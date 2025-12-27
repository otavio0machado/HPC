import { pdfjs } from 'react-pdf';

// Configuração do Worker do PDF.js (essencial para vite)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

/**
 * Extracts raw text from a PDF file.
 * @param file The PDF file object.
 * @returns A promise that resolves to the extracted text.
 */
export interface PDFExtractionResult {
    text: string;
    pageCount: number;
    images: string[]; // Base64 strings
}

/**
 * Extracts raw text and images from a PDF file.
 * @param file The PDF file object.
 * @returns A promise that resolves to the extracted content.
 */
export const extractTextFromPDF = async (file: File): Promise<PDFExtractionResult> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';
        const images: string[] = [];
        const seenImages = new Set<string>(); // To deduplicate images

        // Iterate over all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);

            // Extract Text
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += `\n\n--- Página ${i} ---\n\n${pageText}`;

            // Extract Images (Attempt)
            try {
                const ops = await page.getOperatorList();
                const fns = ops.fnArray;
                const args = ops.argsArray;

                for (let j = 0; j < fns.length; j++) {
                    if (fns[j] === pdfjs.OPS.paintImageXObject) {
                        const imgName = args[j][0];
                        try {
                            const img = await page.objs.get(imgName);
                            if (img && img.data) {
                                // Convert raw image data to base64
                                // This is a simplified approach and might need a proper canvas conversion for some image types
                                const width = img.width;
                                const height = img.height;

                                // Only keep reasonably sized images (skip tiny icons/lines)
                                if (width > 100 && height > 100) {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    if (ctx) {
                                        const imageData = ctx.createImageData(width, height);
                                        // Handle different image kinds (RGB, RGBA, etc.) - simplify by assuming RGBA or converting
                                        // If img.data is Uint8ClampedArray compatible:
                                        if (img.kind === pdfjs.ImageKind.RGBA_32BPP) {
                                            imageData.data.set(img.data);
                                        } else if (img.kind === pdfjs.ImageKind.RGB_24BPP) {
                                            // Manually expand RGB to RGBA
                                            let p = 0;
                                            for (let k = 0; k < img.data.length; k += 3) {
                                                imageData.data[p++] = img.data[k];
                                                imageData.data[p++] = img.data[k + 1];
                                                imageData.data[p++] = img.data[k + 2];
                                                imageData.data[p++] = 255;
                                            }
                                        } else {
                                            // Skip unsupported formats for now to avoid crashes
                                            continue;
                                        }

                                        ctx.putImageData(imageData, 0, 0);
                                        const base64 = canvas.toDataURL('image/jpeg', 0.8);

                                        // Basic dedupe by length roughly (perfect dedupe is slow)
                                        if (!seenImages.has(base64.length + "-" + base64.slice(-20))) {
                                            seenImages.add(base64.length + "-" + base64.slice(-20));
                                            images.push(base64);
                                        }
                                    }
                                }
                            }
                        } catch (imgError) {
                            console.warn("Failed to extract an image", imgError);
                        }
                    }
                }
            } catch (opsError) {
                console.warn(`Error extracting images from page ${i}`, opsError);
            }

            // Yield control to prevent freeze
            if (i % 5 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            // Cap images to avoid memory explosion
            if (images.length >= 50) break;
        }

        return {
            text: fullText,
            pageCount: pdf.numPages,
            images
        };
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Falha ao ler o PDF. Verifique se o arquivo não está corrompido.");
    }
};

import { pdfjs } from 'react-pdf';
import JSZip from 'jszip';

// Configure PDF worker globally if not already done
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export const extractCover = async (file: File): Promise<Blob | null> => {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'pdf') {
        return extractPdfCover(file);
    } else if (fileType === 'epub') {
        return extractEpubCover(file);
    }
    return null;
};

const extractPdfCover = async (file: File): Promise<Blob | null> => {
    let objectUrl: string | null = null;
    try {
        // Use createObjectURL instead of arrayBuffer to avoid loading entire file into memory
        objectUrl = URL.createObjectURL(file);

        const loadingTask = pdfjs.getDocument(objectUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Get first page

        const viewport = page.getViewport({ scale: 1.5 }); // Reasonable scale for thumbnail
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) return null;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        } as any).promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.8);
        });
    } catch (e) {
        console.error("Error extracting PDF cover:", e);
        return null;
    } finally {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
};

const extractEpubCover = async (file: File): Promise<Blob | null> => {
    try {
        const zip = await JSZip.loadAsync(file);

        // 1. Find the OPF file location from container.xml
        const container = await zip.file("META-INF/container.xml")?.async("string");
        if (!container) return null;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(container, "text/xml");
        const rootfile = xmlDoc.querySelector("rootfile");
        const fullPath = rootfile?.getAttribute("full-path");

        if (!fullPath) return null;

        // 2. Parse OPF to find cover item
        const opfContent = await zip.file(fullPath)?.async("string");
        if (!opfContent) return null;

        const opfDoc = parser.parseFromString(opfContent, "text/xml");

        // Try finding 'cover' meta element first (standard)
        let coverId = opfDoc.querySelector("meta[name='cover']")?.getAttribute("content");

        // If not found, try finding generic image manifest item that looks like a cover
        if (!coverId) {
            const manifestItems = Array.from(opfDoc.querySelectorAll("manifest > item"));
            const coverItem = manifestItems.find(item =>
                item.getAttribute("id")?.toLowerCase().includes("cover") &&
                item.getAttribute("media-type")?.startsWith("image/")
            );
            if (coverItem) coverId = coverItem.getAttribute("id");
        }

        if (!coverId) return null;

        const coverItem = opfDoc.querySelector(`manifest > item[id='${coverId}']`);
        const coverHref = coverItem?.getAttribute("href");

        if (!coverHref) return null;

        // 3. Resolve path to cover image
        // fullPath (e.g., OEBPS/content.opf) -> exclude filename -> OEBPS/
        const opfDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
        const coverPath = opfDir ? `${opfDir}/${coverHref}` : coverHref;

        // 4. Get image blob
        const coverFile = zip.file(coverPath);
        if (!coverFile) return null;

        return await coverFile.async("blob");

    } catch (e) {
        console.error("Error extracting EPUB cover:", e);
        return null;
    }
};

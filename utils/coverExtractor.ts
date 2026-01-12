import JSZip from 'jszip';

export const extractCover = async (file: File): Promise<Blob | null> => {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'epub') {
        return extractEpubCover(file);
    }
    // PDF support has been removed
    return null;
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

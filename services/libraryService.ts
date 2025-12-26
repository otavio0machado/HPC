import { supabase } from '../lib/supabase';

export interface Book {
    id: string;
    user_id: string;
    title: string;
    author: string;
    cover_url: string | null;
    file_url: string;
    file_path: string;
    format: 'pdf' | 'epub';
    progress_location: string | null;
    progress_percentage: number;
    created_at: string;
}

export interface KindleHighlight {
    id: string;
    user_id: string;
    book_title: string;
    author: string;
    content: string;
    location: string;
    highlighted_at: string;
    created_at: string;
}

export type ReaderTheme = 'light' | 'dark' | 'sepia';

export interface ReaderSettings {
    fontSize: number; // Percentage (e.g., 100)
    theme: ReaderTheme;
}

export const libraryService = {

    // --- Books ---

    async fetchBooks(): Promise<Book[]> {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async uploadBook(file: File, userId: string, coverBlob?: Blob): Promise<Book> {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !['pdf', 'epub'].includes(fileExt)) {
            throw new Error("Formato inválido. Apenas PDF e EPUB são suportados.");
        }

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const timestamp = Date.now();
        const filePath = `${userId}/${timestamp}_${sanitizedName}`;

        // 1. Upload Book File
        const { error: uploadError } = await supabase.storage
            .from('library')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl: fileUrl } } = supabase.storage
            .from('library')
            .getPublicUrl(filePath);

        // 2. Upload Cover (Optional)
        let coverUrl = null;
        if (coverBlob) {
            const coverPath = `covers/${userId}/${timestamp}_cover.jpg`;
            const { error: coverError } = await supabase.storage
                .from('library')
                .upload(coverPath, coverBlob);

            if (!coverError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('library')
                    .getPublicUrl(coverPath);
                coverUrl = publicUrl;
            }
        }

        // 3. Create Record
        const { data, error } = await supabase
            .from('books')
            .insert({
                user_id: userId,
                title: file.name.replace(/\.(pdf|epub)$/i, ''),
                author: 'Desconhecido',
                format: fileExt,
                file_path: filePath,
                file_url: fileUrl,
                cover_url: coverUrl,
                progress_percentage: 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateProgress(bookId: string, location: string, percentage: number) {
        const { error } = await supabase
            .from('books')
            .update({
                progress_location: location,
                progress_percentage: percentage
            })
            .eq('id', bookId);

        if (error) throw error;
    },

    async deleteBook(bookId: string, filePath: string) {
        // 1. Delete from Storage
        await supabase.storage.from('library').remove([filePath]);

        // 2. Delete from DB
        const { error } = await supabase.from('books').delete().eq('id', bookId);
        if (error) throw error;
    },

    // --- Kindle Sync ---

    async syncClippings(file: File, userId: string): Promise<number> {
        const text = await file.text();
        const clips = parseMyClippings(text);

        if (clips.length === 0) return 0;

        // Prepare inserts
        const records = clips.map(clip => ({
            user_id: userId,
            book_title: clip.title,
            author: clip.author,
            content: clip.content,
            location: clip.location,
            highlighted_at: clip.date
        }));

        const { error } = await supabase
            .from('kindle_highlights')
            .insert(records);

        if (error) throw error;
        return records.length;
    },

    async importKindleJson(jsonData: any[], userId: string): Promise<number> {
        if (!Array.isArray(jsonData) || jsonData.length === 0) return 0;

        const records: any[] = [];

        jsonData.forEach(book => {
            if (book.highlights && Array.isArray(book.highlights)) {
                book.highlights.forEach((hl: any) => {
                    records.push({
                        user_id: userId,
                        book_title: book.title,
                        author: book.author,
                        content: hl.content,
                        location: hl.location,
                        highlighted_at: new Date().toISOString() // API doesn't give date easily
                    });
                });
            }
        });

        if (records.length === 0) return 0;

        const { error } = await supabase
            .from('kindle_highlights')
            .insert(records);

        if (error) throw error;
        return records.length;
    },

    async fetchHighlights(): Promise<KindleHighlight[]> {
        const { data, error } = await supabase
            .from('kindle_highlights')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
};

// --- Helper Parser ---

interface ParsedClip {
    title: string;
    author: string;
    type: string;
    location: string;
    date: string;
    content: string;
}

function parseMyClippings(text: string): ParsedClip[] {
    // Typical separation is "=========="
    const rawClips = text.split("==========").map(s => s.trim()).filter(s => s);
    const parsed: ParsedClip[] = [];

    for (const raw of rawClips) {
        const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 3) continue;

        // Line 1: Title (Author)
        // Example: "Essentialism: The Disciplined Pursuit of Less (McKeown, Greg)"
        const line1 = lines[0];
        const authorMatch = line1.match(/\(([^)]+)\)$/);
        const author = authorMatch ? authorMatch[1] : "Unknown";
        const title = authorMatch ? line1.replace(authorMatch[0], '').trim() : line1;

        // Line 2: Type | Location | Date
        // Example: "- Your Highlight on Location 566-566 | Added on Saturday, August 24, 2024 10:44:50 AM"
        const line2 = lines[1];
        const type = line2.includes("Highlight") ? "Highlight" : "Note";
        if (type !== "Highlight") continue; // Skip bookmarks/notes for now if we only want highlights

        let location = "";
        const locMatch = line2.match(/Location\s+([\d-]+)/);
        if (locMatch) location = locMatch[1];

        const dateMatch = line2.match(/Added on\s+(.+)$/);
        const date = dateMatch ? dateMatch[1] : "";

        // Remaining lines: Content
        const content = lines.slice(2).join("\n");

        parsed.push({ title, author, type, location, date, content });
    }

    return parsed;
}

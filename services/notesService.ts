import { supabase } from '../lib/supabase';
import { NoteFile } from '../types';

export interface NoteRow {
    id: string;
    parent_id: string | null;
    name: string;
    type: 'folder' | 'markdown' | 'pdf';
    content?: string;
    tags?: string[];
    pdf_data?: string;
    created_at: string;
    updated_at: string;
    is_favorite: boolean;
    pdf_annotations?: any[]; // Keep any for JSON/Complex object for now or strict it later
}

export const notesService = {
    // Fetch all notes for the current user
    async fetchNotes(): Promise<NoteFile[]> {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Usuário não autenticado ou sessão expirada');
        }

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('type', { ascending: true }) // Folders first
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        return (data || []).map((n) => {
            const note = n as unknown as NoteRow;
            // Polyfill: If tags column doesn't exist or is empty, extract from content
            let tags = note.tags || [];
            if ((!tags || tags.length === 0) && note.content) {
                tags = note.content.match(/#[\w\u00C0-\u00FF]+/g) || [];
            }

            return {
                id: note.id,
                parentId: note.parent_id,
                name: note.name,
                type: note.type,
                content: note.content,
                tags: tags,
                pdfData: note.pdf_data,
                createdAt: new Date(note.created_at).getTime(),
                updatedAt: new Date(note.updated_at).getTime(),
                isFavorite: note.is_favorite,
                pdfAnnotations: note.pdf_annotations || []
            };
        });
    },

    async createNote(note: Partial<NoteFile>): Promise<{ data: NoteFile | null, error: string | null }> {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { data: null, error: 'Usuário não autenticado ou sessão expirada. Por favor, faça login novamente.' };
        }

        // Extract tags
        const tags = note.content ? (note.content.match(/#[\w\u00C0-\u00FF]+/g) || []) : [];

        // Default to markdown if not specified
        const type = note.type || 'markdown';

        const { data, error } = await supabase
            .from('notes')
            .insert([{
                user_id: user.id,
                parent_id: note.parentId,
                name: note.name || 'Nova Nota',
                content: note.content || '',
                type: type,
                tags: tags,
                pdf_data: note.pdfData,
                pdf_annotations: note.pdfAnnotations || [],
                is_favorite: note.isFavorite || false
            }])
            .select()
            .single();

        if (error) {
            return { data: null, error: error.message };
        }

        return {
            data: {
                id: data.id,
                parentId: data.parent_id,
                name: data.name,
                type: data.type,
                content: data.content,
                tags: data.tags,
                updatedAt: new Date(data.updated_at).getTime(),
                isFavorite: data.is_favorite,
                pdfAnnotations: data.pdf_annotations
            } as NoteFile,
            error: null
        };
    },

    async updateNote(id: string, updates: Partial<NoteFile>): Promise<boolean> {
        const updatePayload: Record<string, any> = {
            updated_at: new Date().toISOString()
        };

        if (updates.name !== undefined) updatePayload.name = updates.name;
        if (updates.content !== undefined) {
            updatePayload.content = updates.content;
            // Tags extraction logic maintained in comments if needed later
        }
        if (updates.parentId !== undefined) updatePayload.parent_id = updates.parentId;
        if (updates.pdfData !== undefined) updatePayload.pdf_data = updates.pdfData;
        if (updates.pdfAnnotations !== undefined) updatePayload.pdf_annotations = updates.pdfAnnotations;
        if (updates.isFavorite !== undefined) updatePayload.is_favorite = updates.isFavorite;

        const { error } = await supabase
            .from('notes')
            .update(updatePayload)
            .eq('id', id);

        if (error) {
            return false;
        }
        return true;
    },

    async deleteNote(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) {
            return false;
        }
        return true;
    },

    async uploadAttachment(file: File): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Ensure bucket exists or is public. 
        // Note: Client cannot create buckets usually. Assuming 'notes-attachments' exists.

        const { data, error } = await supabase.storage
            .from('notes-attachments')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            // Fail silently
            return null;
        }

        const { data: publicUrlData } = supabase.storage
            .from('notes-attachments')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }
};

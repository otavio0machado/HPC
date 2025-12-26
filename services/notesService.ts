import { supabase } from '../lib/supabase';
import { NoteFile } from '../types';

export const notesService = {
    // Fetch all notes for the current user
    async fetchNotes(): Promise<NoteFile[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('type', { ascending: true }) // Folders first
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching notes:', error);
            throw error;
        }

        return (data || []).map((n: any) => {
            // Polyfill: If tags column doesn't exist or is empty, extract from content
            let tags = n.tags || [];
            if ((!tags || tags.length === 0) && n.content) {
                tags = n.content.match(/#[\w\u00C0-\u00FF]+/g) || [];
            }

            return {
                id: n.id,
                parentId: n.parent_id,
                name: n.name,
                type: n.type,
                content: n.content,
                tags: tags,
                pdfData: n.pdf_data,
                createdAt: typeof n.created_at === 'string' ? new Date(n.created_at).getTime() : n.created_at,
                updatedAt: typeof n.updated_at === 'string' ? new Date(n.updated_at).getTime() : n.updated_at,
                isFavorite: n.is_favorite, // Map from DB
                pdfAnnotations: n.pdf_annotations || []
            };
        });
    },

    async createNote(note: Partial<NoteFile>): Promise<{ data: NoteFile | null, error: string | null }> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'User not authenticated' };

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
            console.error('Error creating note:', error);
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
        const updatePayload: any = {
            updated_at: new Date().toISOString()
        };

        if (updates.name !== undefined) updatePayload.name = updates.name;
        if (updates.content !== undefined) {
            updatePayload.content = updates.content;
            // Tags are parsed from content, but we don't save to 'tags' column yet 
            // to avoid errors if migration didn't run.
            // const tags = updates.content.match(/#[\w\u00C0-\u00FF]+/g) || [];
            // updatePayload.tags = tags;
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
            console.error('Error updating note:', error);
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
            console.error('Error deleting note:', error);
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
            console.error('Error uploading file:', error);
            // Try creating bucket if it doesn't exist? No, that requires higher privs.
            // Just return null and let UI handle error.
            return null;
        }

        const { data: publicUrlData } = supabase.storage
            .from('notes-attachments')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }
};

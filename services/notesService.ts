import { supabase } from '../lib/supabase';
import { NoteFile } from '../types';

export const notesService = {
    fetchNotes: async (): Promise<NoteFile[]> => {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notes:', error);
            return [];
        }

        return data.map((note: any) => ({
            id: note.id,
            parentId: note.parent_id,
            name: note.name,
            type: note.type,
            content: note.content,
            pdfData: note.pdf_data,
            createdAt: new Date(note.created_at).getTime(),
            updatedAt: new Date(note.updated_at).getTime()
        }));
    },

    createNote: async (note: NoteFile): Promise<NoteFile | null> => {
        // We treat 'createdAt' from client as source of truth if provided, or let DB handle it.
        // Usually DB default is better, but to sync with optimistic UI updates:
        const { data, error } = await supabase
            .from('notes')
            .insert({
                parentId: note.parentId, // CamelCase to snake_case is NOT automatic unless configured, so manual mapping:
                parent_id: note.parentId,
                name: note.name,
                type: note.type,
                content: note.content,
                pdf_data: note.pdfData,
                // created_at will be set by default or we can pass explicit:
                // created_at: new Date(note.createdAt).toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating note:', error);
            return null;
        }

        return {
            id: data.id,
            parentId: data.parent_id,
            name: data.name,
            type: data.type,
            content: data.content,
            pdfData: data.pdf_data,
            createdAt: new Date(data.created_at).getTime(),
            updatedAt: new Date(data.updated_at).getTime()
        };
    },

    updateNote: async (note: NoteFile): Promise<boolean> => {
        const { error } = await supabase
            .from('notes')
            .update({
                parent_id: note.parentId,
                name: note.name,
                content: note.content,
                pdf_data: note.pdfData,
                updated_at: new Date().toISOString()
            })
            .eq('id', note.id);

        if (error) {
            console.error('Error updating note:', error);
            return false;
        }
        return true;
    },

    deleteNote: async (id: string): Promise<boolean> => {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting note:', error);
            return false;
        }
        return true;
    }
};

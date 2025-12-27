import { supabase } from '../lib/supabase';
import { Subject, KnowledgePill } from '../data/contentData';

// Reusing types from data/contentData for now, but extending them for DB structure
export interface DBSubject extends Subject {
    user_id: string;
    created_at?: string;
}

export interface DBPill extends KnowledgePill {
    id: string; // Ensure ID is string (UUID)
    subject_id: string;
    user_id: string;
    created_at?: string;
    source_pdf_url?: string;
    layout?: 'default' | 'image_top' | 'quote' | 'list';
    image_url?: string;
    folder?: string;
}

export const contentService = {

    /**
     * Fetch all subjects for the current user, including their pills.
     */
    /**
     * Fetch all subjects for the current user, including their pills and explicit folders.
     */
    fetchSubjects: async (): Promise<Subject[]> => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return [];

        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('*')
            .eq('user_id', userData.user.id)
            .order('created_at', { ascending: true });

        if (subjectsError) {
            console.error("Error fetching subjects:", subjectsError);
            return [];
        }

        const { data: pills, error: pillsError } = await supabase
            .from('knowledge_pills')
            .select('*')
            .eq('user_id', userData.user.id);

        const { data: folders, error: foldersError } = await supabase
            .from('content_folders')
            .select('*')
            .eq('user_id', userData.user.id);

        if (pillsError) console.error("Error fetching pills:", pillsError);
        if (foldersError) console.error("Error fetching folders:", foldersError);

        // Map DB structure back to UI structure
        return (subjects || []).map(sub => ({
            id: sub.id,
            title: sub.title,
            icon: sub.icon || 'Book',
            color: sub.color || 'bg-gray-500',
            folders: (folders || [])
                .filter(f => f.subject_id === sub.id)
                .map(f => ({ id: f.id, name: f.name })),
            pills: (pills || [])
                .filter(p => p.subject_id === sub.id)
                .map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description || '',
                    content: p.content,
                    readTime: p.read_time || '2 min',
                    layout: p.layout || 'default',
                    imageUrl: p.image_url,
                    folder: p.folder
                }))
        }));
    },

    /**
     * Create a new subject.
     */
    createSubject: async (title: string, icon: string, color: string): Promise<Subject | null> => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('subjects')
            .insert({
                user_id: userData.user.id,
                title,
                icon,
                color
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating subject:", error);
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            icon: data.icon,
            color: data.color,
            pills: [],
            folders: []
        };
    },

    /**
     * Save generated pills to the database.
     */
    savePills: async (subjectId: string, pills: Omit<KnowledgePill, 'id'>[]): Promise<boolean> => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("User not authenticated");

        const dbPills = pills.map(p => ({
            user_id: userData.user.id,
            subject_id: subjectId,
            title: p.title,
            description: p.description,
            content: p.content,
            read_time: p.readTime,
            layout: p.layout || 'default',
            image_url: p.imageUrl,
            folder: p.folder
        }));

        const { error } = await supabase
            .from('knowledge_pills')
            .insert(dbPills);

        if (error) {
            console.error("Error saving pills:", error);
            return false;
        }

        return true;
    },

    /**
     * Create a new folder.
     */
    createFolder: async (subjectId: string, name: string): Promise<boolean> => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('content_folders')
            .insert({
                user_id: userData.user.id,
                subject_id: subjectId,
                name
            });

        if (error) {
            console.error("Error creating folder:", error);
            return false;
        }

        return true;
    },

    /**
     * Delete a folder.
     */
    deleteFolder: async (folderId: string): Promise<boolean> => {
        const { error } = await supabase
            .from('content_folders')
            .delete()
            .eq('id', folderId);

        if (error) {
            console.error("Error deleting folder:", error);
            return false;
        }

        return true;
    }
};

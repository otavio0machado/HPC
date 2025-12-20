import { supabase } from '../lib/supabase';

export interface Flashcard {
    id: string;
    front: string;
    back: string;
    folderPath: string[];
    nextReview: number;
    interval: number;
    ease: number;
    repetitions: number;
}

export const flashcardService = {
    fetchFlashcards: async (): Promise<Flashcard[]> => {
        const { data, error } = await supabase
            .from('flashcards')
            .select('*');

        if (error) {
            console.error('Error fetching flashcards:', error);
            return [];
        }

        return data.map((card: any) => ({
            id: card.id,
            front: card.front,
            back: card.back,
            folderPath: card.folder_path || [],
            nextReview: Number(card.next_review),
            interval: card.interval,
            ease: card.ease,
            repetitions: card.repetitions
        }));
    },

    createFlashcard: async (card: Flashcard): Promise<Flashcard | null> => {
        const { data, error } = await supabase
            .from('flashcards')
            .insert({
                front: card.front,
                back: card.back,
                folder_path: card.folderPath,
                next_review: card.nextReview, // Stored as bigint
                interval: card.interval,
                ease: card.ease,
                repetitions: card.repetitions
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating flashcard:', error);
            return null;
        }

        return {
            id: data.id,
            front: data.front,
            back: data.back,
            folderPath: data.folder_path,
            nextReview: Number(data.next_review),
            interval: data.interval,
            ease: data.ease,
            repetitions: data.repetitions
        };
    },

    updateFlashcard: async (card: Flashcard): Promise<boolean> => {
        const { error } = await supabase
            .from('flashcards')
            .update({
                front: card.front,
                back: card.back,
                folder_path: card.folderPath,
                next_review: card.nextReview,
                interval: card.interval,
                ease: card.ease,
                repetitions: card.repetitions
            })
            .eq('id', card.id);

        if (error) {
            console.error('Error updating flashcard:', error);
            return false;
        }
        return true;
    },

    batchUpdateFlashcards: async (cards: Flashcard[]): Promise<boolean> => {
        // Supabase upsert is efficient for this
        const upserts = cards.map(c => ({
            id: c.id,
            user_id: (supabase.auth.getSession() as any)?.user?.id, // This might fail if session logic isn't clean, but RLS handles standard inserts.
            // Actually, for updates, we don't need user_id if RLS checks existing.
            // But for upsert we might need all required fields.
            front: c.front,
            back: c.back,
            folder_path: c.folderPath,
            next_review: c.nextReview,
            interval: c.interval,
            ease: c.ease,
            repetitions: c.repetitions
        }));

        // Removing user_id from map and relying on RLS context for updates or default for inserts is better?
        // Upsert requires user_id usually if it's a new row.
        // For now, let's just loop updates since batch update is tricky with different data per row without user_id known easily in service (it is async).
        // Or we can use `upsert` and trust Supabase to use the auth context? No, `user_id` is required column.
        // Better strategy: Simple Loop for now (easier to implement reliably) or passing user_id.

        // Let's stick to simple individual updates for reliability in this generated code
        for (const card of cards) {
            await flashcardService.updateFlashcard(card);
        }
        return true;
    },

    deleteFlashcard: async (id: string): Promise<boolean> => {
        const { error } = await supabase
            .from('flashcards')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting flashcard:', error);
            return false;
        }
        return true;
    }
};

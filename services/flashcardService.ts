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

interface FlashcardRow {
    id: string;
    front: string;
    back: string;
    folder_path: string[];
    next_review: number;
    interval: number;
    ease: number;
    repetitions: number;
}

export const flashcardService = {
    fetchFlashcards: async (): Promise<Flashcard[]> => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Usuário não autenticado ou sessão expirada');

        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .eq('user_id', user.id); // Validating RLS explicitly

        if (error) {
            // Fail silently
            return [];
        }

        return (data as unknown as FlashcardRow[]).map((card) => ({
            id: card.id,
            front: card.front,
            back: card.back,
            folderPath: card.folder_path || [],
            nextReview: Number(card.next_review) || 0,
            interval: Number(card.interval) || 1,
            ease: Number(card.ease) || 2.5,
            repetitions: Number(card.repetitions) || 0
        }));
    },

    createFlashcard: async (card: Omit<Flashcard, 'id'>): Promise<Flashcard | null> => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Usuário não autenticado ou sessão expirada');

        const { data, error } = await supabase
            .from('flashcards')
            .insert({
                user_id: user.id,
                front: card.front,
                back: card.back,
                folder_path: card.folderPath,
                next_review: card.nextReview,
                interval: card.interval,
                ease: card.ease,
                repetitions: card.repetitions
            })
            .select()
            .single();

        if (error) {
            return null;
        }

        return {
            id: data.id,
            front: data.front,
            back: data.back,
            folderPath: data.folder_path || [],
            nextReview: Number(data.next_review) || 0,
            interval: Number(data.interval) || 1,
            ease: Number(data.ease) || 2.5,
            repetitions: Number(data.repetitions) || 0
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
            return false;
        }
        return true;
    },

    batchUpdateFlashcards: async (cards: Flashcard[]): Promise<boolean> => {
        // Supabase upsert is efficient for this
        // Batch update using simple loop for reliability

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
            return false;
        }
        return true;
    }
};

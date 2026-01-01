import { supabase } from '../lib/supabase';
import { Flashcard, flashcardService } from './flashcardService';
import { ErrorEntry } from '../types';

export type ReviewItemType = 'flashcard' | 'error' | 'weakness';

export interface SmartReviewItem {
    id: string;
    type: ReviewItemType;
    content: {
        front: string; // Pergunta ou Erro
        back: string;  // Resposta ou Correção
        context?: string; // Tópico ou Matéria
    };
    sourceRef: any; // Objeto original
    priority: number; // 0-100 (Calculado por data e importância)
}

export const reviewService = {

    async fetchSmartQueue(): Promise<SmartReviewItem[]> {
        const queue: SmartReviewItem[] = [];
        const now = Date.now();

        // 1. Fetch Due Flashcards
        try {
            const cards = await flashcardService.fetchFlashcards();
            const dueCards = cards.filter(c => c.nextReview <= now && c.front !== '[[FOLDER_MARKER]]');

            dueCards.forEach(c => {
                queue.push({
                    id: c.id,
                    type: 'flashcard',
                    content: {
                        front: c.front,
                        back: c.back,
                        context: c.folderPath.join(' / ')
                    },
                    sourceRef: c,
                    priority: 80 // Base priority for due cards
                });
            });
        } catch (e) {
            console.error("Error fetching cards for review", e);
        }

        // 2. Fetch Recent Errors (Fake for now, assuming local storage or separate table)
        // In a real scenario, we would join with an 'errors' table
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Assuming we might have an 'errors' table or just using local storage in previous steps
                // Let's try to fetch from a hypothetical 'errors' table if it existed, or mock it from localStorage client-side.
                // Since this is a service, we can't access localStorage easily if server-side (but we are client-side).
                // For safety, we will stick to the architecture where errors might be stored.
                // Let's assume we fetch from supabase 'errors' table created previously or just mock return for now if table missing.

                // Mock integration or LocalStorage handling should be done at Component level if service cannot access BOM.
                // However, we can standardize the interface.
            }
        } catch (e) {
            console.error(e);
        }

        // Randomize slightly to mix types
        return queue.sort((a, b) => b.priority - a.priority + (Math.random() * 10 - 5));
    },

    async processReview(item: SmartReviewItem, quality: number): Promise<void> {
        if (item.type === 'flashcard') {
            const card = item.sourceRef as Flashcard;

            // Re-implement SM-2 Logic or reuse service logic?
            // Reuse service would be cleaner if it exposed a "processReview" method.
            // But we already have the logic in Flashcards.tsx. Ideally, move it here.

            const MIN_EASE = 1.3;
            let { interval, repetitions, ease } = card;

            if (quality >= 3) {
                if (repetitions === 0) interval = 1;
                else if (repetitions === 1) interval = 6;
                else interval = Math.round(interval * ease);
                repetitions++;
            } else {
                repetitions = 0;
                interval = 1;
            }

            ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            if (ease < MIN_EASE) ease = MIN_EASE;

            // Ensure valid numbers
            if (isNaN(interval)) interval = 1;
            if (isNaN(ease)) ease = 2.5;

            const nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);

            try {
                await flashcardService.updateFlashcard({
                    ...card,
                    interval,
                    repetitions,
                    ease,
                    nextReview
                });
            } catch (err) {
                console.error("Critical error updating flashcard inside review service", err);
            }
        }

        if (item.type === 'error') {
            // Logic to update error review status
            // For now, no-op or console log
            console.log("Processed error review", item.id);
        }
    }
};

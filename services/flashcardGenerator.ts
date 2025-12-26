import { flashcardService } from './flashcardService';
import { toast } from 'sonner';

export const flashcardGenerator = {
    // Scans text for "Front >> Back" pattern
    scanAndCreate: async (content: string, folderName: string = 'Geral') => {
        // Regex for: Start of line or non-alphanum, capture phrase, '>>', capture phrase, end or new line.
        // Simplifying: Matches "Term >> Definition"
        // Limitations: HTML tags from TipTap might interfere. We should strip HTML or parse carefully.

        // TipTap usually wraps paragraphs in <p>.
        // Example: <p>Capital of France >> Paris</p>

        const regex = /([^>]+)>>(.*)/g;

        // Strip HTML tags for cleaner text processing? Or parse HTML?
        // Let's operate on plain text extraction for simplicity first, or regex over HTML string carefully.
        // If we have "<p>Foo >> Bar</p>", regex works if we ignore tags.
        const cleanContent = content.replace(/<[^>]*>/g, '\n'); // Replace tags with newlines

        const matches = [];
        let match;
        while ((match = regex.exec(cleanContent)) !== null) {
            if (match[1] && match[2]) {
                matches.push({
                    front: match[1].trim(),
                    back: match[2].trim()
                });
            }
        }

        if (matches.length === 0) {
            return { count: 0, message: "Nenhum flashcard encontrado (use 'Frente >> Verso')." };
        }

        let created = 0;
        for (const m of matches) {
            // Create card
            await flashcardService.createFlashcard({
                front: m.front,
                back: m.back,
                folderPath: ['Notas', folderName],
                nextReview: Date.now(),
                interval: 0,
                ease: 2.5,
                repetitions: 0
            });
            created++;
        }

        return { count: created, message: `${created} flashcards criados!` };
    }
};

import { Flashcard } from '../../services/flashcardService';

export interface DeckStats {
    name: string;
    total: number;
    due: number;
    progress: number;
    path: string[];
}

export interface FolderNode {
    name: string;
    fullPath: string[];
    stats: DeckStats;
    children: Map<string, FolderNode>;
    cards: Flashcard[];
}

export const buildFolderTree = (cards: Flashcard[]): FolderNode => {
    const root: FolderNode = {
        name: 'Root',
        fullPath: [],
        stats: { name: 'Total', total: 0, due: 0, progress: 0, path: [] },
        children: new Map(),
        cards: []
    };

    cards.forEach(card => {
        let currentNode = root;

        // Aggregate stats for root
        updateNodeStats(root, card);

        // Traverse path
        const path = card.folderPath || [];
        // If path is empty, it goes to root cards
        if (path.length === 0) {
            root.cards.push(card);
            return;
        }

        path.forEach((folderName, index) => {
            if (!currentNode.children.has(folderName)) {
                const newPath = path.slice(0, index + 1);
                currentNode.children.set(folderName, {
                    name: folderName,
                    fullPath: newPath,
                    stats: { name: folderName, total: 0, due: 0, progress: 0, path: newPath },
                    children: new Map(),
                    cards: []
                });
            }
            currentNode = currentNode.children.get(folderName)!;
            updateNodeStats(currentNode, card);
        });

        // Add card to the leaf folder
        currentNode.cards.push(card);
    });

    return root;
};

const updateNodeStats = (node: FolderNode, card: Flashcard) => {
    node.stats.total++;
    if (card.nextReview <= Date.now()) {
        node.stats.due++;
    }
    if (card.interval > 21) {
        node.stats.progress++; // Raw count of mastered cards
    }
};

export const getFolderByPath = (root: FolderNode, path: string[]): FolderNode | null => {
    let current = root;
    for (const segment of path) {
        if (!current.children.has(segment)) {
            return null;
        }
        current = current.children.get(segment)!;
    }
    return current;
};

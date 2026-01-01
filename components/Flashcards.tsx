import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { flashcardService, Flashcard } from '../services/flashcardService';
import { Dashboard } from './flashcards/Dashboard';
import SmartReview from './flashcards/SmartReview';
import { CreateCardModal } from './flashcards/CreateCardModal';
import { CreateFolderModal } from './flashcards/CreateFolderModal';
import { CreateFlashcardsWithAIModal } from './flashcards/CreateFlashcardsWithAIModal';
import { SmartReviewItem } from '../services/reviewService';

interface DeckStats {
  name: string;
  total: number;
  due: number;
  progress: number;
  path: string[];
}

const Flashcards: React.FC = () => {
  // --- Global State ---
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- View State ---
  const [view, setView] = useState<'dashboard' | 'study'>('dashboard');
  const [studyQueue, setStudyQueue] = useState<SmartReviewItem[]>([]);

  // --- Modals ---
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [initialCreatePath, setInitialCreatePath] = useState<string | undefined>(undefined);

  // --- Data Loading ---
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const fetched = await flashcardService.fetchFlashcards();
      setCards(fetched);
    } catch (e) {
      toast.error("Erro ao carregas flashcards.");
      setCards([]); // Clear on error or keep? Safe to clear or keep old.
    } finally {
      setIsLoading(false);
    }
  };

  // --- Computed Data ---
  const knownPaths = useMemo(() => {
    const paths = new Set<string>();
    cards.forEach(c => {
      if (c.folderPath && c.folderPath.length > 0) {
        paths.add(c.folderPath.join('/'));
        // Add parent paths too
        let currentParts: string[] = [];
        for (const part of c.folderPath) {
          currentParts.push(part);
          paths.add(currentParts.join('/'));
        }
      }
    });
    return Array.from(paths).sort();
  }, [cards]);

  // Legacy shim for Dashboard interface
  const decks = useMemo(() => {
    return [];
  }, []);

  const revisionQueue = useMemo(() => {
    return cards
      .filter(c => c.nextReview <= Date.now())
      .sort((a, b) => a.nextReview - b.nextReview)
      .slice(0, 5);
  }, [cards]);

  // --- Actions ---

  const startStudySession = (targetPath?: string[]) => {
    let queue = cards.filter(c => c.nextReview <= Date.now());

    if (targetPath && targetPath.length > 0) {
      queue = queue.filter(c => {
        if (c.folderPath.length < targetPath.length) return false;
        for (let i = 0; i < targetPath.length; i++) {
          if (c.folderPath[i] !== targetPath[i]) return false;
        }
        return true;
      });
    }

    if (queue.length === 0) {
      toast.info("Tudo revisado neste local!");
      return;
    }

    // Convert to SmartReviewItem
    const smartQueue: any[] = queue.map(c => ({
      id: c.id,
      type: 'flashcard',
      content: {
        front: c.front,
        back: c.back,
        context: c.folderPath.join(' / ')
      },
      sourceRef: c, // Important for SmartReview to handle updates
      priority: 100
    }));

    setStudyQueue(smartQueue); // Note: State type might need update safely, or cast
    setView('study');
  };

  const handleCreateCard = async (newCard: Partial<Flashcard>) => {
    try {
      await flashcardService.createFlashcard(newCard as any);
      toast.success("Card criado!");
      loadCards();
    } catch (e) {
      toast.error("Erro ao criar card.");
      console.error(e);
    }
  };

  const handleBatchCreate = async (newCards: Partial<Flashcard>[]) => {
    try {
      let createdCount = 0;
      for (const card of newCards) {
        await flashcardService.createFlashcard(card as any);
        createdCount++;
      }
      toast.success(`${createdCount} cards criados com sucesso!`);
      loadCards();
    } catch (e) {
      toast.error("Erro ao criar cards em lote.");
      console.error(e);
    }
  };

  // Deprecated local handler, logic moved to SmartReview/Service, but we need to refresh cards on exit
  const handleSessionExit = () => {
    setView('dashboard');
    loadCards(); // Refresh data to show correct stats
  };

  useEffect(() => {
    if (view === 'study' && studyQueue.length === 0) {
      // Just in case
    }
  }, [studyQueue, view]);


  // --- Render ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-pulse font-light tracking-widest uppercase text-xs gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
        Carregando Biblioteca...
      </div>
    );
  }

  if (view === 'study') {
    return (
      <SmartReview
        initialQueue={studyQueue}
        onExit={handleSessionExit}
      />
    );
  }

  // Helper to check subpath
  const isSubPath = (fullPath: string[], prefix: string[]) => {
    if (fullPath.length < prefix.length) return false;
    for (let i = 0; i < prefix.length; i++) {
      if (fullPath[i] !== prefix[i]) return false;
    }
    return true;
  }

  const handleMoveFolder = async (sourcePath: string[], targetPath: string[]) => {
    // 1. Identify all cards that need to be moved
    const updates: Flashcard[] = [];

    for (const card of cards) {
      if (isSubPath(card.folderPath, sourcePath)) {
        // Calculate new path
        // We keep the last segment of the sourcePath (the folder name itself)
        // and append everything after it from the card's path.
        // e.g. Move ['A', 'Sub'] to ['B']
        // Card ['A', 'Sub', 'Doc'] -> ['B', 'Sub', 'Doc']
        // sourcePath.length = 2. slice(1) -> ['Sub', 'Doc']

        const relativePath = card.folderPath.slice(sourcePath.length - 1);
        const newPath = [...targetPath, ...relativePath];

        updates.push({ ...card, folderPath: newPath });
      }
    }

    if (updates.length === 0) return;

    // 2. Optimistic Update (Optional, but good for UI)
    // For now we just wait for the server

    try {
      await flashcardService.batchUpdateFlashcards(updates);
      toast.success("Pasta movida com sucesso!");
      loadCards();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao mover pasta.");
    }
  };

  return (
    <>
      <Dashboard
        cards={cards}
        decks={decks}
        revisionQueue={revisionQueue}
        onStartSession={(deckName) => {
          if (typeof deckName === 'string') {
            startStudySession(deckName ? deckName.split('/') : undefined);
          } else {
            startStudySession(undefined);
          }
        }}
        onCreateCard={(path) => {
          setInitialCreatePath(path);
          setIsCardModalOpen(true);
        }}
        onCreateFolder={(path) => {
          setInitialCreatePath(path);
          setIsFolderModalOpen(true);
        }}
        onCreateAI={(path) => {
          setInitialCreatePath(path);
          setIsAIModalOpen(true);
        }}
        onMoveFolder={handleMoveFolder}
        onFilter={() => { }}
      />

      {isCardModalOpen && (
        <CreateCardModal
          decks={knownPaths}
          initialDeck={initialCreatePath}
          onClose={() => setIsCardModalOpen(false)}
          onCreate={handleCreateCard}
        />
      )}

      {isFolderModalOpen && (
        <CreateFolderModal
          parentPath={initialCreatePath ? initialCreatePath.split('/').map(s => s.trim()).filter(Boolean) : []}
          onClose={() => setIsFolderModalOpen(false)}
          onCreate={async (name) => {
            const safeParent = initialCreatePath ? initialCreatePath.split('/').map(s => s.trim()).filter(Boolean) : [];
            const newPath = [...safeParent, name.trim()];

            try {
              // Direct service call to avoid "Card Created" toast from handleCreateCard
              await flashcardService.createFlashcard({
                front: '[[FOLDER_MARKER]]',
                back: '[[FOLDER_MARKER]]',
                folderPath: newPath,
                nextReview: 0,
                interval: 0,
                ease: 2.5,
                repetitions: 0
              } as any);

              toast.success("Pasta criada com sucesso!");
              loadCards(); // Refresh UI
            } catch (e) {
              console.error(e);
              toast.error("Erro ao criar pasta");
            }
          }}
        />
      )}

      {isAIModalOpen && (
        <CreateFlashcardsWithAIModal
          decks={knownPaths}
          initialDeck={initialCreatePath}
          onClose={() => setIsAIModalOpen(false)}
          onBatchCreate={handleBatchCreate}
        />
      )}
    </>
  );
};

export default Flashcards;
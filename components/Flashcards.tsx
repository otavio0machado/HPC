import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { flashcardService, Flashcard } from '../services/flashcardService';
import { Dashboard } from './flashcards/Dashboard';
import SmartReview from './flashcards/SmartReview';
import { CreateCardModal } from './flashcards/CreateCardModal';
import { SmartReviewItem } from '../services/reviewService';

// --- SM-2 Constants ---
const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

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
      toast.error("Erro ao carregar flashcards.");
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
      <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-500 animate-pulse">
        Carregando Flashcards...
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
        onCreateCard={() => setIsCardModalOpen(true)}
        onCreateFolder={() => {
          toast.info("Crie um card para inaugurar uma nova pasta");
          setIsCardModalOpen(true);
        }}
        onFilter={() => { }}
      />

      {isCardModalOpen && (
        <CreateCardModal
          decks={knownPaths}
          onClose={() => setIsCardModalOpen(false)}
          onCreate={handleCreateCard}
        />
      )}
    </>
  );
};

export default Flashcards;
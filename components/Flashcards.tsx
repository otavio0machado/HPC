import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { flashcardService, Flashcard } from '../services/flashcardService';
import { Dashboard } from './flashcards/Dashboard';
import { StudySession } from './flashcards/StudySession';
import { CreateCardModal } from './flashcards/CreateCardModal';

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
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);

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
        // Check if card path STARTS with targetPath
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

    setStudyQueue(queue);
    setView('study');
  };

  const handleCreateCard = async (newCard: Partial<Flashcard>) => {
    try {
      await flashcardService.createFlashcard(newCard as any);
      toast.success("Card criado!");
      // setIsCardModalOpen(false); // Valid choice to keep open for batch creation
      loadCards();
    } catch (e) {
      toast.error("Erro ao criar card.");
      console.error(e);
    }
  };

  const handleCardReview = (quality: number) => {
    setStudyQueue(prevQueue => {
      const currentCard = prevQueue[0];
      if (!currentCard) return prevQueue;

      // SM-2 Logic
      let { interval, repetitions, ease } = currentCard;
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

      const nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);
      const updated = { ...currentCard, interval, repetitions, ease, nextReview };

      // Update DB (async fire & forget)
      flashcardService.updateFlashcard(updated);

      // Update Local State synchronously
      setCards(prev => prev.map(c => c.id === updated.id ? updated : c));

      if (quality < 3) {
        return [...prevQueue.slice(1), updated];
      }

      return prevQueue.slice(1);
    });
  };

  useEffect(() => {
    if (view === 'study' && studyQueue.length === 0) {
      toast.success("Sessão finalizada!");
      setView('dashboard');
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
      <StudySession
        queue={studyQueue}
        onExit={() => setView('dashboard')}
        onReview={handleCardReview}
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
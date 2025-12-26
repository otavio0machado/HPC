import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, RotateCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Flashcard } from '../../services/flashcardService';

interface StudySessionProps {
    queue: Flashcard[];
    onExit: () => void;
    onReview: (quality: number) => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ queue, onExit, onReview }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [direction, setDirection] = useState(0); // For animation direction

    const currentCard = queue[currentCardIndex];
    const progress = ((currentCardIndex) / queue.length) * 100;

    const handleReview = (quality: number) => {
        setIsFlipped(false);
        setDirection(1);

        // Quick delay for animation
        setTimeout(() => {
            if (currentCardIndex < queue.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
            }
            onReview(quality); // Note: Parent manages logic. If checking end of queue locally, be careful.
            // Actually, onReview in parent likely removes card or checks completion. 
            // If we want smooth transition, we might need to wait for parent info?
            // Let's assume parent handles logic but we handle local optimistic UI for next card if available.
        }, 200);
    };

    // Safe check if queue became empty or index out of bounds due to parent updates?
    // Assuming queue is static for the session or stable.
    if (!currentCard) return null;

    return (
        <div className="h-full flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
            {/* Background ambient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 z-50">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="w-full max-w-3xl aspect-[4/3] bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl z-10">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md z-20">
                    <div className='flex flex-col'>
                        <span className="text-zinc-500 font-mono text-xs max-w-[200px] truncate">{currentCard.folderPath.join(' > ')}</span>
                        <span className="text-zinc-400 text-xs font-bold">Card {currentCardIndex + 1} de {queue.length}</span>
                    </div>
                    <button onClick={onExit} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors"><X size={18} /></button>
                </div>

                <div className="flex-1 relative perspective-1000">
                    <AnimatePresence mode='wait' custom={direction}>
                        <motion.div
                            key={currentCard.id + (isFlipped ? '-back' : '-front')}
                            initial={{ opacity: 0, rotateX: isFlipped ? -20 : 20, y: 10 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0 }}
                            exit={{ opacity: 0, rotateX: isFlipped ? 20 : -20, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={() => !isFlipped && setIsFlipped(true)}
                            className="absolute inset-0 flex items-center justify-center p-12 cursor-pointer"
                        >
                            <div className="w-full max-h-full overflow-y-auto custom-scrollbar">
                                <div className="text-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-6 block border rounded-full py-1.5 px-4 w-max mx-auto transition-colors ${isFlipped ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                        {isFlipped ? 'Resposta' : 'Pergunta'}
                                    </span>
                                    <div className={`prose prose-invert prose-lg max-w-none ${isFlipped ? 'text-blue-50' : 'text-zinc-100'}`}>
                                        <ReactMarkdown>
                                            {isFlipped ? currentCard.back : currentCard.front}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-lg">
                    {isFlipped ? (
                        <div className="grid grid-cols-4 h-20 divide-x divide-zinc-800">
                            <button onClick={() => handleReview(0)} className="group hover:bg-red-950/30 transition-colors flex flex-col items-center justify-center gap-1">
                                <span className="text-red-400 font-bold text-sm group-hover:scale-110 transition-transform">Errei</span>
                                <span className="text-[10px] text-zinc-500">1 min</span>
                            </button>
                            <button onClick={() => handleReview(3)} className="group hover:bg-orange-950/30 transition-colors flex flex-col items-center justify-center gap-1">
                                <span className="text-orange-400 font-bold text-sm group-hover:scale-110 transition-transform">Difícil</span>
                                <span className="text-[10px] text-zinc-500">2 dias</span>
                            </button>
                            <button onClick={() => handleReview(4)} className="group hover:bg-blue-950/30 transition-colors flex flex-col items-center justify-center gap-1">
                                <span className="text-blue-400 font-bold text-sm group-hover:scale-110 transition-transform">Bom</span>
                                <span className="text-[10px] text-zinc-500">5 dias</span>
                            </button>
                            <button onClick={() => handleReview(5)} className="group hover:bg-emerald-950/30 transition-colors flex flex-col items-center justify-center gap-1">
                                <span className="text-emerald-400 font-bold text-sm group-hover:scale-110 transition-transform">Fácil</span>
                                <span className="text-[10px] text-zinc-500">8 dias</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="h-20 w-full hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3"
                        >
                            Mostrar Resposta <kbd className="hidden sm:inline-block px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-500 font-sans border border-zinc-700">Espaço</kbd>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, RotateCw, BookOpen } from 'lucide-react';
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
            onReview(quality); // Note: Parent manages logic.
        }, 200);
    };

    // Safe check if queue became empty or index out of bounds due to parent updates?
    if (!currentCard) return null;

    return (
        <div className="h-full flex items-center justify-center bg-black p-6 relative overflow-hidden">
            {/* Background ambient */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 z-50">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${progress}%` }} />
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-3xl aspect-[4/3] bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl z-10 backdrop-blur-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-20">
                    <div className='flex flex-col gap-1'>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-white/5 px-2 py-0.5 rounded w-fit border border-white/5">
                            <BookOpen size={10} />
                            <span className="max-w-[200px] truncate">{currentCard.folderPath.join(' / ')}</span>
                        </div>
                        <span className="text-zinc-300 text-xs font-bold pl-1">Card {currentCardIndex + 1} <span className="text-zinc-600 mx-1">/</span> {queue.length}</span>
                    </div>
                    <button onClick={onExit} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors border border-white/5 hover:border-white/20"><X size={18} /></button>
                </div>

                <div className="flex-1 relative perspective-1000">
                    <AnimatePresence mode='wait' custom={direction}>
                        <motion.div
                            key={currentCard.id + (isFlipped ? '-back' : '-front')}
                            initial={{ opacity: 0, rotateX: isFlipped ? -15 : 15, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateX: isFlipped ? 15 : -15, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
                            onClick={() => !isFlipped && setIsFlipped(true)}
                            className="absolute inset-0 flex items-center justify-center p-12 cursor-pointer"
                        >
                            <div className="w-full max-h-full overflow-y-auto custom-scrollbar">
                                <div className="text-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-8 block border rounded-full py-2 px-6 w-max mx-auto transition-all duration-500 shadow-lg ${isFlipped ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10 shadow-emerald-500/20' : 'border-blue-500/30 text-blue-300 bg-blue-500/10 shadow-blue-500/20'}`}>
                                        {isFlipped ? 'Resposta' : 'Pergunta'}
                                    </span>
                                    <div className={`prose prose-invert prose-lg max-w-none transition-colors duration-500 ${isFlipped ? 'text-blue-50 drop-shadow-sm' : 'text-zinc-100'}`}>
                                        <ReactMarkdown>
                                            {isFlipped ? currentCard.back : currentCard.front}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    {isFlipped ? (
                        <div className="grid grid-cols-4 h-24 divide-x divide-white/5">
                            <button onClick={() => handleReview(0)} className="group hover:bg-red-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-red-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Errei</span>
                                <span className="text-[10px] text-red-300/50 font-mono">REINÍCIO</span>
                            </button>
                            <button onClick={() => handleReview(3)} className="group hover:bg-orange-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-orange-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Difícil</span>
                                <span className="text-[10px] text-orange-300/50 font-mono">2 DIAS</span>
                            </button>
                            <button onClick={() => handleReview(4)} className="group hover:bg-blue-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-blue-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Bom</span>
                                <span className="text-[10px] text-blue-300/50 font-mono">5 DIAS</span>
                            </button>
                            <button onClick={() => handleReview(5)} className="group hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-emerald-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Fácil</span>
                                <span className="text-[10px] text-emerald-300/50 font-mono">8 DIAS</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="h-24 w-full hover:bg-white/5 text-zinc-400 hover:text-white font-bold tracking-[0.2em] uppercase text-sm transition-all flex items-center justify-center gap-4 group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">Mostrar Resposta</span>
                            <kbd className="hidden sm:inline-block px-2 py-1 bg-white/10 rounded text-[10px] text-zinc-400 font-mono border border-white/10">ESPAÇO</kbd>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

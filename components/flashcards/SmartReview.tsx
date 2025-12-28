import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, AlertTriangle, Check, RotateCw, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { reviewService, SmartReviewItem } from '../../services/reviewService';
import { Flashcard } from '../../services/flashcardService';
import { toast } from 'sonner';

interface SmartReviewProps {
    initialQueue?: SmartReviewItem[];
    onExit: () => void;
}

const MIN_EASE = 1.3;

export const SmartReview: React.FC<SmartReviewProps> = ({ initialQueue, onExit }) => {
    // State
    const [queue, setQueue] = useState<SmartReviewItem[]>([]);
    const [loading, setLoading] = useState(!initialQueue);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
    const [direction, setDirection] = useState(0);

    // Load Data
    useEffect(() => {
        if (initialQueue) {
            setQueue(initialQueue);
            setLoading(false);
        } else {
            loadSmartQueue();
        }
    }, [initialQueue]);

    const loadSmartQueue = async () => {
        setLoading(true);
        try {
            const q = await reviewService.fetchSmartQueue();
            setQueue(q);
        } catch (error) {
            console.error(error);
            toast.error("Falha ao carregar fila de revisão");
        } finally {
            setLoading(false);
        }
    };

    // Current Item
    const currentItem = queue[currentIndex];
    const progress = queue.length > 0 ? ((currentIndex) / queue.length) * 100 : 0;

    // Logic for "Next Interval" preview (Dry Run)
    const getNextInterval = (quality: number): string => {
        if (!currentItem || currentItem.type !== 'flashcard') return '—';

        const card = currentItem.sourceRef as Flashcard;
        let { interval, repetitions, ease } = card;

        if (quality >= 3) {
            if (repetitions === 0) interval = 1;
            else if (repetitions === 1) interval = 6;
            else interval = Math.round(interval * ease);
        } else {
            interval = 1;
        }

        return interval === 1 ? '1 dia' : `${interval} dias`;
    };

    const handleReview = async (quality: number) => {
        if (!currentItem) return;

        // Optimistic UI update
        setIsFlipped(false);
        setDirection(1);

        // Process in background
        reviewService.processReview(currentItem, quality).catch(err => {
            console.error("Failed to process review", err);
            toast.error("Erro ao salvar progresso");
        });

        // Update Stats
        setSessionStats(prev => ({
            correct: quality >= 3 ? prev.correct + 1 : prev.correct,
            total: prev.total + 1
        }));

        // Move Next
        setTimeout(() => {
            if (currentIndex < queue.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // End of session
                setCurrentIndex(prev => prev + 1); // move to "finished" state
            }
        }, 200);
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-pulse bg-black">
                <Brain size={64} className="mb-4 text-violet-500" />
                <p>Calibrando Rede Neural...</p>
            </div>
        );
    }

    // Finished State
    if (currentIndex >= queue.length && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.3)] mb-6 animate-bounce relative z-10">
                    <Check size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 relative z-10">Sessão Concluída!</h2>
                <p className="text-zinc-400 mb-8 text-center max-w-md relative z-10">
                    Você revisou {sessionStats.total} itens com <span className="text-emerald-400 font-bold">{sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%</span> de aproveitamento.
                </p>
                <div className="flex gap-4 relative z-10">
                    <button
                        onClick={onExit}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                    >
                        Voltar ao Painel
                    </button>
                    {!initialQueue && (
                        <button
                            onClick={() => {
                                setQueue([]);
                                setCurrentIndex(0);
                                setSessionStats({ correct: 0, total: 0 });
                                loadSmartQueue();
                            }}
                            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-violet-900/20"
                        >
                            <RotateCw size={18} /> Continuar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!currentItem) return null;

    return (
        <div className="h-full flex items-center justify-center bg-black p-6 relative overflow-hidden font-sans">
            {/* Background ambient */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 z-50">
                <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-400 transition-all duration-300 shadow-[0_0_10px_rgba(167,139,250,0.5)]" style={{ width: `${progress}%` }} />
            </div>

            {/* Ambient Glows */}
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-1000 ${currentItem.type === 'error' ? 'bg-red-600/10' : 'bg-violet-600/10'}`}></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-3xl aspect-[4/3] bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl z-10 backdrop-blur-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-20">
                    <div className='flex flex-col gap-1'>
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border ${currentItem.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-zinc-500 border-white/5'}`}>
                            {currentItem.type === 'error' ? <AlertTriangle size={10} /> : <BookOpen size={10} />}
                            <span className="max-w-[200px] truncate">{currentItem.content.context || 'Geral'}</span>
                        </div>
                        <span className="text-zinc-300 text-xs font-bold pl-1">Card {currentIndex + 1} <span className="text-zinc-600 mx-1">/</span> {queue.length}</span>
                    </div>
                    <button onClick={onExit} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors border border-white/5 hover:border-white/20"><X size={18} /></button>
                </div>

                {/* Card Content */}
                <div className="flex-1 relative perspective-1000">
                    <AnimatePresence mode='wait' custom={direction}>
                        <motion.div
                            key={currentItem.id + (isFlipped ? '-back' : '-front')}
                            initial={{ opacity: 0, rotateX: isFlipped ? -15 : 15, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, rotateX: isFlipped ? 15 : -15, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
                            onClick={() => !isFlipped && setIsFlipped(true)}
                            className="absolute inset-0 flex items-center justify-center p-12 cursor-pointer"
                        >
                            <div className="w-full max-h-full overflow-y-auto custom-scrollbar">
                                <div className="text-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-8 block border rounded-full py-2 px-6 w-max mx-auto transition-all duration-500 shadow-lg ${isFlipped
                                        ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10 shadow-emerald-500/20'
                                        : (currentItem.type === 'error' ? 'border-red-500/30 text-red-300 bg-red-500/10 shadow-red-500/20' : 'border-violet-500/30 text-violet-300 bg-violet-500/10 shadow-violet-500/20')
                                        }`}>
                                        {isFlipped ? 'Resposta' : (currentItem.type === 'error' ? 'Erro' : 'Pergunta')}
                                    </span>
                                    <div className={`prose prose-invert prose-lg max-w-none transition-colors duration-500 ${isFlipped ? 'text-blue-50 drop-shadow-sm' : 'text-zinc-100'}`}>
                                        <ReactMarkdown>
                                            {isFlipped ? currentItem.content.back : currentItem.content.front}
                                        </ReactMarkdown>
                                    </div>
                                    {!isFlipped && (
                                        <div className="mt-12 text-zinc-500 text-xs animate-pulse tracking-widest font-mono">TOQUE PARA REVELAR</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    {isFlipped ? (
                        <div className="grid grid-cols-4 h-24 divide-x divide-white/5">
                            <button onClick={(e) => { e.stopPropagation(); handleReview(1); }} className="group hover:bg-red-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-red-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Errei</span>
                                <span className="text-[10px] text-red-300/50 font-mono">AGORA</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleReview(3); }} className="group hover:bg-orange-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-orange-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Difícil</span>
                                <span className="text-[10px] text-orange-300/50 font-mono">{getNextInterval(3)}</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleReview(4); }} className="group hover:bg-blue-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-blue-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Bom</span>
                                <span className="text-[10px] text-blue-300/50 font-mono">{getNextInterval(4)}</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleReview(5); }} className="group hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-emerald-400 font-bold text-sm group-hover:scale-110 transition-transform uppercase tracking-wider">Fácil</span>
                                <span className="text-[10px] text-emerald-300/50 font-mono">{getNextInterval(5)}</span>
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

export default SmartReview;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, AlertTriangle, Check, RotateCw, Brain, ChevronRight, HelpCircle } from 'lucide-react';
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
            if (q && q.length > 0) {
                setQueue(q);
            } else {
                setQueue([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Falha ao carregar fila de revisão");
            setQueue([]);
        } finally {
            setLoading(false);
        }
    };

    // Current Item
    const currentItem = queue && queue.length > 0 && currentIndex < queue.length ? queue[currentIndex] : null;
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

        return interval === 1 ? '1d' : `${interval}d`;
    };

    const handleReview = async (quality: number) => {
        if (!currentItem) return;

        // Optimistic UI update
        setIsFlipped(false);
        setDirection(1);

        // Process in background
        const processingPromise = reviewService.processReview(currentItem, quality).catch(err => {
            console.error("Failed to process review", err);
            toast.error("Erro ao salvar progresso");
        });

        // Update Stats
        setSessionStats(prev => ({
            correct: quality >= 3 ? prev.correct + 1 : prev.correct,
            total: prev.total + 1
        }));

        // Wait for flip animation to start reversely or just move next
        // We delay slightly to allow the user to see the feedback (or just snappy transition)
        // But more importantly, we need to ensure the state only changes after the visual reset is accepted
        setTimeout(async () => {
            // Ensure the processing at least started
            await processingPromise;

            if (currentIndex < queue.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // End of session
                setCurrentIndex(prev => prev + 1); // move to "finished" state
            }
        }, 300); // Slightly longer than 200 to allow flip reset visual
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-pulse font-light tracking-widest uppercase text-xs gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                Carregando Sessão...
            </div>
        );
    }

    // Finished State
    if (currentIndex >= queue.length && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full relative overflow-hidden font-sans">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] mb-8 animate-in zoom-in duration-500">
                        <Check size={48} className="text-white drop-shadow-md" strokeWidth={3} />
                    </div>

                    <h2 className="text-4xl font-light text-white mb-2 tracking-tight">Sessão Finalizada</h2>
                    <p className="text-zinc-400 mb-10 text-center max-w-md text-sm font-medium leading-relaxed tracking-wide">
                        Você dominou <span className="text-white font-bold">{sessionStats.total}</span> conceitos hoje.
                        <br />
                        Aproveitamento de <span className="text-emerald-400 font-bold">{sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%</span>.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={onExit}
                            className="px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-all backdrop-blur-md"
                        >
                            Voltar
                        </button>
                        {!initialQueue && (
                            <button
                                onClick={() => {
                                    setQueue([]);
                                    setCurrentIndex(0);
                                    setSessionStats({ correct: 0, total: 0 });
                                    loadSmartQueue();
                                }}
                                className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                            >
                                <RotateCw size={14} /> Continuar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!currentItem) return null;

    return (
        <div className="h-full flex flex-col items-center justify-center relative overflow-hidden font-sans p-4 md:p-8">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2 translate-y-1/2" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onExit}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors backdrop-blur-md border border-white/5"
                    >
                        <X size={20} />
                    </button>

                    {/* Progress Pills */}
                    <div className="hidden md:flex gap-1">
                        {queue.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${idx < currentIndex ? 'bg-blue-500' :
                                    idx === currentIndex ? 'bg-white blink' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    <span className="md:hidden text-xs font-bold text-zinc-500 tracking-wider">
                        {currentIndex + 1} / {queue.length}
                    </span>
                </div>

                <div className='flex items-center gap-3'>
                    <div className={`px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${currentItem.type === 'error'
                        ? 'bg-red-500/10 border-red-500/20 text-red-300'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                        }`}>
                        {currentItem.type === 'error' ? <AlertTriangle size={12} /> : <BookOpen size={12} />}
                        <span className="max-w-[150px] truncate">{currentItem.content.context || 'Geral'}</span>
                    </div>
                </div>
            </div>

            {/* Card Container */}
            <div className="w-full max-w-4xl flex-1 max-h-[600px] relative perspective-1000 z-10 my-auto">
                <AnimatePresence mode='wait' custom={direction}>
                    <motion.div
                        key={currentItem.id + (isFlipped ? '-back' : '-front')}
                        initial={{ opacity: 0, rotateX: isFlipped ? -5 : 5, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                        exit={{ opacity: 0, rotateX: isFlipped ? 5 : -5, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <div
                            onClick={() => !isFlipped && setIsFlipped(true)}
                            className={`w-full h-full rounded-[40px] border relative overflow-hidden backdrop-blur-2xl shadow-2xl transition-all duration-500 flex flex-col ${isFlipped
                                ? 'bg-zinc-900/80 border-white/10'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer group'
                                }`}
                        >
                            {/* Inner Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none transition-opacity duration-500 ${isFlipped ? 'from-blue-500/5 to-transparent opacity-100' : 'from-white/5 to-transparent opacity-50 group-hover:opacity-100'
                                }`} />

                            <div className="flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center text-center relative z-10">

                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-12 px-4 py-1.5 rounded-full border ${isFlipped
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : 'bg-white/5 border-white/10 text-zinc-500'
                                    }`}>
                                    {isFlipped ? 'Resposta' : 'Pergunta'}
                                </span>

                                <div className={`prose prose-invert prose-2xl max-w-none transition-all duration-500 ${isFlipped ? 'text-white drop-shadow-sm' : 'text-zinc-200'}`}>
                                    <ReactMarkdown>
                                        {isFlipped ? currentItem.content.back : currentItem.content.front}
                                    </ReactMarkdown>
                                </div>

                                {!isFlipped && (
                                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-600 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 opacity-50 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                        <HelpCircle size={14} /> Toque para revelar
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className={`w-full max-w-2xl mt-8 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="grid grid-cols-4 gap-3 bg-black/40 backdrop-blur-xl p-2 rounded-3xl border border-white/10 shadow-2xl">
                    <button
                        onClick={() => handleReview(1)}
                        className="group flex flex-col items-center justify-center py-4 rounded-2xl hover:bg-red-500/20 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <span className="text-zinc-400 group-hover:text-red-400 font-bold text-xs uppercase tracking-widest mb-1 transition-colors">Errei</span>
                        <span className="text-[10px] text-zinc-600 group-hover:text-red-300/70 font-mono">Agora</span>
                    </button>

                    <button
                        onClick={() => handleReview(3)}
                        className="group flex flex-col items-center justify-center py-4 rounded-2xl hover:bg-amber-500/20 transition-all border border-transparent hover:border-amber-500/20"
                    >
                        <span className="text-zinc-400 group-hover:text-amber-400 font-bold text-xs uppercase tracking-widest mb-1 transition-colors">Difícil</span>
                        <span className="text-[10px] text-zinc-600 group-hover:text-amber-300/70 font-mono">{getNextInterval(3)}</span>
                    </button>

                    <button
                        onClick={() => handleReview(4)}
                        className="group flex flex-col items-center justify-center py-4 rounded-2xl hover:bg-blue-500/20 transition-all border border-transparent hover:border-blue-500/20"
                    >
                        <span className="text-zinc-400 group-hover:text-blue-400 font-bold text-xs uppercase tracking-widest mb-1 transition-colors">Bom</span>
                        <span className="text-[10px] text-zinc-600 group-hover:text-blue-300/70 font-mono">{getNextInterval(4)}</span>
                    </button>

                    <button
                        onClick={() => handleReview(5)}
                        className="group flex flex-col items-center justify-center py-4 rounded-2xl hover:bg-emerald-500/20 transition-all border border-transparent hover:border-emerald-500/20"
                    >
                        <span className="text-zinc-400 group-hover:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1 transition-colors">Fácil</span>
                        <span className="text-[10px] text-zinc-600 group-hover:text-emerald-300/70 font-mono">{getNextInterval(5)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmartReview;

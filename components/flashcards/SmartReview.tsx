import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Check, RotateCw, AlertTriangle, Layers, BookOpen } from 'lucide-react';
import { reviewService, SmartReviewItem } from '../../services/reviewService';
import { toast } from 'sonner';

const SmartReview: React.FC = () => {
    const [queue, setQueue] = useState<SmartReviewItem[]>([]);
    const [currentItem, setCurrentItem] = useState<SmartReviewItem | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

    useEffect(() => {
        loadQueue();
    }, []);

    const loadQueue = async () => {
        setLoading(true);
        const q = await reviewService.fetchSmartQueue();
        setQueue(q);
        if (q.length > 0) setCurrentItem(q[0]);
        setLoading(false);
    };

    const handleAnswer = async (quality: number) => {
        if (!currentItem) return;

        // Process logic
        await reviewService.processReview(currentItem, quality);

        // Update stats
        setSessionStats(prev => ({
            correct: quality >= 3 ? prev.correct + 1 : prev.correct,
            total: prev.total + 1
        }));

        // Next item
        const nextQueue = queue.slice(1);
        setQueue(nextQueue);
        setIsFlipped(false);

        if (nextQueue.length > 0) {
            setCurrentItem(nextQueue[0]);
        } else {
            setCurrentItem(null);
            toast.success("Revisão Inteligente concluída!");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-pulse">
                <Brain size={64} className="mb-4 text-violet-500" />
                <p>Calibrando Rede Neural...</p>
            </div>
        );
    }

    if (!currentItem) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.3)] mb-6 animate-bounce">
                    <Check size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Tudo Limpo!</h2>
                <p className="text-zinc-400 mb-6 text-center max-w-md">
                    Você zerou a fila de revisão inteligente. <br />
                    {sessionStats.total > 0 && `Você revisou ${sessionStats.total} itens com ${Math.round((sessionStats.correct / sessionStats.total) * 100)}% de retenção.`}
                </p>
                <button
                    onClick={loadQueue}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-2"
                >
                    <RotateCw size={18} /> Verificar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-6 relative">

            {/* Header / Stats */}
            <div className="absolute top-0 w-full flex justify-between items-center p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Layers size={18} />
                    <span className="font-mono text-sm">{queue.length} restantes</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full border border-violet-500/20">
                        Smart Review
                    </span>
                </div>
            </div>

            {/* The Card */}
            <div className="w-full max-w-xl perspective-1000 h-[400px] cursor-pointer" onClick={() => !isFlipped && setIsFlipped(true)}>
                <motion.div
                    initial={false}
                    animate={{ rotateX: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-full h-full relative preserve-3d"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT */}
                    <div className="absolute inset-0 backface-hidden glass-card rounded-[32px] p-8 flex flex-col items-center justify-center border border-white/10 shadow-2xl">
                        {currentItem.type === 'error' && (
                            <div className="absolute top-6 left-6 text-red-400 flex items-center gap-2 text-sm font-bold">
                                <AlertTriangle size={16} /> Erro Passado
                            </div>
                        )}
                        {currentItem.type === 'flashcard' && (
                            <div className="absolute top-6 left-6 text-blue-400 flex items-center gap-2 text-sm font-bold">
                                <BookOpen size={16} /> Flashcard
                            </div>
                        )}
                        <div className="text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest">{currentItem.content.context}</div>
                        <div className="text-2xl md:text-3xl font-bold text-center text-white leading-relaxed">
                            {currentItem.content.front}
                        </div>
                        <div className="mt-8 text-zinc-500 text-sm animate-pulse">
                            Toque para ver a resposta
                        </div>
                    </div>

                    {/* BACK */}
                    <div
                        className="absolute inset-0 backface-hidden glass-spatial rounded-[32px] p-8 flex flex-col items-center justify-center border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)] bg-zinc-900/90"
                        style={{ transform: 'rotateX(180deg)' }}
                    >
                        <div className="text-lg md:text-xl text-center text-zinc-200 leading-relaxed font-medium">
                            {currentItem.content.back}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <AnimatePresence>
                {isFlipped && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 flex gap-4 w-full max-w-xl"
                    >
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(1); }} className="flex-1 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold transition-all hover:scale-105 active:scale-95">
                            Errei
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(3); }} className="flex-1 py-4 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-500 font-bold transition-all hover:scale-105 active:scale-95">
                            Complicado
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(4); }} className="flex-1 py-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 font-bold transition-all hover:scale-105 active:scale-95">
                            Bom
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(5); }} className="flex-1 py-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 font-bold transition-all hover:scale-105 active:scale-95">
                            Fácil
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default SmartReview;

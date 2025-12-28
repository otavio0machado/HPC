import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Send, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { essayService, EssayCorrection } from '../../services/essayService';
import { toast } from 'sonner';

const EssayReview: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [essay, setEssay] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<EssayCorrection | null>(null);

    const handleAnalyze = async () => {
        if (!topic || !essay) {
            toast.error("Preencha o tema e a redação!");
            return;
        }

        setIsAnalyzing(true);
        try {
            const correction = await essayService.correctEssay(topic, essay);
            setResult(correction);
            toast.success("Correção concluída!");
        } catch (e) {
            toast.error("Erro ao corrigir redação");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <PenTool className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Duelo de Redação AI</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">Receba nota e feedback nível ENEM em segundos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Tema da Redação</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Ex: Os desafios da educação no Brasil..."
                                className="w-full bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-pink-500/50 transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Seu Texto</label>
                            <textarea
                                value={essay}
                                onChange={(e) => setEssay(e.target.value)}
                                placeholder="Comece a escrever sua redação aqui..."
                                className="w-full h-96 bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-pink-500/50 transition-all resize-none font-medium leading-relaxed"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isAnalyzing ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Corrigir com IA</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Column */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Score Card */}
                                <div className="glass-card p-8 rounded-3xl border border-pink-500/20 bg-pink-500/5 relative overflow-hidden text-center">
                                    <h3 className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-sm mb-2">Nota Final</h3>
                                    <p className="text-6xl font-black text-pink-600 dark:text-pink-400">{result.score}</p>
                                    <div className="absolute top-0 right-0 p-32 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                </div>

                                {/* Competencies */}
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(result.competencies).map(([key, score], idx) => (
                                        <div key={key} className="glass-card px-5 py-3 rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-between">
                                            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Competência {idx + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-pink-500" style={{ width: `${(score / 200) * 100}%` }} />
                                                </div>
                                                <span className="font-mono font-bold text-pink-600">{score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Feedback */}
                                <div className="glass-card p-6 rounded-3xl border border-black/5 dark:border-white/10">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <AlertCircle size={20} className="text-orange-500" />
                                        Comentários da IA
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.comments.map((comment, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                                                <span className="text-pink-500">•</span>
                                                {comment}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Rewrite */}
                                <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 size={20} />
                                        Versão Melhorada
                                    </h4>
                                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 italic">
                                        "{result.improvedVersion}"
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4 min-h-[400px]">
                                <Sparkles size={48} className="text-zinc-300 dark:text-zinc-600" />
                                <p className="text-center text-zinc-400 font-medium">Escreva sua redação e clique em<br />Corrigir para ver a mágica acontecer.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default EssayReview;

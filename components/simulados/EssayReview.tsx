import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Send, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Wand2, GraduationCap, ChevronRight, BookOpen } from 'lucide-react';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex items-center gap-5 mb-12">
                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] border border-white/10 group">
                    <PenTool className="text-white group-hover:scale-110 transition-transform duration-500" size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-lg mb-1">Redação AI</h2>
                    <p className="text-zinc-400 text-lg font-medium flex items-center gap-2">
                        Correção nível <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-lg border border-pink-500/20">ENEM</span> em segundos.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
                {/* Input Column */}
                <div className="space-y-6">
                    <div className="glass-spatial p-1 rounded-[32px] overflow-hidden relative">
                        <div className="p-8 space-y-6 bg-black/20 backdrop-blur-md rounded-[30px]">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <BookOpen size={14} /> Tema da Redação
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Ex: Os desafios da educação no Brasil..."
                                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.08] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 outline-none focus:border-pink-500/50 transition-all font-medium text-lg shadow-inner"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <PenTool size={14} /> Seu Texto
                                </label>
                                <textarea
                                    value={essay}
                                    onChange={(e) => setEssay(e.target.value)}
                                    placeholder="Comece a escrever sua redação aqui..."
                                    className="w-full h-[500px] bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.08] border border-white/10 rounded-2xl px-5 py-5 text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-pink-500/50 transition-all resize-none font-serif text-lg leading-relaxed custom-scrollbar shadow-inner"
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-lg border border-white/20 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                                {isAnalyzing ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={24} />
                                        <span>Analisando Texto...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={24} className="text-pink-600" />
                                        <span>Realizar Correção IA</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Column */}
                <div className="relative min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Score Card */}
                                <div className="glass-spatial p-8 relative overflow-hidden text-center group rounded-[32px]">
                                    <div className="absolute top-0 right-0 p-40 bg-pink-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-pink-500/20 transition-colors duration-700" />

                                    <h3 className="text-pink-200 font-bold uppercase tracking-[0.2em] text-xs mb-6 relative z-10 bg-pink-500/10 inline-block px-4 py-1.5 rounded-full border border-pink-500/20">Nota Final</h3>

                                    <div className="relative z-10 flex items-center justify-center gap-4 mb-4">
                                        <span className="text-8xl font-black text-white drop-shadow-2xl tracking-tighter">{result.score}</span>
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Pontos</span>
                                            <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-pink-500 w-full animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-zinc-400 font-medium relative z-10 text-sm max-w-xs mx-auto">
                                        Sua redação foi avaliada com base nas 5 competências oficiais do ENEM.
                                    </div>
                                </div>

                                {/* Competencies */}
                                <div className="space-y-3">
                                    <h4 className="text-white font-bold text-lg flex items-center gap-2 mb-4 px-2">
                                        <GraduationCap size={20} className="text-pink-400" /> Competências
                                    </h4>
                                    {Object.entries(result.competencies).map(([key, score], idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={key}
                                            className="glass-card bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                                        >
                                            <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">Competência {idx + 1}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="h-2 w-32 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(score / 200) * 100}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                        className={`h-full ${score >= 160 ? 'bg-emerald-500' : score >= 120 ? 'bg-yellow-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                                                    />
                                                </div>
                                                <span className={`font-mono font-bold w-12 text-right ${score >= 160 ? 'text-emerald-400' : score >= 120 ? 'text-yellow-400' : 'text-red-400'}`}>{score}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Feedback */}
                                <div className="glass-spatial p-8 rounded-[32px]">
                                    <h4 className="font-bold text-lg mb-6 flex items-center gap-3 text-white">
                                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                                            <AlertCircle size={20} />
                                        </div>
                                        Análise Detalhada
                                    </h4>
                                    <ul className="space-y-4">
                                        {result.comments.map((comment, i) => (
                                            <li key={i} className="flex gap-4 text-sm text-zinc-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                                <ChevronRight className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                                                {comment}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Rewrite */}
                                <div className="glass-spatial p-8 border-emerald-500/20 relative overflow-hidden rounded-[32px]">
                                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-[80px]" />
                                    <h4 className="font-bold text-lg mb-6 flex items-center gap-3 text-emerald-400 relative z-10">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        Versão Refinada
                                    </h4>
                                    <div className="relative z-10 bg-emerald-900/10 rounded-xl p-6 border border-emerald-500/10">
                                        <p className="text-sm leading-loose text-emerald-100 font-serif whitespace-pre-line">
                                            "{result.improvedVersion}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-6 min-h-[500px] border-2 border-dashed border-white/10 rounded-[40px]">
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                                    <Sparkles size={40} className="text-zinc-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-bold text-zinc-300">Aguardando Redação</p>
                                    <p className="text-sm text-zinc-500 font-medium max-w-xs mx-auto">Escreva sua dissertação ao lado para receber uma correção completa com Inteligência Artificial.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

export default EssayReview;

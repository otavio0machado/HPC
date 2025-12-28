import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { NoteFile } from '../../types';
import { flashcardGenerator } from '../../services/flashcardGenerator';
import { analyzeNoteContent, generateFlashcardsFromNote, aiService } from '../../services/aiService';
import { flashcardService } from '../../services/flashcardService';

interface NotesInsightsProps {
    note: NoteFile;
}

const NotesInsights: React.FC<NotesInsightsProps> = ({ note }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<{ summary: string, keywords: string[] } | null>(null);

    // Dynamic ToC
    const toc = React.useMemo(() => {
        if (!note.content) return [];
        const lines = note.content.split('\n');
        return lines
            .filter(line => line.startsWith('#'))
            .map(line => {
                const level = line.match(/^#+/)?.[0].length || 0;
                const text = line.replace(/^#+\s*/, '');
                return { level, text };
            });
    }, [note.content]);

    // Simple "Local" Stats
    const localStats = React.useMemo(() => {
        if (!note.content) return { time: 0 };
        const words = note.content.split(/\s+/).filter(w => w.length > 3);
        const time = Math.ceil(words.length / 200);
        return { time };
    }, [note.content]);

    const handleGenerateFlashcards = async () => {
        if (!note.content) {
            toast.info("A nota está vazia.");
            return;
        }

        setIsGenerating(true);
        try {
            let count = 0;

            if (aiService.hasKey) {
                // Use HPC AI
                const cards = await generateFlashcardsFromNote(note.content);
                if (cards.length > 0) {
                    // Save to DB
                    for (const c of cards) {
                        await flashcardService.createFlashcard({
                            front: c.front,
                            back: c.back,
                            folderPath: ['AI Generated'], // Or current folder if available
                            nextReview: Date.now(),
                            interval: 0,
                            ease: 2.5,
                            repetitions: 0
                        } as any);
                    }
                    count = cards.length;
                    toast.success(`${count} Flashcards gerados com IA!`);
                } else {
                    toast.warning("IA não conseguiu gerar flashcards deste conteúdo.");
                }
            } else {
                // Use Regex Fallback
                const result = await flashcardGenerator.scanAndCreate(note.content, note.name);
                count = result.count;
                if (count > 0) toast.success(result.message);
                else toast.info(result.message);
            }

        } catch (e: any) {
            console.error(e);
            toast.error(`Erro ao gerar: ${e.message || e.toString()}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAiAnalysis = async () => {
        if (!aiService.hasKey) {
            toast.error("Configure sua API Key no arquivo .env para usar este recurso.");
            return;
        }
        setIsGenerating(true);
        try {
            const result = await analyzeNoteContent(note.content || "");
            setAiAnalysis(result);
        } catch (e: any) {
            toast.error(`Falha na análise: ${e.message || e}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* AI Insight Card */}
            <div className="glass-card rounded-2xl p-4 group relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                        <Sparkles size={14} className="animate-pulse" />
                        {aiService.hasKey ? 'HPC AI Ativado' : 'Insights'}
                    </div>
                    {aiService.hasKey && <Zap size={12} className="text-yellow-400" fill="currentColor" />}
                </div>

                <p className="text-zinc-400 text-xs mb-4 leading-relaxed relative z-10">
                    {aiService.hasKey
                        ? "IA pronta para analisar conteúdo e criar material de estudo."
                        : "Detectando padrões locais. Adicione API Key para inteligência real."}
                </p>

                <div className="space-y-2 relative z-10">
                    <button
                        onClick={handleGenerateFlashcards}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={14} /> : (aiService.hasKey ? 'Gerar Flashcards com IA' : 'Gerar Flashcards (Padrões)')}
                    </button>

                    {aiService.hasKey && (
                        <button
                            onClick={handleAiAnalysis}
                            disabled={isGenerating}
                            className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-50 text-zinc-300 hover:text-white text-xs font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/5"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={14} /> : 'Resumir e Analisar Nota'}
                        </button>
                    )}
                </div>

                {/* AI Analysis Result */}
                {aiAnalysis && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 relative z-10">
                        <div className="mb-3">
                            <h5 className="text-[10px] text-blue-300 uppercase font-bold mb-1">Resumo Inteligente</h5>
                            <p className="text-zinc-300 text-xs leading-relaxed">{aiAnalysis.summary}</p>
                        </div>
                        <div>
                            <h5 className="text-[10px] text-blue-300 uppercase font-bold mb-2">Conceitos Chave</h5>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis.keywords.map(k => (
                                    <span key={k} className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/20">{k}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Table of Contents (Dynamic) */}
            <div className="glass-card rounded-2xl p-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Nesta Página</h4>
                {toc.length > 0 ? (
                    <ul className="space-y-2 text-sm max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                        {toc.map((h, i) => (
                            <li
                                key={i}
                                className={`pl-2 border-l-2 cursor-pointer transition-colors truncate text-xs ${h.level === 1 ? 'text-blue-400 border-blue-500 font-bold' : 'text-zinc-500 border-transparent hover:border-zinc-700 hover:text-zinc-300'}`}
                                style={{ marginLeft: `${(h.level - 1) * 8}px` }}
                            >
                                {h.text}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-zinc-600 text-xs italic">Nenhum cabeçalho identificado.</p>
                )}
            </div>

            {/* Read Stats */}
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs text-zinc-500 uppercase font-bold">Tempo de Leitura</span>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                    ~{localStats.time} min
                </span>
            </div>
        </div>
    );
};

export default NotesInsights;

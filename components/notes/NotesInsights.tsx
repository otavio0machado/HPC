import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { NoteFile } from '../../types';
import { flashcardGenerator } from '../../services/flashcardGenerator';
import { analyzeNoteContent, generateFlashcardsFromNote, aiService } from '../../services/geminiService';
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
                // Use Gemini AI
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
        <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-6">

                {/* AI Insight Card */}
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                            <Sparkles size={14} />
                            {aiService.hasKey ? 'Gemini AI Ativado' : 'Insights'}
                        </div>
                        {aiService.hasKey && <Zap size={12} className="text-yellow-400" fill="currentColor" />}
                    </div>

                    <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                        {aiService.hasKey
                            ? "IA pronta para analisar conteúdo e criar material de estudo."
                            : "Detectando padrões locais. Adicione API Key para inteligência real."}
                    </p>

                    <div className="space-y-2">
                        <button
                            onClick={handleGenerateFlashcards}
                            disabled={isGenerating}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={14} /> : (aiService.hasKey ? 'Gerar Flashcards com IA' : 'Gerar Flashcards (Padrões)')}
                        </button>

                        {aiService.hasKey && (
                            <button
                                onClick={handleAiAnalysis}
                                disabled={isGenerating}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={14} /> : 'Resumir e Analisar Nota'}
                            </button>
                        )}
                    </div>

                    {/* AI Analysis Result */}
                    {aiAnalysis && (
                        <div className="mt-4 pt-4 border-t border-blue-500/20 animate-in fade-in slide-in-from-top-2">
                            <div className="mb-3">
                                <h5 className="text-[10px] text-blue-300 uppercase font-bold mb-1">Resumo Inteligente</h5>
                                <p className="text-zinc-300 text-xs leading-relaxed">{aiAnalysis.summary}</p>
                            </div>
                            <div>
                                <h5 className="text-[10px] text-blue-300 uppercase font-bold mb-2">Conceitos Chave</h5>
                                <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.keywords.map(k => (
                                        <span key={k} className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded-md border border-blue-500/20">{k}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table of Contents (Dynamic) */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Nesta Página</h4>
                    {toc.length > 0 ? (
                        <ul className="space-y-2 text-sm max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                            {toc.map((h, i) => (
                                <li
                                    key={i}
                                    className={`pl-2 border-l-2 cursor-pointer transition-colors truncate ${h.level === 1 ? 'text-blue-400 border-blue-500 font-medium' : 'text-zinc-500 border-transparent hover:border-zinc-700 hover:text-zinc-300'}`}
                                    style={{ marginLeft: `${(h.level - 1) * 8}px` }}
                                >
                                    {h.text}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-zinc-600 text-xs italic">Nenhum cabeçalho identificado (use # ou ##).</p>
                    )}
                </div>

                {/* Read Stats */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 uppercase font-bold">Tempo de Leitura</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1">
                        ~{localStats.time} min
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NotesInsights;

import React, { useState } from 'react';
import { X, Sparkles, Folder, Layers, BookOpen, BrainCircuit } from 'lucide-react';
import { Flashcard } from '../../services/flashcardService';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface CreateFlashcardsWithAIModalProps {
    decks: string[];
    initialDeck?: string;
    onClose: () => void;
    onBatchCreate: (cards: Partial<Flashcard>[]) => Promise<void>;
}

export const CreateFlashcardsWithAIModal: React.FC<CreateFlashcardsWithAIModalProps> = ({ decks, initialDeck = 'Geral', onClose, onBatchCreate }) => {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [difficulty, setDifficulty] = useState('Médio');
    const [deckPath, setDeckPath] = useState(initialDeck);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Simple autocomplete suggestion
    const suggestions = decks.filter(d => d.toLowerCase().includes(deckPath.toLowerCase()) && d !== deckPath).slice(0, 5);

    const handleGenerate = async () => {
        if (!topic && !content) {
            toast.error("Por favor, forneça um tópico ou contexto.");
            return;
        }

        setIsGenerating(true);
        try {
            const { data, error } = await supabase.functions.invoke('ai-service', {
                body: {
                    action: 'generate_flashcards',
                    payload: {
                        topic,
                        content,
                        difficulty
                    }
                }
            });

            if (error) throw error;

            const generatedCards: { front: string; back: string }[] = data.result || data; // Fallback depending on exact API return

            if (!Array.isArray(generatedCards) || generatedCards.length === 0) {
                toast.warning("A IA não gerou nenhum flashcard. Tente melhorar o contexto.");
                return;
            }

            const pathArray = deckPath.split('/').map(s => s.trim()).filter(Boolean);
            const finalPath = pathArray.length > 0 ? pathArray : ['Geral'];

            const newCards: Partial<Flashcard>[] = generatedCards.map(c => ({
                front: c.front,
                back: c.back,
                folderPath: finalPath,
                nextReview: Date.now(),
                interval: 0,
                ease: 2.5,
                repetitions: 0
            }));

            await onBatchCreate(newCards);
            onClose();

        } catch (e: any) {
            console.error('AI Generation Error:', e);
            toast.error("Erro ao gerar flashcards: " + (e.message || "Erro desconhecido"));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[20px] animate-in fade-in duration-500"
                onClick={onClose}
            ></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl glass-hydro rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden group border border-white/10 ring-1 ring-white/20"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/10">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md">
                            <Sparkles size={22} className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-md">Criar com IA</h2>
                            <p className="text-sm text-zinc-400 font-medium tracking-wide">Geração inteligente de flashcards</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full bg-zinc-800/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">

                    {/* Folder Selection */}
                    <div className="space-y-3 relative z-30">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <Folder size={12} /> Salvar em (Pasta)
                        </label>
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-3xl px-6 py-4 text-zinc-100 focus:outline-none focus:bg-black/40 focus:border-purple-500/50 focus:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 font-medium placeholder:text-zinc-600 backdrop-blur-sm"
                                placeholder="Ex: Biologia / Genética"
                                value={deckPath}
                                onChange={(e) => setDeckPath(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 10, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute top-full left-0 w-full bg-zinc-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-40 backdrop-blur-xl ring-1 ring-black/50"
                                    >
                                        <div className="p-2">
                                            {suggestions.map(s => (
                                                <button
                                                    key={s}
                                                    className="w-full text-left px-5 py-3.5 rounded-2xl text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-all flex items-center gap-3 group/item scale-100 hover:scale-[1.01]"
                                                    onClick={() => setDeckPath(s)}
                                                >
                                                    <div className="p-1.5 rounded-lg bg-white/5 group-hover/item:bg-purple-500/20 text-zinc-500 group-hover/item:text-purple-300 transition-colors">
                                                        <Folder size={14} />
                                                    </div>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Topic */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <BookOpen size={12} /> Tópico Principal
                        </label>
                        <input
                            type="text"
                            className="w-full bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-3xl px-6 py-4 text-zinc-100 focus:outline-none focus:bg-black/40 focus:border-purple-500/50 transition-all duration-300 font-medium placeholder:text-zinc-600 backdrop-blur-sm"
                            placeholder="Ex: Leis de Mendel"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <BrainCircuit size={12} /> Dificuldade
                        </label>
                        <div className="grid grid-cols-3 gap-2 p-1 bg-black/20 rounded-3xl border border-white/10">
                            {['Fácil', 'Médio', 'Difícil'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-3 rounded-2xl text-sm font-bold transition-all ${difficulty === level
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content / Context */}
                    <div className="space-y-3 flex-1 flex flex-col">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <Layers size={12} /> Conteúdo Base (Opcional)
                        </label>
                        <textarea
                            className="w-full flex-1 min-h-[150px] bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-3xl p-6 text-zinc-100 focus:outline-none focus:bg-black/40 focus:border-purple-500/40 transition-all duration-300 font-mono text-sm leading-relaxed resize-none placeholder:text-zinc-700 backdrop-blur-sm"
                            placeholder="Cole aqui o texto, resumo ou anotações para a IA usar como base..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-8 border-t border-white/10 flex justify-end gap-4 relative z-20">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 rounded-2xl border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 backdrop-blur-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={(!topic && !content) || isGenerating}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 transform hover:scale-[1.02] border border-white/10"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Gerando...
                            </div>
                        ) : (
                            <>
                                <Sparkles size={18} /> Gerar Flashcards
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

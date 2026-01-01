import React, { useState } from 'react';
import { X, Save, Eye, Folder, Layers, BookOpen, PenLine } from 'lucide-react';
import { Flashcard } from '../../services/flashcardService';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';

interface CreateCardModalProps {
    decks: string[];
    initialDeck?: string;
    onClose: () => void;
    onCreate: (card: Partial<Flashcard>) => Promise<void>;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({ decks, initialDeck = 'Geral', onClose, onCreate }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [deckPath, setDeckPath] = useState(initialDeck);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Simple autocomplete suggestion
    const suggestions = decks.filter(d => d.toLowerCase().includes(deckPath.toLowerCase()) && d !== deckPath).slice(0, 5);

    const handleSubmit = async () => {
        if (!front || !back || !deckPath) return;

        setIsSubmitting(true);
        const pathArray = deckPath.split('/').map(s => s.trim()).filter(Boolean);

        await onCreate({
            front,
            back,
            folderPath: pathArray.length > 0 ? pathArray : ['Geral'],
            nextReview: Date.now(),
            interval: 0,
            ease: 2.5,
            repetitions: 0
        });
        setIsSubmitting(false);
        setFront('');
        setBack('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with heavy blur for depth isolation */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[20px] animate-in fade-in duration-500"
                onClick={onClose}
            ></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="relative z-10 w-full max-w-4xl glass-hydro rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden group border border-white/10 ring-1 ring-white/20"
            >
                {/* Header - Transparent to let material show */}
                <div className="flex items-center justify-between p-8 border-b border-white/10">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md">
                            <Layers size={22} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-md">Novo Flashcard</h2>
                            <p className="text-sm text-zinc-400 font-medium tracking-wide">Adicione ao seu banco de conhecimento</p>
                        </div>
                    </div>
                    <div className="flex gap-3">

                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-full bg-zinc-800/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

                    {/* Deck Selection */}
                    <div className="space-y-3 relative z-30">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <Folder size={12} /> Localização (Pasta)
                        </label>
                        <div className="relative group/input">
                            <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />
                            <input
                                type="text"
                                className="w-full bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-3xl px-6 py-4 text-zinc-100 focus:outline-none focus:bg-black/40 focus:border-blue-500/50 focus:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 font-medium placeholder:text-zinc-600 relative z-10 backdrop-blur-sm"
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
                                                    <div className="p-1.5 rounded-lg bg-white/5 group-hover/item:bg-blue-500/20 text-zinc-500 group-hover/item:text-blue-300 transition-colors">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[350px]">
                        {/* FRONT */}
                        <div className="flex flex-col gap-4">
                            <label className="text-xs font-bold text-blue-300 uppercase tracking-widest pl-2 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span> Frente (Pergunta)
                            </label>

                            <div className="flex-1 relative group rounded-3xl p-1 transition-all duration-300 hover:bg-white/5">
                                <textarea
                                    className="w-full h-full bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-3xl p-6 text-zinc-100 focus:outline-none focus:bg-black/40 focus:border-blue-500/40 focus:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 font-mono text-sm leading-relaxed resize-none placeholder:text-zinc-700 backdrop-blur-sm"
                                    placeholder="# Digite a pergunta principal..."
                                    value={front}
                                    onChange={e => setFront(e.target.value)}
                                />

                            </div>
                        </div>

                        {/* BACK */}
                        <div className="flex flex-col gap-4">
                            <label className="text-xs font-bold text-emerald-300 uppercase tracking-widest pl-2 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span> Verso (Resposta)
                            </label>

                            <div className="flex-1 relative group rounded-3xl p-1 transition-all duration-300 hover:bg-white/5">
                                <textarea
                                    className="w-full h-full bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-3xl p-6 text-zinc-100 focus:outline-none focus:bg-black/40 focus:border-emerald-500/40 focus:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 font-mono text-sm leading-relaxed resize-none placeholder:text-zinc-700 backdrop-blur-sm"
                                    placeholder="Digite a resposta detalhada..."
                                    value={back}
                                    onChange={e => setBack(e.target.value)}
                                />

                            </div>
                        </div>
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
                        onClick={handleSubmit}
                        disabled={!front || !back || isSubmitting}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 transform hover:scale-[1.02] border border-white/10"
                    >
                        {isSubmitting ? 'Salvando...' : <><Save size={18} /> Salvar Card</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

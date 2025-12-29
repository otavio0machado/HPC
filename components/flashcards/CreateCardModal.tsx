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
    const [preview, setPreview] = useState(false);
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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative z-10 w-full max-w-4xl bg-zinc-900/40 border border-white/10 rounded-[32px] shadow-2xl backdrop-blur-3xl flex flex-col max-h-[90vh] overflow-hidden group"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Layers size={18} />
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-white tracking-tight">Novo Flashcard</h2>
                            <p className="text-xs text-zinc-500 font-medium">Adicione ao seu banco de conhecimento</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPreview(!preview)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${preview
                                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {preview ? 'Editar' : 'Preview'}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

                    {/* Deck Selection */}
                    <div className="space-y-2 relative z-20">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 flex items-center gap-2">
                            <Folder size={12} /> Localização (Pasta)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-zinc-200 focus:outline-none focus:bg-black/40 focus:border-blue-500/30 transition-all font-medium placeholder:text-zinc-700"
                                placeholder="Ex: Biologia / Genética"
                                value={deckPath}
                                onChange={(e) => setDeckPath(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />

                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30"
                                    >
                                        {suggestions.map(s => (
                                            <button
                                                key={s}
                                                className="w-full text-left px-5 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 last:border-0"
                                                onClick={() => setDeckPath(s)}
                                            >
                                                <Folder size={14} className="opacity-50" /> {s}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[300px]">
                        {/* FRONT */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold text-blue-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Frente (Pergunta)
                            </label>

                            <div className="flex-1 relative group">
                                {preview ? (
                                    <div className="w-full h-full bg-white/5 border border-white/5 rounded-2xl p-6 text-zinc-200 prose prose-invert prose-sm overflow-y-auto">
                                        <ReactMarkdown>{front || '*Vazio*'}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full h-full bg-black/20 border border-white/5 rounded-2xl p-6 text-zinc-200 focus:outline-none focus:bg-black/40 focus:border-blue-500/30 transition-all font-mono text-sm leading-relaxed resize-none placeholder:text-zinc-800"
                                        placeholder="# Digite a pergunta principal..."
                                        value={front}
                                        onChange={e => setFront(e.target.value)}
                                    />
                                )}
                                {!preview && <PenLine size={16} className="absolute bottom-4 right-4 text-zinc-700 pointer-events-none" />}
                            </div>
                        </div>

                        {/* BACK */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verso (Resposta)
                            </label>

                            <div className="flex-1 relative group">
                                {preview ? (
                                    <div className="w-full h-full bg-white/5 border border-white/5 rounded-2xl p-6 text-zinc-200 prose prose-invert prose-sm overflow-y-auto">
                                        <ReactMarkdown>{back || '*Vazio*'}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full h-full bg-black/20 border border-white/5 rounded-2xl p-6 text-zinc-200 focus:outline-none focus:bg-black/40 focus:border-emerald-500/30 transition-all font-mono text-sm leading-relaxed resize-none placeholder:text-zinc-800"
                                        placeholder="Digite a resposta detalhada..."
                                        value={back}
                                        onChange={e => setBack(e.target.value)}
                                    />
                                )}
                                {!preview && <PenLine size={16} className="absolute bottom-4 right-4 text-zinc-700 pointer-events-none" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-md flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!front || !back || isSubmitting}
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? 'Salvando...' : <><Save size={16} /> Salvar Card</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

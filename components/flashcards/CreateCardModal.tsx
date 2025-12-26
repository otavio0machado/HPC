import React, { useState } from 'react';
import { X, Save, Eye, Folder, Layers } from 'lucide-react';
import { Flashcard } from '../../services/flashcardService';
import ReactMarkdown from 'react-markdown';

interface CreateCardModalProps {
    decks: string[]; // These are full paths like "Science/Physics"
    initialDeck?: string;
    onClose: () => void;
    onCreate: (card: Partial<Flashcard>) => Promise<void>;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({ decks, initialDeck = 'Geral', onClose, onCreate }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    // Use text input for deck to allow subfolders
    const [deckPath, setDeckPath] = useState(initialDeck);

    const [preview, setPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simple autocomplete suggestion
    const suggestions = decks.filter(d => d.toLowerCase().includes(deckPath.toLowerCase()) && d !== deckPath).slice(0, 5);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!front || !back || !deckPath) return;

        setIsSubmitting(true);
        // Split path by / to get array
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
        // Keep deck path for next card
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                            <Layers size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Criar Novo Flashcard</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPreview(!preview)}
                            className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border ${preview ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/10'}`}
                            title="Alternar Visualização"
                        >
                            {preview ? 'Editar' : 'Preview'}
                        </button>
                        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="relative group">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block tracking-wider">Pasta / Deck</label>
                        <div className="relative">
                            <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                className="w-full bg-[var(--glass-bg)] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-zinc-600 font-medium"
                                placeholder="Ex: Biologia / Genética"
                                value={deckPath}
                                onChange={(e) => setDeckPath(e.target.value)}
                            />
                        </div>
                        {/* Suggestions */}
                        {deckPath && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-800 mt-2 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {suggestions.map(s => (
                                    <div
                                        key={s}
                                        className="px-4 py-3 hover:bg-blue-600/10 hover:text-blue-300 cursor-pointer text-sm text-zinc-300 border-b border-zinc-800 last:border-0 transition-colors flex items-center gap-2"
                                        onClick={() => setDeckPath(s)}
                                    >
                                        <Folder size={14} className="opacity-50" /> {s}
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-[10px] text-zinc-500 mt-2 font-medium flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                            Use "/" para criar subpastas automaticamente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="space-y-4 flex flex-col">
                            <label className="text-xs text-blue-400 mb-0 block font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Frente (Markdown)
                            </label>
                            {preview ? (
                                <div className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-zinc-200 min-h-[200px] prose prose-invert prose-sm overflow-y-auto shadow-inner">
                                    <ReactMarkdown>{front || '*Vazio*'}</ReactMarkdown>
                                </div>
                            ) : (
                                <textarea
                                    className="w-full bg-[var(--glass-bg)] border border-white/10 rounded-2xl p-5 text-white min-h-[200px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-zinc-700 transition-all"
                                    placeholder="# Digite a pergunta aqui..."
                                    value={front}
                                    onChange={e => setFront(e.target.value)}
                                    autoFocus
                                />
                            )}
                        </div>
                        <div className="space-y-4 flex flex-col">
                            <label className="text-xs text-emerald-400 mb-0 block font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Verso (Markdown)
                            </label>
                            {preview ? (
                                <div className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-zinc-200 min-h-[200px] prose prose-invert prose-sm overflow-y-auto shadow-inner">
                                    <ReactMarkdown>{back || '*Vazio*'}</ReactMarkdown>
                                </div>
                            ) : (
                                <textarea
                                    className="w-full bg-[var(--glass-bg)] border border-white/10 rounded-2xl p-5 text-white min-h-[200px] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-zinc-700 transition-all"
                                    placeholder="Digite a resposta esperada..."
                                    value={back}
                                    onChange={e => setBack(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-zinc-900/50 backdrop-blur-md">
                    <button onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors">Cancelar</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!front || !back || isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {isSubmitting ? 'Salvando...' : <><Save size={16} /> Criar Card</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { X, Save, Eye, Folder } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                    <h3 className="text-xl font-bold text-white">Criar Novo Flashcard</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPreview(!preview)}
                            className={`p-2 rounded-lg transition-colors ${preview ? 'bg-blue-600/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                            title="Alternar Visualização"
                        >
                            <Eye size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="relative">
                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Pasta / Deck</label>
                        <div className="relative">
                            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="Ex: Biologia/Genética"
                                value={deckPath}
                                onChange={(e) => setDeckPath(e.target.value)}
                            />
                        </div>
                        {/* Suggestions */}
                        {deckPath && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-800 mt-1 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto">
                                {suggestions.map(s => (
                                    <div
                                        key={s}
                                        className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-zinc-300"
                                        onClick={() => setDeckPath(s)}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-[10px] text-zinc-600 mt-1">Use "/" para criar subpastas.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-blue-400 mb-2 block font-bold uppercase tracking-wider">Frente (Markdown)</label>
                                {preview ? (
                                    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 min-h-[150px] prose prose-invert prose-sm overflow-y-auto">
                                        <ReactMarkdown>{front || '*Vazio*'}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-white min-h-[150px] focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                                        placeholder="Digite a pergunta..."
                                        value={front}
                                        onChange={e => setFront(e.target.value)}
                                        autoFocus
                                    />
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-emerald-400 mb-2 block font-bold uppercase tracking-wider">Verso (Markdown)</label>
                                {preview ? (
                                    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 min-h-[150px] prose prose-invert prose-sm overflow-y-auto">
                                        <ReactMarkdown>{back || '*Vazio*'}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-white min-h-[150px] focus:border-emerald-500 focus:outline-none resize-none font-mono text-sm"
                                        placeholder="Digite a resposta..."
                                        value={back}
                                        onChange={e => setBack(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!front || !back || isSubmitting}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                    >
                        {isSubmitting ? 'Salvando...' : <><Save size={16} /> Criar Card</>}
                    </button>
                </div>
            </div>
        </div>
    );
};


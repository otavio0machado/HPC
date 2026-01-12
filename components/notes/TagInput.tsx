
import React, { useState, useRef, useEffect } from 'react';
import { Hash, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface TagInputProps {
    allTags: string[];
    onAddTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ allTags, onAddTag }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectTag = (tag: string) => {
        const cleanTag = tag.trim().replace(/^#/, '');
        if (cleanTag) {
            onAddTag(`#${cleanTag}`);
            setIsOpen(false);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSelectTag(input);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Filter suggestions
    const suggestions = (allTags || []).filter(t =>
        t && typeof t === 'string' && t.toLowerCase().includes(input.toLowerCase().replace('#', ''))
    ).slice(0, 5);

    return (
        <div className="relative" ref={containerRef}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group"
                >
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all active:scale-95">
                        <Plus size={12} className="text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">Adicionar Tag</span>
                    </div>
                </button>
            ) : (
                <div className="absolute top-0 right-0 z-50 min-w-[240px] glass-spatial rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-3 animate-in fade-in zoom-in-95 duration-200 border border-white/10">
                    <div className="flex items-center gap-2 mb-3 p-1.5 bg-black/20 rounded-lg border border-white/5">
                        <Hash size={14} className="text-zinc-500" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent text-sm w-full focus:outline-none text-white placeholder:text-zinc-600 font-medium"
                            placeholder="Buscar ou criar tag..."
                            autoFocus
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {input && !suggestions.includes(`#${input.replace('#', '')}`) && (
                            <button
                                onClick={() => handleSelectTag(input)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-blue-300 hover:text-white hover:bg-blue-500/20 transition-all text-left group"
                            >
                                <div className="p-1 rounded bg-blue-500/20 group-hover:bg-blue-500/30">
                                    <Plus size={10} />
                                </div>
                                Criar tag <span className="text-white">"{input}"</span>
                            </button>
                        )}

                        {suggestions.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleSelectTag(tag)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-all text-left group"
                            >
                                <Hash size={12} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                <span className="font-medium">{tag.replace('#', '')}</span>
                            </button>
                        ))}

                        {suggestions.length === 0 && !input && (
                            <div className="py-8 text-center">
                                <Hash size={24} className="mx-auto text-zinc-700 mb-2" />
                                <p className="text-xs text-zinc-600 font-medium">Digite para buscar</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagInput;


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
                    className="text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-1 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-white/10 active:scale-95"
                >
                    <Plus size={12} /> Add Tag
                </button>
            ) : (
                <div className="absolute top-0 right-0 z-50 min-w-[220px] glass-spatial rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2 animate-in fade-in zoom-in-95 duration-200 border border-white/10">
                    <div className="flex items-center gap-2 mb-2 p-1 border-b border-white/10">
                        <Hash size={14} className="text-zinc-500" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent text-sm w-full focus:outline-none text-white placeholder:text-zinc-600 font-medium"
                            placeholder="Nome da tag..."
                            autoFocus
                        />
                        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md">
                            <X size={14} />
                        </button>
                    </div>

                    <div className="space-y-1 max-h-[180px] overflow-y-auto custom-scrollbar">
                        {input && !suggestions.includes(`#${input.replace('#', '')}`) && (
                            <div
                                onClick={() => handleSelectTag(input)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-blue-300 hover:text-white hover:bg-blue-500/20 cursor-pointer transition-colors"
                            >
                                <Plus size={12} /> Criar "{input}"
                            </div>
                        )}

                        {suggestions.map(tag => (
                            <div
                                key={tag}
                                onClick={() => handleSelectTag(tag)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                            >
                                <Hash size={12} className="text-zinc-500 group-hover:text-zinc-300" /> {tag.replace('#', '')}
                            </div>
                        ))}

                        {suggestions.length === 0 && !input && (
                            <div className="px-2 py-4 text-center text-xs text-zinc-600 italic">
                                Sem tags recentes
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagInput;

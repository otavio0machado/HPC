
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
                    className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1 hover:bg-zinc-800/50 px-2 py-1 rounded"
                >
                    <Plus size={10} /> Tag
                </button>
            ) : (
                <div className="absolute top-0 right-0 z-50 min-w-[200px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2">
                    <div className="flex items-center gap-2 mb-2 p-1 border-b border-zinc-800">
                        <Hash size={12} className="text-zinc-500" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent text-sm w-full focus:outline-none text-white placeholder:text-zinc-600"
                            placeholder="Nome da tag..."
                            autoFocus
                        />
                        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                            <X size={12} />
                        </button>
                    </div>

                    <div className="space-y-0.5 max-h-[150px] overflow-y-auto custom-scrollbar">
                        {input && !suggestions.includes(`#${input.replace('#', '')}`) && (
                            <div
                                onClick={() => handleSelectTag(input)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                            >
                                <Plus size={10} /> Criar "{input}"
                            </div>
                        )}

                        {suggestions.map(tag => (
                            <div
                                key={tag}
                                onClick={() => handleSelectTag(tag)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                            >
                                <Hash size={10} className="text-zinc-500" /> {tag.replace('#', '')}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagInput;

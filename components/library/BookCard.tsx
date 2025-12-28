import React from 'react';
import { Book as BookIcon, MoreVertical, Trash2 } from 'lucide-react';
import { Book } from '../../services/libraryService';

interface BookCardProps {
    book: Book;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, onDelete }) => {
    return (
        <div
            onClick={onClick}
            className="group relative glass-card rounded-[24px] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 border border-white/5 hover:border-white/20"
        >
            {/* Cover / Placeholder */}
            <div className="aspect-[2/3] bg-zinc-900/50 w-full relative overflow-hidden border-b border-white/5">
                {book.cover_url ? (
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-950 border-b border-white/5">
                        <BookIcon size={48} strokeWidth={1} className="opacity-40 mb-3" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 px-3 py-1.5 rounded-lg text-zinc-500 border border-white/5">{book.format}</span>
                    </div>
                )}

                {/* Glass Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Progress Bar Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 backdrop-blur-sm bg-black/40">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                        style={{ width: `${book.progress_percentage}%` }}
                    />
                </div>

                {/* Delete Button (Visible on Hover) */}
                <button
                    onClick={onDelete}
                    className="absolute top-3 right-3 p-2.5 glass-spatial text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80 hover:scale-110 shadow-lg translate-y-2 group-hover:translate-y-0"
                    title="Excluir"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Meta */}
            <div className="p-4 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-bold text-zinc-100 text-sm truncate leading-tight mb-1 group-hover:text-blue-200 transition-colors" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-xs text-zinc-500 truncate font-medium">{book.author}</p>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide group-hover:border-white/10 transition-colors group-hover:text-zinc-400">
                        {Math.round(book.progress_percentage)}% Lido
                    </span>
                    <div className="flex gap-1" title="Progresso Visual">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-colors ${(book.progress_percentage / 33) > i
                                        ? 'bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.5)]'
                                        : 'bg-zinc-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;

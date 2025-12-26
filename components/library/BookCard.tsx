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
            className="group relative bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md"
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-950">
                        <BookIcon size={48} strokeWidth={1} className="opacity-50" />
                        <span className="text-[10px] font-bold mt-3 uppercase tracking-widest bg-black/30 px-2 py-1 rounded text-zinc-500">{book.format}</span>
                    </div>
                )}

                {/* Glass Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Progress Bar Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-950">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${book.progress_percentage}%` }}
                    />
                </div>

                {/* Delete Button (Visible on Hover) */}
                <button
                    onClick={onDelete}
                    className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80 backdrop-blur-sm border border-white/10"
                    title="Excluir"
                >
                    <Trash2 size={14} />
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
                    <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide group-hover:border-white/10 transition-colors">
                        {Math.round(book.progress_percentage)}% Lido
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;

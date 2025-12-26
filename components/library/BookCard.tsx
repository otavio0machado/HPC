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
            className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300"
        >
            {/* Cover / Placeholder */}
            <div className="aspect-[2/3] bg-zinc-800 w-full relative overflow-hidden">
                {book.cover_url ? (
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <BookIcon size={48} strokeWidth={1} />
                        <span className="text-xs font-mono mt-2 uppercase opacity-50">{book.format}</span>
                    </div>
                )}

                {/* Progress Bar Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-950/50">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${book.progress_percentage}%` }}
                    />
                </div>

                {/* Delete Button (Visible on Hover) */}
                <button
                    onClick={onDelete}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    title="Excluir"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Meta */}
            <div className="p-3">
                <h3 className="font-bold text-zinc-200 text-sm truncate leading-tight mb-1" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-xs text-zinc-500 truncate">{book.author}</p>
                <p className="text-[10px] text-zinc-600 mt-2">
                    {Math.round(book.progress_percentage)}% Lido
                </p>
            </div>
        </div>
    );
};

export default BookCard;

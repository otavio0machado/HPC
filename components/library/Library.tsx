import React, { useState, useEffect } from 'react';
import { Plus, Upload, BookOpen, Quote, Search, Loader2, Trash2, Library as LibraryIcon } from 'lucide-react';
import { libraryService, Book, KindleHighlight } from '../../services/libraryService';
import BookCard from './BookCard';
import BookReader from './BookReader';
import KindleSync from './KindleSync';
import { toast } from 'sonner';
import { extractCover } from '../../utils/coverExtractor';

const Library: React.FC<{ userId: string }> = ({ userId }) => {
    // Tabs: 'books' | 'highlights'
    const [activeTab, setActiveTab] = useState<'books' | 'highlights'>('books');

    // Data State
    const [books, setBooks] = useState<Book[]>([]);
    const [highlights, setHighlights] = useState<KindleHighlight[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [readingBook, setReadingBook] = useState<Book | null>(null);
    const [showKindleSync, setShowKindleSync] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Load Data
    useEffect(() => {
        loadLibrary();
    }, [userId]);

    const loadLibrary = async () => {
        try {
            setLoading(true);
            const [booksData, highlightsData] = await Promise.all([
                libraryService.fetchBooks(),
                libraryService.fetchHighlights()
            ]);
            setBooks(booksData);
            setHighlights(highlightsData);
        } catch (e: any) {
            console.error(e);
            toast.error(`Erro ao carregar biblioteca: ${e.message || 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                setIsUploading(true);
                toast.info("Processando livro e capa...");

                // Extract cover
                const coverBlob = await extractCover(file);

                const newBook = await libraryService.uploadBook(file, userId, coverBlob || undefined);
                setBooks([newBook, ...books]);
                toast.success("Livro adicionado com sucesso!");
            } catch (err: any) {
                toast.error(err.message || "Erro no upload.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDeleteBook = async (e: React.MouseEvent, book: Book) => {
        e.stopPropagation();
        if (!confirm(`Excluir "${book.title}"?`)) return;

        try {
            await libraryService.deleteBook(book.id, book.file_path);
            setBooks(books.filter(b => b.id !== book.id));
            toast.success("Livro removido.");
        } catch (err) {
            toast.error("Erro ao remover livro.");
        }
    };

    if (readingBook) {
        return (
            <BookReader
                book={readingBook}
                onClose={() => {
                    setReadingBook(null);
                    loadLibrary(); // Refresh progress
                }}
                onUpdate={(updated) => {
                    setBooks(books.map(b => b.id === updated.id ? updated : b));
                }}
            />
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-1 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200 tracking-tight drop-shadow-md">Biblioteca Digital</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="glass-spatial p-1.5 rounded-2xl flex text-sm backdrop-blur-xl">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold ${activeTab === 'books' ? 'bg-white/20 text-white shadow-lg border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <BookOpen size={16} /> Livros
                        </button>
                        <button
                            onClick={() => setActiveTab('highlights')}
                            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold ${activeTab === 'highlights' ? 'bg-white/20 text-white shadow-lg border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Quote size={16} /> Destaques
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8 glass-card p-4 rounded-[28px] backdrop-blur-xl">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar em sua biblioteca..."
                        className="w-full bg-black/20 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowKindleSync(true)}
                        className="px-5 py-3 text-sm font-bold bg-zinc-900/50 border border-white/10 hover:bg-zinc-800 hover:border-white/20 text-zinc-300 rounded-xl transition-all flex items-center gap-2 group shadow-sm"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Kindle_logo.svg" alt="Kindle" className="h-4 opacity-50 invert group-hover:opacity-80 transition-opacity" />
                        Sincronizar
                    </button>

                    <label className="px-6 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 group border border-white/20">
                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                        <span className="hidden sm:inline">Adicionar Livro</span>
                        <input
                            type="file"
                            accept=".pdf,.epub"
                            className="hidden"
                            disabled={isUploading}
                            onChange={handleFileUpload}
                        />
                    </label>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pb-20 pr-2 custom-scrollbar">
                    {activeTab === 'books' ? (
                        books.length === 0 ? (
                            <div className="text-center py-24 text-zinc-500 glass-card rounded-[32px] flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <LibraryIcon size={40} className="opacity-30" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Sua biblioteca está vazia</h3>
                                <p className="text-sm text-zinc-400">Adicione livros PDF ou EPUB para começar a ler.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {books.map(book => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        onClick={() => setReadingBook(book)}
                                        onDelete={(e) => handleDeleteBook(e, book)}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {highlights.length === 0 ? (
                                <div className="col-span-full text-center py-24 text-zinc-500 glass-card rounded-[32px] flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        <Quote size={40} className="opacity-30" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Nenhum destaque importado</h3>
                                    <p className="text-sm text-zinc-400">Use o botão "Sincronizar" para importar seu My Clippings.txt</p>
                                </div>
                            ) : (
                                highlights.map((hl) => (
                                    <div key={hl.id} className="glass-card p-6 rounded-[28px] bubble-hover relative">
                                        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <Quote size={40} />
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                                                <Quote size={20} className="text-blue-500/80 mb-3" />
                                                <p className="font-serif text-zinc-200 leading-relaxed text-sm mb-4 italic">
                                                    "{hl.content}"
                                                </p>
                                                <div className="flex flex-col gap-1 text-xs text-zinc-500 pt-4 border-t border-white/5">
                                                    <span className="font-bold text-blue-300 line-clamp-1">{hl.book_title}</span>
                                                    <span>{hl.author}</span>
                                                    <span className="text-[10px] opacity-50 mt-1">{hl.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {showKindleSync && (
                <KindleSync userId={userId} onClose={() => setShowKindleSync(false)} />
            )}
        </div>
    );
};

export default Library;

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
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 tracking-tight drop-shadow-md mb-1">
                        Biblioteca Digital
                    </h2>
                    <p className="text-zinc-400 text-sm">Gerencie seus livros e destaques.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="glass-spatial p-1.5 rounded-2xl flex text-sm backdrop-blur-xl border border-white/10">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-6 py-2 rounded-xl transition-all flex items-center gap-2 font-bold ${activeTab === 'books' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <BookOpen size={16} /> Livros
                        </button>
                        <button
                            onClick={() => setActiveTab('highlights')}
                            className={`px-6 py-2 rounded-xl transition-all flex items-center gap-2 font-bold ${activeTab === 'highlights' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Quote size={16} /> Destaques
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 glass-card p-4 rounded-[28px] backdrop-blur-3xl border border-white/10 gap-4">
                <div className="relative w-full md:max-w-sm group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar em sua biblioteca..."
                        className="w-full bg-black/20 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600 hover:bg-black/30"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowKindleSync(true)}
                        className="glass-button px-5 py-3 text-sm font-bold text-zinc-300 rounded-xl transition-all flex items-center gap-2 group hover:text-white"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Kindle_logo.svg" alt="Kindle" className="h-4 opacity-50 invert group-hover:opacity-100 transition-opacity" />
                        Sincronizar
                    </button>

                    <label className="cursor-pointer">
                        <div className="glass-button-primary px-6 py-3 text-sm font-bold text-white rounded-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
                            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} className="transition-transform group-hover:rotate-90" />}
                            <span className="hidden sm:inline">{isUploading ? 'Enviando...' : 'Adicionar Livro'}</span>
                        </div>
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
                            <div className="text-center py-24 text-zinc-500 glass-card rounded-[32px] flex flex-col items-center border border-white/5">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                                    <LibraryIcon size={48} className="opacity-30 drop-shadow-lg" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Sua biblioteca está vazia</h3>
                                <p className="text-sm text-zinc-400 max-w-md mx-auto">Adicione livros PDF ou EPUB para começar a ler e anotar seus estudos.</p>
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
                                <div className="col-span-full text-center py-24 text-zinc-500 glass-card rounded-[32px] flex flex-col items-center border border-white/5">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                                        <Quote size={48} className="opacity-30 drop-shadow-lg" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Nenhum destaque importado</h3>
                                    <p className="text-sm text-zinc-400 max-w-md mx-auto">Use o botão "Sincronizar" para importar seu My Clippings.txt do Kindle.</p>
                                </div>
                            ) : (
                                highlights.map((hl) => (
                                    <div key={hl.id} className="glass-card hover:glass-card-hover p-6 rounded-[28px] group relative transition-all duration-300 border border-white/5 hover:border-white/10">
                                        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Quote size={32} />
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                                                <Quote size={18} className="text-blue-400/80 mb-3" />
                                                <p className="font-serif text-zinc-200 leading-relaxed text-sm mb-4 italic pl-2 border-l-2 border-white/10">
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

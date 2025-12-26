import React, { useState, useEffect } from 'react';
import { Plus, Upload, BookOpen, Quote, Search, Loader2, Trash2 } from 'lucide-react';
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
        <div className="h-full flex flex-col">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Sua Biblioteca</h2>
                    <p className="text-zinc-400 text-sm">Gerencie seus livros e destaques do Kindle.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-lg flex text-sm">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-4 py-1.5 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'books' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <BookOpen size={16} /> Livros
                        </button>
                        <button
                            onClick={() => setActiveTab('highlights')}
                            className={`px-4 py-1.5 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'highlights' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Quote size={16} /> Destaques
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowKindleSync(true)}
                        className="px-4 py-2 text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Kindle_logo.svg" alt="Kindle" className="h-4 opacity-70 invert" />
                        Sincronizar
                    </button>

                    <label className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-2">
                        {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
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
                    <Loader2 className="animate-spin text-zinc-500" size={32} />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pb-20">
                    {activeTab === 'books' ? (
                        books.length === 0 ? (
                            <div className="text-center py-20 text-zinc-500">
                                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Sua biblioteca está vazia.</p>
                                <p className="text-sm">Adicione livros PDF ou EPUB para começar a ler.</p>
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
                        <div className="space-y-4">
                            {highlights.length === 0 ? (
                                <div className="text-center py-20 text-zinc-500">
                                    <Quote size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Nenhum destaque importado.</p>
                                    <p className="text-sm">Use o botão "Sincronizar" para importar seu My Clippings.txt</p>
                                </div>
                            ) : (
                                highlights.map((hl) => (
                                    <div key={hl.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <p className="font-serif text-zinc-300 leading-relaxed mb-3 pl-4 border-l-2 border-blue-500">
                                                    "{hl.content}"
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                    <span className="font-bold text-zinc-400">{hl.book_title}</span>
                                                    <span>•</span>
                                                    <span>{hl.author}</span>
                                                    <span className="ml-auto">{hl.location}</span>
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

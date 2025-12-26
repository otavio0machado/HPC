import React, { useState } from 'react';
import { ArrowLeft, Settings, Type, Moon, Sun, Monitor } from 'lucide-react';
import { PDFReader } from '../notes/PDFReader';
import EpubReader from './EpubReader';
import { Book, libraryService, ReaderSettings, ReaderTheme } from '../../services/libraryService';
import { toast } from 'sonner';

interface BookReaderProps {
    book: Book;
    onClose: () => void;
    onUpdate: (book: Book) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ book, onClose, onUpdate }) => {
    // Settings State
    const [settings, setSettings] = useState<ReaderSettings>({
        fontSize: 100,
        theme: 'dark' // Default to dark match app
    });
    const [showSettings, setShowSettings] = useState(false);

    const handleLocationChange = async (loc: string | number) => {
        try {
            await libraryService.updateProgress(book.id, String(loc), book.progress_percentage);
        } catch (e) {
            console.error("Failed to save progress", e);
        }
    };

    const handlePdfUpdate = (highlights: any) => {
        // Logic to save highlights for PDF
    };

    const toggleTheme = (t: ReaderTheme) => setSettings(s => ({ ...s, theme: t }));
    const adjustFontSize = (delta: number) => setSettings(s => ({ ...s, fontSize: Math.max(50, Math.min(200, s.fontSize + delta)) }));

    return (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col animate-in slide-in-from-bottom duration-300">

            {/* Reader Header */}
            <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <span className="font-bold text-sm text-zinc-200 block max-w-[200px] truncate">{book.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{book.format}</span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${showSettings ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    >
                        <Settings size={20} />
                        <span className="text-xs font-medium hidden sm:inline">Aparência</span>
                    </button>

                    {showSettings && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                            {/* Theme Selector */}
                            <div className="mb-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Tema</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => toggleTheme('light')}
                                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${settings.theme === 'light' ? 'border-blue-500 bg-white text-black' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}
                                    >
                                        <Sun size={16} />
                                        <span className="text-[10px]">Claro</span>
                                    </button>
                                    <button
                                        onClick={() => toggleTheme('sepia')}
                                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${settings.theme === 'sepia' ? 'border-blue-500 bg-[#f4ecd8] text-[#5b4636]' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}
                                    >
                                        <Type size={16} />
                                        <span className="text-[10px]">Sépia</span>
                                    </button>
                                    <button
                                        onClick={() => toggleTheme('dark')}
                                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${settings.theme === 'dark' ? 'border-blue-500 bg-zinc-900 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}
                                    >
                                        <Moon size={16} />
                                        <span className="text-[10px]">Escuro</span>
                                    </button>
                                </div>
                            </div>

                            {/* Font Size Selector */}
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Tamanho da Fonte</label>
                                <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                                    <button onClick={() => adjustFontSize(-10)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"><Type size={14} /></button>
                                    <span className="text-sm font-mono text-zinc-300">{settings.fontSize}%</span>
                                    <button onClick={() => adjustFontSize(10)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"><Type size={20} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reader Body */}
            <div className="flex-1 overflow-hidden relative">
                {book.format === 'pdf' ? (
                    <PDFReader
                        url={book.file_url}
                        onUpdateAnnotations={handlePdfUpdate}
                        settings={settings}
                        onClose={undefined}
                    />
                ) : (
                    <EpubReader
                        url={book.file_url}
                        location={book.progress_location || undefined}
                        locationChanged={handleLocationChange}
                        settings={settings}
                    />
                )}
            </div>
        </div>
    );
};

export default BookReader;

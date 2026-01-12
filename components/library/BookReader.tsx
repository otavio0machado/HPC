import React, { useState } from 'react';
import { ArrowLeft, Settings, Type, Moon, Sun, FileText } from 'lucide-react';
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



    const toggleTheme = (t: ReaderTheme) => setSettings(s => ({ ...s, theme: t }));
    const adjustFontSize = (delta: number) => setSettings(s => ({ ...s, fontSize: Math.max(50, Math.min(200, s.fontSize + delta)) }));

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-bottom duration-300">

            {/* Reader Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 backdrop-blur-3xl z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95"
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
                        className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${showSettings ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Settings size={20} />
                        <span className="text-xs font-bold hidden sm:inline">Aparência</span>
                    </button>

                    {showSettings && (
                        <div className="absolute right-0 top-full mt-4 w-72 glass-card rounded-[24px] p-5 animate-in fade-in zoom-in-95 duration-200 border border-white/10 shadow-2xl z-50">
                            {/* Theme Selector */}
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-3 block tracking-wider">Tema</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => toggleTheme('light')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${settings.theme === 'light' ? 'border-blue-500 bg-white text-black ring-2 ring-blue-500/20' : 'border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-white/5'}`}
                                    >
                                        <Sun size={18} />
                                        <span className="text-[10px] font-bold">Claro</span>
                                    </button>
                                    <button
                                        onClick={() => toggleTheme('sepia')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${settings.theme === 'sepia' ? 'border-amber-500 bg-[#f4ecd8] text-[#5b4636] ring-2 ring-amber-500/20' : 'border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-white/5'}`}
                                    >
                                        <Type size={18} />
                                        <span className="text-[10px] font-bold">Sépia</span>
                                    </button>
                                    <button
                                        onClick={() => toggleTheme('dark')}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${settings.theme === 'dark' ? 'border-indigo-500 bg-zinc-950 text-white ring-2 ring-indigo-500/20' : 'border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-white/5'}`}
                                    >
                                        <Moon size={18} />
                                        <span className="text-[10px] font-bold">Escuro</span>
                                    </button>
                                </div>
                            </div>

                            {/* Font Size Selector */}
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-3 block tracking-wider">Tamanho da Fonte</label>
                                <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-1.5">
                                    <button onClick={() => adjustFontSize(-10)} className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Type size={14} /></button>
                                    <span className="text-sm font-mono text-zinc-200 font-bold">{settings.fontSize}%</span>
                                    <button onClick={() => adjustFontSize(10)} className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Type size={20} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reader Body */}
            <div className={`flex-1 overflow-hidden relative ${settings.theme === 'light' ? 'bg-zinc-100' : settings.theme === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-transparent'}`}>
                {book.format === 'epub' ? (
                    <EpubReader
                        url={book.file_url}
                        location={book.progress_location || undefined}
                        locationChanged={handleLocationChange}
                        settings={settings}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <h2 className="text-xl font-bold text-white mb-2">Formato não suportado</h2>
                        <p className="text-sm text-zinc-400">O suporte a PDF foi removido. Por favor, use arquivos EPUB.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookReader;

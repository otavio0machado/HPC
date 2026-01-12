import React, { useState, useEffect, useCallback } from 'react';
import NotesSidebar from './NotesSidebar';
import NotesEditor from './NotesEditor';
import NotesInsights from './NotesInsights';
import NotesSettings from './NotesSettings';
import { notesService } from '../../services/notesService';
import { NoteFile } from '../../types';
import { toast } from 'sonner';
import { Loader2, Star, Maximize2, Minimize2, PanelRight, Info, FileText, X, ChevronRight, MoreHorizontal, Sidebar, Folder } from 'lucide-react';
import TagInput from './TagInput';
import { PDFReader } from './PDFReader';
import type { IHighlight } from 'react-pdf-highlighter';

const NotesModule: React.FC = () => {
    const [notes, setNotes] = useState<NoteFile[]>([]);
    const [selectedNote, setSelectedNote] = useState<NoteFile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // PDF Reader State
    const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
    const [pdfAnnotations, setPdfAnnotations] = useState<IHighlight[]>([]);
    const [showPdfReader, setShowPdfReader] = useState(false);

    // Layout States
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [isExpandedMode, setIsExpandedMode] = useState(false);

    // Zoom / Focus State
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

    // Stats for Footer
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Calculate unique tags
    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        if (Array.isArray(notes)) {
            notes.forEach(note => {
                if (note && Array.isArray(note.tags)) {
                    note.tags.forEach(t => tags.add(t));
                }
            });
        }
        return Array.from(tags).sort();
    }, [notes]);

    // Filter notes
    const filteredNotes = React.useMemo(() => {
        if (!Array.isArray(notes)) return [];
        if (!selectedTag) return notes;
        return notes.filter(n => n && Array.isArray(n.tags) && n.tags.includes(selectedTag));
    }, [notes, selectedTag]);

    // Mobile State
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadNotes();
    }, []);

    useEffect(() => {
        if (selectedNote?.content) {
            const text = selectedNote.content.replace(/<[^>]*>/g, '');
            setWordCount(text.split(/\s+/).filter(w => w.length > 0).length);
            setCharCount(text.length);
        } else {
            setWordCount(0);
            setCharCount(0);
        }
    }, [selectedNote?.content]);

    const loadNotes = async () => {
        try {
            const data = await notesService.fetchNotes();
            setNotes(data);
        } catch (e) {
            toast.error("Erro ao carregar notas.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNote = async (parentId: string | null = null, type: 'folder' | 'markdown' = 'markdown') => {
        try {
            const { data: newNote, error } = await notesService.createNote({
                name: type === 'folder' ? 'Nova Pasta' : 'Sem Título',
                type: type,
                parentId: parentId,
                content: ''
            });

            if (newNote) {
                setNotes(prev => [...prev, newNote]);
                if (type === 'markdown') {
                    setSelectedNote(newNote);
                }
                toast.success(type === 'folder' ? 'Pasta criada' : 'Nota criada');
            } else if (error) {
                toast.error(`Erro ao criar: ${error}`);
            }
        } catch (e) {
            toast.error("Erro inesperado ao criar.");
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Tem certeza? Isso apagará notas filhas também.')) return;

        const previousNotes = [...notes];
        setNotes(prev => prev.filter(n => n.id !== id && n.parentId !== id));
        if (selectedNote?.id === id) setSelectedNote(null);

        try {
            await notesService.deleteNote(id);
            toast.success("Nota removida.");
        } catch (e) {
            setNotes(previousNotes);
            toast.error("Erro ao remover.");
        }
    };

    const handleRenameNote = async (id: string, newName: string) => {
        const previousNotes = [...notes];
        setNotes(prev => prev.map(n => n.id === id ? { ...n, name: newName } : n));
        if (selectedNote?.id === id) setSelectedNote(prev => prev ? { ...prev, name: newName } : null);

        try {
            await notesService.updateNote(id, { name: newName });
            toast.success("Renomeado com sucesso.");
        } catch (e) {
            setNotes(previousNotes);
            toast.error("Erro ao renomear.");
        }
    };

    const handleMoveNote = async (noteId: string, newParentId: string | null) => {
        if (noteId === newParentId) return;

        const isDescendant = (parentId: string, targetId: string): boolean => {
            if (parentId === targetId) return true;
            const children = notes.filter(n => n.parentId === parentId);
            for (const child of children) {
                if (isDescendant(child.id, targetId)) return true;
            }
            return false;
        };

        if (newParentId && isDescendant(noteId, newParentId)) {
            toast.error("Não é possível mover uma pasta para dentro de si mesma.");
            return;
        }

        const note = notes.find(n => n.id === noteId);
        if (!note || note.parentId === newParentId) return;

        const previousNotes = [...notes];
        setNotes(prev => prev.map(n => n.id === noteId ? { ...n, parentId: newParentId } : n));
        if (selectedNote?.id === noteId) setSelectedNote(prev => prev ? { ...prev, parentId: newParentId } : null);

        try {
            await notesService.updateNote(noteId, { parentId: newParentId });
            toast.success("Nota movida.");
        } catch (e) {
            setNotes(previousNotes);
            toast.error("Erro ao mover nota.");
        }
    };

    // Modified to handle content as markdown (strings)
    const handleUpdateContent = useCallback(async (content: string) => {
        if (!selectedNote) return;

        const updatedNote = { ...selectedNote, content };
        const extractedTags = content.match(/#[\w\u00C0-\u00FF]+/g) || [];
        updatedNote.tags = extractedTags;

        setSelectedNote(updatedNote);
        setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));
    }, [selectedNote]);

    const handleToggleFavorite = async () => {
        if (!selectedNote) return;
        const newStatus = !selectedNote.isFavorite;
        const updatedNote = { ...selectedNote, isFavorite: newStatus };
        setSelectedNote(updatedNote);
        setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));

        try {
            await notesService.updateNote(selectedNote.id, { isFavorite: newStatus });
            toast.success(newStatus ? "Adicionado aos favoritos" : "Removido dos favoritos");
        } catch (e) {
            const revertedNote = { ...selectedNote, isFavorite: !newStatus };
            setSelectedNote(revertedNote);
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? revertedNote : n));
            toast.error("Erro ao atualizar favorito");
        }
    };

    const handleAddTag = async (tag: string) => {
        if (!selectedNote) return;
        const tagText = ` #${tag} `;
        const newContent = selectedNote.content ? selectedNote.content + tagText : tagText;
        await handleUpdateContent(newContent);
        // Saving handled by debounce effect
        toast.success(`Tag ${tag} adicionada!`);
    };

    const handleOpenPdf = useCallback((url: string, title?: string) => {
        setActivePdfUrl(url);
        setShowPdfReader(true);
    }, []);

    const handleUpdateAnnotations = useCallback(async (allHighlights: IHighlight[]) => {
        setPdfAnnotations(allHighlights);
        if (selectedNote) {
            const updatedNote = { ...selectedNote, pdfAnnotations: allHighlights };
            setSelectedNote(updatedNote);
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));
            try {
                await notesService.updateNote(selectedNote.id, { pdfAnnotations: allHighlights });
            } catch (error) {
                // Fail silently
            }
        }
    }, [selectedNote]);

    useEffect(() => {
        if (selectedNote && selectedNote.pdfAnnotations) {
            setPdfAnnotations(selectedNote.pdfAnnotations);
        } else {
            setPdfAnnotations([]);
        }
    }, [selectedNote?.id]);

    useEffect(() => {
        if (!selectedNote) return;
        const timer = setTimeout(async () => {
            setIsSaving(true);
            await notesService.updateNote(selectedNote.id, {
                content: selectedNote.content,
                name: selectedNote.name,
                parentId: selectedNote.parentId,
                pdfData: selectedNote.pdfData
            });
            setIsSaving(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [selectedNote?.content, selectedNote?.name]);

    useEffect(() => {
        const handleZoom = async (e: Event) => {
            const customEvent = e as CustomEvent;
            const blockId = customEvent.detail.blockId;
            setFocusedBlockId(blockId);
            toast.info(`Foco no bloco ${blockId}`);
        };
        window.addEventListener('zoom-block', handleZoom);
        return () => window.removeEventListener('zoom-block', handleZoom);
    }, []);

    const searchNotes = useCallback(async (query: string) => {
        const lowerQuery = query.toLowerCase();
        return notes
            .filter(n => n.name.toLowerCase().includes(lowerQuery) && n.id !== selectedNote?.id)
            .slice(0, 5)
            .map(n => ({
                id: n.id,
                label: n.name,
                name: n.name
            }));
    }, [notes, selectedNote]);

    // BREADCRUMBS MAKER
    const getBreadcrumbs = () => {
        if (!selectedNote) return [];
        const path: NoteFile[] = [];
        let current = selectedNote;

        // Prevent infinite loop with max depth
        let i = 0;
        while (current.parentId && i < 20) {
            const parent = notes.find(n => n.id === current.parentId);
            if (parent) {
                path.unshift(parent);
                current = parent;
            } else {
                break;
            }
            i++;
        }
        return path;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className={`
            flex overflow-hidden bg-white dark:bg-[#0c0c0e] animate-in fade-in duration-300 relative
            ${isExpandedMode ? 'fixed inset-0 z-50' : 'h-[calc(100vh-64px)]'}
        `}>
            {/* --- MOBILE OVERLAY (Left) --- */}
            {isMobile && showLeftSidebar && (
                <div
                    className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
                    onClick={() => setShowLeftSidebar(false)}
                />
            )}

            {/* --- LEFT SIDEBAR: File Tree --- */}
            <div className={`
                ${isMobile ? 'absolute inset-y-0 left-0 z-40 shadow-2xl' : 'relative'} 
                ${showLeftSidebar ? 'w-64' : 'w-0'} 
                transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden bg-zinc-50 dark:bg-black/20
            `}>
                <div className="w-64 h-full">
                    <NotesSidebar
                        notes={filteredNotes}
                        selectedNoteId={selectedNote?.id || null}
                        onSelectNote={setSelectedNote}
                        onCreateNote={handleCreateNote}
                        onDeleteNote={handleDeleteNote}
                        onMoveNote={handleMoveNote}
                        onRenameNote={handleRenameNote}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        allTags={allTags}
                        selectedTag={selectedTag}
                        onSelectTag={setSelectedTag}
                    />
                </div>
            </div>

            {/* --- MAIN CONTENT: Editor --- */}
            <div className={`flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0c0c0e] relative z-0 transition-all duration-300`}>
                {selectedNote ? (
                    <>
                        {/* --- HEADER --- */}
                        <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e]">
                            {/* Tabs Area */}
                            <div className="flex items-end px-3 pt-2 bg-zinc-100 dark:bg-black/40 border-b border-zinc-200 dark:border-zinc-800">
                                <div className="group relative flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0c0c0e] rounded-t-lg border-t border-x border-zinc-200 dark:border-zinc-800 -mb-px text-sm select-none z-10 w-fit max-w-[200px]">
                                    <FileText size={14} className="text-blue-500 shrink-0" />
                                    <span className="font-medium text-zinc-900 dark:text-white truncate">{selectedNote.name}</span>
                                    <button onClick={() => setSelectedNote(null)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded ml-2 transition-opacity">
                                        <X size={12} className="text-zinc-500 hover:text-red-500" />
                                    </button>
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                                </div>
                                {/* New Tab + */}
                                <button onClick={() => handleCreateNote(null, 'markdown')} className="p-2 mb-1 ml-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                                    <X size={14} className="rotate-45" />
                                </button>
                            </div>

                            {/* Breadcrumbs & Toolbar */}
                            <div className="h-10 flex items-center justify-between px-4 bg-white dark:bg-[#0c0c0e]">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 overflow-hidden">
                                    <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="mr-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Toggle Sidebar">
                                        <Sidebar size={16} className={!showLeftSidebar ? "text-blue-500" : ""} />
                                    </button>

                                    <Folder size={12} className="opacity-50" />
                                    <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors font-medium">Biblioteca</span>

                                    {getBreadcrumbs().map(folder => (
                                        <React.Fragment key={folder.id}>
                                            <ChevronRight size={10} className="opacity-40" />
                                            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors">
                                                {folder.name}
                                            </span>
                                        </React.Fragment>
                                    ))}

                                    <ChevronRight size={10} className="opacity-40" />
                                    <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1 truncate text-blue-600 dark:text-blue-400">
                                        {selectedNote.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-zinc-400">
                                    {isSaving && <span className="text-[10px] text-zinc-400 animate-pulse">Salvando...</span>}
                                    <button onClick={() => setIsExpandedMode(!isExpandedMode)} className="hover:text-zinc-900 dark:hover:text-white transition-colors" title="Expandir/Minimizar">
                                        {isExpandedMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                    </button>

                                    <button onClick={() => setShowRightSidebar(!showRightSidebar)} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <PanelRight size={16} className={!showRightSidebar ? "opacity-50" : "text-blue-500"} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- EDITOR AREA --- */}
                        <div className="flex-1 overflow-hidden flex bg-transparent">
                            <div className={`flex flex-col transition-all duration-300 ease-in-out ${showPdfReader ? 'w-1/2 border-r border-zinc-200 dark:border-zinc-800' : 'w-full'}`}>

                                {/* Title Input - Clean & Big */}
                                <div className="px-8 lg:px-12 pt-10 pb-2">
                                    <input
                                        type="text"
                                        value={selectedNote.name.replace('.md', '')}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            setSelectedNote(prev => prev ? { ...prev, name: newName } : null);
                                            setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, name: newName } : n));
                                            notesService.updateNote(selectedNote.id, { name: newName });
                                        }}
                                        className="w-full bg-transparent text-4xl font-bold text-zinc-900 dark:text-white placeholder:text-zinc-300/50 focus:outline-none tracking-tight leading-none"
                                        placeholder="Sem Título"
                                    />
                                </div>

                                <NotesEditor
                                    noteId={selectedNote.id}
                                    content={selectedNote.content || ''}
                                    onUpdate={handleUpdateContent}
                                    searchNotes={searchNotes}
                                    onOpenPdf={handleOpenPdf}
                                />

                                {/* Status Bar */}
                                <div className="h-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0e] flex items-center justify-between px-4 text-[10px] text-zinc-500 dark:text-zinc-400 select-none font-medium">
                                    <div className="flex items-center gap-4">
                                        <span>{wordCount} palavras</span>
                                        <span>{charCount} caracteres</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {selectedNote.updatedAt && (
                                            <span>Atualizado: {new Date(selectedNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        )}
                                        <span className="flex items-center gap-1.5"><Info size={10} className="text-blue-500" /> Markdown Mode</span>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Reader Panel */}
                            {showPdfReader && activePdfUrl && (
                                <div className="w-1/2 flex flex-col bg-zinc-100 dark:bg-zinc-900/50 z-20 shadow-xl">
                                    <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Leitor PDF</span>
                                        <button onClick={() => setShowPdfReader(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 rounded transition-colors">
                                            <Minimize2 size={14} />
                                        </button>
                                    </div>
                                    <PDFReader
                                        url={activePdfUrl}
                                        initialAnnotations={pdfAnnotations}
                                        onUpdateAnnotations={handleUpdateAnnotations}
                                        onClose={() => setShowPdfReader(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-zinc-50/30 dark:bg-[#0c0c0e]">
                        <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                            <FileText size={40} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                            Sem nota selecionada
                        </h2>
                        <p className="font-medium text-zinc-400 text-sm max-w-xs text-center">
                            Selecione um arquivo da biblioteca ou crie uma nova nota.
                        </p>
                        <button
                            onClick={() => handleCreateNote(null, 'markdown')}
                            className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-blue-500/20"
                        >
                            Criar Nova Nota
                        </button>
                    </div>
                )}
            </div>

            {/* --- MOBILE OVERLAY (Right) --- */}
            {isMobile && showRightSidebar && (
                <div
                    className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
                    onClick={() => setShowRightSidebar(false)}
                />
            )}

            {/* --- RIGHT SIDEBAR: Meta & Details --- */}
            <div className={`
                ${isMobile ? 'absolute inset-y-0 right-0 z-40 shadow-2xl' : 'relative'}
                ${showRightSidebar && selectedNote ? 'w-72' : 'w-0'} 
                transition-all duration-300 ease-in-out flex flex-col overflow-hidden bg-zinc-50 dark:bg-black/20 border-l border-zinc-200 dark:border-zinc-800
            `}>
                <div className="w-72 h-full overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {selectedNote && (
                        <>
                            {/* Meta Header */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Informações</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors -mx-2">
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Favorito</span>
                                        <button
                                            onClick={handleToggleFavorite}
                                            className={`p-1.5 rounded-md transition-all ${selectedNote.isFavorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                                        >
                                            <Star size={16} className={selectedNote.isFavorite ? 'fill-current' : ''} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors -mx-2">
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Criado</span>
                                        <span className="text-xs font-mono text-zinc-500">{new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors -mx-2">
                                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Modificado</span>
                                        <span className="text-xs font-mono text-zinc-500">
                                            {selectedNote.updatedAt ? new Date(selectedNote.updatedAt).toLocaleDateString() : 'Hoje'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

                            {/* Tags */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedNote.tags && selectedNote.tags.length > 0 ? (
                                        selectedNote.tags.map(tag => (
                                            <span key={tag} className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors" onClick={() => setSelectedTag(tag)}>
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-zinc-400 italic">Sem tags</span>
                                    )}
                                </div>
                                <TagInput allTags={allTags} onAddTag={handleAddTag} />
                            </div>

                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

                            {/* AI Insights Stub */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Info size={12} /> Insights
                                </h3>
                                <NotesInsights note={selectedNote} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <NotesSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onImportComplete={() => loadNotes()}
            />
        </div>
    );
};

export default NotesModule;

import React, { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import NotesSidebar from './NotesSidebar';
import NotesEditor from './NotesEditor';
import NotesInsights from './NotesInsights';
import NotesSettings from './NotesSettings';
import { notesService } from '../../services/notesService';
import { NoteFile } from '../../types';
import { toast } from 'sonner';
import { Loader2, Hash, Star, PanelLeft } from 'lucide-react';
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

    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Responsive Check
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1280px)'); // Expanded to cover landscape iPads and small laptops
    const isTablet = useMediaQuery('(max-width: 1280px)'); // Expanded to cover landscape iPads and small laptops

    // View Mode State (Split vs Tabs)
    // We initialize based on screen size, but allow user override
    const [viewMode, setViewMode] = useState<'split' | 'tabs'>('split');
    const [activeTab, setActiveTab] = useState<'editor' | 'pdf'>('editor');

    // Sync viewMode with screen size changes, but only if user hasn't manually set it?
    // actually, simpler: just default to 'tabs' if starts on tablet, 'split' if desktop. 
    // Effect will handle resizing updates.
    useEffect(() => {
        if (isTablet) {
            setViewMode('tabs');
        } else {
            setViewMode('split');
        }
    }, [isTablet]);

    // Auto-close sidebar on mobile first load or when switching to mobile
    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [isMobile]);

    // Zoom / Focus State
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string, text: string }[]>([]);

    // Calculate unique tags
    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        // Safety check: ensure notes is array
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

    useEffect(() => {
        loadNotes();
    }, []);

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
                name: type === 'folder' ? 'Nova Pasta' : 'Nova Nota Sem Título',
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

        // Optimistic
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
        // Optimistic
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
        // Validation: Prevent moving into self
        if (noteId === newParentId) return;

        // Validation: Prevent circular dependency (moving parent into child)
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

        // Optimistic update
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

    // Debounced save
    const handleUpdateContent = useCallback(async (content: string) => {
        if (!selectedNote) return;

        // Update local state immediately
        const updatedNote = { ...selectedNote, content };

        // Scan for new tags immediately to update UI without refresh
        const extractedTags = content.match(/#[\w\u00C0-\u00FF]+/g) || [];
        updatedNote.tags = extractedTags;

        setSelectedNote(updatedNote);
        setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));

    }, [selectedNote]);

    const handleToggleFavorite = async () => {
        if (!selectedNote) return;

        const newStatus = !selectedNote.isFavorite;

        // Optimistic
        const updatedNote = { ...selectedNote, isFavorite: newStatus };
        setSelectedNote(updatedNote);
        setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));

        try {
            await notesService.updateNote(selectedNote.id, { isFavorite: newStatus });
            toast.success(newStatus ? "Adicionado aos favoritos" : "Removido dos favoritos");
        } catch (e) {
            // Revert
            const revertedNote = { ...selectedNote, isFavorite: !newStatus };
            setSelectedNote(revertedNote);
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? revertedNote : n));
            toast.error("Erro ao atualizar favorito");
        }
    };

    const handleAddTag = async (tag: string) => {
        if (!selectedNote) return;

        // Ensure we append safely to HTML or plain text
        // If content is empty, just the tag. If content exists, new paragraph.
        const tagHtml = `<p>${tag} </p>`;
        const newContent = selectedNote.content ? selectedNote.content + tagHtml : tagHtml;

        await handleUpdateContent(newContent);

        // Force immediate save for better UX
        setIsSaving(true);
        await notesService.updateNote(selectedNote.id, {
            content: newContent,
            name: selectedNote.name,
            parentId: selectedNote.parentId,
            pdfData: selectedNote.pdfData
        });
        setIsSaving(false);
        toast.success(`Tag ${tag} adicionada!`);
    };

    const handleOpenPdf = useCallback((url: string, title?: string) => {
        setActivePdfUrl(url);
        setShowPdfReader(true);
        const handleOpenPdf = useCallback((url: string, title?: string) => {
            setActivePdfUrl(url);
            setShowPdfReader(true);
            if (viewMode === 'tabs') {
                setActiveTab('pdf');
            }
            // If the note has stored annotations, load them
            // Note: We need to make sure selectedNote matches the one with PDF or is just a workspace
            // For now, assuming current note might have the annotations in pdfAnnotations field
        }, [viewMode]);
        // If the note has stored annotations, load them
        // Note: We need to make sure selectedNote matches the one with PDF or is just a workspace
        // For now, assuming current note might have the annotations in pdfAnnotations field
    }, [isTablet]);

    const handleUpdateAnnotations = useCallback(async (allHighlights: IHighlight[]) => {
        setPdfAnnotations(allHighlights);
        if (selectedNote) {
            // Update local state immediately
            const updatedNote = { ...selectedNote, pdfAnnotations: allHighlights };
            setSelectedNote(updatedNote);
            setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));

            // Debounce save? Or save immediately on annotation change
            // It's better to save immediately for annotations as they are critical
            try {
                await notesService.updateNote(selectedNote.id, {
                    pdfAnnotations: allHighlights
                });
            } catch (error) {
                console.error("Error saving annotations", error);
                toast.error("Erro ao salvar anotações");
            }
        }
    }, [selectedNote]);

    // Update pdfAnnotations state when selectedNote changes
    useEffect(() => {
        if (selectedNote && selectedNote.pdfAnnotations) {
            setPdfAnnotations(selectedNote.pdfAnnotations);
        } else {
            setPdfAnnotations([]);
        }
    }, [selectedNote?.id]); // Only reset when switching notes

    // Autosave Effect

    // Autosave Effect
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

    // Handle Zoom Event
    useEffect(() => {
        const handleZoom = async (e: any) => {
            const blockId = e.detail.blockId;
            setFocusedBlockId(blockId);
            // In a real implementation, we would fetch the block content and ancestors for breadcrumbs
            // For now, let's just show a toast that we zoomed in
            toast.info(`Zoomed in to block ${blockId}`);
        };

        window.addEventListener('zoom-block', handleZoom);
        return () => window.removeEventListener('zoom-block', handleZoom);
    }, []);


    // Search notes for WikiLinks
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-zinc-950">
            {/* Mobile Sidebar Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with visibility control */}
            <div className={`${isSidebarOpen ? 'w-72 translate-x-0' : (isMobile ? '-translate-x-full w-72 absolute' : 'w-0')} ${isMobile ? 'absolute z-50 h-full shadow-2xl border-r border-zinc-800' : 'relative border-r border-zinc-800'} transition-all duration-300 overflow-hidden flex-shrink-0 bg-zinc-950 flex flex-col`}>
                <div className="w-72 h-full flex flex-col">
                    <NotesSidebar
                        notes={filteredNotes}
                        selectedNoteId={selectedNote?.id || null}
                        onSelectNote={(n) => {
                            setSelectedNote(n);
                            if (isMobile) setIsSidebarOpen(false);
                        }}
                        onCreateNote={handleCreateNote}
                        onDeleteNote={handleDeleteNote}
                        onMoveNote={handleMoveNote}
                        onRenameNote={handleRenameNote}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        // Tag Props
                        allTags={allTags}
                        selectedTag={selectedTag}
                        onSelectTag={setSelectedTag}
                        allNotes={notes} // Pass all notes for favorites
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
                {selectedNote ? (
                    <>
                        {/* Note Header */}
                        <div className="px-8 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                            <div className="flex-1">
                                <div className="text-xs text-zinc-500 mb-2 flex items-center gap-2">
                                    <button
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                                        title={isSidebarOpen ? "Fechar Sidebar" : "Abrir Sidebar"}
                                    >
                                        <PanelLeft size={16} />
                                    </button>

                                    {/* Layout Toggle (Only visible if PDF is open) */}
                                    {showPdfReader && (
                                        <>
                                            <span className="text-zinc-700">|</span>
                                            <button
                                                onClick={() => setViewMode(prev => prev === 'split' ? 'tabs' : 'split')}
                                                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                                                title={viewMode === 'split' ? "Mudar para modo abas (Focado)" : "Mudar para modo dividido"}
                                            >
                                                {viewMode === 'split' ? (
                                                    <div className="flex gap-0.5"><div className="w-2 h-3 border border-current rounded-[1px]" /><div className="w-2 h-3 border border-current rounded-[1px] bg-current" /></div>
                                                ) : (
                                                    <div className="w-4 h-3 border border-current rounded-[1px] bg-current" />
                                                )}
                                                <span className="hidden sm:inline">{viewMode === 'split' ? 'Dividido' : 'Focado'}</span>
                                            </button>
                                        </>
                                    )}

                                    <span className="text-zinc-700">|</span>
                                    {focusedBlockId && (
                                        <>
                                            <button
                                                onClick={() => setFocusedBlockId(null)}
                                                className="hover:underline text-blue-500"
                                            >
                                                Zoom Out
                                            </button>
                                            <span className="text-zinc-700">/</span>
                                            <span className="text-zinc-300 font-mono text-[10px]">{focusedBlockId.slice(0, 8)}...</span>
                                            <span className="text-zinc-700">|</span>
                                        </>
                                    )}
                                    Cadernos <span className="text-zinc-700">/</span> {selectedNote.type === 'folder' ? 'Pasta' : 'Nota'}
                                </div>
                                <input
                                    type="text"
                                    value={selectedNote.name}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        setSelectedNote(prev => prev ? { ...prev, name: newName } : null);
                                        setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, name: newName } : n));
                                    }}
                                    className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full placeholder:text-zinc-700"
                                    placeholder="Título da Nota"
                                />
                                <button
                                    onClick={handleToggleFavorite}
                                    className="absolute right-4 top-4 p-2 text-zinc-500 hover:text-yellow-400 transition-colors"
                                    title={selectedNote.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                >
                                    <Star size={20} className={selectedNote.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                                </button>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {selectedNote.tags && selectedNote.tags.length > 0 ? (
                                        selectedNote.tags.map(tag => (
                                            <span key={tag} className="bg-emerald-900/30 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-emerald-800/50" onClick={() => setSelectedTag(tag)}>
                                                <Hash size={10} /> {tag.replace('#', '')}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-zinc-600 italic flex items-center gap-1">
                                            Sem tags
                                        </span>
                                    )}
                                    <TagInput allTags={allTags} onAddTag={handleAddTag} />
                                </div>
                            </div>
                            <div className="text-xs text-zinc-500 flex flex-col items-end gap-1">
                                <span>{isSaving ? 'Salvando...' : 'Salvo agora'}</span>
                                {/* Spacer for absolute star button */}
                                <div className="w-8"></div>
                            </div>
                        </div>

                        {/* Mobile/Tablet Tab Viewer for PDF */}
                        {viewMode === 'tabs' && showPdfReader && activePdfUrl && (
                            <div className="flex items-center border-b border-zinc-800 bg-zinc-900">
                                <button
                                    onClick={() => setActiveTab('editor')}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'editor' ? 'text-white border-b-2 border-blue-500 bg-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    Anotações
                                </button>
                                <button
                                    onClick={() => setActiveTab('pdf')}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'pdf' ? 'text-white border-b-2 border-blue-500 bg-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    PDF
                                </button>
                            </div>
                        )}

                        {/* Editor and PDF Split View */}
                        <div className="flex-1 overflow-hidden flex relative">
                            {/* Editor Panel - Resizable or Flex */}
                            <div className={`flex flex-col transition-all duration-300 
                                ${viewMode === 'tabs' && showPdfReader ? (activeTab === 'editor' ? 'w-full' : 'hidden') : ''}
                                ${viewMode === 'split' && showPdfReader ? 'w-1/2 border-r border-zinc-800' : (viewMode === 'split' && !showPdfReader ? 'w-full' : '')}
                                ${(viewMode === 'tabs' && !showPdfReader) ? 'w-full' : ''}
                            `}>
                                <NotesEditor
                                    noteId={selectedNote.id}
                                    content={selectedNote.content || ''}
                                    onUpdate={handleUpdateContent}
                                    searchNotes={searchNotes}
                                    onOpenPdf={handleOpenPdf}
                                />
                            </div>

                            {/* PDF Reader Panel */}
                            {showPdfReader && activePdfUrl && (
                                <div className={`flex flex-col bg-zinc-900 border-l border-zinc-800 
                                    ${viewMode === 'tabs' ? (activeTab === 'pdf' ? 'w-full' : 'hidden') : 'w-1/2'}
                                `}>
                                    <PDFReader
                                        url={activePdfUrl}
                                        initialAnnotations={pdfAnnotations}
                                        onUpdateAnnotations={handleUpdateAnnotations}
                                        onClose={() => setShowPdfReader(false)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Status Bar */}
                        <div className="h-8 border-t border-zinc-800 flex items-center justify-between px-4 text-[10px] text-zinc-500 bg-zinc-950">
                            <div className="flex gap-4">
                                <span>Palavras: {selectedNote.content?.split(/\s+/).filter(w => w.length > 0).length || 0}</span>
                                <span>Caracteres: {selectedNote.content?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <Hash size={48} className="text-zinc-800 mb-4" />
                        <p>Selecione uma nota ou crie uma nova para começar.</p>
                    </div>
                )}
            </div>

            {selectedNote && <NotesInsights note={selectedNote} />}

            <NotesSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onImportComplete={() => loadNotes()}
            />
        </div>
    );
};

export default NotesModule;

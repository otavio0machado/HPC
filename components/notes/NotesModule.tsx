import React, { useState, useEffect, useCallback } from 'react';
import NotesSidebar from './NotesSidebar';
import NotesEditor from './NotesEditor';
import NotesInsights from './NotesInsights';
import NotesSettings from './NotesSettings';
import { notesService } from '../../services/notesService';
import { NoteFile } from '../../types';
import { toast } from 'sonner';
import { Loader2, Star, PanelRight, Info, FileText, ChevronRight, Sidebar, Folder } from 'lucide-react';
import TagInput from './TagInput';

const NotesModule: React.FC = () => {
    const [notes, setNotes] = useState<NoteFile[]>([]);
    const [selectedNote, setSelectedNote] = useState<NoteFile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Auto-focus state for renaming
    const [autoFocusId, setAutoFocusId] = useState<string | null>(null);

    // Ref to the editor
    const editorRef = React.useRef<any>(null);

    // Layout States
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    // Removed isExpandedMode state as user requested removal of expansion logic

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
                setAutoFocusId(newNote.id); // Trigger auto-focus

                if (type === 'markdown') {
                    setSelectedNote(newNote);
                }

                // If created inside a folder, we don't explicitly need to expand it here because 
                // NotesSidebar handles auto-expansion based on autoFocusId

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

    const handleToggleFavorite = async (noteId?: string) => {
        const targetId = noteId || selectedNote?.id;
        if (!targetId) return;

        const note = notes.find(n => n.id === targetId);
        if (!note) return;

        const newStatus = !note.isFavorite;
        const updatedNote = { ...note, isFavorite: newStatus };

        setNotes(prev => prev.map(n => n.id === targetId ? updatedNote : n));
        if (selectedNote?.id === targetId) {
            setSelectedNote(updatedNote);
        }

        try {
            await notesService.updateNote(targetId, { isFavorite: newStatus });
            toast.success(newStatus ? "Adicionado aos favoritos" : "Removido dos favoritos");
        } catch (e) {
            const revertedNote = { ...note, isFavorite: !newStatus };
            setNotes(prev => prev.map(n => n.id === targetId ? revertedNote : n));
            if (selectedNote?.id === targetId) {
                setSelectedNote(revertedNote);
            }
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



    useEffect(() => {
        if (!selectedNote) return;
        const timer = setTimeout(async () => {
            setIsSaving(true);
            await notesService.updateNote(selectedNote.id, {
                content: selectedNote.content,
                name: selectedNote.name,
                parentId: selectedNote.parentId
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
        <div className="flex h-full w-full gap-4 animate-in fade-in duration-300 relative p-4">
            {/* Removed Outer Glass Container */}

            {/* --- MOBILE OVERLAY (Left) --- */}
            {isMobile && showLeftSidebar && (
                <div
                    className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
                    onClick={() => setShowLeftSidebar(false)}
                />
            )}

            {/* --- LEFT SIDEBAR: File Tree --- */}
            <div className={`
                ${isMobile ? 'absolute inset-y-0 left-0 z-40 shadow-2xl h-full' : 'relative h-full'} 
                ${showLeftSidebar ? 'w-64 border border-white/10 opacity-100' : 'w-0 border-0 opacity-0'}  
                transition-all duration-300 ease-in-out flex flex-col overflow-hidden 
                glass-hydro rounded-[32px] bg-black/60 backdrop-blur-md shadow-2xl
            `}>
                <div className="w-full h-full">
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
                        autoFocusId={autoFocusId}
                        onAutoFocusHandled={() => setAutoFocusId(null)}
                    />
                </div>
            </div>

            {/* --- MAIN CONTENT: Editor --- */}
            {/* --- MAIN CONTENT BUBBLE (Editor + Right Sidebar) --- */}
            <div className={`
                    flex-1 flex h-full relative overflow-hidden transition-all duration-300
                    glass-hydro rounded-[32px] border border-white/10 bg-gradient-to-br from-[#050505] to-[#0a0a0a] shadow-2xl
                `}>
                {/* Inner Editor Container */}
                <div className={`flex-1 flex flex-col min-w-0 bg-transparent relative z-0`}>
                    {selectedNote ? (
                        <>
                            {/* --- HEADER --- */}
                            <div className="flex flex-col border-b border-white/10 bg-white/5 backdrop-blur-sm">
                                {/* Tabs Area - SIMPLIFIED/REMOVED as per VisionOS clean look requirement, keeping minimal header */}

                                {/* Breadcrumbs & Toolbar */}
                                <div className="h-12 flex items-center justify-between px-6 bg-transparent">
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 overflow-hidden">
                                        <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="mr-3 text-zinc-400 hover:text-white transition-colors" title="Toggle Sidebar">
                                            <Sidebar size={18} className={!showLeftSidebar ? "text-blue-500" : ""} />
                                        </button>

                                        <Folder size={14} className="opacity-50" />
                                        <span className="hover:text-white cursor-pointer transition-colors font-medium">Biblioteca</span>

                                        {getBreadcrumbs().map(folder => (
                                            <React.Fragment key={folder.id}>
                                                <ChevronRight size={12} className="opacity-40" />
                                                <span className="hover:text-white cursor-pointer transition-colors">
                                                    {folder.name}
                                                </span>
                                            </React.Fragment>
                                        ))}

                                        <ChevronRight size={12} className="opacity-40" />
                                        <span className="font-semibold text-white flex items-center gap-1 truncate text-blue-400">
                                            {selectedNote.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-zinc-400">
                                        {isSaving && <span className="text-[10px] text-zinc-400 animate-pulse">Salvando...</span>}

                                        {/* Removed maximize button */}

                                        <button onClick={() => setShowRightSidebar(!showRightSidebar)} className="hover:text-white transition-colors">
                                            <PanelRight size={18} className={!showRightSidebar ? "opacity-50" : "text-blue-500"} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* --- EDITOR AREA --- */}
                            <div className="flex-1 overflow-hidden flex bg-transparent relative">
                                <div className="flex flex-col h-full overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out w-full">

                                    {/* Title Input */}
                                    <div className="px-8 lg:px-12 pt-12 pb-6 shrink-0 group">
                                        <input
                                            type="text"
                                            value={selectedNote.name.replace('.md', '')}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                setSelectedNote(prev => prev ? { ...prev, name: newName } : null);
                                                setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, name: newName } : n));
                                                notesService.updateNote(selectedNote.id, { name: newName });
                                            }}
                                            className="w-full bg-transparent text-5xl font-bold text-white/90 placeholder:text-zinc-700 focus:outline-none tracking-tight leading-none transition-colors group-hover:text-white"
                                            placeholder="Sem Título"
                                        />
                                    </div>

                                    <div className="flex-1 px-2 h-full"> {/* Container for editor to take full remaining height */}
                                        <NotesEditor
                                            noteId={selectedNote.id}
                                            content={selectedNote.content || ''}
                                            onUpdate={handleUpdateContent}
                                            searchNotes={searchNotes}
                                            editorRef={editorRef}
                                        />
                                    </div>

                                    {/* Status Bar - Minimal */}
                                    <div className="shrink-0 h-8 border-t border-white/5 bg-black/20 flex items-center justify-between px-6 text-[10px] text-zinc-500 select-none font-medium mt-auto">
                                        <div className="flex items-center gap-4">
                                            <span>{wordCount} palavras</span>
                                            <span>{charCount} caracteres</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {selectedNote.updatedAt && (
                                                <span>Atualizado: {new Date(selectedNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-transparent">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-black/20 backdrop-blur-md">
                                <FileText size={48} className="text-zinc-600 drop-shadow-md" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                Nenhuma nota selecionada
                            </h2>
                            <p className="font-medium text-zinc-500 text-sm max-w-xs text-center leading-relaxed">
                                Selecione um arquivo da biblioteca ou crie uma nova nota para começar a escrever.
                            </p>
                            <button
                                onClick={() => handleCreateNote(null, 'markdown')}
                                className="mt-8 px-8 py-3 bg-white text-black hover:bg-zinc-200 text-sm font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                            >
                                Criar Nova Nota
                            </button>
                        </div>
                    )}
                </div>

                {/* --- MOBILE OVERLAY (Right) --- */}
                {
                    isMobile && showRightSidebar && (
                        <div
                            className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
                            onClick={() => setShowRightSidebar(false)}
                        />
                    )
                }

                {/* --- RIGHT SIDEBAR: Meta & Details --- */}
                <div className={`
                ${isMobile ? 'absolute inset-y-0 right-0 z-40 shadow-2xl' : 'relative'}
                ${showRightSidebar && selectedNote ? 'w-80' : 'w-0'} 
                transition-all duration-300 ease-in-out flex flex-col overflow-hidden bg-[#0c0c0e]/40 border-l border-white/10 backdrop-blur-md
            `}>
                    <div className="w-80 h-full overflow-y-auto custom-scrollbar p-6 space-y-8">
                        {selectedNote && (
                            <>
                                {/* Meta Header */}
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Informações</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                            <span className="text-sm text-zinc-400 font-medium">Favorito</span>
                                            <button
                                                onClick={() => handleToggleFavorite()}
                                                className={`p-1.5 rounded-lg transition-all ${selectedNote.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-500 hover:text-zinc-200'}`}
                                            >
                                                <Star size={18} className={selectedNote.isFavorite ? 'fill-current' : ''} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-sm text-zinc-400 font-medium">Criado</span>
                                            <span className="text-xs font-mono text-zinc-500">{new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-sm text-zinc-400 font-medium">Modificado</span>
                                            <span className="text-xs font-mono text-zinc-500">
                                                {selectedNote.updatedAt ? new Date(selectedNote.updatedAt).toLocaleDateString() : 'Hoje'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* Tags */}
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedNote.tags && selectedNote.tags.length > 0 ? (
                                            selectedNote.tags.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setSelectedTag(tag)}
                                                    className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                                                >
                                                    {tag}
                                                </button>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-600 italic">Sem tags</span>
                                        )}
                                    </div>
                                    <TagInput allTags={allTags} onAddTag={handleAddTag} />
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* AI Insights Stub */}
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info size={12} /> Insights & IA
                                    </h3>
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                                        <NotesInsights note={selectedNote} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div > {/* End Main Content Bubble */}

            < NotesSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onImportComplete={() => loadNotes()}
            />
        </div >
    );
};

export default NotesModule;

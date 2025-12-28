import React, { useState, useEffect, useCallback } from 'react';
import NotesSidebar from './NotesSidebar';
import NotesEditor from './NotesEditor';
import NotesInsights from './NotesInsights';
import NotesSettings from './NotesSettings';
import { notesService } from '../../services/notesService';
import { NoteFile } from '../../types';
import { toast } from 'sonner';
import { Loader2, Hash, Star, Layout, Maximize2, Minimize2, PanelRight, Calendar, Info, FileText, Check } from 'lucide-react';
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
        const tagHtml = `<p>${tag} </p>`;
        const newContent = selectedNote.content ? selectedNote.content + tagHtml : tagHtml;
        await handleUpdateContent(newContent);
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
                console.error("Error saving annotations", error);
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
        const handleZoom = async (e: any) => {
            const blockId = e.detail.blockId;
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className={`
            flex overflow-hidden glass-hydro rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in duration-500
            ${isExpandedMode ? 'fixed inset-4 z-50' : 'h-[calc(100vh-80px)] relative'}
        `}>
            {/* --- LEFT SIDEBAR: File Tree --- */}
            <div className={`${showLeftSidebar ? 'w-72' : 'w-0'} transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] border-r border-white/5 flex flex-col overflow-hidden bg-black/10`}>
                <div className="w-72 h-full">
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
                        allNotes={notes}
                    />
                </div>
            </div>

            {/* --- MAIN CONTENT: Editor --- */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                {selectedNote ? (
                    <>
                        {/* Editor Toolbar / Header */}
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/5 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors bubble-hover">
                                    <Layout size={20} className={showLeftSidebar ? "text-blue-400" : ""} />
                                </button>
                                <span className="text-zinc-600 text-lg font-light">/</span>
                                <input
                                    type="text"
                                    value={selectedNote.name}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        setSelectedNote(prev => prev ? { ...prev, name: newName } : null);
                                        setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, name: newName } : n));
                                    }}
                                    className="bg-transparent text-white font-bold text-xl focus:outline-none placeholder:text-zinc-600 min-w-[200px] tracking-tight"
                                    placeholder="Sem Título"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden md:flex items-center gap-3 mr-4">
                                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${isSaving ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
                                        {isSaving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                                        {isSaving ? 'Salvando' : 'Salvo'}
                                    </div>
                                    <button onClick={() => setIsExpandedMode(!isExpandedMode)} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors bubble-hover" title={isExpandedMode ? "Sair do modo foco" : "Modo foco"}>
                                        {isExpandedMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                </div>
                                <button onClick={() => setShowRightSidebar(!showRightSidebar)} className={`p-2 hover:bg-white/10 rounded-xl transition-colors bubble-hover ${showRightSidebar ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-400'}`}>
                                    <PanelRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Editor & PDF Split */}
                        <div className="flex-1 overflow-hidden flex bg-transparent">
                            <div className={`flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showPdfReader ? 'w-1/2 border-r border-white/5' : 'w-full'}`}>
                                <NotesEditor
                                    noteId={selectedNote.id}
                                    content={selectedNote.content || ''}
                                    onUpdate={handleUpdateContent}
                                    searchNotes={searchNotes}
                                    onOpenPdf={handleOpenPdf}
                                />
                            </div>

                            {/* PDF Reader */}
                            {showPdfReader && activePdfUrl && (
                                <div className="w-1/2 flex flex-col bg-transparent border-l border-white/5 shadow-inner">
                                    <div className="flex justify-between items-center bg-zinc-950 p-2 border-b border-white/5">
                                        <span className="text-xs font-bold text-zinc-400 px-2 uppercase tracking-wider">Leitor PDF</span>
                                        <button onClick={() => setShowPdfReader(false)} className="text-zinc-500 hover:text-white p-1 hover:bg-white/10 rounded">
                                            <Minimize2 size={16} />
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
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 animate-in fade-in duration-700">
                        <div className="w-32 h-32 rounded-full glass-spatial flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <FileText size={48} className="text-zinc-600 group-hover:text-blue-400 transition-colors duration-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 tracking-tight">
                            Nenhuma nota selecionada
                        </h2>
                        <p className="font-medium text-zinc-500 max-w-xs text-center leading-relaxed">
                            Selecione uma nota na barra lateral ou crie uma nova para começar a escrever.
                        </p>
                    </div>
                )}
            </div>

            {/* --- RIGHT SIDEBAR: Meta & Details --- */}
            <div className={`${showRightSidebar && selectedNote ? 'w-80' : 'w-0'} transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col overflow-hidden glass-hydro border-l border-white/5`}>
                <div className="w-80 h-full overflow-y-auto custom-scrollbar p-5 space-y-6">
                    {selectedNote && (
                        <>
                            {/* Meta Header */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Metadados</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between group">
                                        <span className="text-sm text-zinc-400">Favorito</span>
                                        <button
                                            onClick={handleToggleFavorite}
                                            className={`p-2 rounded-xl transition-all duration-300 ${selectedNote.isFavorite ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/30' : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
                                        >
                                            <Star size={16} className={`${selectedNote.isFavorite ? 'fill-yellow-500' : ''} transition-all duration-300`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-400">Criado em</span>
                                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                            <Calendar size={12} className="text-zinc-500" />
                                            {selectedNote.createdAt ? new Date(selectedNote.createdAt).getFullYear() : 2024}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full" />

                            {/* Tags */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Tags & Assuntos</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedNote.tags && selectedNote.tags.length > 0 ? (
                                        selectedNote.tags.map(tag => (
                                            <span key={tag} className="glass-card bg-emerald-500/5 text-emerald-400 border-white/5 hover:border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/10 transition-all shadow-sm" onClick={() => setSelectedTag(tag)}>
                                                <Hash size={12} className="opacity-50" /> {tag.replace('#', '')}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-zinc-600 italic px-2">Sem tags.</span>
                                    )}
                                </div>
                                <div className="p-1">
                                    <TagInput allTags={allTags} onAddTag={handleAddTag} />
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full" />

                            {/* Stats */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Estatísticas</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="glass-card rounded-2xl p-4 border border-white/5 relative overflow-hidden group hover:bg-blue-500/5 transition-colors">
                                        <div className="absolute top-2 right-2 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <span className="text-2xl font-black text-white block mb-1 tracking-tight">{selectedNote.content?.split(/\s+/).filter(w => w.length > 0).length || 0}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider group-hover:text-blue-400/80 transition-colors">Palavras</span>
                                    </div>
                                    <div className="glass-card rounded-2xl p-4 border border-white/5 relative overflow-hidden group hover:bg-purple-500/5 transition-colors">
                                        <div className="absolute top-2 right-2 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                                            <Layout size={20} />
                                        </div>
                                        <span className="text-2xl font-black text-white block mb-1 tracking-tight">{selectedNote.content?.length || 0}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider group-hover:text-purple-400/80 transition-colors">Caracteres</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full" />

                            {/* AI Insights Stub */}
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Info size={14} /> Insights
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

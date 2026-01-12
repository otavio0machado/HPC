import React, { useState, useEffect } from 'react';
import { Search, Folder, FileText, ChevronRight, Settings, Trash2, Edit2, FolderPlus, FilePlus } from 'lucide-react';
import { NoteFile } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface NotesSidebarProps {
    notes: NoteFile[];
    selectedNoteId: string | null;
    onSelectNote: (note: NoteFile) => void;
    onCreateNote: (parentId: string | null, type: 'folder' | 'markdown') => void;
    onDeleteNote: (id: string) => void;
    onMoveNote: (noteId: string, newParentId: string | null) => void;
    onRenameNote: (id: string, newName: string) => void;
    onOpenSettings: () => void;
    allTags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
    allNotes?: NoteFile[];
    autoFocusId: string | null;
    onAutoFocusHandled: () => void;
}

const FileTreeItem = ({
    note,
    level = 0,
    notes,
    selectedNoteId,
    onSelect,
    onMoveNote,
    onDelete,
    onRename,
    onCreateNote,
    autoFocusId,
    onAutoFocusHandled
}: {
    note: NoteFile,
    level: number,
    notes: NoteFile[],
    selectedNoteId: string | null,
    onSelect: (n: NoteFile) => void,
    onMoveNote: (id: string, parentId: string | null) => void,
    onDelete: (id: string) => void,
    onRename: (id: string, newName: string) => void,
    onCreateNote: (parentId: string | null, type: 'folder' | 'markdown') => void,
    autoFocusId: string | null,
    onAutoFocusHandled: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(note.name);

    const hasChildren = notes.some(n => n.parentId === note.id);

    // Auto-focus logic
    useEffect(() => {
        if (autoFocusId === note.id) {
            setIsEditing(true);
            onAutoFocusHandled();
        }
    }, [autoFocusId, note.id, onAutoFocusHandled]);

    // Auto-expand if child matches autoFocusId or is selected
    useEffect(() => {
        const shouldExpand = notes.some(n =>
            n.parentId === note.id && (n.id === autoFocusId || n.id === selectedNoteId)
        );
        if (shouldExpand) {
            setIsOpen(true);
        }
    }, [autoFocusId, selectedNoteId, notes, note.id]);

    const handleRenameSubmit = () => {
        if (editName.trim() && editName !== note.name) {
            onRename(note.id, editName);
        } else {
            setEditName(note.name);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRenameSubmit();
        else if (e.key === 'Escape') {
            setEditName(note.name);
            setIsEditing(false);
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('noteId', note.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (note.type === 'folder') setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const draggedId = e.dataTransfer.getData('noteId');
        if (draggedId && draggedId !== note.id && note.type === 'folder') {
            onMoveNote(draggedId, note.id);
        }
    };

    return (
        <div className="select-none">
            <div
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={(e) => {
                    e.stopPropagation();
                    if (note.type === 'folder') setIsOpen(!isOpen);
                    else onSelect(note);
                }}
                className={`flex items-center gap-2 py-1.5 px-3 mx-2 rounded-xl cursor-pointer transition-all duration-200 group relative border border-transparent 
                ${selectedNoteId === note.id
                        ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/30 font-medium'
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                    } 
                ${isDragOver ? 'bg-blue-500/20 ring-1 ring-blue-500' : ''}`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <span className="flex-shrink-0 relative z-10 flex items-center">
                    {note.type === 'folder' ? (
                        <>
                            <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.1 }}
                                className="mr-1"
                            >
                                <ChevronRight size={12} className={hasChildren ? "opacity-100" : "opacity-0"} />
                            </motion.div>
                            <Folder size={14} className={selectedNoteId === note.id ? 'fill-blue-500/20 text-blue-300' : 'fill-white/5 text-zinc-500 group-hover:text-zinc-400'} />
                        </>
                    ) : (
                        <div className="flex items-center ml-4">
                            <FileText size={14} className={selectedNoteId === note.id ? 'text-blue-300' : 'text-zinc-500 group-hover:text-zinc-400'} />
                        </div>
                    )}
                </span>

                {isEditing ? (
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs border border-blue-500 rounded px-1 py-0.5 outline-none min-w-0"
                    />
                ) : (
                    <span className="truncate text-xs group-hover:text-zinc-900 dark:group-hover:text-white flex-1">
                        {note.name}
                    </span>
                )}

                {/* Hover Actions */}
                <div className={`flex items-center gap-0.5 scale-90 transition-all duration-200 absolute right-2 px-1 ${selectedNoteId === note.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 bg-zinc-100 dark:bg-zinc-800 rounded shadow-sm'}`}>

                    {note.type === 'folder' && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCreateNote(note.id, 'markdown'); setIsOpen(true); }}
                                className="p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-500 hover:text-white transition-colors"
                                title="Nova Nota na Pasta"
                            >
                                <FilePlus size={10} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCreateNote(note.id, 'folder'); setIsOpen(true); }}
                                className="p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-500 hover:text-white transition-colors"
                                title="Nova Pasta na Pasta"
                            >
                                <FolderPlus size={10} />
                            </button>
                            <div className="w-px h-3 bg-zinc-600/20 mx-0.5" />
                        </>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                        className={`p-1 rounded ${selectedNoteId === note.id ? 'text-blue-200 hover:text-white hover:bg-white/20' : 'hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-500'}`}
                        title="Renomear"
                    >
                        <Edit2 size={10} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className={`p-1 rounded ${selectedNoteId === note.id ? 'text-blue-200 hover:text-red-300 hover:bg-white/20' : 'hover:bg-red-500/10 text-zinc-500 hover:text-red-500'}`}
                        title="Excluir"
                    >
                        <Trash2 size={10} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                    >
                        {notes
                            .filter(n => n.parentId === note.id)
                            .map(child => (
                                <FileTreeItem
                                    key={child.id}
                                    note={child}
                                    level={level + 1}
                                    notes={notes}
                                    selectedNoteId={selectedNoteId}
                                    onSelect={onSelect}
                                    onMoveNote={onMoveNote}
                                    onDelete={onDelete}
                                    onRename={onRename}
                                    onCreateNote={onCreateNote}
                                    autoFocusId={autoFocusId}
                                    onAutoFocusHandled={onAutoFocusHandled}
                                />
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NotesSidebar: React.FC<NotesSidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote, onDeleteNote, onMoveNote, onRenameNote, onOpenSettings, allTags, selectedTag, onSelectTag, autoFocusId, onAutoFocusHandled }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDropRoot = (e: React.DragEvent) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('noteId');
        if (draggedId) onMoveNote(draggedId, null);
    };

    const filteredNotes = searchTerm
        ? notes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : notes;
    const rootNotes = filteredNotes.filter(n => n.parentId === null);
    const favoriteNotes = notes.filter(n => n.isFavorite);

    return (
        <div
            className="w-full h-full flex flex-col flex-shrink-0 bg-transparent"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropRoot}
        >
            {/* Header */}
            <div className="flex flex-col gap-4 p-4 pb-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Biblioteca</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onCreateNote(null, 'markdown')}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                            title="Nova Nota"
                        >
                            <FilePlus size={16} />
                        </button>
                        <button
                            onClick={() => onCreateNote(null, 'folder')}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                            title="Nova Pasta"
                        >
                            <FolderPlus size={16} />
                        </button>
                        <button onClick={onOpenSettings} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
                            <Settings size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative group px-1">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar notas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-blue-500/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 rounded-xl py-2 pl-9 pr-3 text-xs text-zinc-300 focus:text-white focus:outline-none transition-all placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 pb-10 space-y-6">

                {/* Favorites Section */}
                {favoriteNotes.length > 0 && !searchTerm && (
                    <div className="mb-4 px-2">
                        <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            Favoritos
                        </div>
                        {favoriteNotes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => onSelectNote(note)}
                                className={`flex items-center gap-2 py-1.5 px-3 rounded-xl cursor-pointer transition-all duration-200 group border border-transparent
                                    ${selectedNoteId === note.id
                                        ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/30 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                    }`}
                            >
                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                <span className="truncate text-xs flex-1">{note.name}</span>
                            </div>
                        ))}
                        <div className="h-px bg-white/5 mx-3 mt-2" />
                    </div>
                )}

                {/* File Tree Section */}
                <div>
                    {rootNotes.map(note => (
                        <FileTreeItem
                            key={note.id}
                            note={note}
                            level={0}
                            notes={filteredNotes}
                            selectedNoteId={selectedNoteId}
                            onSelect={onSelectNote}
                            onMoveNote={onMoveNote}
                            onDelete={onDeleteNote}
                            onRename={onRenameNote}
                            onCreateNote={onCreateNote}
                            autoFocusId={autoFocusId}
                            onAutoFocusHandled={onAutoFocusHandled}
                        />
                    ))}

                    {rootNotes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                                <FolderPlus size={20} className="text-zinc-300 dark:text-zinc-700" />
                            </div>

                            <p className="text-zinc-500 dark:text-zinc-500 text-xs font-medium">Nenhum arquivo encontrado</p>
                            <button onClick={() => onCreateNote(null, 'markdown')} className="mt-2 text-[10px] text-blue-500 hover:underline">
                                Criar primeira nota
                            </button>
                        </div>
                    )}
                </div>

                {/* Tags Section */}
                {allTags.length > 0 && (
                    <div className="px-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tags</span>
                            {selectedTag && (
                                <button
                                    onClick={() => onSelectTag(null)}
                                    className="text-[10px] text-zinc-500 hover:text-white transition-colors"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                                    className={`
                                        text-[10px] px-2 py-1 rounded-md border transition-all duration-200
                                        ${selectedTag === tag
                                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                            : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/10 hover:text-zinc-200'
                                        }
                                    `}
                                >
                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesSidebar;

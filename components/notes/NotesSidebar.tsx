import React, { useState } from 'react';
import { Search, Folder, FileText, ChevronRight, Plus, Settings, Trash2, Edit2, Hash, FolderPlus, FilePlus } from 'lucide-react';
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
}

const FileTreeItem = ({
    note,
    level = 0,
    notes,
    selectedNoteId,
    onSelect,
    onToggle,
    onMoveNote,
    onDelete,
    onRename
}: {
    note: NoteFile,
    level: number,
    notes: NoteFile[],
    selectedNoteId: string | null,
    onSelect: (n: NoteFile) => void,
    onToggle: (id: string) => void,
    onMoveNote: (id: string, parentId: string | null) => void,
    onDelete: (id: string) => void,
    onRename: (id: string, newName: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(note.name);

    const hasChildren = notes.some(n => n.parentId === note.id);

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
                className={`flex items-center gap-2 py-2.5 px-3 mx-2 rounded-xl cursor-pointer transition-all group relative overflow-hidden border border-transparent ${selectedNoteId === note.id
                    ? 'glass-active text-blue-100 font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10 bubble-hover'
                    } ${isDragOver ? 'bg-blue-500/20 ring-1 ring-blue-500 scale-[1.02]' : ''}`}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {/* Active Indicator */}
                {selectedNoteId === note.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_currentColor]" />
                )}

                <span className="flex-shrink-0 relative z-10">
                    {note.type === 'folder' ? (
                        <div className="flex items-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
                            <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="mr-1"
                            >
                                {hasChildren ? <ChevronRight size={14} /> : <div className="w-3.5" />}
                            </motion.div>
                            <Folder size={16} className={selectedNoteId === note.id ? 'text-blue-600 dark:text-blue-500 fill-blue-500/20' : 'fill-zinc-300 dark:fill-zinc-800 text-zinc-400 dark:text-zinc-500'} />
                        </div>
                    ) : (
                        <div className="flex items-center text-zinc-600 group-hover:text-zinc-400 transition-colors ml-4">
                            <FileText size={16} />
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
                        className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm border border-blue-500 rounded px-1.5 py-0.5 outline-none relative z-20 min-w-0"
                    />
                ) : (
                    <span className="truncate text-sm relative z-10 flex-1 font-medium">{note.name}</span>
                )}

                {/* Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 relative z-20 scale-90">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                        className="p-1 hover:bg-zinc-700 text-zinc-500 hover:text-white rounded-lg transition-all"
                        title="Renomear"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className="p-1 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-lg transition-all"
                        title="Excluir"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
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
                                    onToggle={onToggle}
                                    onMoveNote={onMoveNote}
                                    onDelete={onDelete}
                                    onRename={onRename}
                                />
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NotesSidebar: React.FC<NotesSidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote, onDeleteNote, onMoveNote, onRenameNote, onOpenSettings, allTags, selectedTag, onSelectTag }) => {
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

    return (
        <div
            className="w-full glass-hydro border-r border-white/10 flex flex-col h-full flex-shrink-0 backdrop-blur-xl"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropRoot}
        >
            {/* Header */}
            <div className="p-4 border-b border-white/5 space-y-4 bg-transparent backdrop-blur-none">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-white flex items-center gap-2 text-xs tracking-widest uppercase opacity-80 pl-1">
                        <Folder className="text-blue-400" size={14} /> BIBLIOTECA
                    </h2>
                    <button onClick={onOpenSettings} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Settings size={14} />
                    </button>
                </div>

                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar arquivos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all placeholder:text-zinc-500 shadow-inner"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onCreateNote(null, 'markdown')}
                        className="flex-1 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95 border border-blue-500/30 backdrop-blur-md"
                    >
                        <FilePlus size={14} /> Nota
                    </button>
                    <button
                        onClick={() => onCreateNote(null, 'folder')}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-95 hover:shadow-lg backdrop-blur-md"
                    >
                        <FolderPlus size={14} /> Pasta
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {/* Favorites & Tags are now in Right Sidebar in parent component */}

                <div className="min-h-[200px] pb-20">
                    {rootNotes.map(note => (
                        <FileTreeItem
                            key={note.id}
                            note={note}
                            level={0}
                            notes={filteredNotes}
                            selectedNoteId={selectedNoteId}
                            onSelect={onSelectNote}
                            onToggle={() => { }}
                            onMoveNote={onMoveNote}
                            onDelete={onDeleteNote}
                            onRename={onRenameNote}
                        />
                    ))}

                    {rootNotes.length === 0 && (
                        <div className="text-zinc-400 dark:text-zinc-600 text-xs text-center py-12 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-2xl mx-4 mt-4">
                            Sua biblioteca está vazia.
                            <br />Crie uma nota para começar.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesSidebar;

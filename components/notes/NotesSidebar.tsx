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
                className={`flex items-center gap-2 py-2 px-3 mx-2 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-visible border border-transparent 
                ${selectedNoteId === note.id
                        ? 'glass-card bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    } 
                ${isDragOver ? 'bg-blue-500/20 ring-1 ring-blue-500 scale-[1.02]' : ''}`}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                <span className="flex-shrink-0 relative z-10">
                    {note.type === 'folder' ? (
                        <div className="flex items-center transition-colors">
                            <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="mr-1"
                            >
                                {hasChildren ? <ChevronRight size={14} className={selectedNoteId === note.id ? 'text-blue-500' : 'text-zinc-400'} /> : <div className="w-3.5" />}
                            </motion.div>
                            <Folder size={16} className={selectedNoteId === note.id ? 'text-blue-500 fill-blue-500/20' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'} />
                        </div>
                    ) : (
                        <div className="flex items-center transition-colors ml-4">
                            <FileText size={16} className={selectedNoteId === note.id ? 'text-blue-500' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'} />
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
                    <span className={`truncate text-[13px] relative z-10 flex-1 ${selectedNoteId === note.id ? 'font-semibold' : 'font-medium'}`}>
                        {note.name}
                    </span>
                )}

                {/* Hover Actions - Glass Pill */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 relative z-20 scale-90 transition-opacity duration-200">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-white rounded-lg transition-all"
                        title="Renomear"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-all"
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
            className="w-full h-full flex flex-col flex-shrink-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropRoot}
        >
            {/* Header */}
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 text-xs tracking-widest uppercase pl-1 text-spatial">
                        <Folder className="text-blue-500" size={14} /> BIBLIOTECA
                    </h2>
                    <button onClick={onOpenSettings} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors bubble-hover">
                        <Settings size={14} />
                    </button>
                </div>

                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <input
                        type="text"
                        placeholder="Buscar arquivos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl py-2.5 pl-9 pr-3 text-sm text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-400 relative z-0 glass-inner-shadow"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onCreateNote(null, 'markdown')}
                        className="flex-1 glass-card bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-sm"
                    >
                        <FilePlus size={14} className="group-hover:scale-110 transition-transform" /> Nova Nota
                    </button>
                    <button
                        onClick={() => onCreateNote(null, 'folder')}
                        className="flex-1 glass-card bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-sm"
                    >
                        <FolderPlus size={14} className="group-hover:scale-110 transition-transform" /> Nova Pasta
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
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
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center mt-4">
                            <div className="w-16 h-16 rounded-3xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-4 rotate-3 glass-card">
                                <FilePlus size={24} className="text-zinc-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Sua biblioteca está vazia.</p>
                            <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-1">Crie uma nota para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesSidebar;

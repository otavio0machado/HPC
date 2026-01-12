import React, { useState } from 'react';
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
}

const FileTreeItem = ({
    note,
    level = 0,
    notes,
    selectedNoteId,
    onSelect,
    onMoveNote,
    onDelete,
    onRename
}: {
    note: NoteFile,
    level: number,
    notes: NoteFile[],
    selectedNoteId: string | null,
    onSelect: (n: NoteFile) => void,
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
                className={`flex items-center gap-2 py-1 px-2 mx-2 rounded-md cursor-pointer transition-colors duration-200 group relative border border-transparent 
                ${selectedNoteId === note.id
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
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
                            <Folder size={14} className={selectedNoteId === note.id ? 'fill-blue-400 text-blue-200' : 'fill-zinc-300 dark:fill-zinc-700 text-zinc-400 dark:text-zinc-600'} />
                        </>
                    ) : (
                        <div className="flex items-center ml-4">
                            <FileText size={14} className={selectedNoteId === note.id ? 'text-white' : 'text-zinc-400'} />
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
                <div className={`flex items-center gap-1 scale-90 transition-all duration-200 absolute right-2 px-1 ${selectedNoteId === note.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 bg-zinc-100 dark:bg-zinc-800 rounded'}`}>
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
            className="w-full h-full flex flex-col flex-shrink-0 bg-zinc-50 dark:bg-zinc-950/50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropRoot}
        >
            {/* Header */}
            <div className="flex flex-col gap-2 p-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2">Biblioteca</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onCreateNote(null, 'markdown')}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            title="Nova Nota"
                        >
                            <FilePlus size={16} />
                        </button>
                        <button
                            onClick={() => onCreateNote(null, 'folder')}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            title="Nova Pasta"
                        >
                            <FolderPlus size={16} />
                        </button>
                        <button onClick={onOpenSettings} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                            <Settings size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative group px-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar notas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 rounded-md py-1.5 pl-8 pr-2 text-xs text-zinc-800 dark:text-white focus:outline-none transition-all placeholder:text-zinc-400 shadow-sm"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 pb-10">
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
        </div>
    );
};

export default NotesSidebar;

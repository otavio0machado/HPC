import React, { useState } from 'react';
import { Search, Folder, FileText, ChevronRight, ChevronDown, Plus, MoreHorizontal, Settings, Trash2, Edit2, Hash } from 'lucide-react';
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

    // Tags
    allTags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;

    allNotes?: NoteFile[]; // New prop for accessing all notes (favorites)
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
            setEditName(note.name); // Revert if empty or unchanged
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            setEditName(note.name);
            setIsEditing(false);
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleClick = () => {
        if (note.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            onSelect(note);
        }
    };

    // Drag Handlers
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('noteId', note.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // allow drop
        e.stopPropagation();
        if (note.type === 'folder') {
            setIsDragOver(true);
        }
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
        if (draggedId && draggedId !== note.id) {
            if (note.type === 'folder') {
                onMoveNote(draggedId, note.id);
            }
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
                onClick={handleClick}
                className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition-all group relative overflow-hidden ${selectedNoteId === note.id
                    ? 'bg-blue-600/10 text-blue-400 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    } ${isDragOver ? 'bg-blue-500/20 ring-1 ring-blue-500' : ''}`}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {/* Active Indicator */}
                {selectedNoteId === note.id && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"
                    />
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
                            <Folder size={16} className={selectedNoteId === note.id ? 'text-blue-500 fill-blue-500/20' : ''} />
                        </div>
                    ) : (
                        <div className="flex items-center text-zinc-500 group-hover:text-zinc-300 transition-colors ml-4">
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
                        className="flex-1 bg-zinc-900 text-white text-sm border border-blue-500 rounded px-1 py-0.5 outline-none relative z-20"
                    />
                ) : (
                    <span className="truncate text-sm relative z-10 flex-1">{note.name}</span>
                )}

                {/* Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 relative z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                        className="p-1 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded transition-all"
                        title="Renomear"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className="p-1 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded transition-all"
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
                        transition={{ duration: 0.2, ease: "easeInOut" }}
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

const NotesSidebar: React.FC<NotesSidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote, onDeleteNote, onMoveNote, onRenameNote, onOpenSettings, allTags, selectedTag, onSelectTag, allNotes }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Drop on Root
    const handleDropRoot = (e: React.DragEvent) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('noteId');
        if (draggedId) {
            // If dropped on empty space, move to root (null)
            onMoveNote(draggedId, null);
        }
    };

    const filteredNotes = searchTerm
        ? notes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : notes;

    const rootNotes = filteredNotes.filter(n => n.parentId === null);

    return (
        <div
            className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full flex-shrink-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropRoot}
        >
            {/* Header & Actions */}
            <div className="p-4 border-b border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                        <Folder className="text-blue-500" size={18} /> Minhas Notas
                    </h2>
                    <button
                        onClick={onOpenSettings}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Configurações"
                    >
                        <Settings size={18} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onCreateNote(null, 'markdown')}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-zinc-800 hover:border-zinc-700"
                    >
                        <Plus size={14} /> Nota
                    </button>
                    <button
                        onClick={() => onCreateNote(null, 'folder')}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-zinc-800 hover:border-zinc-700"
                    >
                        <Folder size={14} /> Pasta
                    </button>
                </div>

                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar notas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* Lists */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">



                {/* Favorites Section */}
                {(allNotes || notes).some(n => n.isFavorite) && (
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-zinc-600 px-2 uppercase tracking-wider">Favoritos</h3>

                        {(allNotes || notes)
                            .filter(n => n.isFavorite)
                            .map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => onSelectNote(note)}
                                    className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors group ${selectedNoteId === note.id
                                        ? 'bg-zinc-900 text-white'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                        }`}
                                >
                                    <FileText size={16} className="text-yellow-500/80 group-hover:text-yellow-400 fill-yellow-500/10" />
                                    <span className="text-sm truncate">{note.name}</span>
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Cadernos / Tree */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 mb-2 group">
                        <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Seus Cadernos</h3>
                    </div>

                    <div className="min-h-[100px] pb-10">
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
                            <div className="text-zinc-700 text-xs text-center py-8 border-2 border-dashed border-zinc-900 rounded-lg">
                                Arraste arquivos ou crie uma nova nota
                            </div>
                        )}
                    </div>
                </div>


                {/* Tags Section */}
                {allTags && allTags.length > 0 && (
                    <div className="space-y-1 pt-4 border-t border-zinc-900 mt-4">
                        <h3 className="text-[10px] font-bold text-zinc-600 px-2 uppercase tracking-wider">Tags</h3>
                        <div className="px-2 space-y-0.5">
                            {allTags.map(tag => (
                                <div
                                    key={tag}
                                    onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors ${selectedTag === tag
                                        ? 'bg-emerald-900/30 text-emerald-400'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                        }`}
                                >
                                    <Hash size={14} className={selectedTag === tag ? "text-emerald-500" : "text-zinc-600"} />
                                    <span className={selectedTag === tag ? 'font-medium' : ''}>
                                        {tag.replace('#', '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>

    );
};

export default NotesSidebar;

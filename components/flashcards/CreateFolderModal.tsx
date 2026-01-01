import React, { useState } from 'react';
import { X, FolderPlus, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreateFolderModalProps {
    parentPath: string[]; // The current context path
    onClose: () => void;
    onCreate: (folderName: string) => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ parentPath, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (folderName.trim()) {
            onCreate(folderName.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <FolderPlus size={20} className="text-blue-400" />
                        Nova Pasta
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                            Nome da Pasta
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Ex: Zoologia"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.02] transition-all"
                        />
                        {parentPath.length > 0 && (
                            <p className="text-xs text-zinc-600 pl-1">
                                Será criada dentro de: <span className="text-zinc-400">{parentPath.join(' / ')}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!folderName.trim()}
                            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Criar Pasta
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

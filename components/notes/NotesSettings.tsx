import React, { useRef } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { notesService } from '../../services/notesService';
import { NoteFile } from '../../types';

interface NotesSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onImportComplete: (count: number) => void;
}

const NotesSettings: React.FC<NotesSettingsProps> = ({ isOpen, onClose, onImportComplete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        let importedCount = 0;
        const toastId = toast.loading("Importando notas...");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
                try {
                    const content = await file.text();
                    const name = file.name.replace(/\.(md|txt)$/, '');

                    await notesService.createNote({
                        name: name,
                        type: 'markdown',
                        content: content,
                        parentId: null // Import to root for now
                    });
                    importedCount++;
                } catch (err) {
                    console.error(`Erro ao importar ${file.name}`, err);
                }
            }
        }

        toast.dismiss(toastId);

        if (importedCount > 0) {
            toast.success(`${importedCount} notas importadas com sucesso!`);
            onImportComplete(importedCount);
            onClose();
        } else {
            toast.error("Nenhuma nota válida encontrada (.md ou .txt)");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] glass-spatial border border-white/10 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    >
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="flex items-center justify-between p-6 border-b border-white/10 relative z-10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-300 rounded-xl shadow-inner">
                                    <FileText size={20} />
                                </div>
                                <span className="tracking-tight">Configurações de Notas</span>
                            </h2>
                            <button onClick={onClose} className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 relative z-10">
                            <div className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                                    <Upload size={18} className="text-emerald-400" /> Importar Notas
                                </h3>
                                <p className="text-sm text-zinc-400 mb-5 relative z-10">
                                    Importe seus arquivos Markdown (.md) ou texto (.txt) do computador para sua biblioteca.
                                </p>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".md,.txt"
                                    multiple
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full relative z-10 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 group shadow-lg active:scale-95"
                                >
                                    <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform text-emerald-400" /> Selecionar Arquivos
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-500 ml-1">Preferências</h3>

                                <div className="glass-card px-4 py-3 rounded-xl border border-white/5 flex items-center justify-between">
                                    <span className="text-zinc-200 font-medium text-sm">Modo Leitura por Padrão</span>
                                    <div className="w-11 h-6 bg-black/40 rounded-full relative cursor-pointer border border-white/10">
                                        <div className="w-4 h-4 bg-zinc-500 rounded-full absolute top-1 left-1 shadow-sm transition-all"></div>
                                    </div>
                                </div>

                                <div className="glass-card px-4 py-3 rounded-xl border border-white/5 flex items-center justify-between">
                                    <span className="text-zinc-200 font-medium text-sm">Auto-salvar (Debounce)</span>
                                    <span className="text-xs text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Ativo (2s)</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end bg-black/20 relative z-10">
                            <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:shadow-lg active:scale-95">
                                Fechar
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotesSettings;

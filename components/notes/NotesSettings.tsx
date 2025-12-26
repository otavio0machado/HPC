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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-blue-500" /> Configurações de Notas
                            </h2>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Upload size={18} className="text-emerald-500" /> Importar
                                </h3>
                                <p className="text-sm text-zinc-400 mb-4">
                                    Importe seus arquivos Markdown (.md) ou texto (.txt) do computador.
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
                                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" /> Selecionar Arquivos
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-zinc-500">Preferências</h3>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-zinc-300">Modo Leitura por Padrão</span>
                                    <div className="w-10 h-5 bg-zinc-800 rounded-full relative cursor-pointer">
                                        <div className="w-3 h-3 bg-zinc-600 rounded-full absolute top-1 left-1"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-zinc-300">Auto-salvar (Debounce)</span>
                                    <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">Ativo (2s)</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-end">
                            <button onClick={onClose} className="px-4 py-2 text-zinc-300 hover:text-white transition-colors">
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

import React, { useState } from 'react';
import { Upload, FileText, Check, Loader2, AlertCircle, X, Globe, Copy } from 'lucide-react';
import { libraryService } from '../../services/libraryService';
import { toast } from 'sonner';
import { KINDLE_BOOKMARKLET_CODE } from '../../utils/kindleBookmarklet';

interface KindleSyncProps {
    userId: string;
    onClose: () => void;
}

const KindleSync: React.FC<KindleSyncProps> = ({ userId, onClose }) => {
    const [mode, setMode] = useState<'usb' | 'web'>('usb');
    const [file, setFile] = useState<File | null>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [count, setCount] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
        }
    };

    const handleSyncUSB = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            const addedCount = await libraryService.syncClippings(file, userId);
            setCount(addedCount);
            setStatus('success');
            toast.success(`${addedCount} destaques sincronizados!`);
        } catch (e) {
            console.error(e);
            setStatus('error');
            toast.error("Erro ao processar arquivo My Clippings.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSyncWeb = async () => {
        if (!jsonInput) return;
        setIsUploading(true);
        try {
            const data = JSON.parse(jsonInput);
            const addedCount = await libraryService.importKindleJson(data, userId);
            setCount(addedCount);
            setStatus('success');
            toast.success(`${addedCount} destaques importados!`);
        } catch (e) {
            console.error(e);
            setStatus('error');
            toast.error("JSON inválido ou erro na importação.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-300 rounded-[32px] border border-white/10 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Kindle_logo.svg" alt="Kindle" className="h-6 opacity-70 invert" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Sincronizar Kindle</h2>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 bg-black/40 rounded-xl mb-8 border border-white/5">
                    <button
                        onClick={() => setMode('usb')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'usb' ? 'bg-white/15 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Upload size={16} /> Via USB
                    </button>
                    <button
                        onClick={() => setMode('web')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'web' ? 'bg-white/15 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Globe size={16} /> Via Nuvem
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-2xl flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Check size={32} />
                        </div>
                        <div>
                            <p className="font-bold text-xl text-white">Importação Concluída!</p>
                            <p className="text-emerald-300/80 mt-1">{count} novos destaques adicionados.</p>
                        </div>
                        <button onClick={onClose} className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-900/20">
                            Fechar
                        </button>
                    </div>
                ) : mode === 'usb' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl text-sm text-blue-200/80">
                            <p className="flex gap-3 items-start leading-relaxed">
                                <AlertCircle size={18} className="shrink-0 mt-0.5 text-blue-400" />
                                <span>Conecte seu Kindle via USB e envie o arquivo <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-100 font-mono text-xs">documents/My Clippings.txt</code>.</span>
                            </p>
                        </div>

                        <label className="block w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl p-10 cursor-pointer transition-all text-center group">
                            <input type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                            {file ? (
                                <div className="flex flex-col items-center text-blue-400">
                                    <FileText size={40} className="mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-lg">{file.name}</span>
                                    <span className="text-xs text-blue-300/60 mt-1">Clique para alterar</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500 group-hover:text-blue-300/80 transition-colors">
                                    <Upload size={40} className="mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">Clique para selecionar arquivo</span>
                                    <span className="text-xs opacity-60 mt-1">Suporta .txt</span>
                                </div>
                            )}
                        </label>

                        <button
                            disabled={!file || isUploading}
                            onClick={handleSyncUSB}
                            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isUploading ? <Loader2 className="animate-spin" /> : "Carregar Arquivo"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4">
                            <p className="text-sm text-zinc-300 font-medium">1. Arraste este botão para sua barra de favoritos:</p>
                            <div className="flex justify-center py-2">
                                <a
                                    href={KINDLE_BOOKMARKLET_CODE}
                                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white rounded-xl font-bold text-sm cursor-grab active:cursor-grabbing flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                                    onClick={(e) => e.preventDefault()}
                                    title="Arraste para a barra de favoritos"
                                >
                                    📑 Exportar HPC
                                </a>
                            </div>
                            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-wide">
                                (Ou clique direito &rarr; "Salvar link como...")
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-zinc-300 font-medium">2. Cole o JSON gerado pelo bookmarklet:</p>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='Cole o JSON aqui... [{"title": "Exemplo" ...}]'
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all placeholder:text-zinc-700"
                            />
                        </div>

                        <button
                            disabled={!jsonInput || isUploading}
                            onClick={handleSyncWeb}
                            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isUploading ? <Loader2 className="animate-spin" /> : "Importar Dados"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KindleSync;

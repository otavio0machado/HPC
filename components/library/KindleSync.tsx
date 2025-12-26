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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 text-center">Sincronizar Kindle</h2>

                {/* Tabs */}
                <div className="flex p-1 bg-zinc-950 rounded-lg mb-6 border border-zinc-800">
                    <button
                        onClick={() => setMode('usb')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'usb' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Upload size={14} /> Via USB
                    </button>
                    <button
                        onClick={() => setMode('web')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'web' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Globe size={14} /> Via Amazon Cloud
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-lg flex flex-col items-center gap-4 text-center animate-in fade-in">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                            <Check size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white">Importação Concluída!</p>
                            <p className="text-emerald-300/80 mt-1">{count} novos destaques adicionados.</p>
                        </div>
                        <button onClick={onClose} className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
                            Fechar
                        </button>
                    </div>
                ) : mode === 'usb' ? (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-sm text-blue-200">
                            <p className="flex gap-2 items-start">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>Conecte seu Kindle via USB e envie o arquivo <code>documents/My Clippings.txt</code>. Este método captura destaques de <strong>todos</strong> os seus livros e documentos pessoais.</span>
                            </p>
                        </div>

                        <label className="block w-full border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-8 cursor-pointer transition-colors text-center bg-zinc-950/30">
                            <input type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                            {file ? (
                                <div className="flex flex-col items-center text-blue-400">
                                    <FileText size={32} className="mb-2" />
                                    <span className="font-semibold">{file.name}</span>
                                    <span className="text-xs text-zinc-500 mt-1">Clique para alterar</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500">
                                    <Upload size={32} className="mb-2" />
                                    <span className="font-medium">Clique para selecionar</span>
                                </div>
                            )}
                        </label>

                        <button
                            disabled={!file || isUploading}
                            onClick={handleSyncUSB}
                            className="w-full py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-2"
                        >
                            {isUploading ? <Loader2 className="animate-spin" /> : "Carregar Arquivo"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-left-4 duration-200">
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3">
                            <p className="text-sm text-zinc-400 font-medium">1. Arraste este botão para sua barra de favoritos:</p>
                            <div className="flex justify-center py-2">
                                <a
                                    href={KINDLE_BOOKMARKLET_CODE}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white rounded-md font-bold text-sm cursor-grab active:cursor-grabbing flex items-center gap-2 shadow-lg"
                                    onClick={(e) => e.preventDefault()}
                                    title="Arraste para a barra de favoritos"
                                >
                                    📑 Exportar HPC
                                </a>
                            </div>
                            <p className="text-xs text-zinc-500 text-center">
                                (Ou clique com botão direito e "Salvar link como favorito" se não puder arrastar)
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-zinc-400 font-medium">2. Acesse <a href="https://read.amazon.com/notebook" target="_blank" className="text-blue-400 hover:underline">read.amazon.com/notebook</a>, clique no favorito e cole o resultado aqui:</p>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='Cole o JSON gerado aqui... [{"title": "Exemplo" ...}]'
                                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-mono text-zinc-300 focus:outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        <button
                            disabled={!jsonInput || isUploading}
                            onClick={handleSyncWeb}
                            className="w-full py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-2"
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

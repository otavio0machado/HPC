import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Bold, Italic, Underline, List, ListOrdered, CheckSquare, Quote, Code, RotateCcw, RotateCw, Wand2, PenTool, X, Paperclip, Heading1, Heading2, Heading3 } from 'lucide-react';
import { generateNoteContent } from '../../services/geminiService';
import { notesService } from '../../services/notesService';
import { blockService } from '../../services/blockService';
import UniqueID from '@tiptap/extension-unique-id';
import { toast } from 'sonner';

interface NotesEditorProps {
    noteId: string; // [NEW] Required for block sync
    content: string;
    onUpdate: (content: string) => void;
    readOnly?: boolean;
    searchNotes?: (query: string) => Promise<any[]>;
    onOpenPdf?: (url: string, title?: string) => void;
}

const MenuBar = ({ editor, onOpenAI }: { editor: any, onOpenAI: () => void }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    if (!editor) {
        return null;
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Apenas arquivos PDF são permitidos.');
            return;
        }

        const toastId = toast.loading('Fazendo upload do PDF... (Isso pode variar conforme sua internet)');

        try {
            const publicUrl = await notesService.uploadAttachment(file);

            if (publicUrl) {
                // Insert embedded PDF node
                editor.chain().focus().insertContent({
                    type: 'pdf',
                    attrs: {
                        src: publicUrl,
                        title: file.name
                    }
                }).run();
                toast.success('PDF anexado com sucesso!', { id: toastId });
            } else {
                toast.error('Falha no upload.', { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao fazer upload.', { id: toastId });
        } finally {
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-white/5 backdrop-blur-md border-b border-white/5 sticky top-0 z-20 items-center transition-all">
            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="application/pdf"
            />

            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Negrito"
                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Itálico"
                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Tachado"
                >
                    <span className="line-through font-bold text-xs px-0.5">S</span>
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Título 1"
                >
                    <Heading1 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Título 2"
                >
                    <Heading2 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Título 3"
                >
                    <Heading3 size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Lista de Marcadores"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Lista Numerada"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('taskList') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Lista de Tarefas"
                >
                    <CheckSquare size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Citação"
                >
                    <Quote size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('codeBlock') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Código"
                >
                    <Code size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().setDrawing().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor.isActive('drawing') ? 'bg-blue-500/20 text-blue-400 shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    title="Desenho"
                >
                    <PenTool size={16} />
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-1.5 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-white/10`}
                    title="Anexar PDF"
                >
                    <Paperclip size={16} />
                </button>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center gap-1">
                <button
                    onClick={onOpenAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white text-xs font-bold border border-purple-500/20 transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                >
                    <Wand2 size={12} /> Ask AI
                </button>
            </div>
        </div>
    );
};

import { WikiLinkExtension } from './extensions/WikiLinkExtension';
import DrawingExtension from './extensions/DrawingExtension';
import PdfExtension from './extensions/PdfExtension';
import { CollapsibleListItem } from './extensions/CollapsibleListItem';

import Link from '@tiptap/extension-link';

const NotesEditor: React.FC<NotesEditorProps> = ({ noteId, content, onUpdate, readOnly = false, searchNotes, onOpenPdf }) => {
    const [showAIDialog, setShowAIDialog] = React.useState(false);
    const [aiPrompt, setAiPrompt] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerateNote = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        const toastId = toast.loading('Gerando nota com IA...');

        try {
            const generatedContent = await generateNoteContent(aiPrompt);
            if (generatedContent) {
                editor?.commands.setContent(generatedContent);
                toast.success('Nota gerada com sucesso!', { id: toastId });
                setShowAIDialog(false);
                setAiPrompt('');
            } else {
                toast.error('Não foi possível gerar a nota.', { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao gerar nota.', { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };
    // Use ref to keep search callback stable for extensions without re-creating them
    const searchNotesRef = React.useRef(searchNotes);
    React.useEffect(() => {
        searchNotesRef.current = searchNotes;
    }, [searchNotes]);

    // Memoize extensions to prevent re-initialization
    // We pass a proxy function to WikiLinkExtension that calls the current ref
    const extensions = React.useMemo(() => [
        StarterKit.configure({
            listItem: false, // Disable default ListItem to use our custom one
        }),
        CollapsibleListItem,
        Placeholder.configure({
            placeholder: 'Comece a escrever sua nota...',
        }),
        Typography,
        Highlight,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Link.configure({
            openOnClick: false, // We handle clicks manually
        }),
        WikiLinkExtension(async (query) => {
            if (searchNotesRef.current) {
                return searchNotesRef.current(query);
            }
            return [];
        }),
        DrawingExtension,
        PdfExtension,
        UniqueID.configure({
            types: ['heading', 'paragraph', 'bulletList', 'orderedList', 'listItem', 'taskItem', 'blockquote', 'codeBlock'],
        }),
    ], []); // Empty dependency array = created once

    // Timeout ref for debounce
    const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const editor = useEditor({
        extensions: extensions,
        content: content,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());

            // [NEW] Sync blocks to Supabase (Debounced)
            // Clear existing timeout
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }

            // Set a new timeout (2s debounce)
            syncTimeoutRef.current = setTimeout(() => {
                blockService.syncBlocks(noteId, editor.getJSON());
            }, 2000);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6 text-zinc-300',
            },
            handleClick: (view, pos, event) => {
                const target = event.target as HTMLElement;
                const link = target.closest('a');
                if (link && onOpenPdf) {
                    const href = link.getAttribute('href');
                    // Check if it's a PDF link or has highlight hash
                    if (href && (href.includes('.pdf') || href.includes('#highlight-'))) {
                        event.preventDefault();
                        // Extract URL before hash
                        const url = href.split('#')[0];
                        // We could pass the ID to onOpenPdf to scroll immediately, 
                        // but PDFReader handles hash reading from window.location.hash?
                        // Actually, PDFReader reads `document.location.hash`.
                        // If we just `setActivePdfUrl`, the iframe loads.
                        // We need to set the hash of the window so PDFReader picks it up?
                        // Or pass it as prop/trigger.
                        // For now, let's just open the PDF.
                        // If we want to scroll, we need to handle it.
                        // PDFReader listens to `hashchange`.
                        // So if we set window.location.hash = ... it might work.

                        if (href.includes('#highlight-')) {
                            window.location.hash = href.split('#')[1];
                        }

                        onOpenPdf(url, link.textContent || undefined);
                        return true;
                    }
                }
                return false;
            }
        },
    });

    // Effect to update content if it changes externally
    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            // Only update if the content is actually different to avoid cursor jumping and loops
            // emitUpdate: false prevents the onUpdate callback from firing, breaking the loop
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    // Update storage with onOpenPdf callback
    useEffect(() => {
        if (editor && onOpenPdf) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const storage = editor.storage as any;
            storage.pdf = storage.pdf || {};
            storage.pdf.openPdf = onOpenPdf;
        }
    }, [editor, onOpenPdf]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 glass-card shadow-xl relative group">
            <MenuBar editor={editor} onOpenAI={() => setShowAIDialog(true)} />

            {showAIDialog && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="glass-spatial border border-white/10 rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 relative">
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none" />

                        <div className="flex items-center justify-between p-5 border-b border-white/10 relative z-10">
                            <h3 className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
                                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 shadow-inner">
                                    <Wand2 size={16} />
                                </div>
                                Gerar Nota com IA
                            </h3>
                            <button
                                onClick={() => setShowAIDialog(false)}
                                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide ml-1">
                                    Sobre o que você quer aprender?
                                </label>
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Ex: Revolução Industrial, Leis de Newton, Funções de 2º Grau..."
                                    className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:bg-black/30 resize-none transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowAIDialog(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    disabled={isGenerating}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGenerateNote}
                                    disabled={!aiPrompt.trim() || isGenerating}
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Wand2 size={16} className="animate-spin" /> Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={16} /> Gerar Nota
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default NotesEditor;

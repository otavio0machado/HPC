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
        <div className="flex flex-wrap gap-1 p-2 bg-zinc-900 border-b border-zinc-800 rounded-t-xl sticky top-0 z-10 items-center">
            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="application/pdf"
            />

            <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Negrito"
                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Itálico"
                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Tachado"
                >
                    <span className="line-through font-bold text-xs px-0.5">S</span>
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Título 1"
                >
                    <Heading1 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Título 2"
                >
                    <Heading2 size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Título 3"
                >
                    <Heading3 size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Lista de Marcadores"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Lista Numerada"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('taskList') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Lista de Tarefas"
                >
                    <CheckSquare size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Citação"
                >
                    <Quote size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Código"
                >
                    <Code size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
                <button
                    onClick={() => editor.chain().focus().setDrawing().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('drawing') ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    title="Desenho"
                >
                    <PenTool size={16} />
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-1.5 rounded transition-colors text-zinc-400 hover:text-white hover:bg-zinc-800`}
                    title="Anexar PDF"
                >
                    <Paperclip size={16} />
                </button>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center gap-1">
                <button
                    onClick={onOpenAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold border border-blue-500/20 transition-all"
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
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-4 md:p-6 text-zinc-300',
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
        <div className="flex flex-col h-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
            <MenuBar editor={editor} onOpenAI={() => setShowAIDialog(true)} />

            {showAIDialog && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h3 className="flex items-center gap-2 font-bold text-zinc-100">
                                <Wand2 size={16} className="text-purple-400" />
                                Gerar Nota com IA
                            </h3>
                            <button
                                onClick={() => setShowAIDialog(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">
                                    Sobre o que você quer aprender?
                                </label>
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Ex: Revolução Industrial, Leis de Newton, Funções de 2º Grau..."
                                    className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowAIDialog(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                    disabled={isGenerating}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGenerateNote}
                                    disabled={!aiPrompt.trim() || isGenerating}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Wand2 size={14} className="animate-spin" /> Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={14} /> Gerar Nota
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default NotesEditor;

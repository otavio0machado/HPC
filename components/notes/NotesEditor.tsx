import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Markdown } from 'tiptap-markdown'; // Ensure this is installed
import MathExtension from '@aarkue/tiptap-math-extension';
import 'katex/dist/katex.min.css';
import { Bold, Italic, Underline, List, ListOrdered, CheckSquare, Quote, Code, RotateCcw, RotateCw, Wand2, PenTool, X, Paperclip, Heading1, Heading2, Heading3, Sigma } from 'lucide-react';
import { generateNoteContent } from '../../services/aiService';
import { notesService } from '../../services/notesService';
import { blockService } from '../../services/blockService';
import UniqueID from '@tiptap/extension-unique-id';
import { toast } from 'sonner';

interface NotesEditorProps {
    noteId: string;
    content: string;
    onUpdate: (content: string) => void;
    readOnly?: boolean;
    searchNotes?: (query: string) => Promise<any[]>;
    onOpenPdf?: (url: string, title?: string) => void;
}

import { Editor } from '@tiptap/react';

const MenuBar = ({ editor, onOpenAI }: { editor: Editor | null, onOpenAI: () => void }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [showMathTooltip, setShowMathTooltip] = React.useState(false);
    const mathButtonRef = React.useRef<HTMLDivElement>(null);

    if (!editor) {
        return null;
    }

    const insertMathFormula = (formula?: string) => {
        const { from, to } = editor.state.selection;
        const formulaText = formula || 'x^2';

        if (from === to) {
            // Sem seleção: inserir fórmula
            editor.chain().focus().insertContent(`$${formulaText}$`).run();
        } else {
            // Com seleção: envolver com $
            const selectedText = editor.state.doc.textBetween(from, to);
            editor.chain().focus().deleteSelection().insertContent(`$${selectedText}$`).run();
        }
        setShowMathTooltip(false);
    };

    const insertBlockMathFormula = (formula?: string) => {
        const formulaText = formula || '\\frac{a}{b} = c';
        editor.chain().focus().insertContent(`\n$$\n${formulaText}\n$$\n`).run();
        setShowMathTooltip(false);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Apenas arquivos PDF são permitidos.');
            return;
        }

        const toastId = toast.loading('Fazendo upload do PDF...');

        try {
            const publicUrl = await notesService.uploadAttachment(file);

            if (publicUrl) {
                editor.chain().focus().insertContent({
                    type: 'pdf',
                    attrs: {
                        src: publicUrl,
                        title: file.name
                    }
                }).run();
                toast.success('PDF anexado!', { id: toastId });
            } else {

                toast.error('Falha no upload.', { id: toastId });
            }
        } catch (error) {
            toast.error('Erro ao fazer upload.', { id: toastId });
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const Button = ({ onClick, isActive, disabled, children, title }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-1.5 rounded-md transition-all text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 ${isActive ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : ''} disabled:opacity-30 disabled:cursor-not-allowed`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-1 px-4 py-2 bg-white dark:bg-[#0c0c0e] border-b border-zinc-200 dark:border-white/10 items-center sticky top-0 z-20">
            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="application/pdf"
            />

            <div className="flex items-center gap-0.5 border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Negrito">
                    <Bold size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Itálico">
                    <Italic size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Tachado">
                    <span className="line-through font-bold text-xs px-0.5">S</span>
                </Button>
            </div>

            <div className="flex items-center gap-0.5 border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Título 1">
                    <Heading1 size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Título 2">
                    <Heading2 size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Título 3">
                    <Heading3 size={14} />
                </Button>
            </div>

            <div className="flex items-center gap-0.5 border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista">
                    <List size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numerada">
                    <ListOrdered size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Tarefas">
                    <CheckSquare size={14} />
                </Button>
            </div>

            <div className="flex items-center gap-0.5 border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Citação">
                    <Quote size={14} />
                </Button>
                <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Código">
                    <Code size={14} />
                </Button>

                {/* Math Formula Button with Interactive Tooltip */}
                <div
                    ref={mathButtonRef}
                    className="relative"
                    onMouseEnter={() => setShowMathTooltip(true)}
                    onMouseLeave={() => setShowMathTooltip(false)}
                >
                    <button
                        onClick={() => insertMathFormula()}
                        className="p-1.5 rounded-md transition-all text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    >
                        <Sigma size={14} />
                    </button>

                    {/* Math Tooltip */}
                    {showMathTooltip && (
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                            onMouseEnter={() => setShowMathTooltip(true)}
                            onMouseLeave={() => setShowMathTooltip(false)}
                        >
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl p-4 w-80">
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                                        <Sigma size={16} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Fórmulas LaTeX</h4>
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Compatível com Markdown</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs">
                                    {/* How to use section */}
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3">
                                        <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1">
                                            <span>💡</span> Como usar:
                                        </p>
                                        <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                                            <p><code className="bg-white/60 dark:bg-black/20 px-1 rounded">$fórmula$</code> → inline no texto</p>
                                            <p><code className="bg-white/60 dark:bg-black/20 px-1 rounded">$$fórmula$$</code> → bloco centralizado</p>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-purple-200/50 dark:border-purple-700/30 space-y-1 text-zinc-500 dark:text-zinc-500">
                                            <p className="flex items-center gap-1.5">
                                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[9px] font-mono shadow-sm">Ctrl</kbd>
                                                <span>+</span>
                                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[9px] font-mono shadow-sm">M</kbd>
                                                <span className="ml-1">→ Inline</span>
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[9px] font-mono shadow-sm">Ctrl</kbd>
                                                <span>+</span>
                                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[9px] font-mono shadow-sm">⇧</kbd>
                                                <span>+</span>
                                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[9px] font-mono shadow-sm">M</kbd>
                                                <span className="ml-1">→ Bloco</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick templates */}
                                    <div>
                                        <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">📐 Templates rápidos:</p>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {[
                                                { label: 'Fração', formula: '\\frac{a}{b}' },
                                                { label: 'Raiz', formula: '\\sqrt{x}' },
                                                { label: 'Potência', formula: 'x^{n}' },
                                                { label: 'Índice', formula: 'x_{i}' },
                                                { label: 'Soma', formula: '\\sum_{i=1}^{n}' },
                                                { label: 'Integral', formula: '\\int_{a}^{b}' },
                                            ].map((t) => (
                                                <button
                                                    key={t.label}
                                                    onClick={() => insertMathFormula(t.formula)}
                                                    className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-md text-[10px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors truncate"
                                                    title={`$${t.formula}$`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Common formulas */}
                                    <div>
                                        <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">📊 Fórmulas comuns:</p>
                                        <div className="space-y-1">
                                            {[
                                                { label: 'Bhaskara', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
                                                { label: 'Pitágoras', formula: 'a^2 + b^2 = c^2' },
                                                { label: 'Euler', formula: 'e^{i\\pi} + 1 = 0' },
                                            ].map((t) => (
                                                <button
                                                    key={t.label}
                                                    onClick={() => insertBlockMathFormula(t.formula)}
                                                    className="w-full text-left px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md text-[10px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-between"
                                                >
                                                    <span>{t.label}</span>
                                                    <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[9px]">Bloco</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                                        <button
                                            onClick={() => insertMathFormula()}
                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                                        >
                                            <span className="text-[10px]">$...$</span>
                                            <span>Inline</span>
                                        </button>
                                        <button
                                            onClick={() => insertBlockMathFormula()}
                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                                        >
                                            <span className="text-[10px]">$$...$$</span>
                                            <span>Bloco</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-900 border-l border-t border-zinc-200 dark:border-zinc-700 transform rotate-45"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-0.5 border-r border-zinc-200 dark:border-zinc-800 pr-2 mr-2">
                <Button onClick={() => editor.chain().focus().setDrawing().run()} isActive={editor.isActive('drawing')} title="Desenho">
                    <PenTool size={14} />
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} title="Anexar PDF">
                    <Paperclip size={14} />
                </Button>
            </div>

            <div className="flex-1"></div>

            <button
                onClick={onOpenAI}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-xs font-semibold transition-colors border border-purple-200 dark:border-purple-800"
            >
                <Wand2 size={12} /> Ask AI
            </button>
        </div>
    );
};

import { WikiLinkExtension } from './extensions/WikiLinkExtension';
import DrawingExtension from './extensions/DrawingExtension';
import PdfExtension from './extensions/PdfExtension';
import { CollapsibleListItem } from './extensions/CollapsibleListItem';
import { MarkdownMathExtension, MATH_TEMPLATES, preprocessMarkdownWithMath } from './extensions/MarkdownMathExtension';

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
    const extensions = React.useMemo(() => [
        StarterKit.configure({
            listItem: false, // Using CollapsibleListItem instead
            heading: {
                levels: [1, 2, 3, 4, 5, 6],
            },
            bulletList: {
                keepMarks: true,
                keepAttributes: false,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false,
            },
            blockquote: {
                HTMLAttributes: {
                    class: 'border-l-4',
                },
            },
            codeBlock: {
                HTMLAttributes: {
                    class: 'rounded-lg',
                },
            },
        }),
        Markdown.configure({
            html: false, // Force Markdown output
            transformPastedText: true,
            transformCopiedText: true,
            // Preserve LaTeX math syntax - don't escape $ and special characters
            breaks: true,
        }),
        CollapsibleListItem,
        Placeholder.configure({
            placeholder: 'Comece a escrever...',
        }),
        Typography,
        Highlight,
        TaskList.configure({
            HTMLAttributes: {
                class: 'not-prose',
            },
        }),
        TaskItem.configure({
            nested: true,
            HTMLAttributes: {
                class: 'flex items-start gap-2',
            },
        }),
        Link.configure({
            openOnClick: false,
        }),
        WikiLinkExtension(async (query) => {
            if (searchNotesRef.current) {
                return searchNotesRef.current(query);
            }
            return [];
        }),
        DrawingExtension,
        PdfExtension,
        MathExtension.configure({
            evaluation: false,
            katexOptions: {
                throwOnError: false,
                strict: false,
                // Display mode for $$ blocks
                displayMode: false,
            },
        }),
        MarkdownMathExtension,
        UniqueID.configure({
            types: ['heading', 'paragraph', 'bulletList', 'orderedList', 'listItem', 'taskItem', 'blockquote', 'codeBlock'],
        }),
    ], []);

    const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const editor = useEditor({
        extensions: extensions,
        content: content,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            // Updated to getMarkdown() instead of getHTML()
            const markdownContent = (editor.storage.markdown as any).getMarkdown();
            onUpdate(markdownContent);

            // Sync blocks to Supabase (Debounced)
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
            syncTimeoutRef.current = setTimeout(() => {
                blockService.syncBlocks(noteId, editor.getJSON());
            }, 2000);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-8 lg:p-12 text-zinc-900 dark:text-zinc-300 font-sans',
            },
            handleKeyDown: (view, event) => {
                // Ctrl+M or Cmd+M to insert inline math formula
                if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
                    event.preventDefault();
                    const { from, to } = view.state.selection;
                    if (from === to) {
                        // Insert inline math template
                        const tr = view.state.tr.insertText('$x^2$');
                        view.dispatch(tr);
                    } else {
                        // Wrap selection with $
                        const selectedText = view.state.doc.textBetween(from, to);
                        const tr = view.state.tr.replaceWith(from, to, view.state.schema.text(`$${selectedText}$`));
                        view.dispatch(tr);
                    }
                    return true;
                }
                // Ctrl+Shift+M or Cmd+Shift+M to insert block math formula
                if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'M') {
                    event.preventDefault();
                    const tr = view.state.tr.insertText('\n$$\n\\frac{a}{b} = c\n$$\n');
                    view.dispatch(tr);
                    return true;
                }
                return false;
            },
            handleClick: (view, pos, event) => {
                const target = event.target as HTMLElement;
                const link = target.closest('a');
                if (link && onOpenPdf) {
                    const href = link.getAttribute('href');
                    if (href && (href.includes('.pdf') || href.includes('#highlight-'))) {
                        event.preventDefault();
                        const url = href.split('#')[0];
                        if (href.includes('#highlight-')) {
                            const hash = href.split('#')[1];
                            // Dispatch event for specialized readers if needed, or handle custom logic
                            // For now, pass to handler
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
        if (editor && content) {
            // Compare with current markdown content to prevent loop
            // This method might be expensive, so rely on standard check or verify if content is markdown
            const currentMarkdown = (editor.storage.markdown as any).getMarkdown();
            if (content !== currentMarkdown) {
                editor.commands.setContent(content, { emitUpdate: false });
            }
        }
    }, [content, editor]);

    // Update storage with onOpenPdf callback
    useEffect(() => {
        if (editor && onOpenPdf) {
            const storage = editor.storage as Record<string, any>;
            storage.pdf = storage.pdf || {};
            storage.pdf.openPdf = onOpenPdf;
        }
    }, [editor, onOpenPdf]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0c0c0e] relative group">
            <MenuBar editor={editor} onOpenAI={() => setShowAIDialog(true)} />

            {showAIDialog && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                            <h3 className="flex items-center gap-2 font-bold text-zinc-800 dark:text-white text-sm">
                                <Wand2 size={16} className="text-purple-500" />
                                Gerar com IA
                            </h3>
                            <button
                                onClick={() => setShowAIDialog(false)}
                                className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Descreva o que você quer..."
                                    className="w-full h-32 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowAIDialog(false)}
                                    className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                    disabled={isGenerating}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGenerateNote}
                                    disabled={!aiPrompt.trim() || isGenerating}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    {isGenerating ? 'Gerando...' : 'Gerar Nota'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default NotesEditor;

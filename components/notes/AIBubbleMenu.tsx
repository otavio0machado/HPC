
import React, { useState } from 'react';
// @ts-ignore
import { BubbleMenu, Editor } from '@tiptap/react';
import { Wand2, Sparkles, Check, ChevronDown, AlignLeft, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { aiService, refineText } from '../../services/geminiService';

interface AIBubbleMenuProps {
    editor: Editor;
}

const AIBubbleMenu: React.FC<AIBubbleMenuProps> = ({ editor }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleAIAction = async (instruction: 'improve' | 'fix' | 'shorter' | 'longer') => {
        if (!editor || isProcessing) return;

        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);

        if (!text || text.trim().length === 0) return;

        setIsProcessing(true);
        const toastId = toast.loading("IA trabalhando...");

        try {
            const refined = await refineText(text, instruction);

            if (refined && refined !== text) {
                editor.chain().focus().insertContentAt({ from, to }, refined).run();
                toast.success("Texto atualizado!", { id: toastId });
            } else {
                toast.dismiss(toastId);
            }
        } catch (e) {
            toast.error("Erro ao processar texto.", { id: toastId });
        } finally {
            setIsProcessing(false);
            setIsOpen(false);
        }
    };

    if (!editor) return null;

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, maxWidth: 600 }}
            shouldShow={({ editor, from, to }) => {
                // Only show if selection is not empty AND not a link/image/etc if preferred
                return !editor.state.selection.empty && !editor.isActive('image');
            }}
            className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-1 overflow-hidden"
        >
            {!isProcessing ? (
                <>
                    <div className="flex items-center">
                        <button
                            onClick={() => handleAIAction('improve')}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 rounded transition-colors"
                        >
                            <Sparkles size={12} /> Melhorar
                        </button>
                        <button
                            onClick={() => handleAIAction('fix')}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                        >
                            <Check size={12} /> Corrigir
                        </button>
                        <button
                            onClick={() => handleAIAction('shorter')}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                            title="Resumir"
                        >
                            <Minimize2 size={12} />
                        </button>
                        <button
                            onClick={() => handleAIAction('longer')}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                            title="Expandir"
                        >
                            <Maximize2 size={12} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400">
                    <Wand2 size={12} className="animate-spin text-purple-400" /> Processando...
                </div>
            )}
        </BubbleMenu>
    );
};

export default AIBubbleMenu;

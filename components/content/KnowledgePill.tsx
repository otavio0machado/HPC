import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Share2, Plus, FileText, Brain, Sparkles, Loader2 } from 'lucide-react';
import { KnowledgePill as PillType } from '../../data/contentData';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { notesService } from '../../services/notesService';
import { flashcardService } from '../../services/flashcardService';
import { toast } from 'sonner';

interface KnowledgePillProps {
    pill: PillType;
    index: number;
}

const KnowledgePill: React.FC<KnowledgePillProps> = ({ pill, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateNote = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCreating(true);
        try {
            const { data, error } = await notesService.createNote({
                name: `Nota: ${pill.title}`,
                content: `# ${pill.title}\n\n${pill.content}`,
                type: 'markdown'
            });

            if (data) {
                toast.success("Nota criada com sucesso!");
            } else {
                toast.error("Erro ao criar nota: " + error);
            }
        } catch (err) {
            toast.error("Erro ao processar criação de nota.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateFlashcard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCreating(true);
        try {
            const success = await flashcardService.createFlashcard({
                front: pill.title,
                back: pill.description + "\n\n" + pill.content,
                folderPath: ['Knowledge Pills'],
                nextReview: Date.now(),
                interval: 0,
                ease: 2.5,
                repetitions: 0
            });

            if (success) {
                toast.success("Flashcard criado com sucesso!");
            } else {
                toast.error("Erro ao criar flashcard.");
            }
        } catch (err) {
            toast.error("Erro ao processar criação de flashcard.");
        } finally {
            setIsCreating(false);
        }
    };

    // Layout Rendering Helpers
    const renderImageTop = () => (
        <div className="flex flex-col h-full">
            {pill.imageUrl && (
                <div className="w-full h-40 overflow-hidden relative border-b border-white/10 group-hover/pill:border-white/20 transition-colors">
                    <img src={pill.imageUrl} alt={pill.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/pill:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                        <h3 className="text-lg font-bold text-white leading-tight drop-shadow-lg text-spatial">
                            {pill.title}
                        </h3>
                    </div>
                </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
                {!pill.imageUrl && (
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mb-2 group-hover/pill:text-blue-400 transition-colors text-spatial">
                        {pill.title}
                    </h3>
                )}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20 backdrop-blur-sm">
                        Insight
                    </span>
                    {pill.readTime && (
                        <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
                            <Clock size={12} />
                            <span>{pill.readTime}</span>
                        </div>
                    )}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {pill.description}
                </p>
                <div className="mt-auto pt-4 flex justify-end">
                    <div className={`p-2 rounded-full border border-transparent transition-all duration-300 ${isOpen ? 'bg-white/10 text-white rotate-180' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderQuote = () => (
        <div className="p-8 h-full flex flex-col relative overflow-hidden">
            {/* Background Gradient Blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="absolute top-6 right-6 p-4 opacity-5 pointer-events-none text-white">
                <Brain size={100} strokeWidth={1} />
            </div>

            <div className="flex-1 relative z-10">
                <div className="flex items-start gap-3 mb-4">
                    <span className="text-4xl text-blue-500 font-serif leading-none mt-2">"</span>
                    <h3 className="text-xl font-bold text-zinc-800 dark:text-white leading-tight mt-1 group-hover/pill:text-blue-400 transition-colors text-spatial">
                        {pill.title}
                    </h3>
                </div>
                <div className="relative pl-6 py-2">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-blue-500 to-transparent opacity-50" />
                    <p className="text-base font-medium text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                        {pill.description}
                    </p>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-500/5 px-2 py-1 rounded border border-zinc-500/10 backdrop-blur-sm">Citação</span>
                <div className={`p-2 rounded-full border border-transparent transition-all duration-300 ${isOpen ? 'bg-white/10 text-white rotate-180' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );

    const renderList = () => (
        <div className="p-6 h-full flex flex-col bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.1)] backdrop-blur-sm">
                        <FileText size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-white leading-tight group-hover/pill:text-green-400 transition-colors text-spatial">
                        {pill.title}
                    </h3>
                </div>
                <div className={`p-1.5 rounded-full border border-transparent transition-all duration-300 ${isOpen ? 'bg-white/10 text-white rotate-180' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                    <ChevronDown size={16} />
                </div>
            </div>
            <div className="flex-1 space-y-3">
                {pill.description.split('. ').slice(0, 3).map((item, i) => (
                    <div key={i} className="flex gap-3 group/item">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover/item:scale-125 transition-transform" />
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed group-hover/item:text-zinc-300 transition-colors">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Resumo Estruturado</span>
            </div>
        </div>
    );

    const renderDefault = () => (
        <div className="p-6 h-full flex flex-col relative group/card">
            {/* Subtle gradient accent */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover/pill:opacity-100 transition-opacity duration-500" />

            <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-sm">
                    <Sparkles size={18} />
                </div>
                <div className="flex items-center gap-2">
                    {pill.readTime && <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">{pill.readTime}</span>}
                    <div className={`p-1.5 rounded-full border border-transparent transition-all duration-300 ${isOpen ? 'bg-white/10 text-white rotate-180' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-3 group-hover/pill:text-blue-400 transition-colors text-spatial">
                {pill.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 flex-1">
                {pill.description}
            </p>
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[9px] font-bold text-zinc-500 uppercase tracking-wider backdrop-blur-sm">Concept</span>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group/pill h-full"
        >
            <div
                className={`
                    h-full relative flex flex-col overflow-hidden rounded-[32px]
                    glass-card
                    hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-300 cursor-pointer
                    ${isOpen ? 'ring-1 ring-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : ''}
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Content based on layout */}
                <div className="flex-1">
                    {pill.layout === 'image_top' && renderImageTop()}
                    {pill.layout === 'quote' && renderQuote()}
                    {pill.layout === 'list' && renderList()}
                    {(!pill.layout || pill.layout === 'default') && renderDefault()}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-black/20 border-t border-white/5 backdrop-blur-xl"
                            onClick={(e) => e.stopPropagation()} // Prevent toggling when interacting with content
                        >
                            <div className="p-6">
                                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        className="markdown-content"
                                    >
                                        {pill.content}
                                    </ReactMarkdown>
                                </div>

                                <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                                    <button
                                        onClick={handleCreateNote}
                                        disabled={isCreating}
                                        className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bubble-hover text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:text-white active:scale-95 transition-all shadow-sm disabled:opacity-50"
                                    >
                                        {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                                        Criar Nota
                                    </button>
                                    <button
                                        onClick={handleCreateFlashcard}
                                        disabled={isCreating}
                                        className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
                                        Flashcards
                                    </button>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bubble-hover text-zinc-500 hover:text-blue-400 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default KnowledgePill;

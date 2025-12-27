
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, BookOpen, Share2, Bookmark } from 'lucide-react';
import { KnowledgePill as PillType } from '../../data/contentData';

interface KnowledgePillProps {
    pill: PillType;
    index: number;
}

const KnowledgePill: React.FC<KnowledgePillProps> = ({ pill, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <div
                className={`
                    w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 
                    rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] 
                    transition-all duration-300 cursor-pointer
                    ${isOpen ? 'ring-2 ring-blue-500/20 dark:ring-blue-500/40' : ''}
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                    Resumo
                                </span>
                                {pill.readTime && (
                                    <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-xs font-medium">
                                        <Clock size={12} />
                                        <span>{pill.readTime}</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {pill.title}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                {pill.description}
                            </p>
                        </div>
                        <div className={`p-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-500/10 text-blue-500' : 'group-hover:bg-zinc-200 dark:group-hover:bg-white/10'}`}>
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-zinc-50 dark:bg-black/20 border-t border-zinc-100 dark:border-white/5"
                        >
                            <div className="p-5">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm">
                                        {pill.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-200 dark:border-white/10">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors shadow-sm">
                                        <BookOpen size={14} />
                                        <span>Estudar Completo</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors shadow-sm ml-auto">
                                        <Bookmark size={14} />
                                        <span>Salvar</span>
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


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Search } from 'lucide-react';
import { contentData, Subject } from '../../data/contentData';
import SubjectCard from './SubjectCard';
import KnowledgePill from './KnowledgePill';

const ContentModule: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubjects = contentData.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20">
                            <Sparkles size={24} />
                        </span>
                        Conteúdos
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                        Pílulas de conhecimento para revisão rápida.
                    </p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    <motion.div
                        key="subject-list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        {/* Search Bar */}
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 shadow-sm group-focus-within:border-blue-500/50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 transition-all">
                                <Search size={20} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar matérias ou tópicos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 hover-cards-container">
                            {filteredSubjects.map((subject, index) => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    index={index}
                                    onClick={() => setSelectedSubject(subject)}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="subject-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1"
                    >
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="mb-6 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 w-fit"
                        >
                            <ArrowLeft size={18} />
                            Voltar para Matérias
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-12 h-12 rounded-2xl ${selectedSubject.color} text-white flex items-center justify-center shadow-lg`}>
                                {/* We can't dynamically import icons easily here without mapping, so let's reuse logic or just pass a simple prop/icon component. 
                                    For now, simple div placeholder or better yet, since we are in the same file/context, we can't easily reuse the iconMap from SubjectCard unless exported.
                                    Let's keep it simple for now and just show the title.
                                */}
                                <span className="font-bold text-lg">{selectedSubject.title[0]}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {selectedSubject.title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {selectedSubject.pills.map((pill, index) => (
                                <KnowledgePill key={pill.id} pill={pill} index={index} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContentModule;

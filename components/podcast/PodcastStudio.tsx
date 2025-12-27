import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Play, FileText, Sparkles, Clock, Music } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface PodcastStudioProps {
    onPlayPodcast: (track: { title: string, text: string, author?: string }) => void;
}

const PodcastStudio: React.FC<PodcastStudioProps> = ({ onPlayPodcast }) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            const { data } = await supabase.from('notes').select('*').limit(10);
            if (data) setNotes(data);
            setLoading(false);
        };
        fetchNotes();
    }, []);

    const handleGeneratePodcast = async (note: any) => {
        const promise = new Promise((resolve) => setTimeout(resolve, 1500));

        toast.promise(promise, {
            loading: 'Gerando roteiro de áudio com IA...',
            success: 'Podcast pronto!',
            error: 'Erro ao gerar podcast'
        });

        await promise;

        // Here we would use LLM to summarize/script the text. For now, raw content.
        const podcastContent = `Olá estudante! Bem vindo ao seu resumo sobre ${note.name}. Vamos revisar os pontos principais. ${note.content || "Sem conteúdo textual detectado."}`;
        onPlayPodcast({
            title: note.name,
            text: podcastContent,
            author: 'AI Tutor'
        });
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
                    <span className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl text-white shadow-lg">
                        <Mic2 size={32} />
                    </span>
                    AI Podcast Studio
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Transforme suas anotações em episódios de áudio imersivos para estudar em qualquer lugar.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Create New Section */}
                <div className="col-span-1 md:col-span-2 p-6 rounded-[32px] glass-card border border-white/5 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 relative overflow-hidden group hover:border-violet-500/30 transition-all cursor-pointer">
                    <div className="absolute right-0 top-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Music size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">Morning Briefing</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-lg">
                            Gere um podcast automático com suas tarefas de hoje, revisão de flashcards pendentes e principais erros da semana.
                        </p>
                        <button className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <Sparkles size={16} /> Gerar Daily Show
                        </button>
                    </div>
                </div>

                {/* Notes List */}
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
                        <FileText size={18} /> Suas Anotações Recentes
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading && <p>Carregando notas...</p>}
                        {notes.map(note => (
                            <motion.div
                                key={note.id}
                                whileHover={{ y: -4 }}
                                className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-violet-500/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${note.type === 'folder' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'} text-xs font-bold uppercase`}>
                                        {note.type}
                                    </div>
                                    <button
                                        onClick={() => handleGeneratePodcast(note)}
                                        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-violet-500 transition-all"
                                    >
                                        <Play size={14} className="ml-0.5 fill-current" />
                                    </button>
                                </div>
                                <h4 className="font-bold text-zinc-800 dark:text-white mb-1 truncate">{note.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <Clock size={12} />
                                    <span>5 min leitura</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PodcastStudio;

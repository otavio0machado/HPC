import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ChevronRight,
    CheckCircle2,
    Play,
    Lock,
    FileText,
    MessageSquare,
    Save,
    MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { CONTENT_REGISTRY } from './registry/ContentRegistry';

interface Lesson {
    id: string;
    title: string;
    duration: string;
    status: 'Locked' | 'In Progress' | 'Completed';
    content?: React.ReactNode;
    contentId?: string;
}

interface Module {
    id: string;
    title: string;
    description: string;
    locked: boolean;
    duration: string;
    lessons: Lesson[];
    status: 'Locked' | 'In Progress' | 'Completed';
}

interface LessonViewProps {
    course: any;
    lesson: any; // The active lesson
    onBack: () => void;
    onLessonSelect: (lesson: any) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ course, lesson, onBack, onLessonSelect }) => {
    const [activeTab, setActiveTab] = useState<'notes' | 'discussion'>('notes');
    const [note, setNote] = useState('');

    const handleSaveNote = () => {
        if (!note.trim()) return;
        toast.success("Note saved successfully!");
        setNote('');
    };

    // Flatten modules to find next/prev lessons or just display navigation
    const modules: Module[] = course.modules || [];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest mb-8 px-2">
                <button onClick={onBack} className="p-2 -ml-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                    <ArrowLeft size={16} />
                </button>
                <span className="text-zinc-600">HPC Knowledge</span>
                <span className="text-zinc-800">/</span>
                <span className="text-zinc-500">{course.title}</span>
                <span className="text-zinc-800">/</span>
                <span className="text-blue-400">{lesson?.title || 'Lesson'}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8 pb-20">
                    <div className="bg-[#1A1B26]/50 border border-white/5 rounded-[40px] p-8 md:p-12 space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                {lesson?.title}
                            </h1>
                            <div className="h-1 w-20 bg-blue-500 rounded-full" />
                        </div>

                        {/* RENDER DYNAMIC CONTENT */}
                        {lesson?.content ? (
                            <div className="text-zinc-300">
                                {lesson.content}
                            </div>
                        ) : lesson?.contentId && CONTENT_REGISTRY[lesson.contentId] ? (
                            <div className="text-zinc-300 fade-in slide-in-from-bottom-4 duration-500">
                                <React.Suspense fallback={
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <Loader2 className="animate-spin text-blue-500" size={32} />
                                        <p className="text-zinc-500 text-sm font-mono">LOADING_MODULE_DATA...</p>
                                    </div>
                                }>
                                    {React.createElement(CONTENT_REGISTRY[lesson.contentId])}
                                </React.Suspense>
                            </div>
                        ) : (
                            // Fallback for demo or if no content is provided
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-2xl font-bold text-blue-300">Content not available</h2>
                                <p className="text-zinc-400 text-lg leading-relaxed">
                                    This lesson content is not yet available in the database.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Navigation & Tools */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Progress Card */}
                    <div className="bg-[#1A1B26]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-white font-bold">Course Progress</h3>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-500">
                                <span>{course.progress}% Complete</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full w-full bg-gradient-to-r from-blue-500 to-cyan-400 origin-left transition-transform duration-1000"
                                    style={{ transform: `scaleX(${course.progress / 100})` }}
                                />
                            </div>
                        </div>

                        {/* Navigation List - Iterating over Modules */}
                        <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {modules.map(mod => (
                                <div key={mod.id} className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest sticky top-0 bg-[#1A1B26] py-1 z-10">
                                        {mod.title}
                                    </h4>
                                    <div className="space-y-2">
                                        {mod.lessons?.map((l) => (
                                            <div
                                                key={l.id}
                                                onClick={() => onLessonSelect(l)}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group
                                                    ${lesson?.id === l.id
                                                        ? 'bg-blue-500/10 border-blue-500/20 shadow-glow'
                                                        : 'bg-white/5 border-transparent hover:border-white/10'}`}
                                            >
                                                <div className={`p-1.5 rounded-full ${l.status === 'Completed' ? 'text-blue-400' : l.status === 'Locked' ? 'text-zinc-700' : 'text-blue-500 animate-pulse'}`}>
                                                    {l.status === 'Completed' ? <CheckCircle2 size={16} /> : l.status === 'Locked' ? <Lock size={16} /> : <Play size={16} fill="currentColor" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-bold truncate ${l.status === 'Locked' ? 'text-zinc-600' : lesson?.id === l.id ? 'text-white' : 'text-zinc-300'}`}>
                                                        {l.title}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-600 font-bold uppercase">{l.duration}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes/Interaction Tab */}
                    <div className="bg-[#1A1B26]/80 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-[350px]">
                        <div className="flex border-b border-white/5">
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'notes' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Notes
                            </button>
                            <button
                                onClick={() => setActiveTab('discussion')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'discussion' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Discussion
                            </button>
                        </div>

                        <div className="flex-1 p-4 relative">
                            {activeTab === 'notes' ? (
                                <textarea
                                    placeholder="Take notes here..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full h-full bg-transparent border-none text-zinc-300 placeholder:text-zinc-700 focus:ring-0 text-sm resize-none custom-scrollbar"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-zinc-700 text-xs font-bold uppercase">
                                    Join the discussion...
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSaveNote}
                                className="absolute bottom-4 right-4 p-3 bg-cyan-400 text-black rounded-xl shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 transition-shadow"
                            >
                                <Save size={18} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;

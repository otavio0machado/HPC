import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Play,
    Lock,
    ChevronDown,
    Clock,
    CheckCircle2,
    BookOpen,
    Target,
    ChevronUp
} from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    duration: string;
    status: 'Locked' | 'In Progress' | 'Completed';
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

interface CourseDetailProps {
    course: any;
    onBack: () => void;
    onResume: () => void;
    onLessonSelect: (lesson: any) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onResume, onLessonSelect }) => {
    // Use course.modules if available, otherwise fallback/empty
    const modules: Module[] = course.modules || [];
    const [expandedModule, setExpandedModule] = useState<string | null>(modules.length > 0 ? modules[0].id : null);

    const toggleModule = (id: string) => {
        setExpandedModule(expandedModule === id ? null : id);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Navigation & Breadcrumbs */}
            <div className="flex items-center gap-4 text-sm font-medium">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <span className="text-zinc-500">HPC Knowledge</span>
                <span className="text-zinc-700">/</span>
                <span className="text-white">{course.title}</span>
            </div>

            {/* Hero Card */}
            <div className="relative group overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1A1B26] to-[#0F172A] border border-white/10 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 group-hover:bg-blue-500/15 transition-colors" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest leading-none">
                                {course.category}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold flex items-center gap-1.5 leading-none">
                                <Clock size={12} />
                                {course.duration}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1]">
                            {course.title}
                        </h1>

                        <div className="space-y-4 max-w-lg mx-auto md:mx-0">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <span>Course Progress</span>
                                <span className="text-blue-400">{course.progress}% Complete</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress}%` }}
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={onResume}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-cyan-400 text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.3)] group/btn"
                        >
                            <Play size={20} fill="currentColor" />
                            Resume Learning
                        </button>
                    </div>

                    <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-20"
                        >
                            <svg viewBox="0 0 200 200" className="w-full h-full text-blue-400">
                                <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(0 100 100)" />
                                <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(60 100 100)" />
                                <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(120 100 100)" />
                            </svg>
                        </motion.div>
                        <div className="relative p-8 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-3xl shadow-2xl">
                            {/* Render icon if it's a component or node */}
                            {typeof course.icon === 'function' ? (
                                <course.icon size={64} className="text-white" />
                            ) : (
                                course.icon // Fallback if it's already a node
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Info Column */}
                <div className="lg:col-span-1 space-y-10">
                    <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                        {course.description}
                    </p>

                    <div className="bg-[#1A1B26]/50 border border-white/5 rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center gap-3 text-white font-bold text-xl">
                            <Target className="text-blue-400" size={24} />
                            Learning Objectives
                        </div>
                        <ul className="space-y-4">
                            {course.objectives?.map((obj: string, i: number) => (
                                <li key={i} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    {obj}
                                </li>
                            )) || <li className="text-zinc-500 italic">No objectives listed.</li>}
                        </ul>
                    </div>
                </div>

                {/* Syllabus Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black text-white">Course Syllabus</h2>
                        <span className="text-sm font-bold text-zinc-500">
                            {modules.length} Modules • {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons
                        </span>
                    </div>

                    <div className="space-y-4">
                        {modules.map((mod) => (
                            <motion.div
                                key={mod.id}
                                className={`group relative rounded-[28px] border transition-all duration-300 overflow-hidden
                                    ${mod.status === 'In Progress'
                                        ? 'bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/5'
                                        : 'bg-white/5 border-white/5'}`}
                            >
                                <div
                                    onClick={() => toggleModule(mod.id)}
                                    className="p-6 cursor-pointer flex items-center justify-between gap-6"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl border ${mod.status === 'Locked' ? 'bg-zinc-900 border-white/5 text-zinc-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                            {mod.status === 'Locked' ? <Lock size={20} /> : <BookOpen size={20} />}
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-bold mb-1 ${mod.status === 'Locked' ? 'text-zinc-500' : 'text-white'}`}>
                                                {mod.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                <span>{mod.lessons?.length || 0} Lessons</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span>{mod.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {expandedModule === mod.id ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-zinc-600 group-hover:text-white transition-colors" />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedModule === mod.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-white/5 bg-black/20"
                                        >
                                            <div className="p-4 space-y-2">
                                                {mod.lessons?.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() => onLessonSelect(lesson)}
                                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/lesson"
                                                    >
                                                        <div className={`p-2 rounded-full ${lesson.status === 'Completed' ? 'text-blue-400' : 'text-zinc-600 group-hover/lesson:text-blue-400'}`}>
                                                            {lesson.status === 'Completed' ? <CheckCircle2 size={16} /> : <Play size={16} fill="currentColor" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-bold text-zinc-300 group-hover/lesson:text-white transition-colors">
                                                                {lesson.title}
                                                            </h4>
                                                        </div>
                                                        <span className="text-xs font-bold text-zinc-600 uppercase">
                                                            {lesson.duration}
                                                        </span>
                                                    </div>
                                                ))}
                                                {(!mod.lessons || mod.lessons.length === 0) && (
                                                    <p className="text-zinc-500 text-sm p-2 italic">No lessons available yet.</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                        {modules.length === 0 && (
                            <div className="text-center p-10 bg-white/5 rounded-[28px] border border-white/5 border-dashed">
                                <p className="text-zinc-500">Content coming soon for this subject.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;

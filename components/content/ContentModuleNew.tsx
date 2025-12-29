import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sparkles,
    Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import CourseCard from './CourseCard';
import CourseDetail from './CourseDetail';
import LessonView from './LessonView';
import { COURSES_DATA, Course, Lesson } from '../../data/newContentData';

// Filter Pills Data
const FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'exatas', label: 'Exatas & Biológicas' },
    { id: 'humanas', label: 'Ciências Humanas' },
    { id: 'linguagens', label: 'Linguagens' },
    { id: 'artes', label: 'Artes' }
];

type ViewState = 'LIBRARY' | 'DETAIL' | 'LESSON';

const ContentModuleNew: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewState>('LIBRARY');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // Filter Logic
    const filteredCourses = COURSES_DATA.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || course.tags.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course);
        setActiveView('DETAIL');
    };

    const handleBackToLibrary = () => {
        setActiveView('LIBRARY');
        setSelectedCourse(null);
        setSelectedLesson(null);
    };

    const handleResumeLearning = () => {
        // Find the first unfinished lesson or just the first one
        if (selectedCourse?.modules && selectedCourse.modules.length > 0) {
            const firstLesson = selectedCourse.modules[0].lessons[0];
            if (firstLesson) {
                setSelectedLesson(firstLesson);
                setActiveView('LESSON');
            }
        } else {
            setActiveView('LESSON');
        }
    };

    const handleLessonSelect = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setActiveView('LESSON');
    };

    const handleBackToDetail = () => {
        setActiveView('DETAIL');
        setSelectedLesson(null);
    };

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-transparent custom-scrollbar p-6">
            <AnimatePresence mode="wait">
                {activeView === 'LIBRARY' && (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="max-w-7xl mx-auto space-y-12 pb-20"
                    >
                        {/* Header Section */}
                        <div className="text-center space-y-6 pt-8">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            >
                                <Sparkles size={14} className="text-blue-400" />
                                HPC Knowledge
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]"
                            >
                                Explore the Universe <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                    of Knowledge
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                            >
                                Dive into our immersive library of high-performance computing,
                                physics, and advanced mathematics.
                            </motion.p>
                        </div>

                        {/* Search & Filter Section */}
                        <div className="flex flex-col items-center gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full max-w-2xl relative group"
                            >
                                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all opacity-0 group-hover:opacity-100" />
                                <div className="relative flex items-center bg-[#1A1B26] border border-white/10 rounded-2xl p-2 shadow-2xl transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50">
                                    <Search className="ml-4 text-zinc-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search topics, concepts, or courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 px-4 py-2 font-medium"
                                    />
                                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95">
                                        Search
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap justify-center gap-3"
                            >
                                {FILTERS.map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all border duration-300 ${activeFilter === filter.id
                                                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </motion.div>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => {
                                // Instantiate the icon component
                                const IconComponent = course.icon;
                                return (
                                    <CourseCard
                                        key={course.id}
                                        course={{
                                            ...course,
                                            icon: <IconComponent size={24} className="text-white" />
                                        }}
                                        onClick={() => handleCourseClick(course)}
                                    />
                                );
                            })}
                        </div>

                        {/* New Arrival Banner */}
                        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#1A1B26] to-[#0F172A] border border-white/10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10" />

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500">
                                    <Rocket size={40} className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2 block">New Arrival</span>
                                    <h3 className="text-3xl font-bold text-white mb-2">Advanced Astrophysics</h3>
                                    <p className="text-zinc-400 max-w-md">Explore the life cycle of stars, black holes, and the expansion of the universe in our newest immersive module.</p>
                                </div>
                            </div>

                            <button className="whitespace-nowrap px-8 py-3 bg-white text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                Start Now
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeView === 'DETAIL' && selectedCourse && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-7xl mx-auto"
                    >
                        <CourseDetail
                            course={{
                                ...selectedCourse,
                                icon: React.createElement(selectedCourse.icon, { size: 64, className: 'text-white' })
                            }}
                            onBack={handleBackToLibrary}
                            onResume={handleResumeLearning}
                            onLessonSelect={handleLessonSelect}
                        />
                    </motion.div>
                )}

                {activeView === 'LESSON' && selectedCourse && (
                    <motion.div
                        key="lesson"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-7xl mx-auto h-full"
                    >
                        <LessonView
                            course={selectedCourse}
                            lesson={selectedLesson}
                            onBack={handleBackToDetail}
                            onLessonSelect={handleLessonSelect}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContentModuleNew;

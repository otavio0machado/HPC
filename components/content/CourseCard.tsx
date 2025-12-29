import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        category: string;
        duration: string;
        progress: number;
        icon: React.ReactNode;
        color: string;
    };
    onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-[#1A1B26]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            onClick={onClick}
        >
            {/* Header: Tags & Icon */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-wider text-blue-300 uppercase">
                        {course.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                        <Clock size={10} />
                        {course.duration}
                    </span>
                </div>

                <div className={`w-12 h-12 rounded-full ${course.color} flex items-center justify-center shadow-lg shadow-white/5 group-hover:scale-110 transition-transform duration-300`}>
                    {course.icon}
                </div>
            </div>

            {/* Content */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-200 transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>
            </div>

            {/* Footer: Progress & Button */}
            <div className="space-y-4">
                {/* Progress Bar */}
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className="text-zinc-500">Progress</span>
                    <span className="text-blue-400">{course.progress}% Complete</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                </div>

                {/* Resume Button - Visible on Hover (or always visible depending on preference, sticking to prototype feel) */}
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 text-zinc-300 hover:text-blue-300 font-bold text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">
                    <Play size={14} fill="currentColor" />
                    Resume Learning
                </button>
            </div>

            {/* Background Gradient Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
        </motion.div>
    );
};

export default CourseCard;

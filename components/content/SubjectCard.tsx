
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Calculator, Scroll, Atom, Dna, Book, Brain, Globe, Music, Code } from 'lucide-react';
import { Subject } from '../../data/contentData';

interface SubjectCardProps {
    subject: Subject;
    onClick: () => void;
    index: number;
}

const iconMap: { [key: string]: React.ElementType } = {
    'Calculator': Calculator,
    'Scroll': Scroll,
    'Atom': Atom,
    'Dna': Dna,
    'Book': Book,
    'Brain': Brain,
    'Globe': Globe,
    'Music': Music,
    'Code': Code
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick, index }) => {
    const Icon = iconMap[subject.icon] || Book;
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -3, 0]
            }}
            transition={{
                delay: index * 0.05,
                y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                }
            }}
            whileHover={{
                scale: 1.03,
                y: -8,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }
            }}
            whileTap={{
                scale: 0.97,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }
            }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            className="group relative w-full aspect-[4/3] rounded-[36px] overflow-hidden transition-all duration-500 text-left bg-white/70 dark:bg-white/[0.05] backdrop-blur-3xl border border-black/[0.06] dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15),_0_0_30px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),_0_0_40px_rgba(99,102,241,0.3)]"
        >
            {/* Enhanced Spotlight Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle 250px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 70%)`
                }}
            />

            {/* Color Gradient Overlay */}
            <div className={`absolute inset-0 opacity-[0.08] ${subject.color} group-hover:opacity-[0.15] transition-opacity duration-500`} />

            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <motion.div
                    className={`w-14 h-14 rounded-2xl ${subject.color} text-white flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 ring-1 ring-white/20`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <Icon size={26} />
                </motion.div>

                <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:translate-x-1 transition-transform duration-300 text-spatial-title">
                        {subject.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-white/60 font-medium text-spatial">
                        {subject.pills.length} pílulas
                    </p>
                </div>

                <motion.div
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    initial={{ x: 16, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                >
                    <div className="w-9 h-9 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-zinc-900 dark:text-white shadow-lg ring-1 ring-white/20">
                        <ChevronRight size={18} />
                    </div>
                </motion.div>
            </div>
        </motion.button>
    );
};

export default SubjectCard;


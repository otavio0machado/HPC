
import React from 'react';
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

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="group relative w-full aspect-[4/3] rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 text-left shadow-lg dark:shadow-none bg-white dark:bg-zinc-900"
        >
            <div className={`absolute inset-0 opacity-10 ${subject.color} group-hover:opacity-20 transition-opacity`} />

            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className={`w-12 h-12 rounded-2xl ${subject.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 group-hover:translate-x-1 transition-transform">
                        {subject.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-white/50 font-medium">
                        {subject.pills.length} pílulas
                    </p>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-zinc-900 dark:text-white">
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

export default SubjectCard;

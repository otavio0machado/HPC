import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Play, Target, Sparkles, Brain, Layout, Library, UserCircle2 } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();

    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const moveX = (clientX / window.innerWidth - 0.5) * 20;
            const moveY = (clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x: moveX, y: moveY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-20 perspective-1000">
            {/* --- BACKGROUND ELEMENTS --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            y: [0, -1000],
                            opacity: [0, 0.3, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 20 + 15,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                        className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/30 dark:bg-white/20 blur-[1px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100 + 100}%`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                style={{ y: y1 }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[0%] right-[-10%] w-[700px] h-[700px] bg-purple-400/20 dark:bg-indigo-600/10 rounded-full blur-[130px] -z-10"
            />

            <motion.div
                style={{ opacity, scale }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center"
            >
                {/* --- BADGE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass-card px-5 py-2 rounded-full mb-10 flex items-center gap-3 cursor-default hover:scale-105 transition-transform duration-300"
                >
                    <div className="flex -space-x-3">
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                            <Brain size={12} className="text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                            A Nova Era do Aprendizado
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                </motion.div>

                {/* --- MAIN HEADLINE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mb-8"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[1.1] md:leading-[1.1]">
                        <span className="block opacity-90 backdrop-blur-sm">Aprenda na velocidade</span>
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 animate-gradient bg-300% py-2">
                            do pensamento.
                        </span>
                    </h1>
                </motion.div>

                {/* --- SUBHEADLINE --- */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12 font-medium"
                >
                    Uma plataforma de alta performance que une <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Organização</span>, <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Conteúdo</span> e <span className="text-zinc-900 dark:text-zinc-100 font-semibold">IA Avançada</span> para transformar sua rotina de estudos.
                </motion.p>

                {/* --- CTA BUTTONS --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto"
                >
                    <motion.button
                        onClick={onCtaClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-hydro group relative px-8 py-4 rounded-full font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-3 overflow-hidden w-full sm:w-auto justify-center"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors duration-300" />
                        <span className="relative z-10">Começar Agora</span>
                        <Zap className="w-5 h-5 fill-current relative z-10" />
                    </motion.button>
                    <motion.button // Secondary Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-card px-8 py-4 rounded-full font-semibold text-lg text-zinc-600 dark:text-zinc-300 flex items-center gap-3 hover:text-zinc-900 dark:hover:text-white transition-colors w-full sm:w-auto justify-center"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Ver Demonstração
                    </motion.button>
                </motion.div>

                {/* --- VISION OS WINDOW MOCKUP --- */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ perspective: 2000 }}
                    className="relative w-full max-w-5xl mx-auto"
                >
                    {/* Window Container */}
                    <div className="glass-spatial rounded-[32px] overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-indigo-500/10 relative">
                        {/* Window Header / Toolbar - CLEAN MINIMALIST */}
                        <div className="h-14 border-b border-white/20 dark:border-white/5 flex items-center px-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl relative">
                            {/* Traffic Lights */}
                            <div className="flex gap-2 absolute left-6">
                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                            </div>

                            {/* Navigation Links - Centered & Precise */}
                            <div className="flex items-center justify-center gap-10 mx-auto text-[11px] uppercase tracking-widest font-bold">
                                <span className="text-zinc-900 dark:text-white cursor-pointer transition-opacity hover:opacity-100">Dashboard</span>
                                <span className="text-zinc-500 dark:text-zinc-500 cursor-pointer transition-opacity hover:opacity-100">Biblioteca</span>
                                <span className="text-zinc-500 dark:text-zinc-500 cursor-pointer transition-opacity hover:opacity-100">Tutores</span>
                            </div>

                            {/* Right side element */}
                            <div className="absolute right-6">
                                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5" />
                            </div>
                        </div>

                        {/* Window Content */}
                        <div className="bg-zinc-50/50 dark:bg-[#0c0c0e]/80 p-6 min-h-[500px] relative">
                            {/* Simulate App Interface */}
                            <div className="grid grid-cols-12 gap-6 h-full">
                                {/* Sidebar */}
                                <div className="col-span-3 hidden md:flex flex-col gap-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-10 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                    <div className="mt-auto h-32 w-full rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-600/20 border border-blue-500/20 shadow-inner flex flex-col items-center justify-center gap-2">
                                        <Sparkles size={20} className="text-blue-500 animate-pulse" />
                                        <div className="h-2 w-16 bg-blue-500/20 rounded" />
                                    </div>
                                </div>
                                {/* Main Content */}
                                <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                                    {/* Header Area */}
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="h-6 w-32 rounded bg-black/10 dark:bg-white/10" />
                                        <div className="flex gap-2">
                                            <div className="h-8 w-24 rounded-lg bg-black/5 dark:bg-white/5" />
                                            <div className="h-8 w-8 rounded-lg bg-blue-500" />
                                        </div>
                                    </div>
                                    {/* Cards Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 h-44 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm p-6 relative overflow-hidden flex flex-col justify-end">
                                            <div className="absolute top-0 right-0 p-6 opacity-10"><Target size={120} /></div>
                                            <div className="space-y-3 relative z-10">
                                                <div className="h-4 w-32 bg-zinc-900/10 dark:bg-white/10 rounded" />
                                                <div className="h-10 w-20 bg-zinc-900/20 dark:bg-white/20 rounded" />
                                            </div>
                                        </div>
                                        <div className="col-span-1 h-44 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 relative overflow-hidden flex flex-col justify-between">
                                            <div className="h-6 w-6 rounded bg-white/20" />
                                            <div>
                                                <div className="font-bold text-3xl">Active</div>
                                                <div className="text-xs opacity-80 mt-1">Focus Flow</div>
                                            </div>
                                            <Sparkles className="absolute -bottom-2 -right-2 opacity-30" size={60} />
                                        </div>
                                    </div>
                                    {/* Chart Area */}
                                    <div className="flex-grow min-h-[180px] rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm p-6 flex flex-col relative overflow-hidden">
                                        <div className="h-4 w-40 bg-black/5 dark:bg-white/5 rounded mb-8" />
                                        <div className="flex-grow flex items-end justify-between gap-2 px-2 pb-2 relative z-10">
                                            {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90, 60, 95].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ duration: 1, delay: 1 + (i * 0.05) }}
                                                    className="w-full bg-blue-500/60 dark:bg-blue-500/40 rounded-t-sm hover:bg-blue-500 transition-colors cursor-pointer"
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Glass Reflection Overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;

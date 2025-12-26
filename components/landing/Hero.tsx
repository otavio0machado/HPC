import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp, Sparkles, Zap } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, 100]);
    const y2 = useTransform(scrollY, [0, 300], [0, -50]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Enhanced Background Gradients with Parallax */}
            <div className="absolute inset-0 bg-zinc-950 -z-20" />

            <motion.div
                style={{ y: y1 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10"
            />

            <motion.div
                style={{ y: y2 }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"
            />

            {/* Subtle Mouse-Following Gradient */}
            <motion.div
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"
            />

            <motion.div
                style={{ opacity }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
            >
                {/* Refined Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md mb-8 hover:border-blue-700/50 hover:bg-zinc-900/70 transition-all duration-300 cursor-default group"
                >
                    <Sparkles size={16} className="text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">A nova era da alta performance</span>
                    <Zap size={14} className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </motion.div>

                {/* Enhanced Title with Better Animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]"
                >
                    <span className="block">Domine o Jogo da</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 animate-gradient bg-300% mt-2">
                        Aprovação
                    </span>
                </motion.h1>

                {/* Enhanced Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-3xl mx-auto text-xl md:text-2xl text-zinc-400 leading-relaxed mb-12 font-light"
                >
                    O sistema definitivo que une <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">inteligência de dados</span> e <span className="text-white font-semibold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">neurociência</span> para quem não aceita menos que a vaga dos sonhos.
                </motion.p>

                {/* Enhanced CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <motion.button
                        onClick={onCtaClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-4 rounded-full bg-white text-black font-bold text-lg overflow-hidden shadow-[0_8px_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 ease-out"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-2">
                            Começar Agora
                            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </span>
                    </motion.button>

                    <motion.a
                        href="#metodologia"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] text-white font-semibold hover:bg-white/[0.08] hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out group flex items-center gap-2 ring-1 ring-white/[0.05] inset"
                    >
                        Conhecer Método
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.a>
                </motion.div>

                {/* Stats Section - New Addition */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20"
                >
                    {[
                        { value: '98%', label: 'Taxa de Aprovação' },
                        { value: '10k+', label: 'Horas de Estudo' },
                        { value: '500+', label: 'Alunos Aprovados' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + idx * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-zinc-500 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* MAIN CARD PREVIEW - Liquid Glass */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 1, delay: 1, ease: "circOut" }}
                    style={{ perspective: 1000 }}
                    className="relative max-w-5xl mx-auto mt-12 transform hover:scale-[1.01] transition-transform duration-700"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[32px] blur opacity-20 animate-pulse"></div>
                    <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-[30px] ring-1 ring-white/[0.05] inset bg-gradient-to-br from-white/[0.1] to-white/[0.02] p-6 lg:p-8 overflow-hidden aspect-video flex items-center justify-center">
                        {/* Mock UI Content inside Glass Card */}
                        <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/[0.05] flex items-center px-6 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="text-center mt-8">
                            <p className="text-sm font-medium text-blue-400 mb-2 uppercase tracking-widest">Plataforma HPC</p>
                            <h3 className="text-3xl font-bold text-white drop-shadow-md tracking-tight">Dashboard de Elite</h3>
                            <p className="text-zinc-400 mt-2 max-w-md mx-auto">Experiência imersiva inspirada no visionOS para foco total.</p>

                            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto opacity-80">
                                <div className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse delay-75"></div>
                                <div className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse delay-150"></div>
                                <div className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse delay-200"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;

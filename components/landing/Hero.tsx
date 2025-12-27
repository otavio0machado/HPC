import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, Sparkles, Zap, Shield, Target, Trophy } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();

    // Parallax and fade effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const moveX = (clientX / window.innerWidth - 0.5) * 40;
            const moveY = (clientY / window.innerHeight - 0.5) * 40;
            setMousePosition({ x: moveX, y: moveY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 perspective-1000">
            {/* Deep Cosmic Background */}
            <div className="absolute inset-0 bg-zinc-950 -z-20 overflow-hidden">
                {/* Floating Particles/Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.1, scale: Math.random() }}
                        animate={{
                            y: [0, -1000],
                            opacity: [0.1, 0.5, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 20,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 20
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100 + 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Dynamic Energy Orbs */}
            <motion.div
                style={{ y: y1 }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 180, 360]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[140px] -z-10"
            />

            <motion.div
                style={{ y: y2 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                    x: [0, 100, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[150px] -z-10"
            />

            {/* Mouse-Interactive Glow */}
            <motion.div
                animate={{
                    x: mousePosition.x * 2,
                    y: mousePosition.y * 2,
                }}
                transition={{ type: "spring", stiffness: 40, damping: 30 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-400/10 rounded-full blur-[180px] -z-10 pointer-events-none"
            />

            <motion.div
                style={{ opacity, scale }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
            >
                {/* Premium Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl mb-10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 cursor-default group shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-zinc-950 bg-blue-500 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600" />
                            </div>
                        ))}
                    </div>
                    <span className="text-sm font-bold text-zinc-100 tracking-wide">+1.240 alunos aprovados este mês</span>
                    <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                </motion.div>

                {/* Main Headline - Dopamine Trigger */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tight text-white mb-8 leading-[0.85]">
                        <span className="block opacity-90">REPROGRAME SUA</span>
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient bg-300% py-2">
                            APROVAÇÃO
                            <motion.div
                                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full blur-[2px]"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1, delay: 1 }}
                            />
                        </span>
                    </h1>
                </motion.div>

                {/* Persuasive Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-4xl mx-auto text-xl md:text-3xl text-zinc-400 leading-tight mb-14 font-medium"
                >
                    Pare de estudar como um computador antigo. Use o sistema de <span className="text-white">alta performance</span> que usa <span className="underline decoration-blue-500/50 decoration-4 underline-offset-4">neurociência aplicada</span> para hackear seu aprendizado.
                </motion.p>

                {/* High-Impact CTA Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col items-center gap-8 mb-20"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
                        <motion.button
                            onClick={onCtaClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative w-full sm:w-auto px-12 py-5 rounded-2xl font-extrabold text-xl overflow-hidden transition-all duration-300
                                bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                                backdrop-blur-md border border-white/20
                                shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                                ring-1 ring-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center justify-center gap-3">
                                ATIVAR ACESSO PRO
                                <Zap className="w-6 h-6 fill-white text-white group-hover:animate-bounce" />
                            </span>
                        </motion.button>

                        <motion.a
                            href="#pricing"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl backdrop-blur-md
                                bg-white/[0.05] hover:bg-white/[0.1]
                                border border-white/[0.1] hover:border-white/[0.2]
                                shadow-lg shadow-black/20 hover:shadow-white/[0.1]
                                ring-1 ring-white/[0.05]
                                text-zinc-400 hover:text-white font-bold text-lg
                                transition-all duration-300
                                flex items-center gap-2 group"
                        >
                            Ver detalhes do plano
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                    </div>

                    {/* Trust Signals */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500">
                        <div className="flex items-center gap-2">
                            <Shield size={18} className="text-blue-500" />
                            <span className="text-sm font-semibold uppercase tracking-wider">7 dias de garantia</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={18} className="text-emerald-500" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Metodologia Validada</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-500" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Plataforma nº1</span>
                        </div>
                    </div>
                </motion.div>

                {/* MAIN PRODUCT PREVIEW - The "Dopamine Shot" */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ perspective: 2000 }}
                    className="relative max-w-6xl mx-auto mt-12 group"
                >
                    {/* Glowing Backlight */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-emerald-600/30 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl overflow-hidden aspect-[16/9] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                        {/* Chrome bar */}
                        <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-6 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="mx-auto w-64 h-5 rounded-md bg-white/5 border border-white/10" />
                        </div>

                        {/* Visual Mockup Content */}
                        <div className="p-8 h-full flex flex-col">
                            <div className="grid grid-cols-12 gap-6 flex-grow">
                                {/* Dashboard Mock Elements */}
                                <div className="col-span-3 space-y-4">
                                    <div className="h-32 rounded-2xl bg-white/5 border border-white/10 p-4">
                                        <div className="w-1/2 h-4 bg-white/20 rounded mb-4" />
                                        <div className="w-full h-2 bg-blue-500/40 rounded mb-2" />
                                        <div className="w-3/4 h-2 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-48 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-white/10 p-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 mb-4" />
                                        <div className="space-y-2">
                                            <div className="w-full h-2 bg-white/20 rounded" />
                                            <div className="w-full h-2 bg-white/20 rounded" />
                                            <div className="w-2/3 h-2 bg-white/20 rounded" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-9 flex flex-col gap-6">
                                    <div className="h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center px-6 justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20" />
                                            <div className="space-y-2 flex flex-col justify-center">
                                                <div className="w-32 h-3 bg-white/40 rounded" />
                                                <div className="w-20 h-2 bg-white/10 rounded" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white/5" />
                                            <div className="w-8 h-8 rounded-lg bg-white/5" />
                                            <div className="w-8 h-8 rounded-lg bg-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex-grow rounded-2xl bg-zinc-950/50 border border-white/10 p-8 flex items-center justify-center relative overflow-hidden group/chart">
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent" />
                                        {/* Fake Chart Lines */}
                                        <svg className="w-full h-48 text-blue-500/50" viewBox="0 0 400 100">
                                            <motion.path
                                                d="M0 80 Q 50 20 100 70 T 200 40 T 300 80 T 400 20"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-5xl font-black text-white mb-2">+42%</div>
                                                <div className="text-sm font-bold text-blue-400 uppercase tracking-widest">Aumento de Retenção</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;

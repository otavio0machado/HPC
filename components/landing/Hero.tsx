import React, { useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Zap, Play, Brain, Sparkles, ArrowRight, Star, TrendingUp, Users, BookOpen } from 'lucide-react';

interface HeroProps {
    onCtaClick: () => void;
}

// Animated counter component
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({
    end,
    duration = 2000,
    suffix = ''
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        const timer = setTimeout(() => requestAnimationFrame(animate), 500);
        return () => clearTimeout(timer);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
    const { scrollY } = useScroll();
    const [isHovered, setIsHovered] = useState(false);

    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -80]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const scale = useTransform(scrollY, [0, 400], [1, 0.92]);

    // Optimized particles
    const particles = useMemo(() => {
        return [...Array(30)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100 + 80}%`,
            duration: Math.random() * 25 + 20,
            delay: Math.random() * 15,
            size: Math.random() * 3 + 1
        }));
    }, []);

    // Floating orbs
    const orbs = useMemo(() => [
        { color: 'from-blue-500 to-cyan-400', size: 80, x: '10%', y: '20%', delay: 0 },
        { color: 'from-purple-500 to-pink-400', size: 60, x: '85%', y: '30%', delay: 1 },
        { color: 'from-emerald-500 to-teal-400', size: 50, x: '70%', y: '70%', delay: 2 },
        { color: 'from-orange-500 to-amber-400', size: 40, x: '20%', y: '75%', delay: 3 },
    ], []);

    const stats = useMemo(() => [
        { icon: Users, value: 2847, suffix: '+', label: 'Estudantes Ativos' },
        { icon: Star, value: 98, suffix: '%', label: 'Taxa de Aprovação' },
        { icon: TrendingUp, value: 4.9, suffix: '', label: 'Avaliação Média' },
    ], []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-24">
            {/* === AMBIENT BACKGROUND LAYER === */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient orbs */}
                {orbs.map((orb, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.2, 1],
                            x: [0, 20, 0],
                            y: [0, -15, 0]
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: orb.delay
                        }}
                        className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-[80px] opacity-30`}
                        style={{
                            width: orb.size,
                            height: orb.size,
                            left: orb.x,
                            top: orb.y,
                        }}
                    />
                ))}

                {/* Rising particles */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            y: [0, -1200],
                            opacity: [0, 0.5, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay
                        }}
                        className="absolute rounded-full bg-gradient-to-t from-blue-400 to-purple-400 dark:from-blue-500/40 dark:to-purple-500/40"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                        }}
                    />
                ))}
            </div>

            {/* Animated gradient mesh */}
            <motion.div
                style={{ y: y1 }}
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.25, 0.4, 0.25],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-15%] w-[700px] h-[700px] bg-gradient-to-br from-blue-500/25 via-cyan-400/20 to-transparent rounded-full blur-[100px] -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.35, 0.2],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-tl from-purple-500/20 via-pink-400/15 to-transparent rounded-full blur-[120px] -z-10"
            />

            {/* === MAIN CONTENT === */}
            <motion.div
                style={{ opacity, scale }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center"
            >
                {/* Premium Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative glass-hydro px-6 py-3 rounded-full flex items-center gap-4 cursor-default group">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Brain size={16} className="text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-blue-500/30"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                                Plataforma de Alta Performance
                            </span>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Headline - Cinematic */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-8"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.95]">
                        <motion.span
                            className="block"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Domine o
                        </motion.span>
                        <motion.span
                            className="block relative"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                                    Vestibular
                                </span>
                                <motion.div
                                    animate={{ scaleX: [0, 1], opacity: [0, 0.3, 0.3] }}
                                    transition={{ duration: 1.2, delay: 1 }}
                                    className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 -z-10 rounded-full blur-sm"
                                    style={{ originX: 0 }}
                                />
                            </span>
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 font-medium"
                >
                    A plataforma que une <span className="text-zinc-900 dark:text-white font-semibold">Inteligência Artificial</span>,
                    {' '}<span className="text-zinc-900 dark:text-white font-semibold">Neurociência</span> e
                    {' '}<span className="text-zinc-900 dark:text-white font-semibold">Metodologia Comprovada</span> para
                    transformar seu estudo em resultados extraordinários.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto"
                >
                    {/* Primary CTA */}
                    <motion.button
                        onClick={onCtaClick}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative group px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden w-full sm:w-auto"
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            animate={{ x: isHovered ? ['-100%', '200%'] : '-100%' }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                        <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                            Começar Gratuitamente
                            <motion.span
                                animate={{ x: isHovered ? 5 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </motion.span>
                        </span>
                    </motion.button>

                    {/* Secondary CTA */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="glass-card px-8 py-5 rounded-2xl font-semibold text-lg text-zinc-700 dark:text-zinc-300 flex items-center gap-3 hover:text-zinc-900 dark:hover:text-white transition-all w-full sm:w-auto justify-center group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                            <Play className="w-4 h-4 fill-current group-hover:text-white transition-colors" />
                        </div>
                        Ver Demonstração
                    </motion.button>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20"
                >
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 + idx * 0.1 }}
                            className="text-center group"
                        >
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <stat.icon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* === PREMIUM APP MOCKUP === */}
                <motion.div
                    initial={{ opacity: 0, y: 80, rotateX: 15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-5xl mx-auto"
                    style={{ perspective: 2000 }}
                >
                    {/* Glow effects behind mockup */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-60" />

                    {/* Main Window */}
                    <div className="relative glass-spatial rounded-[32px] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30">
                        {/* Window Header */}
                        <div className="h-14 border-b border-white/30 dark:border-white/10 flex items-center px-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
                            {/* Traffic Lights */}
                            <div className="flex gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className="w-3 h-3 rounded-full bg-red-400 cursor-pointer"
                                />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer"
                                />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className="w-3 h-3 rounded-full bg-green-400 cursor-pointer"
                                />
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-center gap-8 mx-auto text-[11px] uppercase tracking-widest font-bold">
                                <span className="text-zinc-900 dark:text-white flex items-center gap-2">
                                    <BookOpen size={12} />
                                    Dashboard
                                </span>
                                <span className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors">Biblioteca</span>
                                <span className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors">Tutores IA</span>
                            </div>

                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white shadow-md" />
                        </div>

                        {/* Window Content */}
                        <div className="bg-zinc-50/80 dark:bg-[#0a0a0c]/90 p-6 md:p-8 min-h-[450px] relative">
                            <div className="grid grid-cols-12 gap-6 h-full">
                                {/* Sidebar */}
                                <div className="col-span-3 hidden md:flex flex-col gap-4">
                                    {[
                                        { label: 'Dashboard', active: true },
                                        { label: 'Flashcards', active: false },
                                        { label: 'Questões', active: false },
                                        { label: 'Notas', active: false },
                                        { label: 'Estatísticas', active: false },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.4 + i * 0.1 }}
                                            className={`h-11 w-full rounded-xl flex items-center px-4 gap-3 cursor-pointer transition-all ${item.active
                                                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400'
                                                : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-blue-500' : 'bg-zinc-400'}`} />
                                            <span className="text-xs font-semibold">{item.label}</span>
                                        </motion.div>
                                    ))}

                                    {/* AI Card */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 2 }}
                                        className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 relative overflow-hidden"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                                        />
                                        <Sparkles className="w-6 h-6 text-blue-500 mb-2" />
                                        <div className="text-xs font-bold text-zinc-900 dark:text-white mb-1">Tutor IA</div>
                                        <div className="text-[10px] text-zinc-500">Disponível 24h</div>
                                    </motion.div>
                                </div>

                                {/* Main Content */}
                                <div className="col-span-12 md:col-span-9 flex flex-col gap-5">
                                    {/* Header */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.5 }}
                                        className="flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="text-lg font-bold text-zinc-900 dark:text-white">Boa tarde, Estudante! 👋</div>
                                            <div className="text-xs text-zinc-500">Continue de onde parou</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-9 px-4 rounded-lg bg-black/5 dark:bg-white/5 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-medium">7 dias ativos</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Cards Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Progress Card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.6 }}
                                            className="col-span-2 h-36 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg p-5 relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Progresso Semanal</div>
                                                    <div className="text-2xl font-black text-zinc-900 dark:text-white">78%</div>
                                                </div>
                                                <div className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                                    <TrendingUp size={12} />
                                                    +12%
                                                </div>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '78%' }}
                                                    transition={{ duration: 1.5, delay: 2 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Active Card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.7 }}
                                            className="col-span-1 h-36 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 relative overflow-hidden"
                                        >
                                            <motion.div
                                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                                transition={{ duration: 5, repeat: Infinity }}
                                            >
                                                <Zap className="w-6 h-6 fill-current mb-3" />
                                            </motion.div>
                                            <div className="font-black text-xl">Ativo</div>
                                            <div className="text-xs opacity-80">Mode Flow</div>
                                            <Sparkles className="absolute -bottom-2 -right-2 opacity-20" size={60} />
                                        </motion.div>
                                    </div>

                                    {/* Chart */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.8 }}
                                        className="flex-grow min-h-[160px] rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg p-5 flex flex-col"
                                    >
                                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6">Desempenho Mensal</div>
                                        <div className="flex-grow flex items-end justify-between gap-2 px-2">
                                            {[35, 55, 42, 68, 52, 75, 62, 82, 70, 88, 65, 92].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ duration: 0.8, delay: 2.2 + (i * 0.05) }}
                                                    className="w-full bg-gradient-to-t from-blue-500/60 to-purple-500/40 dark:from-blue-500/40 dark:to-purple-500/30 rounded-t-md hover:from-blue-500 hover:to-purple-500 transition-all cursor-pointer"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-4 top-1/4 glass-card p-4 rounded-2xl shadow-xl hidden lg:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500">Taxa de Acerto</div>
                                <div className="text-lg font-bold text-zinc-900 dark:text-white">94.2%</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -left-4 bottom-1/4 glass-card p-4 rounded-2xl shadow-xl hidden lg:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500">Flashcards</div>
                                <div className="text-lg font-bold text-zinc-900 dark:text-white">+248 hoje</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { gamificationService } from '../../services/gamificationService';

interface FocusModeProps {
    onClose: () => void;
    onSessionComplete: (minutes: number) => void;
    userId?: string;
}

const FOCUS_QUOTES = [
    "A disciplina é a ponte entre metas e realizações.",
    "O foco é a habilidade de dizer não ao que não importa.",
    "Onde a atenção vai, a energia flui.",
    "A calma é um superpoder em um mundo barulhento.",
    "Sua mente é para tener ideias, não para guardá-las.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Estude enquanto eles dormem. Trabalhe enquanto eles se divertem."
];

const FocusMode: React.FC<FocusModeProps> = ({ onClose, onSessionComplete, userId }) => {
    // Timer State
    const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [initialTime, setInitialTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Visual State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % FOCUS_QUOTES.length);
        }, 15000);
        return () => clearInterval(quoteInterval);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleComplete = () => {
        setIsRunning(false);
        if (mode === 'focus') {
            const minutes = initialTime / 60;
            onSessionComplete(minutes);
            setSessionsCompleted(prev => prev + 1);

            // Gamification
            if (userId) {
                gamificationService.addXP(userId, Math.round(minutes * 12), 'Sessão de Foco High Performance');
            }

            const isLongBreak = (sessionsCompleted + 1) % 4 === 0;
            if (isLongBreak) {
                setMode('longBreak');
                setTimeLeft(15 * 60);
                setInitialTime(15 * 60);
                toast.success("Excelência atingida! Hora de uma pausa longa (15 min).");
            } else {
                setMode('shortBreak');
                setTimeLeft(5 * 60);
                setInitialTime(5 * 60);
                toast.success("Bloco de foco concluído! Faça uma pausa de 5 min.");
            }
        } else {
            setMode('focus');
            setTimeLeft(25 * 60);
            setInitialTime(25 * 60);
            toast.success("Pausa finalizada. Retornando ao estado de Deep Work.");
        }
    };

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => { setIsRunning(false); setTimeLeft(initialTime); };
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                toast.error("Erro ao entrar em tela cheia");
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-center overflow-hidden font-sans"
        >
            {/* --- VisionOS Background System --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Dynamic Surface Layer */}
                <div className={`absolute inset-0 transition-all duration-[3s] ease-in-out opacity-40
                    ${mode === 'focus' ? 'bg-gradient-to-tr from-blue-900/40 via-black to-indigo-900/40' : 'bg-gradient-to-tr from-emerald-900/40 via-black to-teal-900/40'}`}
                />

                {/* Animated Orbs for Depth */}
                <motion.div
                    animate={{
                        x: [0, 80, -80, 0],
                        y: [0, -100, 100, 0],
                        scale: [1, 1.2, 0.8, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px]
                        ${mode === 'focus' ? 'bg-blue-600/30' : 'bg-emerald-500/30'}`}
                />

                <motion.div
                    animate={{
                        x: [0, -100, 100, 0],
                        y: [0, 120, -120, 0],
                        scale: [1.2, 0.9, 1.1, 1.2],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className={`absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-[140px]
                        ${mode === 'focus' ? 'bg-indigo-500/20' : 'bg-teal-500/20'}`}
                />

                {/* Main Breathing Core */}
                <motion.div
                    animate={{
                        scale: isRunning ? [1, 1.05, 1] : 1,
                        opacity: isRunning ? [0.3, 0.5, 0.3] : 0.3
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center justify-center`}
                >
                    <div className={`w-[85vh] h-[85vh] rounded-full blur-[120px] transition-colors duration-[2s]
                        ${mode === 'focus' ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`} />
                </motion.div>

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Top Toolbar - Floating Spatial Style */}
            <div className="absolute top-10 flex items-center gap-3 z-20">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-spatial rounded-full p-1.5 flex items-center gap-1.5 border-white/10 shadow-2xl"
                >
                    <button
                        onClick={handleFullscreen}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-white/50 hover:text-white"
                        title="Tela Cheia"
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/30 transition-all text-red-500/70 hover:text-red-500"
                        title="Sair"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mb-6"
                    >
                        <div className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.4em] uppercase border backdrop-blur-xl shadow-2xl transition-all duration-700
                            ${mode === 'focus' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>
                            {mode === 'focus' ? 'Flow State Active' : mode === 'shortBreak' ? 'Mental Refresh' : 'Deep Restore'}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* The Timer - Epic VisionOS Style */}
                <motion.div
                    animate={{
                        scale: isRunning ? [1, 1.01, 1] : 1,
                        filter: isRunning ? 'drop-shadow(0 0 40px rgba(255,255,255,0.1))' : 'none'
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="text-spatial text-[14rem] md:text-[20rem] font-bold tracking-tighter tabular-nums leading-none select-none text-white/95 drop-shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    {formatTime(timeLeft)}
                </motion.div>

                {/* Session Stats */}
                <div className="mt-4 flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <span className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-[9px]">Sessão</span>
                        <span className="text-white/60 font-mono text-lg">{sessionsCompleted + 1}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-white/5" />
                    <div className="flex flex-col items-center">
                        <span className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-[9px]">Meta</span>
                        <span className="text-white/60 font-mono text-lg">4</span>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="mt-20 flex items-center gap-12">
                    <button
                        onClick={toggleTimer}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group
                            ${isRunning ? 'bg-zinc-900 border border-white/10 text-white' : 'bg-white text-black'}`}
                    >
                        {isRunning ? <Pause size={40} className="fill-current" /> : <Play size={40} className="ml-1 fill-current" />}

                        {/* Interactive Aura */}
                        <div className={`absolute -inset-4 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700 blur-2xl
                            ${isRunning ? 'bg-zinc-500' : 'bg-white'}`} />
                    </button>

                    <button
                        onClick={resetTimer}
                        className="w-16 h-16 rounded-full glass-spatial hover:bg-white/10 text-white/30 hover:text-white transition-all flex items-center justify-center border-white/5 shadow-xl"
                    >
                        <RotateCcw size={22} />
                    </button>
                </div>
            </div>

            {/* Quote System */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={quoteIndex}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 1.5 }}
                    className="absolute bottom-24 text-center max-w-2xl px-12 select-none"
                >
                    <p className="text-spatial text-zinc-400 font-medium text-xl leading-relaxed italic opacity-80">
                        "{FOCUS_QUOTES[quoteIndex]}"
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Progress Dots - Spatial Indicators */}
            <div className="absolute bottom-12 flex gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="relative">
                        <div
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-[2s] ease-out
                                ${i < sessionsCompleted ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]' : 'bg-white/10'}`}
                        />
                        {i === sessionsCompleted && isRunning && (
                            <motion.div
                                layoutId="active-dot"
                                className="absolute inset-0 bg-blue-400 rounded-full blur-sm"
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default FocusMode;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { gamificationService } from '../../services/gamificationService';

interface FocusModeProps {
    onClose: () => void;
    onSessionComplete: (minutes: number) => void;
    userId?: string;
}

const AMBIENT_SOUNDS = [
    { id: 'rain', name: 'Chuva Suave', url: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_3a7631336c.mp3' }, // Placeholder URLs - replace with real assets
    { id: 'binaural', name: 'Ondas Beta (Foco)', url: 'https://cdn.pixabay.com/download/audio/2022/11/02/audio_c36f014841.mp3' },
    { id: 'lofi', name: 'Lo-Fi Lounge', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
];

const FocusMode: React.FC<FocusModeProps> = ({ onClose, onSessionComplete, userId }) => {
    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [initialTime, setInitialTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    // Audio State
    const [isMuted, setIsMuted] = useState(false);
    const [selectedSound, setSelectedSound] = useState(AMBIENT_SOUNDS[0]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Visual State
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Breathing Animation State
    // We'll use a CSS/Motion animation loop

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

    // Handle Audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : 0.3; // Default 30% volume
            if (isRunning && !isMuted) {
                audioRef.current.play().catch(e => console.log("Audio play failed interaction required", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isRunning, isMuted, selectedSound]);

    const handleComplete = () => {
        setIsRunning(false);
        if (mode === 'focus') {
            const minutes = initialTime / 60;
            onSessionComplete(minutes);

            // Gamification Award
            if (userId) {
                const xpEarned = Math.round(minutes * 10);
                gamificationService.addXP(userId, xpEarned, 'Sessão de Foco');
            }

            toast.success("Sessão de foco concluída! Hora da pausa.");
            setMode('break');
            setTimeLeft(5 * 60);
            setInitialTime(5 * 60);
        } else {
            toast.success("Pausa concluída! Vamos voltar ao foco?");
            setMode('focus');
            setTimeLeft(25 * 60);
            setInitialTime(25 * 60);
        }
    };

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(initialTime);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Ambient Animation */}
            <div className="absolute inset-0 z-0">
                <div
                    className={`absolute inset-0 bg-gradient-to-br transition-all duration-[10s] ease-in-out
                        ${mode === 'focus'
                            ? 'from-blue-900/20 via-black to-indigo-900/20'
                            : 'from-green-900/20 via-black to-emerald-900/20'}
                    `}
                />
                {/* Breathing Circle Background */}
                <motion.div
                    animate={{
                        scale: isRunning ? [1, 1.2, 1] : 1,
                        opacity: isRunning ? [0.3, 0.5, 0.3] : 0.3
                    }}
                    transition={{
                        duration: 8, // 4s in 4s out basically
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full blur-[100px]
                        ${mode === 'focus' ? 'bg-blue-600' : 'bg-green-500'}
                    `}
                />
            </div>

            {/* Audio Element */}
            <audio ref={audioRef} src={selectedSound.url} loop />

            {/* Controls Header */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 border border-white/5">
                        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-blue-400 transition-colors">
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <div className="h-4 w-px bg-white/20" />
                        <select
                            value={selectedSound.id}
                            onChange={(e) => setSelectedSound(AMBIENT_SOUNDS.find(s => s.id === e.target.value) || AMBIENT_SOUNDS[0])}
                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                        >
                            {AMBIENT_SOUNDS.map(s => (
                                <option key={s.id} value={s.id} className="text-black">{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={handleFullscreen} className="p-3 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                        {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                    </button>
                    <button onClick={onClose} className="p-3 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors text-white/50">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Timer Display */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    key={mode}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase border ${mode === 'focus' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : 'border-green-500/50 text-green-400 bg-green-500/10'}`}>
                        {mode === 'focus' ? 'Deep Work' : 'Relax Mode'}
                    </span>
                </motion.div>

                <div className="text-[12rem] font-bold tracking-tighter tabular-nums leading-none select-none drop-shadow-2xl font-mono">
                    {formatTime(timeLeft)}
                </div>

                {/* Main Action Button */}
                <div className="mt-12 flex items-center gap-8">
                    <button
                        onClick={toggleTimer}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group
                            ${isRunning
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                : 'bg-white text-black hover:bg-blue-50'
                            }`}
                    >
                        {isRunning ? <Pause size={32} className="fill-current" /> : <Play size={32} className="ml-1 fill-current" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all hover:rotate-180 duration-500"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>
            </div>

            {/* Quote or Motivation */}
            <motion.div
                animate={{ opacity: isRunning ? 0.3 : 1 }}
                className="absolute bottom-12 text-center max-w-md px-4"
            >
                <p className="text-zinc-500 font-medium text-lg">
                    "A calma é a chave para a velocidade mental."
                </p>
            </motion.div>

        </motion.div>
    );
};

export default FocusMode;

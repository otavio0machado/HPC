import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, Mic2, X, ChevronUp, ChevronDown, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../services/audioService';

interface PodcastPlayerProps {
    currentTrack?: { title: string; text: string; author?: string };
    onClose?: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ currentTrack: initialTrack, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [track, setTrack] = useState(initialTrack);
    const [duration, setDuration] = useState(0); // Fake duration for visuals
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (initialTrack) {
            setTrack(initialTrack);
            handlePlay(initialTrack.text);
        }
    }, [initialTrack]);

    const handlePlay = (text = track?.text) => {
        if (!text) return;

        if (isPaused) {
            audioService.resume();
            setIsPlaying(true);
            setIsPaused(false);
        } else {
            audioService.speak({
                text: text,
                onStart: () => {
                    setIsPlaying(true);
                    setIsPaused(false);
                    setDuration(text.length / 15); // Rough estimate of seconds
                },
                onEnd: () => {
                    setIsPlaying(false);
                    setIsPaused(false);
                    setProgress(100);
                },
                onError: (e) => {
                    console.error("Speech error", e);
                    setIsPlaying(false);
                }
            });
        }
    };

    const handlePause = () => {
        audioService.pause();
        setIsPlaying(false);
        setIsPaused(true);
    };

    const handleStop = () => {
        audioService.stop();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
    };

    // Fake progress bar effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 100 : prev + (100 / duration) * 0.1));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, duration]);

    if (!track) return null;

    return (
        <motion.div
            layout
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-spring
                ${isExpanded ? 'w-96' : 'w-80'}
            `}
        >
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-[24px] overflow-hidden">

                {/* Expanded View Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-6 border-b border-white/10"
                        >
                            <div className="w-full aspect-square bg-gradient-to-tr from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                                <Mic2 size={48} className="text-white drop-shadow-lg" />
                                {isPlaying && (
                                    <div className="absolute bottom-4 right-4 flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [10, 20, 10] }}
                                                transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                                                className="w-1 bg-white/50 rounded-full"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white truncate text-center">{track.title}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">{track.author || "AI Narrator"}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Compact Player / Controls */}
                <div className="p-4 flex items-center gap-4">

                    {!isExpanded && (
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shrink-0">
                            <Mic2 size={20} className="text-white" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
                        {!isExpanded && (
                            <>
                                <h4 className="font-bold text-zinc-900 dark:text-white text-sm truncate">{track.title}</h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Tocando agora...</p>
                            </>
                        )}
                        {isExpanded && (
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                        {!isExpanded && (
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={isPlaying ? handlePause : () => handlePlay()}
                            className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 rounded-full transition-colors text-zinc-900 dark:text-white"
                        >
                            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
                        </button>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        </button>

                        <button
                            onClick={() => { handleStop(); onClose && onClose(); }}
                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PodcastPlayer;

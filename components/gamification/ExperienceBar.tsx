import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gamificationService, UserLevel } from '../../services/gamificationService';

interface ExperienceBarProps {
    userId: string;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({ userId }) => {
    const [levelData, setLevelData] = useState<UserLevel | null>(null);

    useEffect(() => {
        // Initial load
        setLevelData(gamificationService.getLevelData(userId));

        // Listen for updates
        const handleUpdate = (e: CustomEvent) => setLevelData(e.detail);
        const handleLevelUp = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#8b5cf6', '#10b981']
            });
        };

        window.addEventListener('xp-update', handleUpdate as EventListener);
        window.addEventListener('level-up', handleLevelUp as EventListener);

        return () => {
            window.removeEventListener('xp-update', handleUpdate as EventListener);
            window.removeEventListener('level-up', handleLevelUp as EventListener);
        };
    }, [userId]);

    if (!levelData) return null;

    const progressPercent = (levelData.currentXP / levelData.nextLevelXP) * 100;

    return (
        <div className="w-full px-2 py-3">
            <div className="flex items-center justify-between mb-1.5 px-1">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                        {levelData.level}
                    </div>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        Nível {levelData.level}
                    </span>
                </div>
                <span className="text-[10px] font-medium text-zinc-400">
                    {Math.floor(levelData.currentXP)} / {levelData.nextLevelXP} XP
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
                {/* Liquid Progress Fill */}
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />

                {/* Shine Effect */}
                <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                {/* Particle effect hint (optional) */}
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]" style={{ left: `${progressPercent}%` }} />
            </div>
        </div>
    );
};

export default ExperienceBar;

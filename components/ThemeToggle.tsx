import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-full 
                transition-all duration-300 group overflow-hidden
                ${isDark
                    ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.1] hover:border-white/[0.2]'
                    : 'bg-black/[0.03] hover:bg-black/[0.05] border-black/[0.08] hover:border-black/[0.12]'
                }
                border backdrop-blur-md shadow-lg
                ${isDark
                    ? 'shadow-black/20 hover:shadow-white/[0.1]'
                    : 'shadow-black/5 hover:shadow-black/10'
                }
                ring-1 ${isDark ? 'ring-white/[0.05]' : 'ring-black/[0.03]'}
                ${className}`}
            aria-label={`Mudar para modo ${isDark ? 'claro' : 'escuro'}`}
        >
            {/* Background Gradient Effect */}
            <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    ${isDark
                        ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
                        : 'bg-gradient-to-r from-amber-400/10 to-orange-400/10'
                    }`}
            />

            {/* Toggle Track */}
            <div className="relative z-10">
                <motion.div
                    className={`relative w-11 h-6 rounded-full transition-all duration-500
                        ${isDark
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
                            : 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg shadow-amber-500/30'
                        }`}
                    whileHover={{ scale: 1.05 }}
                >
                    {/* Shimmer Effect */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />

                    {/* Toggle Thumb with Icon */}
                    <motion.div
                        className={`absolute top-0.5 w-5 h-5 rounded-full shadow-xl
                            flex items-center justify-center
                            ${isDark ? 'bg-zinc-900' : 'bg-white'}
                            backdrop-blur-md`}
                        animate={{
                            x: isDark ? 22 : 2,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 700,
                            damping: 35,
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {isDark ? (
                                <motion.div
                                    key="moon"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Moon
                                        className="text-blue-400"
                                        size={12}
                                        fill="currentColor"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="sun"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Sun
                                        className="text-amber-500"
                                        size={12}
                                        fill="currentColor"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>

            {/* Optional Label */}
            {showLabel && (
                <motion.span
                    className={`relative z-10 text-xs font-semibold tracking-wide
                        ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
                        transition-colors duration-300`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {isDark ? 'Escuro' : 'Claro'}
                </motion.span>
            )}
        </motion.button>
    );
};

export default ThemeToggle;

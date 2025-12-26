import React from 'react';
import { motion } from 'framer-motion';
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
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isDark
                    ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                    : 'bg-white border-zinc-300 hover:border-zinc-400'
                } ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {/* Toggle Track */}
            <div
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isDark ? 'bg-blue-600' : 'bg-amber-400'
                    }`}
            >
                {/* Toggle Thumb */}
                <motion.div
                    layout
                    className={`absolute top-1 w-4 h-4 rounded-full shadow-lg transition-colors duration-300 ${isDark ? 'bg-zinc-900' : 'bg-white'
                        }`}
                    animate={{
                        x: isDark ? 28 : 4,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                    }}
                />
            </div>

            {/* Icon Animation */}
            <motion.div
                className="relative w-5 h-5"
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {isDark ? (
                    <Moon
                        className="absolute inset-0 text-blue-400"
                        size={20}
                        fill="currentColor"
                    />
                ) : (
                    <Sun
                        className="absolute inset-0 text-amber-500"
                        size={20}
                        fill="currentColor"
                    />
                )}
            </motion.div>

            {/* Optional Label */}
            {showLabel && (
                <span
                    className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'
                        }`}
                >
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </motion.button>
    );
};

export default ThemeToggle;

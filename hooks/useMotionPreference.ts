import { useState, useEffect } from 'react';

/**
 * Hook to detect user's motion preference for accessibility
 * Returns true if user prefers reduced motion
 */
export const usePrefersReducedMotion = (): boolean => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            // Legacy browsers
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    return prefersReducedMotion;
};

/**
 * Get animation duration based on user preference
 * Returns 0 if user prefers reduced motion, otherwise returns the specified duration
 */
export const useAnimationDuration = (duration: number = 0.3): number => {
    const prefersReducedMotion = usePrefersReducedMotion();
    return prefersReducedMotion ? 0 : duration;
};

/**
 * Get transition configuration based on user preference
 */
export const useAnimationConfig = () => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return {
        duration: prefersReducedMotion ? 0 : 0.3,
        type: prefersReducedMotion ? 'tween' : 'spring',
        stiffness: prefersReducedMotion ? 0 : 400,
        damping: prefersReducedMotion ? 0 : 30,
    };
};

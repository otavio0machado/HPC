import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);

        // Modern browsers support confirm
        try {
            media.addEventListener('change', listener);
        } catch (e) {
            // Fallback for older browsers
            media.addListener(listener);
        }

        return () => {
            window.removeEventListener('resize', listener);
            try {
                media.removeEventListener('change', listener);
            } catch (e) {
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
}

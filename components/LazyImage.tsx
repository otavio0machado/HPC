import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    width?: number | string;
    height?: number | string;
    onLoad?: () => void;
    onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholder,
    width,
    height,
    onLoad,
    onError,
}) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before the image enters viewport
            }
        );

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Load image when in view
    useEffect(() => {
        if (!isInView) return;

        const img = new Image();
        img.src = src;

        img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            onLoad?.();
        };

        img.onerror = () => {
            onError?.();
        };
    }, [isInView, src, onLoad, onError]);

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
        >
            {/* Placeholder/Shimmer */}
            {!isLoaded && (
                <div className="absolute inset-0 shimmer bg-zinc-800/50" />
            )}

            {/* Image */}
            {imageSrc && (
                <motion.img
                    src={imageSrc}
                    alt={alt}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                        opacity: isLoaded ? 1 : 0,
                        scale: isLoaded ? 1 : 1.1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default LazyImage;

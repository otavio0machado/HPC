import React, { useRef, useState, useEffect } from 'react';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
    spotlightSize?: number;
    borderGlow?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
    children,
    className = '',
    intensity = 'medium',
    spotlightSize = 800,
    borderGlow = true,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const intensityValues = {
        low: 0.04,
        medium: 0.06,
        high: 0.1,
    };

    const glowOpacity = intensityValues[intensity];

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setMousePosition({ x, y });
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
            } as React.CSSProperties}
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(${spotlightSize}px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,${glowOpacity}), transparent 40%)`,
                    opacity: isHovering ? 1 : 0,
                    zIndex: 10
                }}
            />

            {/* Border Glow Effect - Simulating Physics */}
            {borderGlow && (
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(${spotlightSize * 0.6}px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.4), transparent 40%)`,
                        opacity: isHovering ? 1 : 0,
                        zIndex: 20,
                        maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                        padding: '1px',
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

export const SpotlightButton: React.FC<SpotlightCardProps> = (props) => {
    return (
        <SpotlightCard
            {...props}
            intensity="low"
            spotlightSize={400}
            className={`${props.className || ''}`}
        />
    );
};

export default SpotlightCard;

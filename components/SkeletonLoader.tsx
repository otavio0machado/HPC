import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | 'circle' | 'rectangle' | 'list';
    width?: string;
    height?: string;
    count?: number;
    className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'rectangle',
    width = '100%',
    height = '20px',
    count = 1,
    className = '',
}) => {
    const baseClasses = 'shimmer rounded';

    const getVariantClasses = () => {
        switch (variant) {
            case 'card':
                return 'w-full h-48 rounded-2xl';
            case 'text':
                return 'h-4 rounded';
            case 'circle':
                return 'rounded-full';
            case 'list':
                return 'h-16 rounded-xl mb-3';
            default:
                return 'rounded-lg';
        }
    };

    const skeletonStyle = {
        width: variant === 'circle' ? height : width,
        height,
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${baseClasses} ${getVariantClasses()} ${className} bg-zinc-800/50`}
                    style={variant !== 'card' && variant !== 'list' ? skeletonStyle : undefined}
                />
            ))}
        </>
    );
};

// Skeleton presets para componentes comuns
export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6 p-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
                <SkeletonLoader variant="text" width="200px" height="32px" />
                <SkeletonLoader variant="text" width="150px" height="16px" />
            </div>
            <SkeletonLoader variant="circle" height="48px" />
        </div>

        {/* Navigation Skeleton */}
        <div className="flex gap-2 mb-8">
            <SkeletonLoader width="100px" height="40px" count={8} className="inline-block mr-2" />
        </div>

        {/* Widget Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" count={6} />
        </div>
    </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <SkeletonLoader variant="circle" height="40px" />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader variant="text" width="60%" height="20px" />
                        <SkeletonLoader variant="text" width="40%" height="14px" />
                    </div>
                </div>
                <SkeletonLoader variant="text" count={3} className="mb-2" />
                <SkeletonLoader width="100px" height="36px" />
            </div>
        ))}
    </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-3">
        <SkeletonLoader variant="list" count={count} />
    </div>
);

export default SkeletonLoader;

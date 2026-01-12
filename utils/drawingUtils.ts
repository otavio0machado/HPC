import { StrokeOptions } from 'perfect-freehand';

export function getSvgPathFromStroke(stroke: number[][]): string {
    if (!stroke.length) return '';

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ['M', ...stroke[0], 'Q']
    );

    d.push('Z');
    return d.join(' ');
}

// Smoothing algorithm using moving average for better handwriting
export function smoothPoints(points: [number, number, number][], windowSize: number = 3): [number, number, number][] {
    if (points.length < windowSize) return points;

    const result: [number, number, number][] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < points.length; i++) {
        let sumX = 0, sumY = 0, sumP = 0;
        let count = 0;

        for (let j = Math.max(0, i - halfWindow); j <= Math.min(points.length - 1, i + halfWindow); j++) {
            sumX += points[j][0];
            sumY += points[j][1];
            sumP += points[j][2];
            count++;
        }

        result.push([sumX / count, sumY / count, sumP / count]);
    }

    return result;
}

// Catmull-Rom spline interpolation for smoother curves
export function catmullRomSpline(points: [number, number, number][], segments: number = 4): [number, number, number][] {
    if (points.length < 4) return points;

    const result: [number, number, number][] = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[Math.min(points.length - 1, i + 1)];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        for (let t = 0; t < segments; t++) {
            const s = t / segments;
            const s2 = s * s;
            const s3 = s2 * s;

            const x = 0.5 * (
                (2 * p1[0]) +
                (-p0[0] + p2[0]) * s +
                (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 +
                (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3
            );

            const y = 0.5 * (
                (2 * p1[1]) +
                (-p0[1] + p2[1]) * s +
                (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 +
                (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3
            );

            // Interpolate pressure linearly
            const p = p1[2] + (p2[2] - p1[2]) * s;

            result.push([x, y, p]);
        }
    }

    result.push(points[points.length - 1]);
    return result;
}

// Pressure normalization with curve for more natural feel
export function normalizePressure(pressure: number, sensitivity: number = 1.0): number {
    // Apply curve for more responsive pressure at low values
    const adjusted = Math.pow(pressure, 1 / sensitivity);
    return Math.max(0.1, Math.min(1.0, adjusted));
}

// Palm rejection - detect if touch is likely a palm (large contact, low velocity, edge of screen)
export function isPalmTouch(
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number,
    radiusX?: number,
    radiusY?: number
): boolean {
    // Large touch area suggests palm
    if (radiusX && radiusY && (radiusX > 20 || radiusY > 20)) {
        return true;
    }

    // Touch near edge often indicates palm resting
    const edgeThreshold = 30;
    if (x < edgeThreshold || x > canvasWidth - edgeThreshold ||
        y > canvasHeight - edgeThreshold) {
        // Only reject if it's a large touch near edge
        if (radiusX && radiusY && (radiusX > 10 || radiusY > 10)) {
            return true;
        }
    }

    return false;
}

// Calculate stroke velocity for dynamic line width
export function calculateVelocity(
    currentPoint: [number, number, number],
    previousPoint: [number, number, number],
    timeDelta: number
): number {
    if (timeDelta === 0) return 0;
    const dx = currentPoint[0] - previousPoint[0];
    const dy = currentPoint[1] - previousPoint[1];
    return Math.sqrt(dx * dx + dy * dy) / timeDelta;
}

// Extended stroke options type to include taper properties
type ExtendedStrokeOptions = StrokeOptions & {
    taperStart?: number;
    taperEnd?: number;
};

// All pen presets with enhanced options
export const PEN_PRESETS: Record<string, ExtendedStrokeOptions> = {
    ballpoint: {
        size: 2,
        thinning: 0,
        smoothing: 0.5,
        streamline: 0.5,
        simulatePressure: true,
    },
    fountain: {
        size: 3,
        thinning: 0.7,
        smoothing: 0.6,
        streamline: 0.6,
        taperStart: 0,
        taperEnd: 50,
        simulatePressure: false,
    },
    brush: {
        size: 8,
        thinning: 0.6,
        smoothing: 0.8,
        streamline: 0.7,
        taperStart: 0,
        taperEnd: 0,
        simulatePressure: false,
    },
    calligraphy: {
        size: 4,
        thinning: 0.95,
        smoothing: 0.4,
        streamline: 0.3,
        taperStart: 100,
        taperEnd: 100,
        simulatePressure: false,
    },
    marker: {
        size: 12,
        thinning: 0.1,
        smoothing: 0.7,
        streamline: 0.5,
        taperStart: 0,
        taperEnd: 0,
        simulatePressure: true,
    },
    felt: {
        size: 6,
        thinning: 0.2,
        smoothing: 0.6,
        streamline: 0.4,
        taperStart: 0,
        taperEnd: 20,
        simulatePressure: true,
    },
    pencil: {
        size: 2,
        thinning: 0.4,
        smoothing: 0.3,
        streamline: 0.2,
        taperStart: 0,
        taperEnd: 0,
        simulatePressure: true,
    },
};

// Color palettes for quick access
export const COLOR_PALETTES = {
    basic: ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'],
    pastel: ['#f0abfc', '#fcd34d', '#a3e635', '#67e8f9', '#c4b5fd', '#fecaca'],
    monochrome: ['#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
    neon: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff', '#06d6a0'],
    earth: ['#3d405b', '#81b29a', '#e07a5f', '#f4f1de', '#2b2d42', '#d62828'],
};

// Paper styles configuration
export const PAPER_STYLES = {
    blank: {
        pattern: 'none',
    },
    ruled: {
        pattern: 'horizontal-lines',
        spacing: 30,
        lineWidth: 1,
    },
    grid: {
        pattern: 'grid',
        spacing: 25,
        lineWidth: 1,
    },
    dot: {
        pattern: 'dots',
        spacing: 25,
        dotSize: 1.5,
    },
    isometric: {
        pattern: 'isometric',
        spacing: 30,
        lineWidth: 1,
    },
    cornell: {
        pattern: 'cornell',
        margins: { left: 100, right: 20, bottom: 150 },
    },
};

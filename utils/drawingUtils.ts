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

export const PEN_PRESETS = {
    ballpoint: {
        size: 2,
        thinning: 0,
        smoothing: 0.5,
        streamline: 0.5,
    } as StrokeOptions,
    fountain: {
        size: 2,
        thinning: 0.9,
        smoothing: 0.6,
        streamline: 0.6,
        taperStart: 0,
        taperEnd: 0,
    } as StrokeOptions,
    brush: {
        size: 4,
        thinning: 0.9,
        smoothing: 0.8,
        streamline: 0.7,
    } as StrokeOptions,
};

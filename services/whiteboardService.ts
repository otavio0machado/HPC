import { supabase } from '../lib/supabase';

export interface CanvasNode {
    id: string;
    type: 'note' | 'card' | 'image' | 'text' | 'sticker';
    x: number;
    y: number;
    content: any; // Text, URL, or Reference ID
    style?: {
        width?: number;
        height?: number;
        color?: string;
        fontSize?: number;
        rotation?: number;
    };
}

export interface InfiniteCanvas {
    id: string;
    userId: string;
    name: string;
    nodes: CanvasNode[];
    updatedAt: number;
}

export const whiteboardService = {
    async fetchCanvases(): Promise<InfiniteCanvas[]> {
        // Mock implementation for MVP - replace with Supabase call later
        // return [];
        const saved = localStorage.getItem('hpc_whiteboards');
        return saved ? JSON.parse(saved) : [];
    },

    async saveCanvas(canvas: InfiniteCanvas): Promise<void> {
        // Mock save
        const saved = await whiteboardService.fetchCanvases();
        const existingIndex = saved.findIndex(c => c.id === canvas.id);

        if (existingIndex >= 0) {
            saved[existingIndex] = { ...canvas, updatedAt: Date.now() };
        } else {
            saved.push({ ...canvas, updatedAt: Date.now() });
        }

        localStorage.setItem('hpc_whiteboards', JSON.stringify(saved));
    },

    async createNode(canvasId: string, node: CanvasNode): Promise<void> {
        const canvases = await whiteboardService.fetchCanvases();
        const canvas = canvases.find(c => c.id === canvasId);
        if (canvas) {
            canvas.nodes.push(node);
            await whiteboardService.saveCanvas(canvas);
        }
    }
};

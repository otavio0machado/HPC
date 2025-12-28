import { supabase } from '../lib/supabase';

export interface CanvasNode {
    id: string;
    type: 'note' | 'card' | 'image' | 'text' | 'sticker';
    x: number;
    y: number;
    content: any;
    style?: {
        width?: number;
        height?: number;
        color?: string;
        fontSize?: number;
        rotation?: number;
    };
}

export interface InfiniteCanvas {
    id: string; // UUID from DB
    userId: string;
    name: string;
    nodes: CanvasNode[];
    updatedAt: number;
}

export const whiteboardService = {
    async fetchCanvases(): Promise<InfiniteCanvas[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('whiteboards')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching whiteboards:', error);
            // Fallback to local storage for offline support/resilience?
            // For now, return empty or try local.
            return [];
        }

        return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            name: d.name,
            nodes: d.nodes as CanvasNode[],
            updatedAt: new Date(d.updated_at).getTime()
        }));
    },

    async saveCanvas(canvas: Partial<InfiniteCanvas> & { nodes: CanvasNode[] }): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Check if update or insert
        if (canvas.id && canvas.id.length > 10) { // Simple UUID check
            // Update
            const { error } = await supabase
                .from('whiteboards')
                .update({
                    name: canvas.name,
                    nodes: canvas.nodes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', canvas.id);

            if (error) {
                console.error("Error updating whiteboard", error);
                return null;
            }
            return canvas.id;
        } else {
            // Create New
            const { data, error } = await supabase
                .from('whiteboards')
                .insert({
                    user_id: user.id,
                    name: canvas.name || 'Novo Quadro',
                    nodes: canvas.nodes
                })
                .select()
                .single();

            if (error) {
                console.error("Error creating whiteboard", error);
                return null;
            }
            return data.id;
        }
    },

    async deleteCanvas(id: string): Promise<void> {
        await supabase.from('whiteboards').delete().eq('id', id);
    }
};

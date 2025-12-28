import { supabase } from '../lib/supabase';

// Helper to determine node color based on different modes
const COLORS = {
    // Subject Colors
    SUBJECT: {
        'Matemática': '#3b82f6', // blue
        'Física': '#8b5cf6', // violet
        'Química': '#ec4899', // pink
        'Biologia': '#10b981', // emerald
        'História': '#f59e0b', // amber
        'Geografia': '#eab308', // yellow
        'Literatura': '#a855f7', // purple
        'Redação': '#ef4444', // red
        'Geral': '#64748b' // slate
    },
    // Heatmap Colors (Next Review Date)
    HEATMAP: {
        FRESH: '#22c55e', // green (far future)
        SOON: '#eab308', // yellow (soon)
        OVERDUE: '#ef4444' // red (overdue)
    },
    TYPE: {
        NOTE: '#3b82f6',
        FLASHCARD: '#f59e0b',
        ERROR: '#ef4444',
    }
};

export interface GraphNode {
    id: string;
    name: string;
    type: 'note' | 'flashcard' | 'error' | 'folder';
    group: string; // Used for clustering
    val: number; // Size
    color?: string; // Override color
    metadata?: any; // metrics, dates, etc
}

export interface GraphLink {
    source: string;
    target: string;
    type?: string;
}

export interface NexusData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export const nexusService = {
    getGraphData: async (mode: 'default' | 'heatmap' | 'detective' = 'default'): Promise<NexusData> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");
            const userId = session.user.id;

            // 1. Fetch Notes (Core Knowledge Nodes)
            const { data: notes, error: notesError } = await supabase
                .from('notes')
                .select('id, name, type, tags, parent_id')
                .eq('user_id', userId);

            if (notesError) throw notesError;

            // 2. Fetch Flashcards (Retention Data)
            const { data: flashcards, error: cardsError } = await supabase
                .from('flashcards')
                .select('*')
                .eq('user_id', userId);

            // 3. Fetch Errors (Detective Data)
            // Errors are in LocalStorage in current implementation according to Dashboard logic?
            // Let's check schema. Dashboard says "hpc_error_list_{id}". 
            // Ah, wait. I can't access localStorage from here easily if this runs in server context? 
            // This is client side, so I can access localStorage.

            const errorsKey = `hpc_error_list_${userId}`;
            const localErrors = typeof window !== 'undefined' ? localStorage.getItem(errorsKey) : null;
            const errors = localErrors ? JSON.parse(localErrors) : [];

            // --- BUILD NODES ---
            let nodes: GraphNode[] = [];
            let links: GraphLink[] = [];

            // A. Process Notes
            notes.forEach((note: any) => {
                // Tag based grouping or default
                const primaryTag = note.tags && note.tags.length > 0 ? note.tags[0] : 'Geral';

                let color = COLORS.SUBJECT[primaryTag as keyof typeof COLORS.SUBJECT] || COLORS.SUBJECT['Geral'];

                // Heatmap Mode Override
                if (mode === 'heatmap') {
                    // Find if this note has associated flashcards?
                    // Since we don't have direct link note->flashcard in schema yet, we use loose name matching or folder matching
                    // For now, let's just make notes neutral and color flashcards vivid
                    color = '#334155'; // Dark slate for context
                }

                nodes.push({
                    id: note.id,
                    name: note.name,
                    type: 'note',
                    group: primaryTag,
                    val: 5,
                    color: color,
                    metadata: { tags: note.tags }
                });

                // Link parent-child
                if (note.parent_id) {
                    links.push({ source: note.parent_id, target: note.id });
                }
            });

            // Central Hub (frontend ensures user_center, but we can rely on it being the root)

            // B. Process Flashcards (Heatmap Mode)
            if (mode === 'heatmap' || mode === 'default') {
                // Create Hub
                if (flashcards && flashcards.length > 0) {
                    nodes.push({ id: 'flashcards_hub', name: 'Decks de Memória', type: 'folder', group: 'System', val: 10, color: '#f59e0b' });
                    // Link hub to user? Front end adds user_center. We can't link to it here if it's not in nodes list yet.
                    // The frontend adds user_center if it's missing.
                    // Let's add user_center here explicitly to be safe and ensure links work.
                }

                flashcards?.forEach((card: any) => {
                    const now = Date.now();
                    let status = 'FRESH';
                    if (card.next_review < now) status = 'OVERDUE';
                    else if (card.next_review < now + 86400000 * 3) status = 'SOON'; // 3 days

                    const cardId = `fc_${card.id}`;
                    nodes.push({
                        id: cardId,
                        name: card.front.substring(0, 20) + '...',
                        type: 'flashcard',
                        group: 'Flashcards',
                        val: 3,
                        color: COLORS.HEATMAP[status as keyof typeof COLORS.HEATMAP],
                        metadata: { review: card.next_review }
                    });

                    // Link to Hub
                    links.push({ source: 'flashcards_hub', target: cardId });
                });
            }

            // C. Process Errors (Detective Mode)
            if (mode === 'detective' || mode === 'default') {
                if (errors.length > 0) {
                    nodes.push({ id: 'errors_hub', name: 'Central de Erros', type: 'folder', group: 'System', val: 10, color: '#ef4444' });
                }

                errors.forEach((err: any) => {
                    const errId = `err_${err.id}`;
                    nodes.push({
                        id: errId,
                        name: err.description,
                        type: 'error',
                        group: 'Errors',
                        val: 6,
                        color: COLORS.TYPE.ERROR,
                        metadata: err
                    });

                    links.push({ source: 'errors_hub', target: errId });

                    // Create "Evidence" links
                    // Search for notes with same subject
                    const relatedNotes = notes.filter((n: any) => n.tags?.includes(err.subject));
                    relatedNotes.forEach((n: any) => {
                        links.push({ source: errId, target: n.id });
                    });
                });
            }

            return { nodes, links };
        } catch (error) {
            console.error("Nexus Data Error:", error);
            return { nodes: [], links: [] };
        }
    }
};

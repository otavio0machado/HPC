import { supabase } from '../lib/supabase';
import { Block } from '../types';
import { JSONContent } from '@tiptap/react';

export const blockService = {
    // Syncs the entire editor state to the blocks table
    async syncBlocks(noteId: string, content: JSONContent) {
        if (!content.content) return;

        // 1. Flatten the tree to a list of blocks
        const blocksToUpsert: Partial<Block>[] = [];

        // Recursive function to traverse TipTap tree
        const traverse = (node: JSONContent, parentId: string | null = null) => {
            // Ensure node has an ID (should be guaranteed by UniqueID extension, but fallback just in case)
            const blockId = node.attrs?.id;

            if (blockId) {
                // Prepare block data
                let textContent = '';
                if (node.content) {
                    // Extract text from children if it's a simple block like paragraph
                    textContent = node.content.filter(c => c.type === 'text').map(c => c.text).join('') || '';
                }

                blocksToUpsert.push({
                    id: blockId,
                    noteId: noteId,
                    type: node.type,
                    content: textContent || JSON.stringify(node.attrs || {}), // Store text or attrs
                    parentBlockId: parentId,
                    properties: node.attrs || {},
                    updatedAt: new Date().toISOString()
                });
            }

            // Process children
            if (node.content) {
                node.content.forEach(child => {
                    // If the child is a block-level element, traverse it
                    // In TipTap, everything is a node. We might only want to index 'paragraph', 'heading', 'bulletList', 'listItem', etc.
                    // For now, let's index everything that has an ID.
                    if (child.attrs?.id || child.type === 'paragraph' || child.type === 'heading' || child.type === 'listItem' || child.type === 'taskItem') {
                        // If it doesn't have an ID yet, we can't sync it properly reliably without UniqueID extension working.
                        // But valid traverse needs parentId.
                        // If uniqueID is working, child.attrs.id will be present.
                        traverse(child, blockId || parentId); // If current node tracked, it becomes parent. If not (e.g. doc), pass null or doc's parent.
                    }
                });
            }
        };

        // 'doc' is the root, but we don't save 'doc' as a block usually, or we can.
        // Let's iterate over top-level nodes.
        content.content.forEach(node => traverse(node, null));

        if (blocksToUpsert.length === 0) return;

        // Get User ID once
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Should handle auth error better but for now safe return

        // 2. Upsert to Supabase
        // We use upsert to handle both inserts and updates
        const { error } = await supabase
            .from('blocks')
            .upsert(
                blocksToUpsert.map(b => ({
                    id: b.id,
                    note_id: b.noteId,
                    type: b.type,
                    content: b.content,
                    parent_block_id: b.parentBlockId,
                    properties: b.properties,
                    updated_at: b.updatedAt,
                    user_id: user.id
                })),
                { onConflict: 'id' }
            );

        if (error) {
            console.error('Error syncing blocks:', error);
        }
    },

    async getBlocks(noteId: string): Promise<Block[]> {
        const { data, error } = await supabase
            .from('blocks')
            .select('*')
            .eq('note_id', noteId);

        if (error) {
            console.error('Error fetching blocks:', error);
            return [];
        }

        return data.map((b: any) => ({
            id: b.id,
            noteId: b.note_id,
            content: b.content,
            type: b.type,
            properties: b.properties,
            parentBlockId: b.parent_block_id,
            rank: b.rank,
            createdAt: b.created_at,
            updatedAt: b.updated_at
        }));
    }
};

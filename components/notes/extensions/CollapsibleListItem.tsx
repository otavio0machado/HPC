import { ListItem } from '@tiptap/extension-list-item';
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { Circle, ChevronRight, ChevronDown } from 'lucide-react';

const CollapsibleListItemComponent = ({ node, updateAttributes, extension }) => {
    const isCollapsed = node.attrs.collapsed;

    const toggleCollapse = () => {
        updateAttributes({ collapsed: !isCollapsed });
    };

    return (
        <NodeViewWrapper as="li" className="relative group flex items-start">
            {/* Bullet / Handle Area */}
            {/* Absolute positioning to place it in the gutter or similar, but standard flow is safer for lists */}
            <div
                className="mr-2 mt-1.5 w-4 h-4 flex items-center justify-center cursor-pointer select-none rounded hover:bg-zinc-800 transition-colors group/handle relative"
                contentEditable={false}
                onClick={(e) => {
                    // If ctrl/cmd click, zoom in
                    if (e.ctrlKey || e.metaKey) {
                        e.stopPropagation();
                        // We dispatch a custom event that NotesEditor will listen to
                        const event = new CustomEvent('zoom-block', { detail: { blockId: node.attrs.id } });
                        window.dispatchEvent(event);
                        return;
                    }
                    toggleCollapse();
                }}
                title="Click to toggle, Ctrl+Click to Zoom In"
                data-collapse-handle=""
            >
                {isCollapsed ? (
                    <ChevronRight size={14} className="text-zinc-400" />
                ) : (
                    <>
                        <div className="group-hover:hidden">
                            <Circle size={6} fill="currentColor" className="text-zinc-500" />
                        </div>
                        <div className="hidden group-hover:block">
                            {/* Show Dot on hover, but maybe different style to indicate zoom potential */}
                            <Circle size={6} className="text-zinc-300 hover:scale-125 transition-transform" />
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <NodeViewContent />
            </div>

            {/* CSS to hide children when collapsed
          We depend on the structure: ListItem -> [Paragraph, List?]
          If we use CSS modules or global styles it is better, but doing it inline is tricky for 'children'.
          The nested list is INSIDE NodeViewContent. 
          We can target it via CSS in the global stylesheet or use a simple style tag here.
      */}
            <style>{`
        li[data-collapsed="true"] > div > div > ul,
        li[data-collapsed="true"] > div > div > ol {
             display: none;
        }
      `}</style>
        </NodeViewWrapper>
    );
};

export const CollapsibleListItem = ListItem.extend({
    name: 'listItem',

    addAttributes() {
        return {
            collapsed: {
                default: false,
                keepOnSplit: false,
                parseHTML: element => element.getAttribute('data-collapsed') === 'true',
                renderHTML: attributes => ({
                    'data-collapsed': attributes.collapsed,
                }),
            },
            id: {
                default: null,
            }
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CollapsibleListItemComponent);
    },

    addKeyboardShortcuts() {
        return {
            'Tab': () => this.editor.commands.sinkListItem('listItem'),
            'Shift-Tab': () => this.editor.commands.liftListItem('listItem'),
            'Mod-ArrowUp': () => this.editor.commands.updateAttributes('listItem', { collapsed: true }),
            'Mod-ArrowDown': () => this.editor.commands.updateAttributes('listItem', { collapsed: false }),
        };
    },
});

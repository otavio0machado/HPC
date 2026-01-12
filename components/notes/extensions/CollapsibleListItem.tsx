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
        <NodeViewWrapper
            as="li"
            className="relative list-none"
            data-collapsed={isCollapsed}
        >
            <div className="flex items-start">
                {/* Bullet / Handle Area */}
                <div
                    className="mr-2 mt-1 w-5 h-5 flex items-center justify-center cursor-pointer select-none rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
                    contentEditable={false}
                    onClick={(e) => {
                        // If ctrl/cmd click, zoom in
                        if (e.ctrlKey || e.metaKey) {
                            e.stopPropagation();
                            const event = new CustomEvent('zoom-block', { detail: { blockId: node.attrs.id } });
                            window.dispatchEvent(event);
                            return;
                        }
                        toggleCollapse();
                    }}
                    title="Clique para recolher/expandir, Ctrl+Clique para zoom"
                >
                    {isCollapsed ? (
                        <ChevronRight size={14} className="text-zinc-400" />
                    ) : (
                        <Circle size={6} fill="currentColor" className="text-zinc-500 dark:text-zinc-400" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <NodeViewContent />
                </div>
            </div>
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

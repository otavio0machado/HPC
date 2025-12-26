import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import DrawingNode from './DrawingNode';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        drawing: {
            setDrawing: () => ReturnType;
        };
    }
}

export default Node.create({
    name: 'drawing',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            lines: {
                default: [],
            },
            width: {
                default: '100%',
            },
            height: {
                default: '300px',
            },
            paperType: {
                default: 'blank',
            },
            paperColor: {
                default: 'white',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'drawing-component',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['drawing-component', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(DrawingNode);
    },

    addCommands() {
        return {
            setDrawing:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'drawing',
                        });
                    },
        };
    },
});

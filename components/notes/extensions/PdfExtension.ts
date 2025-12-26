import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PdfNode from './PdfNode';

export default Node.create({
    name: 'pdf',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: 'PDF Document',
            },
        };
    },

    addStorage() {
        return {
            openPdf: null,
        }
    },

    parseHTML() {
        return [
            {
                tag: 'pdf-component',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['pdf-component', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(PdfNode);
    },
});

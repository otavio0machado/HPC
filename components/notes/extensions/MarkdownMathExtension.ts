import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/**
 * Custom extension to handle LaTeX/Math serialization in Markdown.
 * This ensures that math formulas with $ and $$ delimiters are properly
 * preserved when saving and loading markdown content.
 */

// Regex patterns for math detection
const INLINE_MATH_REGEX = /\$([^\$\n]+)\$/g;
const BLOCK_MATH_REGEX = /\$\$([^\$]+)\$\$/g;

/**
 * Preprocesses markdown content before loading into the editor.
 * Ensures math delimiters are preserved.
 */
export function preprocessMarkdownWithMath(markdown: string): string {
    if (!markdown) return markdown;

    // The tiptap-math-extension should handle $ and $$ automatically
    // We just ensure the content is clean and properly formatted
    return markdown
        // Normalize line endings
        .replace(/\r\n/g, '\n')
        // Ensure block math has proper spacing
        .replace(/([^\n])\$\$/g, '$1\n$$')
        .replace(/\$\$([^\n])/g, '$$\n$1');
}

/**
 * Postprocesses editor content to markdown.
 * Ensures math formulas are properly preserved in the output.
 */
export function postprocessMarkdownWithMath(markdown: string): string {
    if (!markdown) return markdown;

    return markdown
        // Clean up any double escapes that might have been introduced
        .replace(/\\\\\$/g, '\\$')
        // Ensure proper spacing around block math
        .replace(/\n{3,}/g, '\n\n');
}

/**
 * Extracts all math expressions from a markdown string for validation.
 */
export function extractMathExpressions(markdown: string): { inline: string[], block: string[] } {
    const inline: string[] = [];
    const block: string[] = [];

    // Extract block math first (to avoid matching $$ as two $)
    let blockMatch;
    const blockRegex = /\$\$([^\$]+)\$\$/g;
    while ((blockMatch = blockRegex.exec(markdown)) !== null) {
        block.push(blockMatch[1].trim());
    }

    // Remove block math from string before extracting inline
    const withoutBlock = markdown.replace(blockRegex, '');

    // Extract inline math
    let inlineMatch;
    const inlineRegex = /\$([^\$\n]+)\$/g;
    while ((inlineMatch = inlineRegex.exec(withoutBlock)) !== null) {
        inline.push(inlineMatch[1].trim());
    }

    return { inline, block };
}

/**
 * Common LaTeX formula examples for quick insertion
 */
export const MATH_TEMPLATES = {
    inline: [
        { label: 'Fração', formula: '\\frac{a}{b}' },
        { label: 'Raiz quadrada', formula: '\\sqrt{x}' },
        { label: 'Potência', formula: 'x^{n}' },
        { label: 'Índice', formula: 'x_{i}' },
        { label: 'Soma', formula: '\\sum_{i=1}^{n} x_i' },
        { label: 'Integral', formula: '\\int_{a}^{b} f(x) dx' },
        { label: 'Limite', formula: '\\lim_{x \\to \\infty} f(x)' },
        { label: 'Pi', formula: '\\pi' },
        { label: 'Infinito', formula: '\\infty' },
        { label: 'Diferente', formula: '\\neq' },
        { label: 'Menor ou igual', formula: '\\leq' },
        { label: 'Maior ou igual', formula: '\\geq' },
    ],
    block: [
        {
            label: 'Equação quadrática',
            formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
        },
        {
            label: 'Teorema de Pitágoras',
            formula: 'a^2 + b^2 = c^2'
        },
        {
            label: 'Fórmula de Euler',
            formula: 'e^{i\\pi} + 1 = 0'
        },
        {
            label: 'Derivada',
            formula: '\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}'
        },
        {
            label: 'Integral definida',
            formula: '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)'
        },
        {
            label: 'Matriz 2x2',
            formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'
        },
    ],
};

/**
 * Validates if a LaTeX expression is syntactically correct.
 * This is a basic check - full validation happens during KaTeX rendering.
 */
export function isValidLatex(latex: string): boolean {
    if (!latex || latex.trim().length === 0) return false;

    // Check for balanced braces
    let braceCount = 0;
    for (const char of latex) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (braceCount < 0) return false;
    }

    return braceCount === 0;
}

/**
 * Creates the MarkdownMath extension for Tiptap.
 * Provides hooks and utilities for math/markdown integration.
 */
export const MarkdownMathExtension = Extension.create({
    name: 'markdownMath',

    addStorage() {
        return {
            preprocessMarkdown: preprocessMarkdownWithMath,
            postprocessMarkdown: postprocessMarkdownWithMath,
            extractMath: extractMathExpressions,
            templates: MATH_TEMPLATES,
            isValidLatex,
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('markdownMath'),
                props: {
                    // Handle paste events to process math in pasted content
                    handlePaste: (view, event, slice) => {
                        const text = event.clipboardData?.getData('text/plain');
                        if (text && (text.includes('$') || text.includes('\\frac') || text.includes('\\sqrt'))) {
                            // Let the math extension handle it
                            return false;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});

export default MarkdownMathExtension;

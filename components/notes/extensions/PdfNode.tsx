import { NodeViewWrapper } from '@tiptap/react';
import { FileText, ExternalLink, Download, BookOpen } from 'lucide-react';
import React from 'react';

export default function PdfNode(props: any) {
    const { src, title } = props.node.attrs;

    return (
        <NodeViewWrapper className="my-4">
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden shadow-lg select-none">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                    <div className="flex items-center gap-2 text-zinc-200">
                        <FileText size={16} className="text-red-400" />
                        <span className="text-sm font-medium truncate max-w-[300px]">{title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                const openPdf = props.editor?.storage?.pdf?.openPdf;
                                if (openPdf) {
                                    openPdf(src, title); // Pass title as well optionally, but url is key
                                } else {
                                    console.warn("openPdf callback not found in storage");
                                }
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors mr-2"
                            title="Abrir Leitor"
                        >
                            <BookOpen size={12} /> Ler e Anotar
                        </button>
                        <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                            title="Abrir em nova guia"
                        >
                            <ExternalLink size={14} />
                        </a>
                        <a
                            href={src}
                            download={title}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                            title="Baixar"
                        >
                            <Download size={14} />
                        </a>
                    </div>
                </div>

                {/* PDF Status / Preview Placeholder */}
                <div className="relative w-full bg-zinc-800/50 p-6 flex flex-col items-center justify-center gap-3 border-t border-zinc-700/50 group hover:bg-zinc-800 transition-colors cursor-pointer" onClick={() => {
                    const openPdf = props.editor?.storage?.pdf?.openPdf;
                    if (openPdf) openPdf(src, title);
                }}>
                    <div className="w-16 h-20 bg-red-500/10 border-2 border-red-500/20 rounded flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <FileText size={32} className="text-red-500/80" />
                    </div>
                    <div className="text-center">
                        <p className="text-zinc-400 text-xs">Clique para ler e fazer anotações</p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const openPdf = props.editor?.storage?.pdf?.openPdf;
                            if (openPdf) openPdf(src, title);
                        }}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full shadow-lg transition-all transform hover:scale-105"
                    >
                        <BookOpen size={16} /> Ler PDF
                    </button>
                </div>
            </div>
        </NodeViewWrapper>
    );
}

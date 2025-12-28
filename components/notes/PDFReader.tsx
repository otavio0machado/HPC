import React, { useState, useEffect, useRef } from 'react';
import "react-pdf-highlighter/dist/style.css";
import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
} from 'react-pdf-highlighter';
import { Loader2, X, Download, ZoomIn, ZoomOut, RotateCw, Maximize } from 'lucide-react';
import type { IHighlight, NewHighlight } from 'react-pdf-highlighter';

import { toast } from 'sonner';
import { pdfjs } from 'react-pdf';
import { ReaderSettings } from '../../services/libraryService';

// Set worker with specific version to match react-pdf dependency
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

interface PDFReaderProps {
    url: string;
    initialAnnotations?: IHighlight[];
    onUpdateAnnotations: (annotations: IHighlight[]) => void;
    onClose?: () => void;
    scrollRef?: (scrollTo: (highlight: IHighlight) => void) => void;
    settings?: ReaderSettings;
}

const parseIdFromHash = () => {
    return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
    comment,
}: {
    comment: { text: string; emoji: string };
}) =>
    comment.text ? (
        <div className="bg-zinc-800 text-zinc-200 p-2 rounded shadow-lg border border-zinc-700 max-w-xs text-sm">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

export const PDFReader = React.memo<PDFReaderProps>(({
    url,
    initialAnnotations = [],
    onUpdateAnnotations,
    onClose,
    scrollRef,
    settings
}) => {
    const [highlights, setHighlights] = useState<IHighlight[]>(initialAnnotations);
    const scrollViewerTo = useRef<(highlight: IHighlight) => void>(null!);

    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Calculate filters based on settings
    const getFilterStyle = () => {
        if (!settings) return {};
        switch (settings.theme) {
            case 'dark':
                return { filter: 'invert(1) hue-rotate(180deg) contrast(0.8)' };
            case 'sepia':
                return { filter: 'sepia(0.5) contrast(0.9) brightness(0.9)' };
            default:
                return {};
        }
    };

    // Provide scroll handler to parent
    useEffect(() => {
        if (scrollRef) {
            scrollRef((highlight: IHighlight) => {
                if (scrollViewerTo.current) {
                    scrollViewerTo.current(highlight);
                }
            });
        }
    }, [scrollRef]);

    // Handle initial hash navigation
    useEffect(() => {
        const scrollToHighlightFromHash = () => {
            const highlight = getHighlightById(parseIdFromHash());
            if (highlight && scrollViewerTo.current) {
                scrollViewerTo.current(highlight);
            }
        };

        window.addEventListener("hashchange", scrollToHighlightFromHash, false);

        // Initial check
        if (parseIdFromHash()) {
            setTimeout(scrollToHighlightFromHash, 1000);
        }

        return () => {
            window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
        };
    }, [highlights]);

    const getHighlightById = (id: string) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const addHighlight = (highlight: NewHighlight) => {
        console.log("Saving highlight", highlight);
        const newHighlights = [{ ...highlight, id: crypto.randomUUID() }, ...highlights];
        setHighlights(newHighlights);
        onUpdateAnnotations(newHighlights);
    };

    const updateHighlight = (highlightId: string, position: Object, content: Object) => {
        console.log("Updating highlight", highlightId, position, content);
        const newHighlights = highlights.map((h) => {
            const {
                id,
                position: originalPosition,
                content: originalContent,
                ...rest
            } = h;
            return id === highlightId
                ? {
                    id,
                    position: { ...originalPosition, ...position },
                    content: { ...originalContent, ...content },
                    ...rest,
                }
                : h;
        });
        setHighlights(newHighlights);
        onUpdateAnnotations(newHighlights);
    };

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden relative glass-hydro bg-black/40">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2.5 bg-white/5 backdrop-blur-md border-b border-white/5 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                        <ZoomIn size={18} />
                    </button>
                    <span className="text-xs font-bold text-zinc-300 w-12 text-center bg-black/20 py-1 rounded-md">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                        <ZoomOut size={18} />
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button onClick={() => setScale(1.2)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors" title="Ajustar Largura">
                        <Maximize size={18} />
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                        <RotateCw size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <a href={url} download className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors" title="Baixar PDF">
                        <Download size={18} />
                    </a>
                    {onClose && (
                        <button onClick={onClose} className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/20 transition-colors" title="Fechar">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative bg-black/20" style={{ height: "calc(100% - 57px)" }}>
                <div className="h-full" style={getFilterStyle()}>
                    <PdfLoader
                        url={url}
                        beforeLoad={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-blue-500" /></div>}
                        errorMessage={<div className="flex justify-center items-center h-full text-red-400 text-sm font-bold glass-card p-4 rounded-xl border border-red-500/20 bg-red-500/10">Erro ao carregar PDF. Verifique se o arquivo existe.</div>}
                    >
                        {(pdfDocument) => (
                            <PdfHighlighter
                                pdfDocument={pdfDocument}
                                enableAreaSelection={(event) => event.altKey}
                                onScrollChange={resetHash}
                                pdfScaleValue={scale.toString()}
                                scrollRef={(scrollTo) => {
                                    scrollViewerTo.current = scrollTo;
                                }}
                                onSelectionFinished={(
                                    position,
                                    content,
                                    hideTipAndSelection,
                                    transformSelection
                                ) => (
                                    <div className="glass-spatial text-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2.5 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    const id: string = crypto.randomUUID();
                                                    const highlight = { content, position, comment: { text: '', emoji: '' }, id };
                                                    addHighlight(highlight);
                                                    hideTipAndSelection();
                                                    const quote = `> "${content.text}"\n[Ver no PDF](${url}#highlight-${id})`;
                                                    navigator.clipboard.writeText(quote);
                                                    toast.success("Citação copiada para a área de transferência!");
                                                }}
                                                className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg text-zinc-200 transition-colors flex items-center gap-1.5 border border-white/5"
                                            >
                                                <Download size={12} className="rotate-180" /> Copiar Citação
                                            </button>
                                            <button
                                                onClick={transformSelection}
                                                className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white transition-all shadow-lg active:scale-95"
                                            >
                                                Adicionar Nota
                                            </button>
                                        </div>
                                    </div>
                                )}
                                highlightTransform={(
                                    highlight,
                                    index,
                                    setTip,
                                    hideTip,
                                    viewportToScaled,
                                    screenshot,
                                    isScrolledTo
                                ) => {
                                    const isTextHighlight = !Boolean(
                                        highlight.content && highlight.content.image
                                    );

                                    const component = isTextHighlight ? (
                                        <Highlight
                                            isScrolledTo={isScrolledTo}
                                            position={highlight.position}
                                            comment={highlight.comment}
                                        />
                                    ) : (
                                        <AreaHighlight
                                            isScrolledTo={isScrolledTo}
                                            highlight={highlight}
                                            onChange={(boundingRect) => {
                                                updateHighlight(
                                                    highlight.id,
                                                    { boundingRect: viewportToScaled(boundingRect) },
                                                    { image: screenshot(boundingRect) }
                                                );
                                            }}
                                        />
                                    );

                                    return (
                                        <Popup
                                            popupContent={<HighlightPopup {...highlight} />}
                                            onMouseOver={(popupContent) =>
                                                setTip(highlight, (highlight) => popupContent)
                                            }
                                            onMouseOut={hideTip}
                                            key={index}
                                            children={component}
                                        />
                                    );
                                }}
                                highlights={highlights}
                            />
                        )}
                    </PdfLoader>
                </div>
            </div>

            <style>{`
                .PdfHighlighter {
                   background: transparent !important;
                }
                .pdf-viewer__document {
                    background: transparent !important;
                    padding: 20px 0;
                }
                .pdf-viewer__page {
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
                    border-radius: 4px;
                    margin-bottom: 20px !important;
                }
                
                /* Selection Tip Customization */
                 .Tip {
                    background: rgba(30, 30, 35, 0.9);
                    backdrop-filter: blur(10px);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 4px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .Tip__compact {
                    display: flex;
                    gap: 5px;
                }
            `}</style>
        </div>
    );
});

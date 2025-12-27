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
        <div className="flex flex-col h-full bg-zinc-900 overflow-hidden relative">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-zinc-800 border-b border-zinc-700 z-10">
                <div className="flex items-center gap-2">
                    <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-700">
                        <ZoomIn size={18} />
                    </button>
                    <span className="text-xs text-zinc-500 w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-700">
                        <ZoomOut size={18} />
                    </button>
                    <div className="w-px h-4 bg-zinc-700 mx-2" />
                    <button onClick={() => setScale(1.2)} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-700" title="Ajustar Largura">
                        <Maximize size={18} />
                    </button>
                    <div className="w-px h-4 bg-zinc-700 mx-2" />
                    <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-700">
                        <RotateCw size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <a href={url} download className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-700" title="Baixar PDF">
                        <Download size={18} />
                    </a>
                    {onClose && (
                        <button onClick={onClose} className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-900/20" title="Fechar">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative" style={{ height: "calc(100% - 41px)" }}>
                <div className="h-full" style={getFilterStyle()}>
                    <PdfLoader
                        url={url}
                        beforeLoad={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-purple-500" /></div>}
                        errorMessage={<div className="flex justify-center items-center h-full text-red-400">Erro ao carregar PDF. Verifique se o arquivo existe.</div>}
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
                                    <div className="bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg shadow-xl p-2 flex flex-col gap-2">
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
                                                className="px-3 py-1.5 text-xs font-medium bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200 transition-colors flex items-center gap-1"
                                            >
                                                <Download size={12} className="rotate-180" /> Copiar Citação
                                            </button>
                                            <button
                                                onClick={transformSelection}
                                                className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
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
                   background: #18181b !important; /* zinc-950 */
                }
                .pdf-viewer__document {
                    background-color: #52525b !important; /* zinc-600 */
                }
                
                /* Selection Tip Customization */
                 .Tip {
                    background: #27272a; /* zinc-800 */
                    color: white;
                    border: 1px solid #3f3f46;
                    border-radius: 4px;
                    padding: 4px;
                }
                .Tip__compact {
                    display: flex;
                    gap: 5px;
                }
            `}</style>
        </div>
    );
});

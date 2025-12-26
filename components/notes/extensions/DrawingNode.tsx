import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Eraser, Pen, Trash2, Undo2, Redo2, Highlighter, Palette, ChevronDown, Check, MousePointer2, LayoutTemplate } from 'lucide-react';

interface Point {
    x: number;
    y: number;
    pressure?: number;
}

interface Line {
    points: Point[];
    color: string;
    width: number;
    tool: 'pen' | 'highlighter' | 'eraser';
    penType?: 'ballpoint' | 'fountain' | 'brush';
}

const DEFAULT_COLORS = [
    '#000000', // Black
    '#ef4444', // Red
    '#3b82f6', // Blue
];

const PRESET_WIDTHS = [2, 4, 8];

const DrawingNode: React.FC<NodeViewProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Tools state
    const [selectedTool, setSelectedTool] = useState<'pen' | 'eraser' | 'highlighter'>('pen');
    const [penType, setPenType] = useState<'ballpoint' | 'fountain' | 'brush'>('ballpoint');
    const [eraserMode, setEraserMode] = useState<'standard' | 'stroke' | 'precision'>('standard');

    // Quick slots
    const [colorSlots, setColorSlots] = useState<string[]>(DEFAULT_COLORS);
    const [activeColorSlot, setActiveColorSlot] = useState(0);
    const [widthSlots, setWidthSlots] = useState<number[]>(PRESET_WIDTHS);
    const [activeWidthSlot, setActiveWidthSlot] = useState(1);

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showPenOptions, setShowPenOptions] = useState(false);
    const [showPaperMenu, setShowPaperMenu] = useState(false);

    // Paper State
    const [paperType, setPaperType] = useState<'blank' | 'ruled' | 'grid' | 'dot'>(props.node.attrs.paperType || 'blank');
    const [paperColor, setPaperColor] = useState<'white' | 'yellow' | 'dark'>(props.node.attrs.paperColor || 'white');

    // Derived current state
    const currentColor = colorSlots[activeColorSlot];
    const currentWidth = widthSlots[activeWidthSlot];

    // Data state
    const [lines, setLines] = useState<Line[]>(props.node.attrs.lines || []);
    const [history, setHistory] = useState<Line[][]>([]);
    const [redoStack, setRedoStack] = useState<Line[][]>([]);

    // Sync presets based on tool
    useEffect(() => {
        if (selectedTool === 'highlighter') {
            setWidthSlots([12, 24, 36]);
            setActiveWidthSlot(1);
        } else if (selectedTool === 'eraser') {
            setWidthSlots([10, 25, 50]);
            setActiveWidthSlot(1);
        } else {
            setWidthSlots([2, 4, 8]);
            setActiveWidthSlot(1);
        }
    }, [selectedTool]);

    // Sync attributes
    useEffect(() => {
        props.updateAttributes({ paperType, paperColor });
    }, [paperType, paperColor]);

    // Initialize/Sync from props
    useEffect(() => {
        if (props.node.attrs.lines) {
            setLines(props.node.attrs.lines);
        }
        if (props.node.attrs.paperType) setPaperType(props.node.attrs.paperType);
        if (props.node.attrs.paperColor) setPaperColor(props.node.attrs.paperColor);
    }, [props.node.attrs.lines, props.node.attrs.paperType, props.node.attrs.paperColor]);

    // Redraw canvas when lines change
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and Reset
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Separate highlighters to draw them first (behind pens) if we want "behind text" effect, 
        // but here we just draw in order. GoodNotes draws highlighters with multiply blend mode usually.

        lines.forEach((line) => {
            if (line.points.length === 0) return;

            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = line.width;

            if (line.tool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.strokeStyle = '#ffffff';
            } else if (line.tool === 'highlighter') {
                ctx.globalCompositeOperation = 'multiply'; // Highlights blend
                ctx.strokeStyle = line.color;
                ctx.globalAlpha = 0.5; // Transparent
                ctx.lineWidth = line.width * 2; // Highlighters are thicker
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = line.color;
                ctx.globalAlpha = 1.0;
            }

            // Adjust style based on Pen Type (Simulated for now in standard stroke)
            // Real pressure sensitivity requires more complex rendering (ribbons), keeping it simple for stability first.
            // But we can adjust globalAlpha or Width slightly if we processed point-by-point. 
            // For standard stroke():
            if (line.penType === 'brush') {
                // simple simulation: maybe softer?
                ctx.shadowBlur = 0;
            }

            ctx.moveTo(line.points[0].x, line.points[0].y);

            if (line.points.length > 2) {
                for (let i = 1; i < line.points.length - 1; i++) {
                    const xc = (line.points[i].x + line.points[i + 1].x) / 2;
                    const yc = (line.points[i].y + line.points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
                }
                ctx.lineTo(line.points[line.points.length - 1].x, line.points[line.points.length - 1].y);
            } else if (line.points.length > 0) {
                line.points.forEach((point) => {
                    ctx.lineTo(point.x, point.y);
                });
            }

            ctx.stroke();

            // Reset context
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowBlur = 0;
        });
    }, [lines]);

    useEffect(() => {
        draw();
    }, [draw]);

    const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDrawing(true);

        // Push current state to history
        setHistory(prev => [...prev, lines]);
        setRedoStack([]);

        const { offsetX, offsetY, pressure } = getCoordinates(event);

        // Stroke Eraser Logic
        if (selectedTool === 'eraser' && eraserMode === 'stroke') {
            // We handle this in move or click, but usually click is enough for single tap erase
            // For drag erase, we do it in move
            eraseStroke(offsetX, offsetY);
            return;
        }

        const newLine: Line = {
            points: [{ x: offsetX, y: offsetY, pressure }],
            color: currentColor,
            width: currentWidth,
            tool: selectedTool,
            penType: selectedTool === 'pen' ? penType : undefined
        };

        setLines(prev => [...prev, newLine]);
    };

    const drawMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        event.preventDefault();

        const { offsetX, offsetY, pressure } = getCoordinates(event);

        if (selectedTool === 'eraser' && eraserMode === 'stroke') {
            eraseStroke(offsetX, offsetY);
            return;
        }

        setLines(prev => {
            const newLines = [...prev];
            const currentLine = { ...newLines[newLines.length - 1] };
            // Safety check
            if (!currentLine) return prev;

            currentLine.points = [...currentLine.points, { x: offsetX, y: offsetY, pressure }];
            newLines[newLines.length - 1] = currentLine;
            return newLines;
        });
    };

    // Helper for stroke eraser
    const eraseStroke = (x: number, y: number) => {
        setLines(prev => prev.filter(line => {
            // Simple bounding box or distance check
            // Check if any point in line is close to x,y
            // Threshold of 10px
            return !line.points.some(p => Math.hypot(p.x - x, p.y - y) < 15);
        }));
    };

    const getBackgroundStyle = () => {
        let bg = '#ffffff';
        let borderColor = '#e5e7eb'; // zinc-200
        let opacity = 0.5;

        if (paperColor === 'yellow') { bg = '#fefce8'; borderColor = '#ca8a04'; opacity = 0.15; } // yellow-50
        if (paperColor === 'dark') { bg = '#18181b'; borderColor = '#3f3f46'; opacity = 0.3; } // zinc-900

        const styles: React.CSSProperties = { backgroundColor: bg };

        // We use SVG patterns or CSS gradients
        if (paperType === 'grid') {
            styles.backgroundImage = `linear-gradient(${borderColor} 1px, transparent 1px), linear-gradient(90deg, ${borderColor} 1px, transparent 1px)`;
            styles.backgroundSize = '25px 25px';
        } else if (paperType === 'dot') {
            styles.backgroundImage = `radial-gradient(${borderColor} 1.5px, transparent 1.5px)`;
            styles.backgroundSize = '25px 25px';
        } else if (paperType === 'ruled') {
            styles.backgroundImage = `repeating-linear-gradient(0deg, transparent, transparent 29px, ${borderColor} 30px)`;
        }

        return styles;
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            props.updateAttributes({ lines });
        }
    };

    const getCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0, pressure: 0.5 };

        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            pressure: event.pressure
        };
    };

    const handleClear = () => {
        setHistory(prev => [...prev, lines]);
        setRedoStack([]);
        setLines([]);
        props.updateAttributes({ lines: [] });
    };

    const handleUndo = () => {
        if (history.length === 0) return;

        const previousLines = history[history.length - 1];
        setRedoStack(prev => [...prev, lines]);
        setLines(previousLines);
        setHistory(prev => prev.slice(0, -1));
        props.updateAttributes({ lines: previousLines });
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;

        const nextLines = redoStack[redoStack.length - 1];
        setHistory(prev => [...prev, lines]);
        setLines(nextLines);
        setRedoStack(prev => prev.slice(0, -1));
        props.updateAttributes({ lines: nextLines });
    };

    // Responsive Canvas
    useEffect(() => {
        const handleResize = () => {
            // We could implement dynamic resizing here
            // For now fixed width but responsive container
            draw();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    return (
        <NodeViewWrapper className="drawing-component my-6 select-none">
            <div ref={containerRef} className="border border-zinc-700 rounded-xl bg-zinc-900 overflow-hidden shadow-lg relative group">
                {/* Toolbar */}
                <div className="flex flex-col gap-2 p-3 bg-zinc-800 border-b border-zinc-700">
                    {/* Top Row: Tools & Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Main Tools */}
                            <div className="flex bg-zinc-900 rounded-lg p-1 gap-1">
                                <button
                                    onClick={() => setSelectedTool('pen')}
                                    className={`p-2 rounded-md transition-all relative ${selectedTool === 'pen' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                                    title="Caneta"
                                >
                                    <Pen size={20} />
                                    {selectedTool === 'pen' && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setSelectedTool('eraser')}
                                    className={`p-2 rounded-md transition-all relative ${selectedTool === 'eraser' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                                    title="Borracha"
                                >
                                    <Eraser size={20} />
                                    {selectedTool === 'eraser' && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setSelectedTool('highlighter')}
                                    className={`p-2 rounded-md transition-all relative ${selectedTool === 'highlighter' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                                    title="Marca-texto"
                                >
                                    <Highlighter size={20} />
                                    {selectedTool === 'highlighter' && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                    )}
                                </button>
                            </div>

                            <div className="w-px h-8 bg-zinc-700 mx-1"></div>

                            {/* Sub-options based on tool */}
                            {selectedTool === 'pen' && (
                                <div className="flex bg-zinc-900 rounded-lg p-1 gap-1">
                                    <button
                                        onClick={() => setPenType('fountain')}
                                        className={`px-3 py-1 text-xs rounded-md ${penType === 'fountain' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Tinteiro
                                    </button>
                                    <button
                                        onClick={() => setPenType('ballpoint')}
                                        className={`px-3 py-1 text-xs rounded-md ${penType === 'ballpoint' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Esfero.
                                    </button>
                                    <button
                                        onClick={() => setPenType('brush')}
                                        className={`px-3 py-1 text-xs rounded-md ${penType === 'brush' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Pincel
                                    </button>
                                </div>
                            )}

                            {selectedTool === 'eraser' && (
                                <div className="flex bg-zinc-900 rounded-lg p-1 gap-1">
                                    <button
                                        onClick={() => setEraserMode('standard')}
                                        className={`px-3 py-1 text-xs rounded-md ${eraserMode === 'standard' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Padrão
                                    </button>
                                    <button
                                        onClick={() => setEraserMode('stroke')}
                                        className={`px-3 py-1 text-xs rounded-md ${eraserMode === 'stroke' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                                    >
                                        Traço
                                    </button>
                                </div>
                            )}

                        </div>

                        <div className="flex items-center gap-1">
                            <div className="relative">
                                <button
                                    onClick={() => setShowPaperMenu(!showPaperMenu)}
                                    className="p-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                                    title="Papel de Fundo"
                                >
                                    <LayoutTemplate size={20} />
                                </button>
                                {showPaperMenu && (
                                    <div className="absolute top-full right-0 mt-2 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 w-48 flex flex-col gap-3">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 mb-1 uppercase">Padrão</p>
                                            <div className="grid grid-cols-4 gap-1">
                                                {['blank', 'ruled', 'grid', 'dot'].map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => { setPaperType(t as any); }}
                                                        className={`p-1 rounded border ${paperType === t ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}
                                                        title={t}
                                                    >
                                                        {t === 'blank' && <div className="w-full h-4 bg-transparent border border-zinc-600/30"></div>}
                                                        {t === 'ruled' && <div className="w-full h-4 flex flex-col justify-around"><div className="h-px bg-current"></div><div className="h-px bg-current"></div></div>}
                                                        {t === 'grid' && <div className="w-full h-4 grid grid-cols-2 grid-rows-2"><div className="border border-current opacity-50"></div><div className="border border-current opacity-50"></div><div className="border border-current opacity-50"></div><div className="border border-current opacity-50"></div></div>}
                                                        {t === 'dot' && <div className="w-full h-4 flex items-center justify-center gap-1"><div className="w-0.5 h-0.5 bg-current rounded-full"></div><div className="w-0.5 h-0.5 bg-current rounded-full"></div></div>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 mb-1 uppercase">Cor</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setPaperColor('white')} className={`w-6 h-6 rounded-full border bg-white ${paperColor === 'white' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-300'}`}></button>
                                                <button onClick={() => setPaperColor('yellow')} className={`w-6 h-6 rounded-full border bg-yellow-50 ${paperColor === 'yellow' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-yellow-200'}`}></button>
                                                <button onClick={() => setPaperColor('dark')} className={`w-6 h-6 rounded-full border bg-zinc-900 ${paperColor === 'dark' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-700'}`}></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-px h-8 bg-zinc-700 mx-1"></div>

                            <button
                                onClick={handleUndo}
                                disabled={history.length === 0}
                                className="p-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                            >
                                <Undo2 size={20} />
                            </button>
                            <button
                                onClick={handleRedo}
                                disabled={redoStack.length === 0}
                                className="p-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                            >
                                <Redo2 size={20} />
                            </button>
                            <div className="w-px h-8 bg-zinc-700 mx-1"></div>
                            <button
                                onClick={handleClear}
                                className="p-2 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Colors & Width (Contextual) */}
                    {(selectedTool === 'pen' || selectedTool === 'highlighter') && (
                        <div className="flex items-center gap-4 mt-1">
                            {/* Colors Slots */}
                            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1.5 border border-zinc-700/50">
                                {colorSlots.map((c, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveColorSlot(idx)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform ${activeColorSlot === idx ? 'scale-110 shadow-sm border-white' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <div className="w-px h-6 bg-zinc-700 mx-1"></div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className="w-8 h-8 rounded-full border-2 border-zinc-600 flex items-center justify-center hover:bg-zinc-800 text-zinc-400"
                                        title="Cor Personalizada"
                                    >
                                        <Palette size={16} />
                                    </button>

                                    {showColorPicker && (
                                        <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 flex flex-col gap-2">
                                            <input
                                                type="color"
                                                value={currentColor}
                                                onChange={(e) => {
                                                    const newColor = e.target.value;
                                                    const newSlots = [...colorSlots];
                                                    newSlots[activeColorSlot] = newColor;
                                                    setColorSlots(newSlots);
                                                }}
                                                className="w-32 h-10 cursor-pointer"
                                            />
                                            <div className="grid grid-cols-4 gap-1 w-32">
                                                {['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => {
                                                            const newSlots = [...colorSlots];
                                                            newSlots[activeColorSlot] = c;
                                                            setColorSlots(newSlots);
                                                            setShowColorPicker(false);
                                                        }}
                                                        className="w-6 h-6 rounded-full border border-zinc-600"
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Width Slots */}
                            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1.5 border border-zinc-700/50">
                                {widthSlots.map((w, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveWidthSlot(idx)}
                                        className={`w-10 h-8 rounded-md flex items-center justify-center transition-colors ${activeWidthSlot === idx ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                                    >
                                        <div
                                            className="rounded-full bg-current text-white"
                                            style={{ width: w, height: w }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <canvas
                    ref={canvasRef}
                    width={800} // Increased default width
                    height={400}
                    style={getBackgroundStyle()}
                    className={`w-full h-[400px] touch-none ${selectedTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
                    onPointerDown={startDrawing}
                    onPointerMove={drawMove}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                />
            </div>
        </NodeViewWrapper>
    );
};

export default DrawingNode;

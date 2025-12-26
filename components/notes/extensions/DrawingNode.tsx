import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Eraser, Pen, Trash2, Undo2, Redo2, Highlighter, Palette, ChevronDown, Check, MousePointer2, LayoutTemplate, Lasso } from 'lucide-react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke, PEN_PRESETS } from '../../../utils/drawingUtils';

// Types
type Point = [number, number, number]; // x, y, pressure

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

const DrawingNode: React.FC<NodeViewProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Tools state
    const [selectedTool, setSelectedTool] = useState<'pen' | 'eraser' | 'highlighter' | 'lasso'>('pen');
    const [penType, setPenType] = useState<'ballpoint' | 'fountain' | 'brush'>('ballpoint');
    const [eraserMode, setEraserMode] = useState<'standard' | 'stroke'>('stroke');

    // Quick slots
    const [colorSlots, setColorSlots] = useState<string[]>(DEFAULT_COLORS);
    const [activeColorSlot, setActiveColorSlot] = useState(0);
    const [widthSlots, setWidthSlots] = useState<number[]>([2, 4, 8]);
    const [activeWidthSlot, setActiveWidthSlot] = useState(1);

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showPaperMenu, setShowPaperMenu] = useState(false);

    // Paper State
    const [paperType, setPaperType] = useState<'blank' | 'ruled' | 'grid' | 'dot'>(props.node.attrs.paperType || 'blank');
    const [paperColor, setPaperColor] = useState<'white' | 'yellow' | 'dark'>(props.node.attrs.paperColor || 'white');

    // Selection/Lasso State
    const [selectionPoints, setSelectionPoints] = useState<Point[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [isDraggingSelection, setIsDraggingSelection] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);

    // Derived current state
    const currentColor = colorSlots[activeColorSlot];
    const currentWidth = widthSlots[activeWidthSlot];

    // Data state
    const [lines, setLines] = useState<Line[]>([]);
    const [currentLine, setCurrentLine] = useState<Line | null>(null);
    const [history, setHistory] = useState<Line[][]>([]);
    const [redoStack, setRedoStack] = useState<Line[][]>([]);

    // Load initial data
    useEffect(() => {
        // Migration check: if points are objects {x,y,pressure}, convert to array
        let loadedLines = props.node.attrs.lines || [];
        if (loadedLines.length > 0 && loadedLines[0].points.length > 0 && typeof loadedLines[0].points[0] === 'object' && !Array.isArray(loadedLines[0].points[0])) {
            loadedLines = loadedLines.map((l: any) => ({
                ...l,
                points: l.points.map((p: any) => [p.x, p.y, p.pressure || 0.5])
            }));
        }
        setLines(loadedLines);
    }, []);

    // Sync presets based on tool
    useEffect(() => {
        if (selectedTool === 'highlighter') {
            setWidthSlots([12, 24, 36]);
            setActiveWidthSlot(1);
        } else if (selectedTool === 'eraser') {
            setWidthSlots([10, 25, 50]);
            setActiveWidthSlot(1);
        } else if (selectedTool === 'pen') {
            setWidthSlots([2, 4, 8]);
            setActiveWidthSlot(1);
        }
    }, [selectedTool]);

    const updateAttributes = (newLines: Line[]) => {
        props.updateAttributes({ lines: newLines, paperType, paperColor });
    };

    // --- Rendering ---

    const renderLine = useCallback((ctx: CanvasRenderingContext2D, line: Line, isSelected: boolean = false) => {
        if (line.points.length === 0) return;

        const options = { ...PEN_PRESETS[line.penType || 'ballpoint'] };
        options.size = line.width;

        // Highlighter overrides
        if (line.tool === 'highlighter') {
            options.size = line.width * 1.5;
            options.thinning = 0;
            options.smoothing = 0.5;
            // Highlighter color needs transparency
            ctx.globalAlpha = 0.3;
            // Use multiply for true highlighter effect if supported, else source-over
            ctx.globalCompositeOperation = 'multiply';
        } else {
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
        }

        // Selection highlight
        if (isSelected) {
            ctx.shadowColor = '#3b82f6';
            ctx.shadowBlur = 10;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        const stroke = getStroke(line.points, options);
        const pathData = getSvgPathFromStroke(stroke);
        const path = new Path2D(pathData);

        ctx.fillStyle = line.color;
        ctx.fill(path);

        // Reset context
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;

    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw existing lines
        // Draw highlighters first (so they are behind text/ink usually, but here just order)
        // Actually, separate into layers if we want highlighter behind.
        // For now, simple painter's algorithm
        lines.forEach((line, index) => {
            renderLine(ctx, line, selectedIndices.has(index));
        });

        // 2. Draw current active line
        if (currentLine) {
            renderLine(ctx, currentLine);
        }

        // 3. Draw Lasso Selection
        if (selectionPoints.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#3b82f6'; // Blue-500
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            const stroke = getStroke(selectionPoints, {
                size: 2,
                thinning: 0,
                smoothing: 0,
                streamline: 0,
                simulatePressure: false,
            });
            const pathData = getSvgPathFromStroke(stroke);
            const path = new Path2D(pathData);
            ctx.stroke(path); // Stroke the outline of the lasso

            // Or simple polyline
            ctx.beginPath();
            ctx.moveTo(selectionPoints[0][0], selectionPoints[0][1]);
            for (let i = 1; i < selectionPoints.length; i++) {
                ctx.lineTo(selectionPoints[i][0], selectionPoints[i][1]);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
            ctx.fill();
            ctx.stroke();
            ctx.setLineDash([]);
        }

    }, [lines, currentLine, selectionPoints, selectedIndices, renderLine]);

    useEffect(() => {
        requestAnimationFrame(draw);
    }, [draw]);

    // --- Interaction ---

    const getCoords = (e: React.PointerEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            pressure: e.pressure || 0.5
        };
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDrawing(true);
        const { x, y, pressure } = getCoords(e);

        if (selectedTool === 'lasso') {
            // If clicking inside selection, start drag
            // Simple bounding box check for now or just check if we have a selection and click is near
            // For simplicity: if we have separate move tool, it's easier. 
            // Here: Lasso just selects. If you want to move, you might need to click inside.
            // Let's treat standard Lasso as "New Selection" unless we click on existing selection?
            // To keep it simple: clear selection on new Lasso start.
            if (selectedIndices.size > 0 && isPointInSelection(x, y)) {
                setIsDraggingSelection(true);
                setDragStart({ x, y });
            } else {
                setSelectedIndices(new Set());
                setSelectionPoints([[x, y, pressure]]);
            }
            return;
        }

        const newLine: Line = {
            points: [[x, y, pressure]],
            color: currentColor,
            width: currentWidth,
            tool: selectedTool === 'eraser' ? 'eraser' : selectedTool as 'pen' | 'highlighter', // Eraser handled separately?
            penType: selectedTool === 'pen' ? penType : undefined
        };

        if (selectedTool === 'eraser') {
            // Eraser Logic (Stroke Eraser)
            // Check collisions immediately or on move?
            // Usually on move.
        } else {
            setCurrentLine(newLine);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawing) return;
        const { x, y, pressure } = getCoords(e);

        if (selectedTool === 'lasso') {
            if (isDraggingSelection && dragStart) {
                const dx = x - dragStart.x;
                const dy = y - dragStart.y;

                // Move selected lines
                const newLines = [...lines];
                selectedIndices.forEach(idx => {
                    newLines[idx] = {
                        ...newLines[idx],
                        points: newLines[idx].points.map(([px, py, pp]) => [px + dx, py + dy, pp])
                    };
                });
                setLines(newLines);
                setDragStart({ x, y });
            } else {
                setSelectionPoints(prev => [...prev, [x, y, pressure]]);
            }
            return;
        }

        if (selectedTool === 'eraser') {
            // Stroke Eraser
            const eraserRadius = currentWidth * 2; // Tolerance
            setLines(prev => prev.filter(line => {
                // Return false to delete
                // Check if any point of the line is close to eraser
                // Optimization: Check Bounding Box first
                // For now, iterate points.
                for (const p of line.points) {
                    if (Math.hypot(p[0] - x, p[1] - y) < eraserRadius) {
                        return false; // Remove line
                    }
                }
                return true;
            }));
            return;
        }

        if (currentLine) {
            setCurrentLine(prev => prev ? {
                ...prev,
                points: [...prev.points, [x, y, pressure]]
            } : null);
        }
    };

    const handlePointerUp = () => {
        setIsDrawing(false);
        setDragStart(null);
        setIsDraggingSelection(false);

        if (selectedTool === 'lasso') {
            // Close selection polygon
            if (selectionPoints.length > 2) {
                // Find lines inside polygon
                const indices = new Set<number>();
                lines.forEach((line, i) => {
                    // Check if *any* point of the line is inside the polygon
                    // Using ray casting algorithm for point in polygon
                    // Or simplified bounding box for now?
                    // Let's try simple point in polygon for the first point of the line
                    if (isPointInPolygon(line.points[0], selectionPoints)) {
                        indices.add(i);
                    }
                });
                setSelectedIndices(indices);
            }
            setSelectionPoints([]); // Clear visual lasso path
            return;
        }

        if (currentLine) {
            const newLines = [...lines, currentLine];
            setLines(newLines);
            setHistory(prev => [...prev, lines]); // Save previous state
            setRedoStack([]);
            updateAttributes(newLines);
            setCurrentLine(null);
        } else if (selectedTool === 'eraser') {
            // Eraser changes finished
            setHistory(prev => [...prev, lines]); // This might save too many states if we save on every frame of delete? 
            // Currently we filter in Move. So we should save BEFORE erasing.
            // FIXME: This history logic is slightly flawed for eraser (it saves 'after' state as history?).
            // We need to save history on PointerDown for Eraser.
            updateAttributes(lines);
        }
    };

    // Helpers
    const isPointInPolygon = (point: Point, vs: Point[]) => {
        // ray-casting algorithm based on
        // https://github.com/substack/point-in-polygon
        const x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i][0], yi = vs[i][1];
            const xj = vs[j][0], yj = vs[j][1];

            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    // Check if point is inside bounding box of selected items (Approximation)
    const isPointInSelection = (x: number, y: number) => {
        // Find bounding box of all selected lines
        // A bit expensive, but okay for N < 1000
        // ... omitted for brevity/simplicity for now, assume Lasso always starts new selection
        return false;
    };

    const clearCanvas = () => {
        setHistory(prev => [...prev, lines]);
        setLines([]);
        updateAttributes([]);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const prevLines = history[history.length - 1];
        setRedoStack(prev => [...prev, lines]);
        setLines(prevLines);
        setHistory(prev => prev.slice(0, -1));
        updateAttributes(prevLines);
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const nextLines = redoStack[redoStack.length - 1];
        setHistory(prev => [...prev, lines]);
        setLines(nextLines);
        setRedoStack(prev => prev.slice(0, -1));
        updateAttributes(nextLines);
    };

    // Paper Styling
    const getBackgroundStyle = () => {
        let bg = '#ffffff';
        let borderColor = '#e5e7eb';
        if (paperColor === 'yellow') { bg = '#fefce8'; borderColor = '#ca8a04'; }
        if (paperColor === 'dark') { bg = '#18181b'; borderColor = '#3f3f46'; }

        const styles: React.CSSProperties = { backgroundColor: bg };
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

    return (
        <NodeViewWrapper className="drawing-component my-6 select-none animate-in fade-in zoom-in-95 duration-300">
            <div ref={containerRef} className="border border-zinc-700/50 rounded-xl bg-zinc-900 overflow-hidden shadow-2xl relative group ring-1 ring-white/5">

                {/* Modern Toolbar */}
                <div className="flex flex-col gap-2 p-3 bg-zinc-800/90 backdrop-blur-md border-b border-zinc-700/50">
                    <div className="flex items-center justify-between">

                        {/* Tools Group */}
                        <div className="flex items-center bg-zinc-900/50 p-1 rounded-xl border border-white/5 shadow-inner">
                            {[
                                { id: 'pen', icon: Pen, label: 'Caneta' },
                                { id: 'eraser', icon: Eraser, label: 'Borracha' },
                                { id: 'highlighter', icon: Highlighter, label: 'Marca-texto' },
                                { id: 'lasso', icon: Lasso, label: 'Seleção' },
                            ].map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => setSelectedTool(tool.id as any)}
                                    className={`p-2 rounded-lg transition-all relative group/btn ${selectedTool === tool.id ? 'bg-zinc-700 text-white shadow-lg ring-1 ring-white/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                                    title={tool.label}
                                >
                                    <tool.icon size={18} strokeWidth={selectedTool === tool.id ? 2.5 : 2} />
                                    {selectedTool === tool.id && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-zinc-700/50 mx-2"></div>

                        {/* Sub Tools Area (Dynamic) */}
                        <div className="flex items-center gap-2 flex-1 scrollbar-hide overflow-x-auto">
                            {selectedTool === 'pen' && (
                                <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                                    {['ballpoint', 'fountain', 'brush'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setPenType(t as any)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${penType === t ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                        >
                                            {t === 'ballpoint' ? 'Esfero.' : t === 'fountain' ? 'Tinteiro' : 'Pincel'}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Paper Menu */}
                            <div className="relative ml-auto">
                                <button onClick={() => setShowPaperMenu(!showPaperMenu)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
                                    <LayoutTemplate size={20} />
                                </button>
                                {showPaperMenu && (
                                    <div className="absolute top-full right-0 mt-2 p-4 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 w-64 animate-in slide-in-from-top-2">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Papel</h4>
                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                            {['blank', 'ruled', 'grid', 'dot'].map(t => (
                                                <button key={t} onClick={() => setPaperType(t as any)} className={`h-10 rounded border transition-all ${paperType === t ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-700 hover:border-zinc-500'}`}>
                                                    {/* Visual Preview */}
                                                </button>
                                            ))}
                                        </div>
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Cor de Fundo</h4>
                                        <div className="flex gap-3">
                                            <button onClick={() => setPaperColor('white')} className={`w-8 h-8 rounded-full border bg-white ${paperColor === 'white' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-300'}`} />
                                            <button onClick={() => setPaperColor('yellow')} className={`w-8 h-8 rounded-full border bg-[#fefce8] ${paperColor === 'yellow' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-yellow-200'}`} />
                                            <button onClick={() => setPaperColor('dark')} className={`w-8 h-8 rounded-full border bg-[#18181b] ${paperColor === 'dark' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-700'}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                            <button onClick={handleUndo} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"><Undo2 size={18} /></button>
                            <button onClick={handleRedo} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"><Redo2 size={18} /></button>
                            <button onClick={clearCanvas} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                    </div>

                    {/* Secondary Toolbar (Colors & Size) */}
                    {(selectedTool === 'pen' || selectedTool === 'highlighter') && (
                        <div className="flex items-center gap-3 pt-1 animate-in slide-in-from-top-1">
                            {/* Colors */}
                            <div className="flex bg-zinc-900/50 p-1.5 rounded-lg border border-white/5 gap-1.5">
                                {colorSlots.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveColorSlot(i)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${activeColorSlot === i ? 'scale-110 border-white shadow-md' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <button onClick={() => setShowColorPicker(!showColorPicker)} className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center text-zinc-400 hover:bg-zinc-700">
                                    <Palette size={12} />
                                </button>
                            </div>

                            {/* Widths */}
                            <div className="flex bg-zinc-900/50 p-1.5 rounded-lg border border-white/5 gap-1">
                                {widthSlots.map((w, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveWidthSlot(i)}
                                        className={`w-8 h-6 flex items-center justify-center rounded transition-all ${activeWidthSlot === i ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                                    >
                                        <div className="rounded-full bg-zinc-300" style={{ width: w / (selectedTool === 'highlighter' ? 3 : 1), height: w / (selectedTool === 'highlighter' ? 3 : 1) }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Canvas Area */}
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    style={{ ...getBackgroundStyle(), cursor: selectedTool === 'lasso' ? 'crosshair' : 'none' }}
                    className="w-full h-[600px] touch-none outline-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />

                {/* Custom Cursor */}
                {/* We can use CSS cursor for better perf, but a custom div cursor follows pointer */}
            </div>

            {/* Color Picker Popover (Simplified) */}
            {showColorPicker && (
                <div className="absolute z-50 p-3 bg-zinc-800 border border-zinc-600 rounded-xl shadow-2xl mt-2 left-4 top-32">
                    <div className="grid grid-cols-4 gap-2">
                        {['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                            <button
                                key={c}
                                onClick={() => {
                                    const newSlots = [...colorSlots];
                                    newSlots[activeColorSlot] = c;
                                    setColorSlots(newSlots);
                                    setShowColorPicker(false);
                                }}
                                className="w-6 h-6 rounded-full border border-zinc-600 hover:scale-110 transition-transform"
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </NodeViewWrapper>
    );
};

export default DrawingNode;

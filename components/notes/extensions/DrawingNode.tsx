import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
    Eraser, Pen, Trash2, Undo2, Redo2, Highlighter, Palette,
    Lasso, LayoutTemplate, ZoomIn, ZoomOut, Move, Maximize2,
    Minimize2, Settings2, Download, Pencil, PenTool
} from 'lucide-react';
import { getStroke } from 'perfect-freehand';
import {
    getSvgPathFromStroke,
    PEN_PRESETS,
    smoothPoints,
    normalizePressure,
    isPalmTouch,
    COLOR_PALETTES
} from '../../../utils/drawingUtils';

// Types
type Point = [number, number, number]; // x, y, pressure

interface Line {
    points: Point[];
    color: string;
    width: number;
    tool: 'pen' | 'highlighter' | 'eraser';
    penType?: string;
    timestamp?: number;
}

// Tool configurations
const TOOLS = [
    { id: 'pen', icon: Pen, label: 'Caneta' },
    { id: 'pencil', icon: Pencil, label: 'Lápis' },
    { id: 'highlighter', icon: Highlighter, label: 'Marca-texto' },
    { id: 'eraser', icon: Eraser, label: 'Borracha' },
    { id: 'lasso', icon: Lasso, label: 'Seleção' },
] as const;

const PEN_TYPES = [
    { id: 'ballpoint', label: 'Esferográfica' },
    { id: 'fountain', label: 'Tinteiro' },
    { id: 'brush', label: 'Pincel' },
    { id: 'calligraphy', label: 'Caligrafia' },
    { id: 'marker', label: 'Marcador' },
    { id: 'felt', label: 'Hidrocor' },
] as const;

const DEFAULT_COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];

const DrawingNode: React.FC<NodeViewProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });

    // Tools state
    const [selectedTool, setSelectedTool] = useState<'pen' | 'pencil' | 'eraser' | 'highlighter' | 'lasso'>('pen');
    const [penType, setPenType] = useState<string>('ballpoint');
    const [eraserMode, setEraserMode] = useState<'stroke' | 'pixel'>('stroke');

    // Quick slots for colors and widths
    const [colorSlots, setColorSlots] = useState<string[]>(DEFAULT_COLORS);
    const [activeColorSlot, setActiveColorSlot] = useState(0);
    const [widthSlots, setWidthSlots] = useState<number[]>([2, 4, 8]);
    const [activeWidthSlot, setActiveWidthSlot] = useState(1);

    // UI State
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showPaperMenu, setShowPaperMenu] = useState(false);
    const [showPenMenu, setShowPenMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Canvas State
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    // Paper State
    const [paperType, setPaperType] = useState<'blank' | 'ruled' | 'grid' | 'dot' | 'isometric'>
        (props.node.attrs.paperType || 'blank');
    const [paperColor, setPaperColor] = useState<'white' | 'yellow' | 'dark' | 'cream'>
        (props.node.attrs.paperColor || 'white');

    // Settings
    const [pressureSensitivity, setPressureSensitivity] = useState(1.0);
    const [smoothingEnabled, setSmoothingEnabled] = useState(true);
    const [palmRejection, setPalmRejection] = useState(true);

    // Selection/Lasso State
    const [selectionPoints, setSelectionPoints] = useState<Point[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [isDraggingSelection, setIsDraggingSelection] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

    // Derived current state
    const currentColor = colorSlots[activeColorSlot];
    const currentWidth = widthSlots[activeWidthSlot];

    // Data state
    const [lines, setLines] = useState<Line[]>([]);
    const [currentLine, setCurrentLine] = useState<Line | null>(null);
    const [history, setHistory] = useState<Line[][]>([]);
    const [redoStack, setRedoStack] = useState<Line[][]>([]);

    // Canvas dimensions
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

    // Load initial data
    useEffect(() => {
        let loadedLines = props.node.attrs.lines || [];
        // Migration from old format
        if (loadedLines.length > 0 && loadedLines[0].points.length > 0 &&
            typeof loadedLines[0].points[0] === 'object' && !Array.isArray(loadedLines[0].points[0])) {
            loadedLines = loadedLines.map((l: any) => ({
                ...l,
                points: l.points.map((p: any) => [p.x, p.y, p.pressure || 0.5])
            }));
        }
        setLines(loadedLines);
    }, []);

    // Sync width presets based on tool
    useEffect(() => {
        switch (selectedTool) {
            case 'highlighter':
                setWidthSlots([12, 24, 36]);
                break;
            case 'eraser':
                setWidthSlots([10, 25, 50]);
                break;
            case 'pencil':
                setWidthSlots([1, 2, 4]);
                break;
            default:
                setWidthSlots([2, 4, 8]);
        }
        setActiveWidthSlot(1);
    }, [selectedTool]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case 'p':
                    setSelectedTool('pen');
                    break;
                case 'e':
                    setSelectedTool('eraser');
                    break;
                case 'h':
                    setSelectedTool('highlighter');
                    break;
                case 'l':
                    setSelectedTool('lasso');
                    break;
                case 'z':
                    if (e.ctrlKey || e.metaKey) {
                        if (e.shiftKey) {
                            handleRedo();
                        } else {
                            handleUndo();
                        }
                        e.preventDefault();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                    setActiveColorSlot(parseInt(e.key) - 1);
                    break;
                case '[':
                    setActiveWidthSlot(prev => Math.max(0, prev - 1));
                    break;
                case ']':
                    setActiveWidthSlot(prev => Math.min(widthSlots.length - 1, prev + 1));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [widthSlots.length]);

    const updateAttributes = useCallback((newLines: Line[]) => {
        props.updateAttributes({ lines: newLines, paperType, paperColor });
    }, [props, paperType, paperColor]);

    // --- Rendering ---
    const renderLine = useCallback((ctx: CanvasRenderingContext2D, line: Line, isSelected: boolean = false) => {
        if (line.points.length === 0) return;

        // Get the preset, defaulting to ballpoint if not found
        const presetKey = line.tool === 'pencil' ? 'pencil' : (line.penType || 'ballpoint');
        const preset = PEN_PRESETS[presetKey] || PEN_PRESETS.ballpoint;
        const options = { ...preset, size: line.width };

        // Highlighter specific rendering
        if (line.tool === 'highlighter') {
            options.size = line.width * 1.5;
            options.thinning = 0;
            options.smoothing = 0.5;
            ctx.globalAlpha = 0.35;
            ctx.globalCompositeOperation = 'multiply';
        } else {
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
        }

        // Selection highlight glow
        if (isSelected) {
            ctx.shadowColor = '#3b82f6';
            ctx.shadowBlur = 12;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        // Apply smoothing to points
        const pointsToRender = smoothingEnabled && line.points.length > 3
            ? smoothPoints(line.points, 3)
            : line.points;

        const stroke = getStroke(pointsToRender, options);
        const pathData = getSvgPathFromStroke(stroke);
        const path = new Path2D(pathData);

        ctx.fillStyle = line.color;
        ctx.fill(path);

        // Reset context
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
    }, [smoothingEnabled]);

    const drawPaperPattern = useCallback((ctx: CanvasRenderingContext2D) => {
        const { width, height } = canvasSize;

        // Background colors
        const bgColors = {
            white: '#ffffff',
            yellow: '#fefce8',
            dark: '#1f2937',
            cream: '#fef3c7'
        };

        const lineColors = {
            white: '#e5e7eb',
            yellow: '#ca8a04',
            dark: '#374151',
            cream: '#d97706'
        };

        ctx.fillStyle = bgColors[paperColor];
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = lineColors[paperColor];
        ctx.lineWidth = 0.5;

        const spacing = 25;

        switch (paperType) {
            case 'ruled':
                for (let y = spacing; y < height; y += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                break;
            case 'grid':
                for (let x = spacing; x < width; x += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                }
                for (let y = spacing; y < height; y += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                break;
            case 'dot':
                ctx.fillStyle = lineColors[paperColor];
                for (let x = spacing; x < width; x += spacing) {
                    for (let y = spacing; y < height; y += spacing) {
                        ctx.beginPath();
                        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
            case 'isometric':
                const isoSpacing = 30;
                ctx.strokeStyle = lineColors[paperColor];
                // Horizontal lines
                for (let y = 0; y < height; y += isoSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                // Diagonal lines (30 degrees)
                for (let x = -height; x < width + height; x += isoSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x + height * Math.tan(Math.PI / 6), height);
                    ctx.stroke();
                }
                for (let x = 0; x < width + height; x += isoSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x - height * Math.tan(Math.PI / 6), height);
                    ctx.stroke();
                }
                break;
        }
    }, [canvasSize, paperColor, paperType]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and draw paper pattern
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaperPattern(ctx);

        // Apply zoom and pan transform
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        // Draw all lines with layer ordering (highlighters behind)
        const highlighters = lines.filter(l => l.tool === 'highlighter');
        const others = lines.filter(l => l.tool !== 'highlighter');

        highlighters.forEach((line, i) => {
            const originalIndex = lines.indexOf(line);
            renderLine(ctx, line, selectedIndices.has(originalIndex));
        });

        others.forEach((line, i) => {
            const originalIndex = lines.indexOf(line);
            renderLine(ctx, line, selectedIndices.has(originalIndex));
        });

        // Draw current active line
        if (currentLine) {
            renderLine(ctx, currentLine);
        }

        // Draw Lasso Selection
        if (selectionPoints.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2 / zoom;
            ctx.setLineDash([5 / zoom, 5 / zoom]);

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

        ctx.restore();
    }, [lines, currentLine, selectionPoints, selectedIndices, renderLine, drawPaperPattern, zoom, pan]);

    useEffect(() => {
        requestAnimationFrame(draw);
    }, [draw]);

    // --- Interaction ---
    const getCoords = useCallback((e: React.PointerEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        const pressure = normalizePressure(e.pressure || 0.5, pressureSensitivity);
        return { x, y, pressure };
    }, [pan, zoom, pressureSensitivity]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        // Palm rejection
        if (palmRejection && isPalmTouch(e.clientX, e.clientY, canvasSize.width, canvasSize.height,
            (e as any).radiusX, (e as any).radiusY)) {
            return;
        }

        // Middle mouse button for panning
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
            return;
        }

        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDrawing(true);
        const { x, y, pressure } = getCoords(e);

        if (selectedTool === 'lasso') {
            if (selectedIndices.size > 0 && isPointInSelection(x, y)) {
                setIsDraggingSelection(true);
                setDragStart({ x, y });
            } else {
                setSelectedIndices(new Set());
                setSelectionPoints([[x, y, pressure]]);
            }
            return;
        }

        // Save history before starting new stroke
        if (selectedTool !== 'eraser') {
            setHistory(prev => [...prev.slice(-50), lines]); // Keep last 50 states
            setRedoStack([]);
        }

        const effectiveTool = selectedTool === 'pencil' ? 'pen' : selectedTool;
        const effectivePenType = selectedTool === 'pencil' ? 'pencil' : penType;

        const newLine: Line = {
            points: [[x, y, pressure]],
            color: currentColor,
            width: currentWidth,
            tool: effectiveTool as 'pen' | 'highlighter' | 'eraser',
            penType: selectedTool === 'pen' || selectedTool === 'pencil' ? effectivePenType : undefined,
            timestamp: Date.now()
        };

        if (selectedTool === 'eraser') {
            // For eraser, save history now
            setHistory(prev => [...prev.slice(-50), lines]);
            setRedoStack([]);
        } else {
            setCurrentLine(newLine);
        }
    }, [selectedTool, penType, currentColor, currentWidth, lines, selectedIndices, pan, getCoords, palmRejection, canvasSize]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setCursorPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                visible: true
            });
        }

        if (isPanning) {
            setPan({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            });
            return;
        }

        if (!isDrawing) return;
        const { x, y, pressure } = getCoords(e);

        if (selectedTool === 'lasso') {
            if (isDraggingSelection && dragStart) {
                const dx = x - dragStart.x;
                const dy = y - dragStart.y;

                setLines(prev => {
                    const newLines = [...prev];
                    selectedIndices.forEach(idx => {
                        newLines[idx] = {
                            ...newLines[idx],
                            points: newLines[idx].points.map(([px, py, pp]) => [px + dx, py + dy, pp] as Point)
                        };
                    });
                    return newLines;
                });
                setDragStart({ x, y });
            } else {
                setSelectionPoints(prev => [...prev, [x, y, pressure]]);
            }
            return;
        }

        if (selectedTool === 'eraser') {
            const eraserRadius = currentWidth * 2;
            if (eraserMode === 'stroke') {
                setLines(prev => prev.filter(line => {
                    for (const p of line.points) {
                        if (Math.hypot(p[0] - x, p[1] - y) < eraserRadius) {
                            return false;
                        }
                    }
                    return true;
                }));
            } else {
                // Pixel eraser - remove individual points
                setLines(prev => prev.map(line => ({
                    ...line,
                    points: line.points.filter(p => Math.hypot(p[0] - x, p[1] - y) >= eraserRadius)
                })).filter(line => line.points.length > 2));
            }
            return;
        }

        if (currentLine) {
            setCurrentLine(prev => prev ? {
                ...prev,
                points: [...prev.points, [x, y, pressure]]
            } : null);
        }
    }, [isDrawing, isPanning, panStart, selectedTool, isDraggingSelection, dragStart, selectedIndices, currentLine, currentWidth, eraserMode, getCoords]);

    const handlePointerUp = useCallback(() => {
        setIsDrawing(false);
        setIsPanning(false);
        setDragStart(null);
        setIsDraggingSelection(false);

        if (selectedTool === 'lasso') {
            if (selectionPoints.length > 2) {
                const indices = new Set<number>();
                lines.forEach((line, i) => {
                    // Check if any point of the line is inside the polygon
                    if (line.points.some(p => isPointInPolygon(p, selectionPoints))) {
                        indices.add(i);
                    }
                });
                setSelectedIndices(indices);
            }
            setSelectionPoints([]);
            return;
        }

        if (currentLine && currentLine.points.length > 1) {
            const newLines = [...lines, currentLine];
            setLines(newLines);
            updateAttributes(newLines);
        }
        setCurrentLine(null);

        if (selectedTool === 'eraser') {
            updateAttributes(lines);
        }
    }, [selectedTool, selectionPoints, lines, currentLine, updateAttributes]);

    const handlePointerLeave = useCallback(() => {
        setCursorPos(prev => ({ ...prev, visible: false }));
        if (isDrawing) {
            handlePointerUp();
        }
    }, [isDrawing, handlePointerUp]);

    // Point in polygon check
    const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
        const x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    const isPointInSelection = (x: number, y: number): boolean => {
        if (selectedIndices.size === 0) return false;
        // Check if point is near any selected line
        for (const idx of selectedIndices) {
            const line = lines[idx];
            if (line) {
                for (const p of line.points) {
                    if (Math.hypot(p[0] - x, p[1] - y) < 20) return true;
                }
            }
        }
        return false;
    };

    // Actions
    const clearCanvas = () => {
        setHistory(prev => [...prev, lines]);
        setLines([]);
        setSelectedIndices(new Set());
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

    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 4));
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.25));
    const handleResetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            setCanvasSize({ width: window.innerWidth - 48, height: window.innerHeight - 200 });
        } else {
            setCanvasSize({ width: 800, height: 600 });
        }
        setIsFullscreen(!isFullscreen);
    };

    const exportCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `drawing-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Custom cursor style
    const getCursorStyle = useMemo(() => {
        if (selectedTool === 'lasso') return 'crosshair';
        if (selectedTool === 'eraser') return 'none';
        return 'none';
    }, [selectedTool]);

    const cursorSize = useMemo(() => {
        if (selectedTool === 'eraser') return currentWidth * 4;
        if (selectedTool === 'highlighter') return currentWidth * 1.5;
        return currentWidth * 2;
    }, [selectedTool, currentWidth]);

    return (
        <NodeViewWrapper className="drawing-component my-6 select-none animate-in fade-in zoom-in-95 duration-300">
            <div
                ref={containerRef}
                className={`border border-zinc-700/50 rounded-xl bg-zinc-900 overflow-hidden shadow-2xl relative group ring-1 ring-white/5 transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
            >
                {/* Main Toolbar */}
                <div className="flex flex-col gap-2 p-3 bg-gradient-to-b from-zinc-800/95 to-zinc-800/80 backdrop-blur-xl border-b border-zinc-700/50">
                    <div className="flex items-center justify-between gap-3">
                        {/* Tool Selection */}
                        <div className="flex items-center bg-zinc-900/60 p-1 rounded-xl border border-white/5 shadow-inner">
                            {TOOLS.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => setSelectedTool(tool.id as any)}
                                    className={`p-2.5 rounded-lg transition-all duration-200 relative
                                        ${selectedTool === tool.id
                                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                                    title={`${tool.label} (${tool.id[0].toUpperCase()})`}
                                >
                                    <tool.icon size={18} strokeWidth={selectedTool === tool.id ? 2.5 : 2} />
                                </button>
                            ))}
                        </div>

                        <div className="w-px h-8 bg-zinc-700/50" />

                        {/* Pen Type Selector (when pen is selected) */}
                        {(selectedTool === 'pen') && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowPenMenu(!showPenMenu)}
                                    className="flex items-center gap-2 px-3 py-2 bg-zinc-900/60 rounded-lg border border-white/5 text-zinc-300 hover:text-white transition-colors"
                                >
                                    <PenTool size={16} />
                                    <span className="text-sm font-medium">{PEN_TYPES.find(p => p.id === penType)?.label}</span>
                                </button>
                                {showPenMenu && (
                                    <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 min-w-[160px] animate-in slide-in-from-top-2">
                                        {PEN_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => { setPenType(type.id); setShowPenMenu(false); }}
                                                className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors
                                                    ${penType === type.id ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-300 hover:bg-zinc-700'}`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Eraser Mode Toggle */}
                        {selectedTool === 'eraser' && (
                            <div className="flex bg-zinc-900/60 p-1 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setEraserMode('stroke')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all
                                        ${eraserMode === 'stroke' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Traço
                                </button>
                                <button
                                    onClick={() => setEraserMode('pixel')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all
                                        ${eraserMode === 'pixel' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Pixel
                                </button>
                            </div>
                        )}

                        <div className="flex-1" />

                        {/* View Controls */}
                        <div className="flex items-center gap-1">
                            <button onClick={handleZoomOut} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Zoom Out (-)">
                                <ZoomOut size={18} />
                            </button>
                            <span className="text-xs text-zinc-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={handleZoomIn} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Zoom In (+)">
                                <ZoomIn size={18} />
                            </button>
                            <button onClick={handleResetView} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Reset View">
                                <Move size={18} />
                            </button>
                        </div>

                        <div className="w-px h-8 bg-zinc-700/50" />

                        {/* Paper Menu */}
                        <div className="relative">
                            <button onClick={() => setShowPaperMenu(!showPaperMenu)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                                <LayoutTemplate size={18} />
                            </button>
                            {showPaperMenu && (
                                <div className="absolute top-full right-0 mt-2 p-4 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 w-72 animate-in slide-in-from-top-2">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Tipo de Papel</h4>
                                    <div className="grid grid-cols-5 gap-2 mb-4">
                                        {(['blank', 'ruled', 'grid', 'dot', 'isometric'] as const).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setPaperType(t)}
                                                className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-[10px] font-medium
                                                    ${paperType === t ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900'}`}
                                            >
                                                {t === 'blank' ? '—' : t === 'ruled' ? '≡' : t === 'grid' ? '⊞' : t === 'dot' ? '⋯' : '◇'}
                                            </button>
                                        ))}
                                    </div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Cor de Fundo</h4>
                                    <div className="flex gap-3">
                                        {(['white', 'cream', 'yellow', 'dark'] as const).map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setPaperColor(c)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all
                                                    ${paperColor === c ? 'border-blue-500 ring-2 ring-blue-500/20 scale-110' : 'border-zinc-600 hover:scale-105'}`}
                                                style={{
                                                    backgroundColor: c === 'white' ? '#fff' : c === 'cream' ? '#fef3c7' : c === 'yellow' ? '#fefce8' : '#1f2937'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="relative">
                            <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                                <Settings2 size={18} />
                            </button>
                            {showSettings && (
                                <div className="absolute top-full right-0 mt-2 p-4 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 w-64 animate-in slide-in-from-top-2">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Configurações</h4>

                                    <label className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-zinc-300">Suavização</span>
                                        <button
                                            onClick={() => setSmoothingEnabled(!smoothingEnabled)}
                                            className={`w-10 h-6 rounded-full transition-colors relative
                                                ${smoothingEnabled ? 'bg-blue-500' : 'bg-zinc-600'}`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                                                ${smoothingEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                    </label>

                                    <label className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-zinc-300">Palm Rejection</span>
                                        <button
                                            onClick={() => setPalmRejection(!palmRejection)}
                                            className={`w-10 h-6 rounded-full transition-colors relative
                                                ${palmRejection ? 'bg-blue-500' : 'bg-zinc-600'}`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                                                ${palmRejection ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                    </label>

                                    <label className="block mb-2">
                                        <span className="text-sm text-zinc-300 mb-1 block">Sensibilidade à Pressão</span>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2"
                                            step="0.1"
                                            value={pressureSensitivity}
                                            onChange={(e) => setPressureSensitivity(parseFloat(e.target.value))}
                                            className="w-full accent-blue-500"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <button onClick={handleUndo} disabled={history.length === 0} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-30 transition-colors" title="Desfazer (Ctrl+Z)">
                                <Undo2 size={18} />
                            </button>
                            <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-30 transition-colors" title="Refazer (Ctrl+Shift+Z)">
                                <Redo2 size={18} />
                            </button>
                            <button onClick={exportCanvas} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Exportar PNG">
                                <Download size={18} />
                            </button>
                            <button onClick={toggleFullscreen} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Tela Cheia">
                                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button onClick={clearCanvas} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors" title="Limpar Tudo">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Secondary Toolbar: Colors & Widths */}
                    {(selectedTool === 'pen' || selectedTool === 'pencil' || selectedTool === 'highlighter') && (
                        <div className="flex items-center gap-4 pt-1 animate-in slide-in-from-top-1">
                            {/* Color Slots */}
                            <div className="flex items-center bg-zinc-900/60 p-1.5 rounded-xl border border-white/5 gap-2">
                                {colorSlots.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveColorSlot(i)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all duration-200
                                            ${activeColorSlot === i
                                                ? 'scale-110 border-white shadow-lg ring-2 ring-white/20'
                                                : 'border-transparent hover:scale-105 hover:border-white/30'}`}
                                        style={{ backgroundColor: c }}
                                        title={`Cor ${i + 1} (${i + 1})`}
                                    />
                                ))}
                                <div className="w-px h-6 bg-zinc-700 mx-1" />
                                <button
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center hover:scale-105 transition-transform border border-white/20"
                                    title="Mais Cores"
                                >
                                    <Palette size={14} className="text-white drop-shadow" />
                                </button>
                            </div>

                            {/* Width Slots */}
                            <div className="flex items-center bg-zinc-900/60 p-1.5 rounded-xl border border-white/5 gap-1">
                                {widthSlots.map((w, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveWidthSlot(i)}
                                        className={`w-10 h-8 flex items-center justify-center rounded-lg transition-all
                                            ${activeWidthSlot === i ? 'bg-zinc-700 ring-1 ring-white/10' : 'hover:bg-zinc-800'}`}
                                        title={`Espessura ${i + 1} ([/])`}
                                    >
                                        <div
                                            className="rounded-full bg-zinc-300"
                                            style={{
                                                width: Math.max(4, w * (selectedTool === 'highlighter' ? 0.5 : 1)),
                                                height: Math.max(4, w * (selectedTool === 'highlighter' ? 0.5 : 1))
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Canvas Area */}
                <div className="relative overflow-hidden" style={{ height: canvasSize.height }}>
                    <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        style={{ cursor: getCursorStyle }}
                        className="w-full h-full touch-none outline-none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerLeave}
                        onWheel={(e) => {
                            if (e.ctrlKey) {
                                e.preventDefault();
                                if (e.deltaY < 0) handleZoomIn();
                                else handleZoomOut();
                            }
                        }}
                    />

                    {/* Custom Cursor Overlay */}
                    {cursorPos.visible && selectedTool !== 'lasso' && (
                        <div
                            ref={cursorRef}
                            className="pointer-events-none fixed z-50 rounded-full border-2 transition-all duration-75"
                            style={{
                                width: cursorSize,
                                height: cursorSize,
                                left: (canvasRef.current?.getBoundingClientRect().left || 0) + cursorPos.x - cursorSize / 2,
                                top: (canvasRef.current?.getBoundingClientRect().top || 0) + cursorPos.y - cursorSize / 2,
                                borderColor: selectedTool === 'eraser' ? '#ef4444' : currentColor,
                                backgroundColor: selectedTool === 'eraser'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : selectedTool === 'highlighter'
                                        ? `${currentColor}40`
                                        : 'transparent',
                                transform: `scale(${zoom})`,
                            }}
                        />
                    )}

                    {/* Zoom indicator */}
                    {zoom !== 1 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                            {Math.round(zoom * 100)}%
                        </div>
                    )}
                </div>

                {/* Color Picker Popover */}
                {showColorPicker && (
                    <div
                        className="absolute z-50 p-4 bg-zinc-800/95 backdrop-blur-xl border border-zinc-600 rounded-2xl shadow-2xl left-4 top-32 animate-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Paletas</h4>
                        {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                            <div key={name} className="mb-3">
                                <span className="text-xs text-zinc-400 capitalize">{name}</span>
                                <div className="flex gap-2 mt-1">
                                    {colors.map((c, i) => (
                                        <button
                                            key={`${name}-${i}`}
                                            onClick={() => {
                                                const newSlots = [...colorSlots];
                                                newSlots[activeColorSlot] = c;
                                                setColorSlots(newSlots);
                                                setShowColorPicker(false);
                                            }}
                                            className="w-6 h-6 rounded-full border border-white/20 hover:scale-125 transition-transform shadow-lg"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setShowColorPicker(false)}
                            className="w-full mt-2 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                )}

                {/* Keyboard Shortcuts Help */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-zinc-600">
                    P: Caneta | E: Borracha | H: Marca-texto | L: Laço | 1-3: Cores | [/]: Espessura | Ctrl+Z/Y: Desfazer/Refazer
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default DrawingNode;

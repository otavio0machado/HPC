import React, { useRef, useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Eraser, Pen, Trash2 } from 'lucide-react';

const DrawingNode: React.FC<NodeViewProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lines, setLines] = useState<Array<{ points: Array<{ x: number; y: number }>; color: string }>>(
        props.node.attrs.lines || []
    );

    useEffect(() => {
        draw();
    }, [lines]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;

        lines.forEach((line) => {
            ctx.beginPath();
            ctx.strokeStyle = line.color;
            if (line.points.length > 0) {
                ctx.moveTo(line.points[0].x, line.points[0].y);
                line.points.forEach((point) => {
                    ctx.lineTo(point.x, point.y);
                });
            }
            ctx.stroke();
        });
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(event);

        const newLine = { points: [{ x: offsetX, y: offsetY }], color: color };
        setLines([...lines, newLine]);
    };

    const drawMove = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        // Prevent scrolling on touch devices
        if ('touches' in event) {
            // event.preventDefault() - can't do this easily in React synthetic event without { passive: false }
        }

        const { offsetX, offsetY } = getCoordinates(event);

        const newLines = [...lines];
        const currentLine = newLines[newLines.length - 1];
        currentLine.points.push({ x: offsetX, y: offsetY });
        setLines(newLines);
        draw();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            props.updateAttributes({ lines });
        }
    };

    const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };

        if ('touches' in event) {
            const touch = event.touches[0];
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            };
        } else {
            return {
                offsetX: (event as React.MouseEvent).nativeEvent.offsetX,
                offsetY: (event as React.MouseEvent).nativeEvent.offsetY
            };
        }
    };

    const clearCanvas = () => {
        setLines([]);
        props.updateAttributes({ lines: [] });
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <NodeViewWrapper className="drawing-component my-4">
            <div className="border border-zinc-700 rounded-lg bg-zinc-50 overflow-hidden relative group">
                <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800/80 p-1 rounded-md backdrop-blur-sm">
                    <button
                        onClick={() => setColor('#000000')}
                        className={`p-1.5 rounded hover:bg-zinc-700 transition-colors ${color === '#000000' ? 'text-blue-400' : 'text-zinc-300'}`}
                        title="Preto"
                    >
                        <Pen size={14} />
                    </button>
                    <button
                        onClick={() => setColor('#ef4444')}
                        className={`p-1.5 rounded hover:bg-zinc-700 transition-colors ${color === '#ef4444' ? 'text-red-400' : 'text-zinc-300'}`}
                        title="Vermelho"
                    >
                        <Pen size={14} className="text-red-500" />
                    </button>
                    <button
                        onClick={() => setColor('#3b82f6')}
                        className={`p-1.5 rounded hover:bg-zinc-700 transition-colors ${color === '#3b82f6' ? 'text-blue-400' : 'text-zinc-300'}`}
                        title="Azul"
                    >
                        <Pen size={14} className="text-blue-500" />
                    </button>
                    <div className="w-px h-4 bg-zinc-600 self-center mx-1"></div>
                    <button
                        onClick={clearCanvas}
                        className="p-1.5 rounded text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        title="Limpar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                <canvas
                    ref={canvasRef}
                    width={600}
                    height={300}
                    className="w-full h-[300px] cursor-crosshair touch-none bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={drawMove}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={drawMove}
                    onTouchEnd={stopDrawing}
                />
                <div className="absolute bottom-1 right-2 text-xs text-zinc-400 pointer-events-none select-none">
                    Sketch Pad
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default DrawingNode;

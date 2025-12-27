import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, FileText, Type, Sticker, Save, Trash2, MousePointer2 } from 'lucide-react';
import { whiteboardService, InfiniteCanvas, CanvasNode } from '../../services/whiteboardService';
import { toast } from 'sonner';

interface WhiteboardProps {
    canvasId?: string; // Optional if we support multiple boards
}

const NOTE_COLORS = [
    'bg-yellow-100 text-yellow-900 border-yellow-200',
    'bg-blue-100 text-blue-900 border-blue-200',
    'bg-red-100 text-red-900 border-red-200',
    'bg-green-100 text-green-900 border-green-200',
    'bg-purple-100 text-purple-900 border-purple-200',
    'bg-zinc-900 text-zinc-100 border-zinc-700 glass-card', // Dark/Glass note
];

const Whiteboard: React.FC<WhiteboardProps> = ({ canvasId = 'default' }) => {
    const [nodes, setNodes] = useState<CanvasNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [tool, setTool] = useState<'select' | 'note' | 'text'>('select');

    // Load initial data
    useEffect(() => {
        const load = async () => {
            const canvases = await whiteboardService.fetchCanvases();
            const canvas = canvases.find(c => c.id === canvasId);
            if (canvas) {
                setNodes(canvas.nodes);
            } else {
                // Init generic canvas if none
                await whiteboardService.saveCanvas({
                    id: canvasId,
                    userId: 'local',
                    name: 'Meu Quadro',
                    nodes: [],
                    updatedAt: Date.now()
                });
            }
        };
        load();
    }, [canvasId]);

    // Save on change (debounced manually for now)
    const saveBoard = async () => {
        await whiteboardService.saveCanvas({
            id: canvasId,
            userId: 'local',
            name: 'Meu Quadro',
            nodes,
            updatedAt: Date.now()
        });
        toast.success("Quadro salvo!");
    };

    const addNode = (type: CanvasNode['type'], x: number, y: number) => {
        const color = type === 'note' ? NOTE_COLORS[Math.floor(Math.random() * (NOTE_COLORS.length - 1))] : undefined; // Exclude glass by default for fun
        const newNode: CanvasNode = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x,
            y,
            content: type === 'text' ? 'Novo Texto' : '',
            style: {
                width: type === 'note' ? 200 : undefined,
                height: type === 'note' ? 200 : undefined,
                color: color
            }
        };
        setNodes([...nodes, newNode]);
        setTool('select');
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (tool !== 'select') {
            // In a real app we need to map screen coords to canvas coords using the transform state
            // For this MVP we will just spawn in center + offset or rough approximation
            // Ideally we use reference to transform component to get scale/position
            addNode(tool, Math.random() * 500, Math.random() * 500);
        }
    };

    const updateNodePos = (id: string, deltaX: number, deltaY: number) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, x: n.x + deltaX, y: n.y + deltaY } : n));
    };

    // Draggable Logic (Simplistic)
    const dragRef = useRef<{ id: string, startX: number, startY: number } | null>(null);

    const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedNode(id);
        dragRef.current = { id, startX: e.clientX, startY: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragRef.current) {
            const dx = (e.clientX - dragRef.current.startX) / 1; // Divide by scale if needed
            const dy = (e.clientY - dragRef.current.startY) / 1;
            updateNodePos(dragRef.current.id, dx, dy);
            dragRef.current = { ...dragRef.current, startX: e.clientX, startY: e.clientY };
        }
    };

    const handleMouseUp = () => {
        dragRef.current = null;
    };

    const updateNodeContent = (id: string, content: string) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, content } : n));
    };

    const renderNode = (node: CanvasNode) => {
        return (
            <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                className={`absolute cursor-grab active:cursor-grabbing shadow-lg rounded-xl p-4 transition-shadow ${node.style?.color || 'bg-white text-black'} ${selectedNode === node.id ? 'ring-2 ring-blue-500 shadow-2xl z-10' : ''}`}
                style={{
                    left: node.x,
                    top: node.y,
                    width: node.style?.width,
                    minHeight: node.style?.height,
                }}
            >
                {node.type === 'note' && (
                    <textarea
                        className="w-full h-full bg-transparent resize-none outline-none font-handwriting text-lg"
                        placeholder="Escreva algo..."
                        value={node.content}
                        onChange={(e) => updateNodeContent(node.id, e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()} // Allow text selection
                    />
                )}
                {node.type === 'text' && (
                    <input
                        className="bg-transparent outline-none font-bold text-2xl min-w-[200px]"
                        value={node.content}
                        onChange={(e) => updateNodeContent(node.id, e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="h-full w-full relative bg-[#f0f2f5] overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl flex gap-2 z-50 border border-white/20">
                <button onClick={() => setTool('select')} className={`p-3 rounded-xl transition-all ${tool === 'select' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-black/5 text-zinc-600'}`}>
                    <MousePointer2 size={20} />
                </button>
                <button onClick={() => setTool('note')} className={`p-3 rounded-xl transition-all ${tool === 'note' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-black/5 text-zinc-600'}`}>
                    <FileText size={20} />
                </button>
                <button onClick={() => setTool('text')} className={`p-3 rounded-xl transition-all ${tool === 'text' ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-black/5 text-zinc-600'}`}>
                    <Type size={20} />
                </button>
                <div className="w-px bg-zinc-300 h-8 self-center mx-1" />
                <button onClick={saveBoard} className="p-3 rounded-xl hover:bg-green-500/10 text-green-600 transition-all">
                    <Save size={20} />
                </button>
            </div>

            {/* Canvas */}
            <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={4}
                centerOnInit
                limitToBounds={false}
                panning={{ disabled: tool !== 'select' && dragRef.current === null }} // Disable pan when dragging node or using tool? Actually we want pan usually, but maybe using spacebar?
            // For MVP, pan is always enabled unless dragging a node (handled by stopPropagation in node)
            >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <TransformComponent
                        wrapperClass="h-full w-full"
                        contentClass="h-full w-full"
                    >
                        <div
                            className="w-[5000px] h-[5000px] relative bg-dot-pattern opacity-100" // Huge canvas
                            style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                            onClick={handleCanvasClick}
                        >
                            {/* Render Nodes */}
                            {nodes.map(renderNode)}

                            {/* Simple text hint in center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none select-none text-6xl font-black opacity-20">
                                QUADRO INFINITO
                            </div>
                        </div>
                    </TransformComponent>
                )}
            </TransformWrapper>
        </div>
    );
};

export default Whiteboard;

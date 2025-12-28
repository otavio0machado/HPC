import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Image as ImageIcon, FileText, Type, Sticker, Save,
    Trash2, MousePointer2, Move, ZoomIn, ZoomOut, RotateCcw,
    Grid, X
} from 'lucide-react';
import { whiteboardService, InfiniteCanvas, CanvasNode } from '../../services/whiteboardService';
import { toast } from 'sonner';

interface WhiteboardProps {
    canvasId?: string;
}

const NOTE_COLORS = [
    { name: 'Yellow', bg: 'bg-yellow-200/90 dark:bg-yellow-900/40', border: 'border-yellow-300/50', text: 'text-yellow-900 dark:text-yellow-100' },
    { name: 'Blue', bg: 'bg-blue-200/90 dark:bg-blue-900/40', border: 'border-blue-300/50', text: 'text-blue-900 dark:text-blue-100' },
    { name: 'Green', bg: 'bg-green-200/90 dark:bg-green-900/40', border: 'border-green-300/50', text: 'text-green-900 dark:text-green-100' },
    { name: 'Pink', bg: 'bg-pink-200/90 dark:bg-pink-900/40', border: 'border-pink-300/50', text: 'text-pink-900 dark:text-pink-100' },
    { name: 'Glass', bg: 'bg-white/10 dark:bg-black/40 backdrop-blur-md', border: 'border-white/20', text: 'text-zinc-800 dark:text-zinc-100' },
];

const Whiteboard: React.FC<WhiteboardProps> = ({ canvasId = 'default' }) => {
    // State
    const [nodes, setNodes] = useState<CanvasNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [tool, setTool] = useState<'select' | 'note' | 'text'>('select');
    const [isSaving, setIsSaving] = useState(false);

    // Drag data
    const dragRef = useRef<{ id: string, startX: number, startY: number } | null>(null);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            try {
                const canvases = await whiteboardService.fetchCanvases();
                if (canvases.length > 0) {
                    setNodes(canvases[0].nodes);
                }
            } catch (e) {
                console.error("Failed to load whiteboard", e);
                toast.error("Erro ao carregar quadro");
            }
        };
        load();
    }, [canvasId]);

    // Save Action
    const saveBoard = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const canvases = await whiteboardService.fetchCanvases();
            const existingId = canvases.length > 0 ? canvases[0].id : undefined;

            await whiteboardService.saveCanvas({
                id: existingId,
                name: 'Meu Quadro Principal',
                nodes,
                updatedAt: Date.now()
            } as any);

            toast.success("Quadro salvo!", {
                icon: <Save size={16} className="text-green-500" />,
                style: { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#fff' }
            });
        } catch (e) {
            console.error("Save failed", e);
            toast.error("Erro ao salvar");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Helpers ---

    const addNode = (type: CanvasNode['type'], x: number, y: number) => {
        const randomColor = NOTE_COLORS[Math.floor(Math.random() * (NOTE_COLORS.length - 1))]; // Default non-glass

        const newNode: CanvasNode = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x,
            y,
            content: type === 'text' ? 'Novo Texto' : '',
            style: {
                width: type === 'note' ? 240 : undefined,
                height: type === 'note' ? 240 : undefined,
                color: type === 'note' ? JSON.stringify(randomColor) : undefined
            }
        };
        setNodes([...nodes, newNode]);
        setSelectedNode(newNode.id);
        setTool('select');
    };

    const deleteSelectedNode = () => {
        if (selectedNode) {
            setNodes(nodes.filter(n => n.id !== selectedNode));
            setSelectedNode(null);
            toast("Elemento removido");
        }
    };

    const changeNodeColor = (nodeId: string, colorTheme: any) => {
        setNodes(nodes.map(n => n.id === nodeId ? { ...n, style: { ...n.style, color: JSON.stringify(colorTheme) } } : n));
    };

    // --- Event Handlers ---

    const handleCanvasClick = (e: React.MouseEvent) => {
        // If clicking on empty space, deselect
        if (e.target === e.currentTarget) {
            setSelectedNode(null);
        }

        if (tool !== 'select') {
            // e.nativeEvent.offsetX/Y gives coord relative to target background div (the huge one)
            addNode(tool, e.nativeEvent.offsetX - 100, e.nativeEvent.offsetY - 100);
        }
    };

    const updateNodePos = (id: string, deltaX: number, deltaY: number) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, x: n.x + deltaX, y: n.y + deltaY } : n));
    };

    const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedNode(id);
        if (tool === 'select') {
            dragRef.current = { id, startX: e.clientX, startY: e.clientY };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragRef.current && tool === 'select') {
            const dx = (e.clientX - dragRef.current.startX);
            const dy = (e.clientY - dragRef.current.startY);

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

    // --- Renders ---

    const renderNode = (node: CanvasNode) => {
        const isSelected = selectedNode === node.id;

        let colorTheme = NOTE_COLORS[0];
        try {
            if (node.style?.color) colorTheme = JSON.parse(node.style.color);
        } catch { }

        // Determine dynamic class for notes vs text
        const isNote = node.type === 'note';

        return (
            <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onMouseDown={(e: any) => handleMouseDownNode(e, node.id)}
                className={`
                    absolute flex flex-col transition-shadow 
                    ${isNote ? 'shadow-lg backdrop-blur-sm' : ''}
                    ${isNote && (colorTheme.bg || 'bg-white')} 
                    ${isNote && colorTheme.border ? `border ${colorTheme.border}` : 'border-transparent'}
                    ${isSelected ? 'ring-2 ring-blue-500 shadow-2xl z-50 scale-[1.02]' : 'hover:shadow-xl z-10'}
                `}
                style={{
                    left: node.x,
                    top: node.y,
                    width: node.style?.width,
                    minHeight: node.style?.height,
                    borderRadius: '20px',
                    padding: isNote ? '0' : '0.5rem',
                }}
            >
                {/* Node Toolbar (Only when selected) */}
                {isSelected && (
                    <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
                        <div className="flex items-center gap-1 p-1.5 bg-zinc-900/90 backdrop-blur-md rounded-xl border border-white/10 shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200">
                            {isNote && NOTE_COLORS.map((c, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); changeNodeColor(node.id, c); }}
                                    className={`w-6 h-6 rounded-full border border-white/20 ${c.bg} hover:scale-110 transition-transform`}
                                    title={c.name}
                                />
                            ))}
                            {isNote && <div className="w-px h-6 bg-white/20 mx-1" />}
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteSelectedNode(); }}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
                                title="Remover"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* NOTE Content */}
                {isNote && (
                    <div className="flex flex-col h-full w-full p-6">
                        <textarea
                            className={`w-full h-full bg-transparent resize-none outline-none text-xl leading-relaxed font-handwriting ${colorTheme.text || 'text-zinc-800'}`}
                            placeholder="Escreva algo..."
                            value={node.content}
                            onChange={(e) => updateNodeContent(node.id, e.target.value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            spellCheck={false}
                        />
                    </div>
                )}

                {/* TEXT Content */}
                {node.type === 'text' && (
                    <div className="min-w-[200px]">
                        <input
                            className="w-full bg-transparent outline-none font-bold text-3xl text-zinc-900 dark:text-white placeholder:text-zinc-400/50 drop-shadow-sm"
                            value={node.content}
                            onChange={(e) => updateNodeContent(node.id, e.target.value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div
            className="h-full w-full relative bg-zinc-50 dark:bg-black overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* --- FLOATING TOOLBAR --- */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="glass-spatial p-2 rounded-full flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20">
                    <button
                        onClick={() => setTool('select')}
                        className={`p-3 rounded-full transition-all duration-300 ${tool === 'select' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10'}`}
                        title="Selecionar (V)"
                    >
                        <MousePointer2 size={20} />
                    </button>
                    <div className="w-px h-8 bg-zinc-200 dark:bg-white/10" />
                    <button
                        onClick={() => setTool('note')}
                        className={`p-3 rounded-full transition-all duration-300 ${tool === 'note' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10'}`}
                        title="Nota Adesiva (N)"
                    >
                        <FileText size={20} />
                    </button>
                    <button
                        onClick={() => setTool('text')}
                        className={`p-3 rounded-full transition-all duration-300 ${tool === 'text' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10'}`}
                        title="Texto (T)"
                    >
                        <Type size={20} />
                    </button>

                    <div className="w-px h-8 bg-zinc-200 dark:bg-white/10" />

                    <button
                        onClick={saveBoard}
                        className="p-3 rounded-full text-zinc-500 hover:text-green-600 hover:bg-green-500/10 transition-all active:scale-95"
                        title="Salvar Quadro"
                    >
                        {isSaving ? <RotateCcw className="animate-spin" size={20} /> : <Save size={20} />}
                    </button>
                </div>
            </div>

            {/* --- ZOOM CONTROLS --- */}
            <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={4}
                centerOnInit
                limitToBounds={false}
                panning={{ disabled: tool !== 'select' && dragRef.current === null }}
            >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <>
                        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
                            <div className="glass-card p-1.5 rounded-2xl flex flex-col gap-1 shadow-xl">
                                <button onClick={() => zoomIn()} className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors">
                                    <ZoomIn size={20} />
                                </button>
                                <button onClick={() => zoomOut()} className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors">
                                    <ZoomOut size={20} />
                                </button>
                                <button onClick={() => resetTransform()} className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors">
                                    <Grid size={20} />
                                </button>
                            </div>
                        </div>

                        <TransformComponent
                            wrapperClass="h-full w-full"
                            contentClass="h-full w-full"
                        >
                            <div
                                className="w-[5000px] h-[5000px] relative bg-dot-pattern"
                                onClick={handleCanvasClick}
                            >
                                <AnimatePresence>
                                    {nodes.map(renderNode)}
                                </AnimatePresence>

                                {/* Empty State Hint */}
                                {nodes.length === 0 && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40">
                                        <div className="w-24 h-24 bg-zinc-200 dark:bg-white/10 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                                            <MousePointer2 size={48} className="text-zinc-400 dark:text-white/50" />
                                        </div>
                                        <h2 className="text-3xl font-black text-zinc-400 dark:text-zinc-600 tracking-tight">Quadro Infinito</h2>
                                        <p className="text-zinc-400/80 mt-2">Selecione uma ferramenta acima para começar</p>
                                    </div>
                                )}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default Whiteboard;

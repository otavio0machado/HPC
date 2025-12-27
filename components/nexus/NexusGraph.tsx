import React, { useRef, useMemo, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { Share2, Maximize, Minimize, BrainCircuit, Activity, AlertTriangle, Layers } from 'lucide-react';
import { nexusService, GraphNode, GraphLink } from '../../services/nexusService';

const NexusGraph = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fgRef = useRef<any>(null);
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
    const [mode, setMode] = useState<'default' | 'heatmap' | 'detective'>('default');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [mode]);

    const loadData = async () => {
        setIsLoading(true);
        const data = await nexusService.getGraphData(mode);
        // Add User Node if empty or always?
        if (data.nodes.length === 0) {
            data.nodes.push({ id: 'user_center', name: 'Você (Start)', type: 'note', group: 'User', val: 10, color: '#white' });
        }
        setGraphData(data);
        setIsLoading(false);
    };

    const isDark = true;

    return (
        <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 shadow-2xl glass-vision flex flex-col">

            {/* Overlay UI Header */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <h2 className="text-2xl font-black text-white drop-shadow-lg tracking-tight">Nexus <span className="text-blue-400">Mind</span></h2>
                <p className="text-white/60 text-sm">Visualização Neural do Conhecimento</p>
            </div>

            {/* Mode Switcher */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl">
                <button
                    onClick={() => setMode('default')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'default' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Layers size={14} /> Padrão
                </button>
                <button
                    onClick={() => setMode('heatmap')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'heatmap' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Activity size={14} /> Heatmap
                </button>
                <button
                    onClick={() => setMode('detective')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'detective' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                    <AlertTriangle size={14} /> Detetive
                </button>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-white/50">Carregando Neural...</div>
            ) : (
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor={(node: any) => node.color || '#3b82f6'}
                    nodeRelSize={6}
                    nodeVal="val"
                    linkColor={() => isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
                    backgroundColor={isDark ? '#00000000' : '#ffffff00'}
                    linkOpacity={0.3}
                    linkWidth={1.5}
                    enableNodeDrag={true}
                    onNodeClick={(node: any) => {
                        const distance = 40;
                        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

                        if (fgRef.current) {
                            fgRef.current.cameraPosition(
                                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                                node,
                                3000
                            );
                        }
                    }}
                />
            )}

            {/* Background Gradient for depth if canvas is transparent */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/0 via-black/20 to-black/80 pointer-events-none" />
        </div>
    );
};

export default NexusGraph;

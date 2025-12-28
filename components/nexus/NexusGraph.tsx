import React, { useRef, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { Layers, Activity, AlertTriangle, Zap, Share2, Maximize, Minimize, BrainCircuit } from 'lucide-react';
import { nexusService, GraphNode, GraphLink } from '../../services/nexusService';

const NexusGraph = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fgRef = useRef<any>(null);
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
    const [mode, setMode] = useState<'default' | 'heatmap' | 'detective'>('default');
    const [isLoading, setIsLoading] = useState(true);
    const [activeNode, setActiveNode] = useState<GraphNode | null>(null);

    useEffect(() => {
        loadData();
    }, [mode]);

    const loadData = async () => {
        setIsLoading(true);
        const data = await nexusService.getGraphData(mode);
        // Ensure user center node exists
        if (data.nodes.length === 0 || !data.nodes.find(n => n.id === 'user_center')) {
            data.nodes.push({ id: 'user_center', name: 'Você', type: 'note', group: 'User', val: 12, color: '#60a5fa' });
        }
        setGraphData(data);
        setIsLoading(false);
    };

    const isDark = true;

    return (
        <div className="relative w-full h-full rounded-[40px] overflow-hidden glass-hydro flex flex-col group">

            {/* --- TOP HEADER --- */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <BrainCircuit size={28} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-tight flex items-center gap-2">
                        Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Mind</span>
                    </h2>
                    <p className="text-blue-100/60 text-sm font-medium tracking-wide glass-text-edge">
                        CONHECIMENTO NEURAL
                    </p>
                </div>
            </div>

            {/* --- FLOATING DOCK CONTROL --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300">
                    <button
                        onClick={() => setMode('default')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 ${mode === 'default'
                            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <Layers size={16} /> <span className="hidden sm:inline">Estrutura</span>
                    </button>
                    <button
                        onClick={() => setMode('heatmap')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 ${mode === 'heatmap'
                            ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <Activity size={16} /> <span className="hidden sm:inline">Retenção</span>
                    </button>
                    <button
                        onClick={() => setMode('detective')}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 ${mode === 'detective'
                            ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <AlertTriangle size={16} /> <span className="hidden sm:inline">Erros</span>
                    </button>

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <button
                        onClick={() => {
                            if (fgRef.current) {
                                fgRef.current.zoomToFit(1000, 100);
                            }
                        }}
                        className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Centralizar"
                    >
                        <Maximize size={16} />
                    </button>
                </div>
            </div>

            {/* --- INFO PANEL (Conditional) --- */}
            {activeNode && (
                <div className="absolute top-8 right-8 z-20 w-80 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-right-10 duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner
                            ${activeNode.type === 'note' ? 'bg-blue-500/20' :
                                activeNode.type === 'flashcard' ? 'bg-amber-500/20' :
                                    activeNode.type === 'error' ? 'bg-red-500/20' : 'bg-zinc-500/20'}`}
                            style={{ backgroundColor: activeNode.color ? activeNode.color + '40' : undefined }}
                        >
                            {activeNode.type === 'note' && <Share2 size={20} />}
                            {activeNode.type === 'flashcard' && <Zap size={20} />}
                            {activeNode.type === 'error' && <AlertTriangle size={20} />}
                            {activeNode.type === 'folder' && <Layers size={20} />}
                        </div>
                        <button onClick={() => setActiveNode(null)} className="text-white/40 hover:text-white transition-colors">
                            <Minimize size={18} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{activeNode.name}</h3>
                    <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-4">{activeNode.group}</p>

                    <div className="space-y-3">
                        {activeNode.metadata && Object.entries(activeNode.metadata).map(([key, value]) => (
                            <div key={key} className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-white/40 uppercase mb-1">{key}</p>
                                <p className="text-sm text-white font-mono break-all line-clamp-2">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/50 gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="animate-pulse font-medium tracking-widest text-xs uppercase">Sincronizando Rede Neural...</p>
                </div>
            ) : (
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor={(node: any) => node.color || '#3b82f6'}
                    nodeRelSize={6}
                    nodeVal="val"

                    // Visuals
                    linkColor={() => 'rgba(255,255,255,0.08)'}
                    backgroundColor="#00000000"

                    // Optics
                    linkOpacity={0.2}
                    linkWidth={1}

                    // Particles (Data flow effect)
                    linkDirectionalParticles={mode === 'heatmap' ? 2 : 0}
                    linkDirectionalParticleSpeed={0.005}
                    linkDirectionalParticleWidth={2}

                    enableNodeDrag={true}
                    onNodeClick={(node: any) => {
                        setActiveNode(node);
                        const distance = 60;
                        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

                        if (fgRef.current) {
                            fgRef.current.cameraPosition(
                                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                                node,
                                2000
                            );
                        }
                    }}
                    onBackgroundClick={() => setActiveNode(null)}
                />
            )}

            {/* Depth Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none rounded-[40px]" />
        </div>
    );
};

export default NexusGraph;

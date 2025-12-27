import React, { useState, useMemo } from 'react';
import {
    Play, Brain, Clock, Plus, FolderPlus,
    Search, TrendingUp, Layers, Filter, RotateCcw,
    Folder, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Flashcard } from '../../services/flashcardService';
import { buildFolderTree, getFolderByPath, FolderNode } from './folderUtils';

interface DeckStats {
    name: string;
    total: number;
    due: number;
    progress: number;
    path: string[];
}

interface DashboardProps {
    cards: Flashcard[];
    decks: DeckStats[]; // Kept for interface compatibility but we'll use tree mainly
    revisionQueue: Flashcard[];
    onStartSession: (deckName?: string) => void;
    onCreateCard: () => void;
    onCreateFolder: () => void;
    onFilter: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    cards,
    revisionQueue,
    onStartSession,
    onCreateCard,
    onCreateFolder,
}) => {
    // Tree Navigation State
    const [currentPath, setCurrentPath] = useState<string[]>([]);

    const folderTree = useMemo(() => buildFolderTree(cards), [cards]);
    const currentFolder = useMemo(() => getFolderByPath(folderTree, currentPath) || folderTree, [folderTree, currentPath]);

    const retentionRate = 91;
    const totalDue = revisionQueue.length;
    const totalCards = cards.length;
    const masteredCount = cards.filter(c => c.interval > 21).length;

    // Helper to calculate progress percentage safely
    const getProgress = (stats: any) => {
        if (stats.total === 0) return 0;
        return Math.min(100, Math.round((stats.progress / stats.total) * 100));
    };

    const handleNavigate = (folderName: string) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleNavigateUp = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    // Sorted children folders
    const sortedFolders = useMemo(() => {
        return Array.from(currentFolder.children.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [currentFolder]);

    return (
        <div className="p-6 min-h-full font-sans text-zinc-200 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200 tracking-tight drop-shadow-md">Flashcards & Memory</h1>
                    </div>
                    <p className="text-zinc-400 text-sm tracking-wide">Sua central de controle para maestria acadêmica.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCreateFolder}
                        className="bg-white/[0.05] hover:bg-white/10 text-zinc-300 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 backdrop-blur-md flex items-center gap-2 transition-colors active:scale-95"
                    >
                        <FolderPlus size={16} /> Nova Pasta
                    </button>
                    <button
                        onClick={onCreateCard}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-colors active:scale-95 backdrop-blur-md border border-white/20"
                    >
                        <Plus size={16} /> Novo Card
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
                {/* Column 1: Fila de Revisão (3/12) */}
                <div className="md:col-span-12 lg:col-span-3 space-y-4">
                    <div className="glass-hydro p-6 rounded-[32px] mb-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div> Revisões Pendentes
                            </div>
                            <div className="text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-lg">{totalDue}</div>

                            <button
                                onClick={() => onStartSession()}
                                disabled={totalDue === 0}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-md border border-white/20 hover:shadow-cyan-500/20"
                            >
                                <Play fill="currentColor" size={14} /> Iniciar Revisão Global
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-2 px-2">
                        <h2 className="font-bold text-zinc-100 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Clock size={16} className="text-blue-400" /> Próximos
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {revisionQueue.map((card) => {
                            const isUrgent = card.nextReview < Date.now() - 86400000;
                            return (
                                <div key={card.id} className="glass-card p-4 rounded-2xl hover:border-white/30 transition-all hover:scale-[1.02] group relative backdrop-blur-md bubble-hover">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 border ${isUrgent ? 'text-red-300 border-red-500/30 bg-red-500/10' : 'text-blue-300 border-blue-500/30 bg-blue-500/10'}`}>
                                            {isUrgent ? 'Urgente' : 'Revisão'}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[100px] border border-white/5 px-1.5 py-0.5 rounded bg-zinc-950/30">
                                            {card.folderPath[card.folderPath.length - 1] || 'Geral'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-zinc-300 line-clamp-2 mb-3 leading-relaxed group-hover:text-white transition-colors">
                                        {card.front}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {isUrgent ? 'Atrasado' : 'Agora'}</span>
                                        <span className="flex items-center gap-1"><RotateCcw size={10} /> {card.repetitions} reps</span>
                                    </div>
                                </div>
                            );
                        })}

                        {revisionQueue.length === 0 && (
                            <div className="bg-[var(--glass-bg)] border-2 border-dashed border-[var(--border-glass)] p-8 rounded-2xl flex flex-col items-center justify-center text-zinc-500">
                                <Brain size={24} className="mb-2 opacity-30" />
                                <p className="text-xs font-medium uppercase tracking-wider">Tudo em dia!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Métricas (6/12) */}
                <div className="md:col-span-12 lg:col-span-6 space-y-6">
                    {/* Retention Card */}
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none rounded-full"></div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1 block">Performance Neural</span>
                                <span className="text-zinc-400 text-xs">Taxa de Retenção estimada</span>
                                <div className="text-6xl font-black text-white mt-4 tracking-tighter drop-shadow-lg">{retentionRate}<span className="text-3xl text-zinc-500">%</span></div>
                            </div>
                            <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
                                <TrendingUp className="text-emerald-400" size={24} />
                            </div>
                        </div>
                        {/* Mock Graph */}
                        <div className="h-40 flex items-end gap-1.5 opacity-90 relative z-10">
                            {[40, 60, 55, 70, 85, 91, 88, 92, 94, 89, 91, 95].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600/20 to-emerald-400/20 rounded-t-sm hover:from-emerald-500/40 hover:to-emerald-300/40 transition-colors relative group h-full flex items-end">
                                    <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ height: `${h}%` }}></div>

                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sub Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-card p-6 rounded-[28px] backdrop-blur-xl">
                            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Cards Dominados</div>
                            <div className="text-3xl font-black text-emerald-400 flex items-baseline gap-2">
                                {masteredCount} <span className="text-xs font-bold text-zinc-600 uppercase">cards</span>
                            </div>
                            <div className="w-full bg-zinc-900/50 h-1.5 mt-4 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-emerald-500 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${(masteredCount / (totalCards || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-[28px] backdrop-blur-xl">
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Total na Base</div>
                                    <div className="text-3xl font-black text-white">{totalCards}</div>
                                </div>
                            </div>
                            <div className="mt-4 text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded border border-emerald-500/20">
                                <TrendingUp size={12} /> +{cards.filter(c => c.repetitions === 0).length} novos
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Navegação de Decks (3/12) */}
                <div className="md:col-span-12 lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h2 className="font-bold text-zinc-100 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Layers size={16} className="text-yellow-500" /> Estrutura
                        </h2>
                    </div>

                    {/* Breadcrumbs & Navigation Header */}
                    <div className="glass-spatial rounded-t-3xl p-4 border-b-0 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide backdrop-blur-xl">
                        <button
                            onClick={() => setCurrentPath([])}
                            className={`p-2 rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/10 ${currentPath.length === 0 ? 'text-white bg-white/10 shadow-sm backdrop-blur-sm border-white/10' : ''}`}
                        >
                            <Folder size={14} />
                        </button>
                        {currentPath.map((folder, index) => (
                            <React.Fragment key={folder + index}>
                                <ChevronRight size={12} className="text-zinc-600 flex-shrink-0" />
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className="text-xs font-bold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
                                >
                                    {folder}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="glass-card rounded-b-[32px] rounded-tr-none overflow-hidden max-h-[500px] overflow-y-auto min-h-[400px] backdrop-blur-xl border-t-0">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10 border-b border-white/5">
                                <tr className="text-zinc-500 text-[10px] uppercase tracking-wider">
                                    <th className="p-4 font-bold">Nome</th>
                                    <th className="p-4 font-bold text-right w-16">Rev</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Go Back Button if Deep */}
                                {currentPath.length > 0 && (
                                    <tr
                                        onClick={handleNavigateUp}
                                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4 text-zinc-500 flex items-center gap-2" colSpan={2}>
                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> <span className="text-xs font-bold uppercase tracking-wide">Voltar</span>
                                        </td>
                                    </tr>
                                )}

                                {/* Folders */}
                                {sortedFolders.map((folderNode) => (
                                    <tr
                                        key={folderNode.name}
                                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                                        onClick={() => handleNavigate(folderNode.name)}
                                    >
                                        <td className="p-4 font-medium text-zinc-300 group-hover:text-white transition-colors">
                                            <div className='flex flex-col'>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                                                        <Folder size={16} fill="currentColor" fillOpacity={0.2} />
                                                    </div>
                                                    <span className="font-semibold text-sm">{folderNode.name}</span>
                                                </div>
                                                <div className='w-full bg-zinc-900 h-0.5 mt-3 rounded-full overflow-hidden ml-9 w-[calc(100%-2.25rem)] opacity-50 group-hover:opacity-100 transition-opacity'>
                                                    <div className='bg-amber-500/80 h-full shadow-[0_0_5px_rgba(245,158,11,0.5)]' style={{ width: `${getProgress(folderNode.stats)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right align-top pt-5">
                                            {folderNode.stats.due > 0 ? (
                                                <div className='inline-flex items-center justify-center px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold rounded min-w-[24px] shadow-sm'>
                                                    {folderNode.stats.due}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-700 text-xs font-mono">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {/* Cards in this specific folder (optional, maybe specific action) */}
                                {currentFolder.cards.length > 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-4">
                                            <div className="bg-white/5 rounded-xl p-3 text-center text-xs text-zinc-400 border border-white/5 font-medium">
                                                {currentFolder.cards.length} cards soltos nesta pasta
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {sortedFolders.length === 0 && currentFolder.cards.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-10 text-center text-zinc-600">
                                            <p className="text-xs font-bold uppercase tracking-wider mb-2">Pasta vazia</p>
                                            <p className="text-[10px]">Crie novos cards aqui.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Action to Study This Folder */}
                        <div className="p-4 border-t border-[var(--border-glass)] bg-black/20 backdrop-blur-md">
                            <button
                                onClick={() => {
                                    onStartSession(currentPath[0]);
                                }}
                                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-white/10 shadow-lg backdrop-blur-md"
                            >
                                <Play size={12} fill="currentColor" /> Estudar "{currentPath.length > 0 ? currentPath[currentPath.length - 1] : 'Tudo'}"
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

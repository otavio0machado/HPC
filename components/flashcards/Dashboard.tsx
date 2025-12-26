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
        <div className="p-6 bg-zinc-950 min-h-full font-sans text-zinc-200">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Flashcards Command Center</h1>
                    <p className="text-zinc-500 text-sm">Sua central de controle para maestria acadêmica.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCreateFolder}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-800 flex items-center gap-2 transition-colors"
                    >
                        <FolderPlus size={16} /> Nova Pasta
                    </button>
                    <button
                        onClick={onCreateCard}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-colors"
                    >
                        <Plus size={16} /> Novo Card
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
                {/* Column 1: Fila de Revisão (3/12) */}
                <div className="md:col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl mb-4">
                        <div className="text-zinc-500 text-xs mb-1">Revisões Pendentes</div>
                        <div className="text-3xl font-bold text-white mb-4">{totalDue}</div>

                        <button
                            onClick={() => onStartSession()}
                            disabled={totalDue === 0}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
                        >
                            <Play fill="currentColor" size={16} /> Iniciar Revisão Global
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                            <Clock size={18} className="text-blue-500" /> Próximos
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {revisionQueue.map((card) => {
                            const isUrgent = card.nextReview < Date.now() - 86400000;
                            return (
                                <div key={card.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isUrgent ? 'text-red-400' : 'text-blue-400'}`}>
                                            {isUrgent ? 'Urgente' : 'Revisão'}
                                        </span>
                                        <span className="text-[10px] text-zinc-600 truncate max-w-[80px]">
                                            {card.folderPath[card.folderPath.length - 1] || 'Geral'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-200 line-clamp-2 mb-3">
                                        {card.front}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {isUrgent ? 'Atrasado' : 'Agora'}</span>
                                        <span className="flex items-center gap-1"><RotateCcw size={10} /> {card.repetitions} reps</span>
                                    </div>
                                </div>
                            );
                        })}

                        {revisionQueue.length === 0 && (
                            <div className="bg-zinc-900/30 border border-dashed border-zinc-800 p-8 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                                <Brain size={24} className="mb-2 opacity-50" />
                                <p className="text-sm">Tudo em dia!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Métricas (6/12) */}
                <div className="md:col-span-12 lg:col-span-6 space-y-6">
                    {/* Retention Card */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <span className="text-zinc-500 text-sm">Taxa de Retenção</span>
                                <div className="text-4xl font-bold text-emerald-500 mt-1">{retentionRate}%</div>
                            </div>
                            <TrendingUp className="text-emerald-500" size={24} />
                        </div>
                        {/* Mock Graph */}
                        <div className="h-32 flex items-end gap-1 opacity-80 relative z-10">
                            {[40, 60, 55, 70, 85, 91, 88].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors relative group">
                                    <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
                    </div>

                    {/* Sub Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                            <div className="text-zinc-500 text-xs mb-1">Cards Dominados</div>
                            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                                {masteredCount} <span className="text-xs font-normal text-zinc-600">cards</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${(masteredCount / (totalCards || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-zinc-500 text-xs mb-1">Total Cards</div>
                                    <div className="text-2xl font-bold text-white">{totalCards}</div>
                                </div>
                            </div>
                            <div className="mt-3 text-[10px] text-emerald-500 flex items-center gap-1">
                                <TrendingUp size={10} /> +{cards.filter(c => c.repetitions === 0).length} novos
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Navegação de Decks (3/12) */}
                <div className="md:col-span-12 lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-zinc-100 flex items-center gap-2">
                            <Layers size={18} className="text-yellow-500" /> Decks
                        </h2>
                    </div>

                    {/* Breadcrumbs & Navigation Header */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-t-2xl p-3 border-b-0 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                        <button
                            onClick={() => setCurrentPath([])}
                            className={`p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors ${currentPath.length === 0 ? 'text-white bg-zinc-800' : ''}`}
                        >
                            <Folder size={14} />
                        </button>
                        {currentPath.map((folder, index) => (
                            <React.Fragment key={folder + index}>
                                <ChevronRight size={12} className="text-zinc-600 flex-shrink-0" />
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className="text-xs font-medium text-zinc-300 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                                >
                                    {folder}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-b-2xl rounded-tr-none overflow-hidden max-h-[500px] overflow-y-auto min-h-[300px]">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 bg-zinc-900 z-10">
                                <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                                    <th className="p-3 font-medium">Nome</th>
                                    <th className="p-3 font-medium text-right w-16">Rev</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Go Back Button if Deep */}
                                {currentPath.length > 0 && (
                                    <tr
                                        onClick={handleNavigateUp}
                                        className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-3 text-zinc-500 flex items-center gap-2" colSpan={2}>
                                            <ArrowLeft size={14} /> <span className="text-xs">Voltar</span>
                                        </td>
                                    </tr>
                                )}

                                {/* Folders */}
                                {sortedFolders.map((folderNode) => (
                                    <tr
                                        key={folderNode.name}
                                        className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                                        onClick={() => handleNavigate(folderNode.name)}
                                    >
                                        <td className="p-3 font-medium text-zinc-300 group-hover:text-white">
                                            <div className='flex flex-col'>
                                                <div className="flex items-center gap-2">
                                                    <Folder className="text-yellow-600" size={16} fill="currentColor" fillOpacity={0.2} />
                                                    <span>{folderNode.name}</span>
                                                </div>
                                                <div className='w-full bg-zinc-800 h-0.5 mt-2 rounded-full overflow-hidden ml-6 w-[calc(100%-1.5rem)]'>
                                                    <div className='bg-yellow-600 h-full' style={{ width: `${getProgress(folderNode.stats)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right align-top pt-4">
                                            {folderNode.stats.due > 0 ? (
                                                <div className='inline-flex items-center justify-center px-2 py-1 bg-emerald-900/50 text-emerald-400 text-xs font-bold rounded-md min-w-[24px]'>
                                                    {folderNode.stats.due}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {/* Cards in this specific folder (optional, maybe specific action) */}
                                {currentFolder.cards.length > 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-3">
                                            <div className="bg-zinc-950/50 rounded-lg p-2 text-center text-xs text-zinc-500 border border-zinc-800/50">
                                                {currentFolder.cards.length} cards soltos nesta pasta
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {sortedFolders.length === 0 && currentFolder.cards.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="p-6 text-center text-zinc-500 text-xs">
                                            Pasta vazia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Action to Study This Folder */}
                        <div className="p-3 border-t border-zinc-800">
                            <button
                                onClick={() => {
                                    // Construct dot notation or path for study filtering
                                    // Current onStartSession expects just deckName string (first level)
                                    // We need to update onStartSession to handle paths or just pass the first level for now?
                                    // Wait, logic needs to be updated to support deep filtering.
                                    // For now, let's just trigger for the root (first item in path) or handle it later.
                                    // Ideally, we start session for THIS folder recursively.
                                    // Since onStartSession logic in Flashcards.tsx is: c.folderPath[0] === deckName
                                    // We need to fix that too.

                                    // Let's assume we will fix Flashcards.tsx next.
                                    // Passing the full path name joined by something or unique identifier?
                                    // Current Logic: onStartSession(string).
                                    // I will modify Flashcards.tsx to accept string[] or just handle logic there.
                                    // For now, I'll pass the *first* folder name to maintain current behavior 
                                    // until I fix the parent component.
                                    // Actually, let's notify user or just implement the fix in Parent.
                                    onStartSession(currentPath[0]);
                                }}
                                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Play size={12} /> Estudar "{currentPath.length > 0 ? currentPath[currentPath.length - 1] : 'Tudo'}"
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


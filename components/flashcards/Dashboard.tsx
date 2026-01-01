import React, { useState, useMemo } from 'react';
import {
    Play, Clock, Plus, FolderPlus,
    Folder as FolderIcon, ChevronRight, ArrowLeft,
    Layers, TrendingUp, Sparkles, MoreHorizontal,
    GraduationCap, BookOpen, Quote
} from 'lucide-react';
import { Flashcard } from '../../services/flashcardService';
import { buildFolderTree, getFolderByPath } from './folderUtils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface DeckStats {
    name: string;
    total: number;
    due: number;
    progress: number;
    path: string[];
}

interface DashboardProps {
    cards: Flashcard[];
    decks: DeckStats[];
    revisionQueue: Flashcard[];
    onStartSession: (deckName?: string) => void;
    onCreateCard: (initialPath?: string) => void;
    onCreateFolder: (initialPath?: string) => void;
    onMoveFolder: (sourcePath: string[], targetPath: string[]) => void;
    onFilter: () => void;
    onCreateAI: (initialPath?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    cards,
    revisionQueue,
    onStartSession,
    onCreateCard,
    onCreateFolder,
    onMoveFolder,
    onCreateAI,
}) => {
    // Tree Navigation State
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
    const [dragTarget, setDragTarget] = useState<string | null>(null);

    const folderTree = useMemo(() => buildFolderTree(cards), [cards]);
    const currentFolder = useMemo(() => getFolderByPath(folderTree, currentPath) || folderTree, [folderTree, currentPath]);

    const totalDue = revisionQueue.length;

    // Calculate folder-specific stats 
    const currentFolderStats = useMemo(() => {
        // ... (same as before)
        return {
            totalCards: currentFolder.cards.length + Array.from(currentFolder.children.values()).reduce((acc, child) => acc + child.stats.total, 0),
            dueCards: currentFolder.cards.filter(c => c.nextReview <= Date.now()).length + Array.from(currentFolder.children.values()).reduce((acc, child) => acc + child.stats.due, 0)
        };
    }, [currentFolder]);

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

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, path: string[]) => {
        e.dataTransfer.setData('sourcePath', JSON.stringify(path));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, folderName: string) => {
        e.preventDefault(); // Necessary to allow dropping
        e.stopPropagation();
        setDragTarget(folderName);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Only clear if we are leaving the element, might be tricky with children
        // A simple way is to clear it when dropping or ending
        // For now, we rely on dragEnter/Over updates. 
        // If we leave the container, we might want to clear.
        // But 'dragleave' fires when entering a child.
    };

    const handleDrop = (e: React.DragEvent, targetName: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragTarget(null);

        const sourcePathStr = e.dataTransfer.getData('sourcePath');
        if (!sourcePathStr) return;

        try {
            const sourcePath = JSON.parse(sourcePathStr) as string[];
            const targetPath = [...currentPath, targetName];

            // 1. Prevent dropping into itself
            // If targetPath equals sourcePath
            if (sourcePath.join('/') === targetPath.join('/')) return;

            // 2. Prevent dropping into a child of itself
            // If targetPath starts with sourcePath
            const startsWithSource = sourcePath.every((part, i) => targetPath[i] === part);
            if (startsWithSource && targetPath.length > sourcePath.length) {
                toast.error("Não é possível mover uma pasta para dentro dela mesma.");
                return;
            }

            onMoveFolder(sourcePath, targetPath);

        } catch (err) {
            console.error("Drop error", err);
        }
    };

    // Sorted children folders
    const sortedFolders = useMemo(() => {
        return Array.from(currentFolder.children.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [currentFolder]);

    // VisionOS Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="font-sans text-zinc-100 min-h-full pb-20">
            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-1">
                <div className="space-y-1">
                    <h1 className="text-4xl font-light tracking-tight text-white flex items-center gap-3">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-medium">Flashcards</span>
                        <span className="text-white/20 font-thin">|</span>
                        <span className="text-2xl text-zinc-400 font-light">Library</span>
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-wide text-sm">Organize seu conhecimento. Domine sua memória.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onCreateFolder(currentPath.length > 0 ? currentPath.join(' / ') : undefined)}
                        className="group relative px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <FolderPlus size={14} /> Nova Pasta
                        </span>
                    </button>

                    <button
                        onClick={() => onCreateAI(currentPath.length > 0 ? currentPath.join(' / ') : undefined)}
                        className="group relative px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-white/20 active:scale-95 ml-2"
                    >
                        <span className="flex items-center gap-2">
                            <Sparkles size={16} strokeWidth={2} /> Criar com IA
                        </span>
                    </button>

                    <button
                        onClick={() => onCreateCard(currentPath.length > 0 ? currentPath.join(' / ') : undefined)}
                        className="group relative px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-white/20 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            <Plus size={16} strokeWidth={3} /> Novo Card
                        </span>
                    </button>
                </div>
            </div>

            {/* --- CURRENT CONTEXT HERO --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl p-8 md:p-10 shadow-2xl">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-blue-300 backdrop-blur-md">
                                    {currentPath.length === 0 ? 'Visão Geral' : currentPath.join(' / ')}
                                </span>
                                {totalDue > 0 && (
                                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest text-amber-300 backdrop-blur-md animate-pulse">
                                        {totalDue} para revisar
                                    </span>
                                )}
                            </div>

                            <h2 className="text-5xl md:text-6xl font-medium text-white tracking-tighter mb-4 drop-shadow-lg">
                                {totalDue > 0 ? 'Hora de Focar.' : 'Tudo em Dia.'}
                            </h2>
                            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                                {totalDue > 0
                                    ? `Você tem ${totalDue} cards que precisam de atenção agora para maximizar sua retenção.`
                                    : 'Você revisou todos os cards pendentes desta seção. Ótimo trabalho!'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={() => onStartSession(currentPath.length > 0 ? currentPath.join('/') : undefined)}
                                disabled={totalDue === 0}
                                className="w-full md:w-auto px-8 py-4 bg-white text-black hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                            >
                                <Play size={18} fill="currentColor" />
                                {totalDue > 0 ? 'Iniciar Sessão' : 'Praticar Extra'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- BREADCRUMB & CONTENT AREA --- */}
            <div className="space-y-6">

                {/* Clean Breadcrumb */}
                <div className="flex items-center gap-2 px-2 overflow-x-auto scrollbar-hide py-2">
                    <button
                        onClick={() => setCurrentPath([])}
                        className={`p-2 rounded-xl transition-all ${currentPath.length === 0 ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
                    >
                        <Layers size={18} />
                    </button>
                    {currentPath.map((folder, index) => (
                        <React.Fragment key={folder + index}>
                            <ChevronRight size={14} className="text-zinc-700 flex-shrink-0" />
                            <button
                                onClick={() => handleBreadcrumbClick(index)} // Fixed Drop: onDrop here? Maybe later.
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all whitespace-nowrap"
                            >
                                {folder}
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                {/* Back Button if Deep */}
                {currentPath.length > 0 && (
                    <button
                        onClick={handleNavigateUp}
                        // Add drop on back button? A bit complex UI wise.
                        className="mb-4 flex items-center gap-2 text-zinc-500 hover:text-white px-2 transition-colors text-sm font-medium group"
                    >
                        <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={14} />
                        </div>
                        Voltar para nível anterior
                    </button>
                )}

                {/* Grid View of Folders/Cards */}
                <motion.div
                    key={currentPath.join('/') + '-' + cards.length}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    {/* Folders */}
                    {sortedFolders.map((folderNode) => (
                        <motion.div
                            key={folderNode.name}
                            variants={itemVariants}
                            draggable
                            onDragStart={(e) => handleDragStart(e as any, folderNode.fullPath)} // Cast needed for Framer motion div occasionally? 
                            // Actually motion.div props include standard HTML attributes but Typescript might be fuzzy.
                            onDragOver={(e) => handleDragOver(e as any, folderNode.name)}
                            onDragLeave={(e) => {
                                if (dragTarget === folderNode.name) {
                                    setDragTarget(null);
                                }
                            }}
                            onDrop={(e) => handleDrop(e as any, folderNode.name)}
                            onClick={() => handleNavigate(folderNode.name)}
                            onMouseEnter={() => setHoveredFolder(folderNode.name)}
                            onMouseLeave={() => setHoveredFolder(null)}
                            className={`group relative h-48 rounded-3xl bg-zinc-900/40 border p-6 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-md transition-all 
                                ${dragTarget === folderNode.name ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-xl shadow-blue-500/20' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}
                        >
                            {/* Hover Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex justify-between items-start">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all shadow-sm">
                                    <BookOpen size={24} />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {folderNode.stats.due > 0 && (
                                        <div className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                                            {folderNode.stats.due} DUE
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onStartSession(folderNode.fullPath.join('/'));
                                        }}
                                        className="p-2 rounded-full bg-white/10 hover:bg-blue-500 text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 transform scale-90 hover:scale-105"
                                        title="Revisar esta pasta"
                                    >
                                        <Play size={14} fill="currentColor" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-1 mt-2">
                                <h3 className="text-xl font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                                    {folderNode.name}
                                </h3>
                                <p className="text-xs text-zinc-500 font-medium tracking-wide">
                                    {folderNode.stats.total} Flashcards
                                </p>
                            </div>

                            {/* Progress Bar (Subtle) */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                <div
                                    className="h-full bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000"
                                    style={{ width: `${folderNode.stats.total > 0 ? (folderNode.stats.progress / folderNode.stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </motion.div>
                    ))}

                    {/* Loose Cards Indicator (if any) */}
                    {currentFolder.cards.length > 0 && (
                        <motion.div
                            variants={itemVariants}
                            className="col-span-full mt-8 pt-8 border-t border-white/5"
                        >
                            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Layers size={14} /> Arquivos Soltos ({currentFolder.cards.length})
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentFolder.cards.slice(0, 6).map(card => (
                                    <div key={card.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-1.5 rounded-lg bg-zinc-800/50 text-zinc-400">
                                                <Quote size={14} />
                                            </div>
                                            <span className="text-[10px] text-zinc-600 font-mono">ID: {card.id.slice(0, 4)}</span>
                                        </div>
                                        <p className="text-sm text-zinc-300 font-medium line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
                                            {card.front}
                                        </p>
                                    </div>
                                ))}
                                {currentFolder.cards.length > 6 && (
                                    <div className="flex items-center justify-center p-4 rounded-2xl border border-white/5 border-dashed text-zinc-500 text-xs font-medium">
                                        + {currentFolder.cards.length - 6} outros cards
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {sortedFolders.length === 0 && currentFolder.cards.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-600">
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 mb-4">
                                <Sparkles size={32} className="text-zinc-700" />
                            </div>
                            <p className="text-lg font-medium text-zinc-400 mb-2">Esta pasta está vazia</p>
                            <p className="text-sm mb-6 max-w-xs text-center">Comece criando uma nova pasta ou adicionando cards aqui.</p>
                            <button
                                onClick={() => onCreateCard(currentPath.length > 0 ? currentPath.join(' / ') : undefined)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                            >
                                <Plus size={14} /> Criar Primeiro Card
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Search, Upload, RefreshCw, Loader2, Plus } from 'lucide-react';
import { Subject, KnowledgePill as KnowledgePillType } from '../../data/contentData';
import { contentService } from '../../services/contentService';
import { generatePillsFromContent, generatePillsFromPromptAndContent } from '../../services/aiService';
import SubjectCard from './SubjectCard';
import KnowledgePill from './KnowledgePill';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { Trash2, X } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
    useDraggable,
    useDroppable
} from '@dnd-kit/core';
import { FilePlus, FolderPlus } from 'lucide-react';

const SUBJECT_TABS = [
    'Todas',
    'Matemática',
    'Física',
    'Química',
    'Biologia',
    'História',
    'Geografia',
    'Sociologia',
    'Filosofia',
    'Português',
    'Redação',
    'História da Arte',
    'Inglês',
    'Espanhol',
    'Literatura'
];

const ContentModule: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedPills, setSelectedPills] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Folder Move State
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [targetFolder, setTargetFolder] = useState('');

    // Restored State
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectTab, setSelectedSubjectTab] = useState('Todas');
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    // File upload ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create Subject Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newSubjectTitle, setNewSubjectTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const availableColors = [
        'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
    ];
    const [newSubjectColor, setNewSubjectColor] = useState(availableColors[0]);

    // Create Folder Modal State
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    // Selected Folder for upload (Optional)
    // Selected Folder for upload (Optional)
    // Selected Folder for upload (Optional)
    const [selectedUploadFolder, setSelectedUploadFolder] = useState<string>('');

    // VIEW STATE: Selected Folder (null = Root View)
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    // Custom Generation State
    const [isCustomGenModalOpen, setIsCustomGenModalOpen] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [extractionProgress, setExtractionProgress] = useState<string>('');
    const customFileInputRef = useRef<HTMLInputElement>(null);

    // Manual Creation State
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [manualTitle, setManualTitle] = useState('');
    const [manualContent, setManualContent] = useState('');
    const [manualFolder, setManualFolder] = useState('');

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement to start drag (prevents accidental clicks)
            },
        })
    );

    // Active Drag State
    const [activeDragId, setActiveDragId] = useState<string | null>(null);

    // Selection Area State
    const [selectionBox, setSelectionBox] = useState<{ start: { x: number, y: number }, current: { x: number, y: number } } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        loadSubjects();
    }, []);

    // Auto-scroll to top when Custom Gen Modal opens
    useEffect(() => {
        if (isCustomGenModalOpen) {
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Lock body scroll to prevent scrolling behind modal
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal closes
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCustomGenModalOpen]);

    const loadSubjects = async () => {
        setIsLoading(true);
        try {
            const data = await contentService.fetchSubjects();
            setSubjects(data);

            // If a subject is currently selected, refresh its data too
            if (selectedSubject) {
                const refreshed = data.find(s => s.id === selectedSubject.id);
                if (refreshed) setSelectedSubject(refreshed);
                // Also validate if selectedFolder still exists (simple check)
                if (selectedFolder && refreshed && !refreshed.folders?.find(f => f.name === selectedFolder) && selectedFolder !== 'Sem Pasta') {
                    setSelectedFolder(null);
                }
            }
        } catch (error) {
            console.error("Failed to load subjects", error);
            toast.error("Erro ao carregar conteúdos. Verifique sua conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectTitle.trim()) return;

        setIsCreating(true);
        try {
            // Default icon 'Book' for now
            const newSubject = await contentService.createSubject(newSubjectTitle, 'Book', newSubjectColor);

            if (newSubject) {
                toast.success("Matéria criada com sucesso!");
                setIsCreateModalOpen(false);
                setNewSubjectTitle('');
                setNewSubjectColor(availableColors[0]);
                await loadSubjects();
            } else {
                toast.error("Erro ao criar matéria.");
            }
        } catch (error) {
            console.error("Create subject error", error);
            toast.error("Erro ao criar matéria.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        toast.error("O suporte a PDF foi removido. Por favor, insira o conteúdo manualmente.");
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim() || !selectedSubject) return;

        setIsCreatingFolder(true);
        try {
            const success = await contentService.createFolder(selectedSubject.id, newFolderName);
            if (success) {
                toast.success("Pasta criada com sucesso!");
                setIsCreateFolderModalOpen(false);
                setNewFolderName('');
                await loadSubjects();
            } else {
                toast.error("Erro ao criar pasta.");
            }
        } catch (error) {
            console.error("Create folder error", error);
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const filteredSubjects = subjects.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = selectedSubjectTab === 'Todas' || s.title === selectedSubjectTab;
        return matchesSearch && matchesTab;
    });

    const togglePillSelection = (pillId: string) => {
        const newSelected = new Set(selectedPills);
        if (newSelected.has(pillId)) {
            newSelected.delete(pillId);
        } else {
            newSelected.add(pillId);
        }
        setSelectedPills(newSelected);

        // Auto-enable selection mode if not active
        if (!isSelectionMode && newSelected.size > 0) {
            setIsSelectionMode(true);
        }
        // Auto-disable if empty
        if (isSelectionMode && newSelected.size === 0) {
            setIsSelectionMode(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedSubject || selectedPills.size === 0) return;

        const confirmDelete = window.confirm(`Tem certeza que deseja apagar ${selectedPills.size} itens?`);
        if (!confirmDelete) return;

        const pillIds = Array.from(selectedPills);
        const { error } = await supabase
            .from('knowledge_pills')
            .delete()
            .in('id', pillIds);

        if (error) {
            toast.error("Erro ao apagar itens selectionados.");
        } else {
            toast.success("Itens apagados com sucesso.");
            setSelectedPills(new Set());
            setIsSelectionMode(false);
            loadSubjects();
        }
    };

    const handleBulkMove = async () => {
        if (!selectedSubject || selectedPills.size === 0 || !targetFolder.trim()) return;
        await movePillsToFolder(Array.from(selectedPills), targetFolder);
        setIsMoveModalOpen(false);
        setTargetFolder('');
        setSelectedPills(new Set());
        setIsSelectionMode(false);
    };

    const movePillsToFolder = async (pillIds: string[], folderName: string) => {
        const { error } = await supabase
            .from('knowledge_pills')
            .update({ folder: folderName })
            .in('id', pillIds);

        if (error) {
            toast.error("Erro ao mover itens.");
        } else {
            toast.success("Itens movidos!");
            loadSubjects();
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (over && active.id !== over.id) {
            // Drop on a folder
            const folderName = over.id as string;
            // Active.id is the pill ID
            movePillsToFolder([active.id as string], folderName);
        }
    };

    const handleCreateManualPill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject || !manualTitle.trim() || !manualContent.trim()) return;

        setIsCreating(true);
        try {
            const success = await contentService.savePills(selectedSubject.id, [{
                title: manualTitle,
                content: manualContent,
                description: manualContent.slice(0, 100) + '...', // Auto-generate description
                readTime: '1 min',
                folder: manualFolder || undefined,
                layout: 'default'
            }]);

            if (success) {
                toast.success("Conteúdo criado com sucesso!");
                setIsManualModalOpen(false);
                setManualTitle('');
                setManualContent('');
                setManualFolder('');
                loadSubjects();
            } else {
                toast.error("Erro ao criar conteúdo.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao criar conteúdo.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Optional: Check size limit per file just to warn, process limit in generation
            const oversized = newFiles.filter(f => f.size > 200 * 1024 * 1024);
            if (oversized.length > 0) {
                toast.error(`Alguns arquivos excedem 200MB e foram ignorados: ${oversized.map(f => f.name).join(', ')}`);
            }
            const validFiles = newFiles.filter(f => f.size <= 200 * 1024 * 1024);
            setSelectedFiles(prev => [...prev, ...validFiles]);

            // Allow re-selecting same file
            if (customFileInputRef.current) customFileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCustomGeneration = async () => {
        toast.error("O suporte a PDF foi removido. Por favor, insira o conteúdo manualmente.");
        setIsCustomGenModalOpen(false);
        setSelectedFiles([]);
    };

    // Selection Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start selection if clicking directly on the container background
        if (e.target === containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSelectionBox({
                start: { x: e.clientX - rect.left, y: e.clientY - rect.top },
                current: { x: e.clientX - rect.left, y: e.clientY - rect.top }
            });
            setIsSelectionMode(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (selectionBox && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSelectionBox(prev => prev ? ({
                ...prev,
                current: { x: e.clientX - rect.left, y: e.clientY - rect.top }
            }) : null);
        }
    };

    const handleMouseUp = () => {
        if (selectionBox && containerRef.current) {
            // Calculate selection rect
            const sbLeft = Math.min(selectionBox.start.x, selectionBox.current.x);
            const sbTop = Math.min(selectionBox.start.y, selectionBox.current.y);
            const sbWidth = Math.abs(selectionBox.current.x - selectionBox.start.x);
            const sbHeight = Math.abs(selectionBox.current.y - selectionBox.start.y);

            // Ignore tiny accidental drags
            if (sbWidth < 10 && sbHeight < 10) {
                setSelectionBox(null);
                return;
            }

            const selectionRect = {
                left: sbLeft,
                top: sbTop,
                right: sbLeft + sbWidth,
                bottom: sbTop + sbHeight
            };

            // Query all pills
            const pillElements = containerRef.current.querySelectorAll('[data-pill-id]');
            const newSelected = new Set(selectedPills);

            // Get container rect to offset relative coordinates
            const containerRect = containerRef.current.getBoundingClientRect();

            pillElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                // Convert to relative coordinates inside container
                const elLeft = rect.left - containerRect.left;
                const elTop = rect.top - containerRect.top;
                const elRight = elLeft + rect.width;
                const elBottom = elTop + rect.height;

                // Check intersection
                const isIntersecting = !(
                    elLeft > selectionRect.right ||
                    elRight < selectionRect.left ||
                    elTop > selectionRect.bottom ||
                    elBottom < selectionRect.top
                );

                if (isIntersecting) {
                    const id = el.getAttribute('data-pill-id');
                    if (id) newSelected.add(id);
                }
            });

            if (newSelected.size > selectedPills.size) {
                setSelectedPills(newSelected);
                setIsSelectionMode(true);
            }

            setSelectionBox(null);
        }
    };

    // Group pills by folder, including empty folders
    const groupedPills = React.useMemo(() => {
        if (!selectedSubject) return {};
        const groups: Record<string, typeof selectedSubject.pills> = {};

        // 1. Initialize with explicit folders
        (selectedSubject.folders || []).forEach(f => {
            groups[f.name] = [];
        });

        // 2. Add 'Sem Pasta'
        groups['Sem Pasta'] = [];

        // 3. Fill with pills
        selectedSubject.pills.forEach(pill => {
            const folder = pill.folder || 'Sem Pasta';
            if (!groups[folder]) groups[folder] = [];
            groups[folder].push(pill);
        });

        return groups;
    }, [selectedSubject]);

    // Render logic for pill grid
    const renderPillGrid = () => {
        if (!selectedSubject) return null;

        const folders = Object.keys(groupedPills).sort((a, b) => {
            if (a === 'Sem Pasta') return 1; // Last
            if (b === 'Sem Pasta') return -1;
            return a.localeCompare(b);
        });

        // Draggable Component Wrapper for Pills
        const DraggablePillWrapper = ({ pill, index }: { pill: any, index: number }) => {
            const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
                id: pill.id,
                data: pill,
                disabled: !!selectedFolder // Disable drag if inside a folder view (optional, but requested behavior implies dragging TO folders, usually from root)
            });
            const style = transform ? {
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
                zIndex: isDragging ? 50 : 0
            } : undefined;

            return (
                <div ref={setNodeRef} style={style} {...listeners} {...attributes} data-pill-id={pill.id}>
                    <div className="relative group">
                        {isSelectionMode && (
                            <div className="absolute top-4 right-4 z-20" onPointerDown={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedPills.has(pill.id)}
                                    onChange={() => togglePillSelection(pill.id)}
                                    className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                        )}
                        <KnowledgePill pill={pill} index={index} />
                    </div>
                </div>
            );
        };

        // Folder Card Component (Droppable + Clickable)
        const FolderCard = ({ name, count, onClick }: { name: string, count: number, onClick: () => void }) => {
            const { setNodeRef, isOver } = useDroppable({
                id: name,
                data: { type: 'folder', name }
            });

            return (
                <motion.div
                    ref={setNodeRef}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClick}
                    className={`cursor-pointer group relative overflow-hidden rounded-[32px] p-6 transition-all duration-300
                        ${isOver
                            ? 'bg-blue-500/20 border border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.02]'
                            : 'glass-hydro hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                        }`}
                >
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-2xl ${isOver ? 'bg-blue-500 text-white' : 'bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'} transition-colors backdrop-blur-md`}>
                                <Sparkles size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-2xl font-black text-zinc-900/20 dark:text-white/20 group-hover:text-zinc-900/40 dark:group-hover:text-white/40 transition-colors">
                                {String(count).padStart(2, '0')}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 line-clamp-1 drop-shadow-sm">{name}</h3>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{count} itens</p>
                        </div>
                    </div>
                </motion.div>
            );
        };

        return (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(e) => setActiveDragId(e.active.id as string)}>
                <div className="space-y-8" ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                    {selectionBox && (
                        <div
                            className="absolute bg-blue-500/10 border border-blue-500/30 rounded z-50 pointer-events-none"
                            style={{
                                left: Math.min(selectionBox.start.x, selectionBox.current.x),
                                top: Math.min(selectionBox.start.y, selectionBox.current.y),
                                width: Math.abs(selectionBox.current.x - selectionBox.start.x),
                                height: Math.abs(selectionBox.current.y - selectionBox.start.y)
                            }}
                        />
                    )}

                    {/* View Switch */}
                    {!selectedFolder ? (
                        // ROOT VIEW: Folders Grid + Loose Pills
                        <div className="space-y-10">
                            {/* Folders Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {(selectedSubject.folders || []).map(f => (
                                    <FolderCard
                                        key={f.id}
                                        name={f.name}
                                        count={groupedPills[f.name]?.length || 0}
                                        onClick={() => setSelectedFolder(f.name)}
                                    />
                                ))}
                            </div>

                            {/* Separator if we have loose pills */}
                            {groupedPills['Sem Pasta']?.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />
                                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Itens Soltos</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />
                                    </div>
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                        {groupedPills['Sem Pasta'].map((pill, index) => (
                                            <DraggablePillWrapper key={pill.id} pill={pill} index={index} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty State if no folders and no pills */}
                            {(!selectedSubject.folders || selectedSubject.folders.length === 0) && groupedPills['Sem Pasta']?.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
                                    <Sparkles size={48} className="mb-4 opacity-20" />
                                    <p className="font-medium">Nenhum conteúdo encontrado.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // FOLDER VIEW: Header + Pills Grid
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                <button
                                    onClick={() => setSelectedFolder(null)}
                                    className="p-3 -ml-2 rounded-2xl text-zinc-400 hover:text-white transition-all bg-white/[0.05] hover:bg-white/[0.1] border border-transparent hover:border-white/10 backdrop-blur-md bubble-hover"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{selectedFolder}</h2>
                                    <p className="text-sm text-zinc-400 font-medium">
                                        {groupedPills[selectedFolder]?.length || 0} pílulas nesta pasta
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {(groupedPills[selectedFolder] || []).map((pill, index) => (
                                    <DraggablePillWrapper key={pill.id} pill={pill} index={index} />
                                ))}
                                {(groupedPills[selectedFolder] || []).length === 0 && (
                                    <div className="col-span-full h-64 flex flex-col items-center justify-center glass-card border-dashed border-2 border-zinc-300/30 dark:border-white/10 rounded-[32px] group">
                                        <div className="p-5 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors mb-4 backdrop-blur-md">
                                            <FolderPlus size={32} className="text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <p className="font-bold text-zinc-700 dark:text-white mb-1">Esta pasta está vazia</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 opacity-80">Arraste pílulas para cá ou crie novo conteúdo.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
                <DragOverlay>
                    {activeDragId ? (
                        <div className="w-[300px] h-[100px] glass-hydro rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-95 flex items-center justify-center border border-white/20 scale-105 rotate-2 backdrop-blur-2xl">
                            <div className="flex items-center gap-3">
                                <span className="p-3 bg-blue-500/20 text-blue-300 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                    <Sparkles size={24} />
                                </span>
                                <span className="font-bold text-white text-lg">Movendo item...</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext >
        );
    }

    return (
        <div className="h-full flex flex-col relative">
            {/* Bulk Action Bar */}
            <AnimatePresence>
                {isSelectionMode && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-spatial px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4"
                    >
                        <span className="font-bold text-sm bg-white/10 px-3 py-1 rounded-lg text-white">
                            {selectedPills.size} selecionados
                        </span>
                        <div className="h-4 w-[1px] bg-white/20" />
                        <button
                            onClick={() => setIsMoveModalOpen(true)}
                            className="px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300
                                bg-white/[0.1] hover:bg-white/[0.2]
                                border border-white/[0.2] hover:border-white/[0.3]
                                shadow-lg hover:shadow-xl
                                text-white
                                ring-1 ring-white/[0.1]
                                text-sm font-bold hover:scale-[1.02] active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        >
                            Mover para Pasta
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300
                                bg-red-500/10 hover:bg-red-500/20
                                border border-red-500/20 hover:border-red-500/40
                                text-red-400 hover:text-red-300
                                shadow-lg shadow-red-500/10 hover:shadow-red-500/20
                                ring-1 ring-red-500/10
                                text-sm font-bold hover:scale-[1.02] active:scale-95"
                        >
                            Apagar
                        </button>
                        <button
                            onClick={() => { setIsSelectionMode(false); setSelectedPills(new Set()); }}
                            className="ml-2 p-2 rounded-xl backdrop-blur-sm transition-all duration-200
                                bg-transparent hover:bg-white/[0.1] dark:hover:bg-white/[0.1]
                                border border-transparent hover:border-white/[0.2]
                                hover:scale-110 active:scale-90"
                        >
                            X
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Move Modal */}
            {isMoveModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-all">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                        <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-white">Mover para Pasta</h3>
                        <input
                            type="text"
                            placeholder="Nome da pasta (ex: Capítulo 1)"
                            value={targetFolder}
                            onChange={e => setTargetFolder(e.target.value)}
                            className="w-full bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 mb-4 transition-all font-medium"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsMoveModalOpen(false)}
                                className="px-4 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleBulkMove}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Mover
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Header (existing code...) */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20">
                            <Sparkles size={24} />
                        </span>
                        Conteúdos
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                        Pílulas de conhecimento geradas por IA.
                    </p>
                </div>
                {!selectedSubject && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md transition-all duration-300
                            bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                            border border-white/20 shadow-lg shadow-blue-500/30
                            hover:shadow-blue-500/50
                            ring-1 ring-white/10
                            font-bold hover:scale-105 active:scale-95"
                    >
                        <Plus size={18} />
                        Nova Matéria
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    <motion.div
                        key="subject-list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="animate-spin text-pink-500" size={32} />
                            </div>
                        ) : (
                            <>
                                {/* Subject Tabs */}
                                <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                                    <div className="flex gap-3 min-w-max pb-2 px-1">
                                        {SUBJECT_TABS.map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setSelectedSubjectTab(tab)}
                                                className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300
                                                    ${selectedSubjectTab === tab
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105 backdrop-blur-md border border-white/20 ring-1 ring-white/10'
                                                        : 'bubble text-zinc-500 dark:text-zinc-400 hover:bg-white/10 hover:text-white hover:scale-105 hover:border-white/20'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mb-8 group">
                                    <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                    <div className="relative flex items-center gap-3 glass-hydro rounded-2xl px-5 py-4 group-focus-within:border-blue-500/40 group-focus-within:ring-1 group-focus-within:ring-blue-500/20 transition-all">
                                        <Search size={22} className="text-zinc-400 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Buscar matérias ou tópicos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500/70 font-medium text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Grid */}
                                {filteredSubjects.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500">
                                        <p>Nenhuma matéria encontrada.</p>
                                        <p className="text-sm mt-2">Crie uma nova matéria para começar.</p>
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm"
                                        >
                                            Criar Matéria
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredSubjects.map((subject, index) => (
                                            <SubjectCard
                                                key={subject.id}
                                                subject={subject}
                                                index={index}
                                                onClick={() => setSelectedSubject(subject)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="subject-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1"
                    >
                        <div className='flex items-center justify-between mb-6'>
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-medium px-4 py-2 bubble-hover w-fit"
                            >
                                <ArrowLeft size={18} />
                                Voltar para Matérias
                            </button>

                            <div className='flex gap-2 items-center'>
                                <button
                                    onClick={() => setIsCreateFolderModalOpen(true)}
                                    className="px-4 py-2 font-bold text-sm text-zinc-400 hover:text-white bubble-hover transition-all flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Nova Pasta
                                </button>
                                <button
                                    onClick={() => setIsManualModalOpen(true)}
                                    className="px-4 py-2 font-bold text-sm text-zinc-400 hover:text-white bubble-hover transition-all flex items-center gap-2"
                                >
                                    <FilePlus size={16} />
                                    Novo Conteúdo
                                </button>
                                <button
                                    onClick={() => setIsCustomGenModalOpen(true)}
                                    className="px-4 py-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 backdrop-blur-md border border-white/20"
                                >
                                    <Sparkles size={16} />
                                    Geração IA
                                </button>
                                <button
                                    onClick={() => setIsSelectionMode(!isSelectionMode)}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${isSelectionMode ? 'bg-blue-500/10 text-blue-500' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                                >
                                    {isSelectionMode ? 'Cancelar Seleção' : 'Selecionar'}
                                </button>
                                <div className="h-6 w-[1px] bg-zinc-200 dark:bg-white/10 mx-1" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedUploadFolder}
                                        onChange={e => setSelectedUploadFolder(e.target.value)}
                                        className="bg-zinc-100 dark:bg-white/5 border-none rounded-xl px-3 py-2 text-xs font-bold text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/30"
                                    >
                                        <option value="">Sem Pasta</option>
                                        {selectedSubject.folders?.map(f => (
                                            <option key={f.id} value={f.name}>{f.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        disabled={isGenerating}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 backdrop-blur-md border border-white/20"
                                    >
                                        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                        {isGenerating ? "Processando..." : "Carregar PDF"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-12 h-12 rounded-2xl ${selectedSubject.color} text-white flex items-center justify-center shadow-lg`}>
                                <span className="font-bold text-lg">{selectedSubject.title[0]}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {selectedSubject.title}
                            </h2>
                        </div>

                        {selectedSubject.pills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-80 glass-card border-dashed border-2 border-zinc-300/30 dark:border-white/10 rounded-[32px] group">
                                <div className="p-6 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors mb-6 backdrop-blur-md">
                                    <Sparkles size={48} className="text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-700 dark:text-white mb-2">Nenhuma pílula ainda</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm text-center leading-relaxed">
                                    Faça upload de um PDF para gerar cards de estudo automaticamente ou crie um novo conteúdo manualmente.
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-8 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Selecionar arquivo agora
                                </button>
                            </div>
                        ) : (
                            renderPillGrid()
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Gen Modal */}
            {isCustomGenModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="text-purple-500" />
                                Geração Personalizada com IA
                            </h2>
                            <button
                                onClick={() => setIsCustomGenModalOpen(false)}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} className="text-zinc-500" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                    Prompt / Instruções para a IA
                                </label>
                                <textarea
                                    className="w-full bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 min-h-[100px] outline-none focus:ring-2 focus:ring-purple-500/50 resize-y transition-all font-medium"
                                    placeholder="Ex: Foque apenas nas datas históricas e seus eventos. Ignore introduções longas. Crie perguntas de revisão difíceis."
                                    value={customPrompt}
                                    onChange={e => setCustomPrompt(e.target.value)}
                                />
                                <p className="text-xs text-zinc-400 mt-2">
                                    Dê instruções específicas sobre o que você quer extrair ou como quer formatar o conteúdo.
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                    Selecionar PDFs (Máx 200MB por arquivo)
                                </label>

                                <div
                                    onClick={() => customFileInputRef.current?.click()}
                                    className="border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-500/5 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all group"
                                >
                                    <Upload size={32} className="text-zinc-300 dark:text-zinc-600 group-hover:text-purple-500 transition-colors mb-3" />
                                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center">
                                        Clique para adicionar arquivos PDF
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Suporta múltiplos arquivos
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    ref={customFileInputRef}
                                    multiple
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="space-y-2 mb-6">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Arquivos Selecionados ({selectedFiles.length})</h4>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-zinc-50 dark:bg-white/5 px-4 py-3 rounded-xl border border-zinc-100 dark:border-white/5">
                                            <div className="flex items-center gap-3 truncate">
                                                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                                                    <span className="text-[10px] font-bold">PDF</span>
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate max-w-[200px] sm:max-w-xs">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-400">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {extractionProgress && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20 flex items-center gap-3">
                                    <Loader2 className="animate-spin text-blue-500" size={20} />
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {extractionProgress}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsCustomGenModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCustomGeneration}
                                disabled={isGenerating}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 flex items-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                {isGenerating ? "Processando..." : "Gerar Conteúdo"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Subject Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Nova Matéria</h2>
                        <form onSubmit={handleCreateSubject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nome da Matéria</label>
                                <input
                                    type="text"
                                    value={newSubjectTitle}
                                    onChange={(e) => setNewSubjectTitle(e.target.value)}
                                    placeholder="Ex: Biologia"
                                    className="w-full bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    autoFocus
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Cor do Card</label>
                                <div className="flex gap-2 flex-wrap">
                                    {availableColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewSubjectColor(color)}
                                            className={`w-10 h-10 rounded-xl ${color} transition-transform hover:scale-110 shadow-sm ${newSubjectColor === color ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newSubjectTitle.trim() || isCreating}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    {isCreating && <Loader2 className="animate-spin" size={14} />}
                                    Criar Matéria
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Create Folder Modal */}
            {isCreateFolderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Nova Pasta</h2>
                        <form onSubmit={handleCreateFolder}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nome da Pasta</label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Ex: Capítulo 1"
                                    className="w-full bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateFolderModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newFolderName.trim() || isCreatingFolder}
                                    className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                                >
                                    {isCreatingFolder && <Loader2 className="animate-spin" size={14} />}
                                    Criar Pasta
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Manual Content Modal */}
            {isManualModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Novo Conteúdo</h2>
                        <form onSubmit={handleCreateManualPill}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={manualTitle}
                                        onChange={e => setManualTitle(e.target.value)}
                                        className="w-full bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="Título do conteúdo"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Pasta (Opcional)</label>
                                    <select
                                        value={manualFolder}
                                        onChange={e => setManualFolder(e.target.value)}
                                        className="w-full bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    >
                                        <option value="">Sem Pasta</option>
                                        {selectedSubject?.folders?.map(f => (
                                            <option key={f.id} value={f.name}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Conteúdo (Markdown)</label>
                                    <textarea
                                        value={manualContent}
                                        onChange={e => setManualContent(e.target.value)}
                                        className="w-full h-40 bg-zinc-50/50 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-mono text-sm transition-all"
                                        placeholder="Escreva seu conteúdo aqui..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsManualModalOpen(false)}
                                    className="px-4 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!manualTitle.trim() || !manualContent.trim() || isCreating}
                                    className="px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300
                                        bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                                        border border-white/20 shadow-lg shadow-blue-500/30
                                        hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95
                                        ring-1 ring-white/10
                                        text-sm font-bold disabled:opacity-50 disabled:hover:scale-100
                                        flex items-center gap-2"
                                >
                                    {isCreating && <Loader2 className="animate-spin" size={14} />}
                                    Criar Conteúdo
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ContentModule;


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Search, Upload, RefreshCw, Loader2, Plus } from 'lucide-react';
import { Subject, KnowledgePill as KnowledgePillType } from '../../data/contentData';
import { contentService } from '../../services/contentService';
import { extractTextFromPDF } from '../../utils/pdfUtils';
import { generatePillsFromContent } from '../../services/geminiService';
import SubjectCard from './SubjectCard';
import KnowledgePill from './KnowledgePill';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
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
import { FilePlus } from 'lucide-react';

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
    const [selectedUploadFolder, setSelectedUploadFolder] = useState<string>('');

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

    const loadSubjects = async () => {
        setIsLoading(true);
        try {
            const data = await contentService.fetchSubjects();
            setSubjects(data);

            // If a subject is currently selected, refresh its data too
            if (selectedSubject) {
                const refreshed = data.find(s => s.id === selectedSubject.id);
                if (refreshed) setSelectedSubject(refreshed);
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
        const file = event.target.files?.[0];
        if (!file || !selectedSubject) return;

        if (file.type !== 'application/pdf') {
            toast.error("Por favor, selecione um arquivo PDF.");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Lendo PDF e gerando pílulas...");

        try {
            // 1. Extract Text & Metadata
            const { text, pageCount, images } = await extractTextFromPDF(file);

            if (!text || text.length < 50) {
                toast.error("O texto do PDF parece vazio. Se for um PDF escaneado (imagem), a IA não consegue ler ainda.", { id: toastId });
                return;
            }

            // 2. Generate Content with smart pill count & images
            const newPills = await generatePillsFromContent(text, pageCount, images);

            if (newPills.length === 0) {
                toast.error("Não foi possível gerar conteúdo deste PDF. Tente outro arquivo.", { id: toastId });
                return;
            }

            // 3. Save to DB (Attach selected folder if any)
            const pillsWithFolder = newPills.map(p => ({
                ...p,
                folder: selectedUploadFolder || p.folder
            }));

            const success = await contentService.savePills(selectedSubject.id, pillsWithFolder);

            if (success) {
                toast.success(`${newPills.length} pílulas geradas com sucesso!`, { id: toastId });
                await loadSubjects();
                setSelectedUploadFolder(''); // Reset
            } else {
                toast.error("Erro ao salvar pílulas.", { id: toastId });
            }

        } catch (error) {
            console.error("Upload process failed", error);
            toast.error("Ocorreu um erro durante o processamento.", { id: toastId });
        } finally {
            setIsGenerating(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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

    const filteredSubjects = subjects.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

        // Draggable Component Wrapper
        const DraggablePillWrapper = ({ pill, index }: { pill: any, index: number }) => {
            const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
                id: pill.id,
                data: pill
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
                                {/* Stop propagation to prevent drag start on checkbox click */}
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

        // Droppable Component Wrapper
        const DroppableFolderHeader = ({ name, count }: { name: string, count: number }) => {
            const { setNodeRef, isOver } = useDroppable({
                id: name,
            });

            return (
                <div ref={setNodeRef} className={`flex items-center justify-between mb-4 p-2 rounded-xl transition-colors ${isOver ? 'bg-blue-500/20 border border-blue-500/30' : ''}`}>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full" />
                        {name}
                        <span className="text-sm font-medium text-zinc-400 ml-2">({count})</span>
                    </h3>
                </div>
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

                    {folders.map(folderName => {
                        const pills = groupedPills[folderName];

                        return (
                            <div key={folderName} className="mb-10">
                                {folderName !== 'Sem Pasta' ? (
                                    <DroppableFolderHeader name={folderName} count={pills.length} />
                                ) : (
                                    <DroppableFolderHeader name={folderName} count={pills.length} />
                                )}

                                {pills.length === 0 ? (
                                    <div className="py-10 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-400">
                                        <Upload size={24} className="mb-2 opacity-20" />
                                        <p className="text-sm font-medium italic">Pasta vazia (Arraste itens para cá)</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                        {pills.map((pill, index) => (
                                            <DraggablePillWrapper key={pill.id} pill={pill} index={index} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <DragOverlay>
                    {activeDragId ? (
                        <div className="w-[300px] h-[100px] bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl opacity-80 flex items-center justify-center border border-blue-500">
                            <span className="font-bold text-zinc-900 dark:text-white">Movendo item...</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
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
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4"
                    >
                        <span className="font-bold text-sm bg-white/10 dark:bg-black/10 px-3 py-1 rounded-lg">
                            {selectedPills.size} selecionados
                        </span>
                        <div className="h-4 w-[1px] bg-white/20 dark:bg-black/20" />
                        <button
                            onClick={() => setIsMoveModalOpen(true)}
                            className="flex items-center gap-2 text-sm font-bold hover:text-blue-400 dark:hover:text-blue-600 transition-colors"
                        >
                            Mover para Pasta
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 text-sm font-bold text-red-400 dark:text-red-600 hover:text-red-300 transition-colors"
                        >
                            Apagar
                        </button>
                        <button
                            onClick={() => { setIsSelectionMode(false); setSelectedPills(new Set()); }}
                            className="ml-2 p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded-full"
                        >
                            X
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Move Modal */}
            {isMoveModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
                    >
                        <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-white">Mover para Pasta</h3>
                        <input
                            type="text"
                            placeholder="Nome da pasta (ex: Capítulo 1)"
                            value={targetFolder}
                            onChange={e => setTargetFolder(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsMoveModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleBulkMove}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700"
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
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:scale-105 transition-transform"
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
                                {/* Search Bar */}
                                <div className="relative mb-8 group">
                                    <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 shadow-sm group-focus-within:border-blue-500/50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 transition-all">
                                        <Search size={20} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Buscar matérias ou tópicos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 hover-cards-container">
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
                                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 w-fit"
                            >
                                <ArrowLeft size={18} />
                                Voltar para Matérias
                            </button>

                            <div className='flex gap-2 items-center'>
                                <button
                                    onClick={() => setIsCreateFolderModalOpen(true)}
                                    className="px-4 py-2 rounded-xl font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Nova Pasta
                                </button>
                                <button
                                    onClick={() => setIsManualModalOpen(true)}
                                    className="px-4 py-2 rounded-xl font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    <FilePlus size={16} />
                                    Novo Conteúdo
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
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
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
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-3xl bg-zinc-50/50 dark:bg-white/5">
                                <Sparkles size={48} className="text-zinc-300 dark:text-zinc-600 mb-4" />
                                <h3 className="text-lg font-bold text-zinc-500 dark:text-zinc-400">Nenhuma pílula ainda</h3>
                                <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs text-center mt-2">
                                    Faça upload de um PDF para gerar cards de estudo automaticamente.
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-6 text-blue-500 hover:text-blue-600 font-bold text-sm"
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

            {/* Create Subject Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
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
                                    className="w-full bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
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
                                            className={`w-8 h-8 rounded-full ${color} transition-transform hover:scale-110 ${newSubjectColor === color ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900' : ''}`}
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
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
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
                                    className="w-full bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
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
                                    className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-xl disabled:opacity-50 flex items-center gap-2"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
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
                                        className="w-full bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="Título do conteúdo"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Pasta (Opcional)</label>
                                    <select
                                        value={manualFolder}
                                        onChange={e => setManualFolder(e.target.value)}
                                        className="w-full bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
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
                                        className="w-full h-40 bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-mono text-sm"
                                        placeholder="Escreva seu conteúdo aqui..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsManualModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!manualTitle.trim() || !manualContent.trim() || isCreating}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 flex items-center gap-2"
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

import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Target, Flag, ArrowRight, Layout, RefreshCcw, ChevronLeft, ChevronRight, Clock, Book, BookOpen, Bookmark, Percent, BarChart, Loader2, Sparkles, MoreHorizontal, GraduationCap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import RoadmapGenerator from './planner/RoadmapGenerator';
import { authService } from '../services/authService';
import { tasksService } from '../services/tasksService';
import { PlannerTask, TaskScope, TaskPriority, StudyMaterial } from '../types';
import { toast } from 'sonner';

const TaskPlanner: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
    const [activeTab, setActiveTab] = useState<'calendar' | 'materials'>('calendar');
    const [showRoadmapGenerator, setShowRoadmapGenerator] = useState(false);

    // --- STATES FOR TASKS ---
    const [tasks, setTasks] = useState<PlannerTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date()); // For Calendar Navigation
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected day

    // Form State Tasks
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');
    const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');

    // --- STATES FOR MATERIALS ---
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    // Form State Materials
    const [newMaterialTitle, setNewMaterialTitle] = useState('');
    const [newMaterialSubject, setNewMaterialSubject] = useState('Matemática');
    const [newMaterialTotal, setNewMaterialTotal] = useState('');

    const MATERIALS_KEY = authService.getUserStorageKey('hpc_study_materials');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [fetchedTasks] = await Promise.all([
                tasksService.fetchTasks()
            ]);
            setTasks(fetchedTasks);

            const savedMaterials = localStorage.getItem(MATERIALS_KEY);
            if (savedMaterials) setMaterials(JSON.parse(savedMaterials));

        } catch (error) {
            console.error("Failed to load planner data", error);
            toast.error("Erro ao carregar tarefas.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- TASK LOGIC ---

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const newTask = await tasksService.createTask({
                title: newTaskTitle,
                completed: false,
                scope: 'Daily',
                priority: newPriority,
                date: selectedDate.toLocaleDateString('pt-BR'),
                time: newTaskTime || undefined
            });

            if (newTask) {
                setTasks(prev => [newTask, ...prev]);
                setNewTaskTitle('');
                setNewTaskTime('');
                toast.success("Tarefa adicionada!");
            } else {
                toast.error("Erro ao criar tarefa.");
            }
        } catch (e) {
            toast.error("Erro inesperado ao criar tarefa.");
        }
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        // Optimistic
        const oldTasks = [...tasks];
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t);
        setTasks(updatedTasks);

        try {
            const taskToUpdate = updatedTasks.find(t => t.id === id);
            if (taskToUpdate) {
                await tasksService.updateTask(taskToUpdate);
            }
        } catch (e) {
            setTasks(oldTasks); // Revert
            toast.error("Erro ao atualizar tarefa.");
        }
    };

    const deleteTask = async (id: string) => {
        if (!confirm('Remover tarefa?')) return;

        // Optimistic
        const oldTasks = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            await tasksService.deleteTask(id);
            toast.success("Tarefa removida.");
        } catch (e) {
            setTasks(oldTasks);
            toast.error("Erro ao remover tarefa.");
        }
    };

    const clearCompleted = async (dateStr: string) => {
        if (!confirm('Limpar tarefas concluídas deste dia?')) return;

        const toRemove = tasks.filter(t => t.completed && t.date === dateStr);
        const keep = tasks.filter(t => !t.completed || t.date !== dateStr);

        setTasks(keep); // Optimistic

        try {
            await Promise.all(toRemove.map(t => tasksService.deleteTask(t.id)));
            toast.success("Tarefas limpas!");
        } catch (e) {
            toast.error("Erro ao limpar tarefas.");
            // Reload to be safe
            loadData();
        }
    };

    // --- CALENDAR LOGIC ---
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

        const days = [];
        // Add empty slots for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
        setCurrentDate(newDate);
    };

    const selectedDateStr = selectedDate.toLocaleDateString('pt-BR');
    const tasksForSelectedDate = tasks
        .filter(t => t.date === selectedDateStr)
        .sort((a, b) => {
            // Sort by time if available, then by priority
            if (a.time && b.time) return a.time.localeCompare(b.time);
            if (a.time) return -1;
            if (b.time) return 1;
            const pMap = { High: 3, Medium: 2, Low: 1 };
            return pMap[b.priority] - pMap[a.priority];
        });

    const progress = tasksForSelectedDate.length > 0
        ? Math.round((tasksForSelectedDate.filter(t => t.completed).length / tasksForSelectedDate.length) * 100)
        : 0;

    // --- MATERIALS LOGIC ---

    const saveMaterials = (updated: StudyMaterial[]) => {
        setMaterials(updated);
        localStorage.setItem(MATERIALS_KEY, JSON.stringify(updated));
    };

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMaterialTitle.trim() || !newMaterialTotal) return;

        const newMat: StudyMaterial = {
            id: crypto.randomUUID(),
            title: newMaterialTitle,
            subject: newMaterialSubject,
            totalChapters: parseInt(newMaterialTotal),
            currentChapter: 0,
            lastUpdated: Date.now()
        };

        saveMaterials([...materials, newMat]);
        setNewMaterialTitle('');
        setNewMaterialTotal('');
    };

    const updateProgress = (id: string, delta: number) => {
        const updated = materials.map(m => {
            if (m.id !== id) return m;
            const newCurrent = Math.min(Math.max(0, m.currentChapter + delta), m.totalChapters);
            return { ...m, currentChapter: newCurrent, lastUpdated: Date.now() };
        });
        saveMaterials(updated);
    };

    const deleteMaterial = (id: string) => {
        if (confirm('Remover esta apostila?')) {
            saveMaterials(materials.filter(m => m.id !== id));
        }
    };

    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'Medium': return 'text-yellow-400 bg-amber-500/10 border-amber-500/20';
            case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    const subjectsList = ['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Português', 'Literatura', 'Inglês', 'Redação'];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20 text-zinc-500">
                <Loader2 className="animate-spin mb-2 text-blue-500" size={32} />
                <span className="ml-2">Carregando Planner...</span>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header & Tabs */}

            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] -z-10 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                        <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                            Planner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Inteligente</span>
                        </h2>
                    </div>
                    <p className="text-zinc-400 text-base font-medium pl-6 max-w-md leading-relaxed">
                        Gerencie seu tempo com precisão e acompanhe suas metas estratégicas.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-black/20 p-2 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
                    <div className="flex glass-spatial p-1.5 rounded-2xl gap-1">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden
                                ${activeTab === 'calendar'
                                    ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {activeTab === 'calendar' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-blue-500/20 border border-blue-500/30 rounded-xl"
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <CalendarIcon size={16} /> Agenda
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('materials')}
                            className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden
                                ${activeTab === 'materials'
                                    ? 'shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {activeTab === 'materials' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-purple-500/20 border border-purple-500/30 rounded-xl"
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Book size={16} /> Materiais
                            </span>
                        </button>
                    </div>

                    <div className="w-[1px] h-8 bg-white/10 mx-1" />

                    {/* IA Assistant conditional */}
                    {isAdmin && (
                        <button
                            onClick={() => setShowRoadmapGenerator(true)}
                            className="px-5 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all flex items-center gap-2 border border-white/20"
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline">IA Assistant</span>
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showRoadmapGenerator && (
                    <RoadmapGenerator
                        onClose={() => setShowRoadmapGenerator(false)}
                        onSuccess={loadData}
                    />
                )}
            </AnimatePresence>

            {activeTab === 'calendar' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Calendar Grid */}
                    <div className="lg:col-span-7 glass-hydro rounded-[48px] p-8 relative overflow-hidden flex flex-col min-h-[600px]">
                        {/* Decorative background blob */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />

                        <div className="flex justify-between items-center mb-8 px-2">
                            <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all hover:scale-110 border border-transparent hover:border-white/10 hover:shadow-lg"><ChevronLeft size={24} /></button>
                            <h3 className="text-3xl font-black text-white capitalize tracking-tight drop-shadow-sm">
                                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all hover:scale-110 border border-transparent hover:border-white/10 hover:shadow-lg"><ChevronRight size={24} /></button>
                        </div>

                        <div className="grid grid-cols-7 gap-4 mb-4 text-center px-2">
                            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d, i) => (
                                <div key={i} className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-3">
                            {getDaysInMonth(currentDate).map((date, idx) => {
                                if (!date) return <div key={idx} className="aspect-square"></div>;

                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const dateStr = date.toLocaleDateString('pt-BR');
                                const hasTasks = tasks.some(t => t.date === dateStr && !t.completed);
                                const allCompleted = tasks.some(t => t.date === dateStr) && tasks.filter(t => t.date === dateStr).every(t => t.completed);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(date)}
                                        className={`
                                            aspect-square rounded-[24px] flex flex-col items-center justify-center relative transition-all duration-300 group
                                            ${isSelected
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_15px_30px_rgba(59,130,246,0.4)] scale-110 z-10 border border-white/20'
                                                : isToday
                                                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                    : 'bg-white/[0.03] border border-white/[0.05] text-zinc-400 hover:bg-white/[0.08] hover:text-white hover:scale-105 hover:border-white/20 hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        <span className={`text-sm font-bold ${isSelected ? 'scale-125' : 'group-hover:scale-110'} transition-transform`}>{date.getDate()}</span>
                                        <div className="flex gap-0.5 mt-2 h-1.5 justify-center w-full">
                                            {hasTasks && (
                                                <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${isSelected ? 'bg-white' : 'bg-blue-400'}`} />
                                            )}
                                            {allCompleted && !hasTasks && (
                                                <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Task List for Selected Day */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="glass-card rounded-[36px] p-6 flex flex-col h-full min-h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                                            <CalendarIcon size={18} />
                                        </div>
                                        {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-1 pl-10 font-medium uppercase tracking-wider">
                                        {new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(selectedDate)}
                                    </p>
                                </div>
                                {tasksForSelectedDate.some(t => t.completed) && (
                                    <button onClick={() => clearCompleted(selectedDateStr)} className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
                                        <RefreshCcw size={12} /> Limpar Concluídas
                                    </button>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8 p-6 rounded-3xl bg-zinc-950/40 border border-white/5 backdrop-blur-md shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between text-xs mb-3 relative z-10">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Target size={14} className="text-blue-400" />
                                        Metas do Dia
                                    </span>
                                    <span className={`font-black text-lg ${progress === 100 ? 'text-emerald-400' : 'text-white'}`}>{progress}%</span>
                                </div>
                                <div className="h-3 bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 relative z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) relative overflow-hidden
                                            ${progress === 100
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite] opacity-30" />
                                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[4px]" />
                                    </div>
                                </div>
                            </div>

                            {/* Add Task Form */}
                            <form onSubmit={handleAddTask} className="mb-6 space-y-3 glass-spatial p-4 rounded-3xl border border-white/10 relative">
                                <div className="flex gap-3">
                                    <div className="relative w-24 flex-shrink-0 group">
                                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                        <input
                                            type="time"
                                            value={newTaskTime}
                                            onChange={(e) => setNewTaskTime(e.target.value)}
                                            className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-9 pr-2 text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono hover:bg-black/30"
                                        />
                                    </div>
                                    <div className="relative flex-1 group">
                                        <input
                                            type="text"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            placeholder="Nova tarefa estratégica..."
                                            className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 hover:bg-black/30"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                            <button
                                                type="submit"
                                                disabled={!newTaskTitle.trim()}
                                                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between items-center px-1">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Prioridade</span>
                                    <div className="flex gap-2 bg-black/20 p-1 rounded-xl">
                                        {(['Low', 'Medium', 'High'] as TaskPriority[]).map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setNewPriority(p)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${newPriority === p
                                                    ? getPriorityColor(p) + ' shadow-lg scale-105 ring-1 ring-white/10'
                                                    : 'text-zinc-600 hover:bg-white/5 hover:text-zinc-400'
                                                    }`}
                                            >
                                                {p === 'High' ? 'Alta' : p === 'Medium' ? 'Média' : 'Baixa'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {tasksForSelectedDate.length === 0 ? (
                                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-500 border border-white/5 rounded-3xl bg-white/[0.02] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                                        <div className="p-4 rounded-full bg-white/5 mb-3 ring-1 ring-white/10 shadow-lg">
                                            <Target size={24} className="text-zinc-600" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-400">Dia livre de tarefas.</span>
                                        <span className="text-xs text-zinc-600 mt-1">Adicione metas estratégicas.</span>
                                    </div>
                                ) : (
                                    tasksForSelectedDate.map(task => (
                                        <div
                                            key={task.id}
                                            className={`group relative overflow-hidden transition-all duration-500  rounded-2xl border
                                                ${task.completed
                                                    ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60'
                                                    : 'bg-white/[0.03] border-white/[0.05] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-lg'
                                                }
                                                p-0
                                            `}
                                        >
                                            <div className="flex items-center gap-4 p-4 relative z-10">
                                                <button
                                                    onClick={() => toggleTask(task.id, task.completed)}
                                                    className={`flex-shrink-0 transition-all duration-300 transform group-hover:scale-110 ${task.completed ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-emerald-400'}`}
                                                >
                                                    {task.completed ? (
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50" />
                                                            <CheckCircle2 size={26} className="relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                        </div>
                                                    ) : (
                                                        <Circle size={24} strokeWidth={1.5} />
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate transition-all ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        {task.time && (
                                                            <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 font-mono flex items-center gap-1">
                                                                <Clock size={10} /> {task.time}
                                                            </span>
                                                        )}
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md border text-opacity-80
                                                            ${task.priority === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                                task.priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                                    'bg-blue-500/10 border-blue-500/20 text-blue-400'}
                                                        `}>
                                                            {task.priority === 'High' ? 'Alta' : task.priority === 'Medium' ? 'Média' : 'Baixa'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg transform translate-x-4 group-hover:translate-x-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Priority Indicator Stripe */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'High' ? 'bg-red-500' :
                                                task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                                                } opacity-0 group-hover:opacity-100 transition-opacity`} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'materials' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Add Material & Stats */}
                    <div className="space-y-8">
                        <div className="glass-hydro rounded-[48px] p-8 relative overflow-hidden">
                            {/* Shiny effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] -z-10 rounded-full" />

                            <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-xl">
                                <span className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <Bookmark size={22} />
                                </span>
                                Novo Material
                            </h3>
                            <form onSubmit={handleAddMaterial} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 mb-1.5 block uppercase tracking-wider">Título do Material</label>
                                    <input
                                        type="text"
                                        value={newMaterialTitle}
                                        onChange={e => setNewMaterialTitle(e.target.value)}
                                        className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                                        placeholder="Ex: Matemática Vol 1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 mb-1.5 block uppercase tracking-wider">Matéria</label>
                                        <select
                                            value={newMaterialSubject}
                                            onChange={e => setNewMaterialSubject(e.target.value)}
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                                        >
                                            {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 mb-1.5 block uppercase tracking-wider">Capítulos</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newMaterialTotal}
                                            onChange={e => setNewMaterialTotal(e.target.value)}
                                            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                                            placeholder="Qtd."
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.5)] active:scale-95 mt-4 border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 group">
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                    Adicionar ao Planner
                                </button>
                            </form>
                        </div>

                        {materials.length > 0 && (
                            <div className="glass-card rounded-[36px] p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 bg-zinc-900/30 rounded-full flex items-center justify-center mb-5 border border-white/5 relative group">
                                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                                    <BarChart size={40} className="text-purple-400 relative z-10" />
                                </div>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Biblioteca Ativa</p>
                                <h4 className="text-5xl font-black text-white mb-4 tracking-tighter">{materials.length}</h4>
                                <div className="px-5 py-2 glass-spatial rounded-full">
                                    <p className="text-xs text-zinc-300 font-medium">
                                        Progresso Geral: <span className="text-white font-bold ml-1">{Math.round(materials.reduce((acc, m) => acc + (m.currentChapter / m.totalChapters), 0) / materials.length * 100)}%</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Grid of Materials */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
                        {materials.length === 0 ? (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center text-zinc-500 border border-white/5 rounded-[32px] bg-white/[0.02] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-50" />
                                <div className="p-6 rounded-full bg-black/20 mb-4 ring-1 ring-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-500">
                                    <BookOpen size={48} className="text-zinc-700 group-hover:text-purple-400 transition-colors" />
                                </div>
                                <p className="font-bold text-lg text-zinc-400">Nenhuma apostila cadastrada.</p>
                                <p className="text-sm opacity-50 mt-1 max-w-xs text-center">Adicione seus materiais didáticos para rastrear o progresso de estudo.</p>
                            </div>
                        ) : (
                            materials.map(mat => {
                                const pct = Math.round((mat.currentChapter / mat.totalChapters) * 100);
                                return (
                                    <div key={mat.id} className="bubble hover:scale-[1.02] p-6 relative group transition-all duration-500 flex flex-col justify-between h-[240px]">
                                        <button
                                            onClick={() => deleteMaterial(mat.id)}
                                            className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-500/10 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="flex items-start gap-5 relative z-10">
                                            <div className="w-16 h-20 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl group-hover:-translate-y-2 group-hover:rotate-2 transition-all duration-300 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Book size={28} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">{mat.subject}</span>
                                                <h4 className="text-white font-bold leading-tight mt-2.5 text-lg truncate pr-6 group-hover:text-purple-200 transition-colors">{mat.title}</h4>
                                                <p className="text-zinc-500 text-xs mt-1.5 font-medium flex items-center gap-1.5">
                                                    <BookOpen size={12} /> Capítulo <span className="text-white font-bold">{mat.currentChapter}</span> / {mat.totalChapters}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                                    <div className={`h-full rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${pct >= 100 ? 'bg-emerald-500 text-emerald-500' : 'bg-purple-500 text-purple-500'}`} style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-white w-8 text-right">{pct}%</span>
                                            </div>

                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                                <button
                                                    onClick={() => updateProgress(mat.id, -1)}
                                                    disabled={mat.currentChapter <= 0}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Atualizar</span>
                                                <button
                                                    onClick={() => updateProgress(mat.id, 1)}
                                                    disabled={mat.currentChapter >= mat.totalChapters}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskPlanner;
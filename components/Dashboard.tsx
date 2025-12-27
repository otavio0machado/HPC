import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Menu, X, Clock, Loader2, ChevronRight, User, Settings as SettingsIcon, LogOut, Lock, LayoutDashboard, Calendar, BookOpen, GraduationCap, AlertOctagon, Zap, FileText, ChevronDown, Search, GripVertical, Sparkles } from 'lucide-react';
import { useDragControls } from 'framer-motion';
import { toast } from 'sonner';

// Components
import DashboardWidgets from './dashboard/DashboardWidgets';
import Tutors from './Tutors';
import ErrorList from './ErrorList';
import Flashcards from './Flashcards';
import Simulados from './Simulados';
import TaskPlanner from './TaskPlanner';
import Profile from './Profile';
import Settings from './Settings';
import NotesModule from './notes/NotesModule';
import Library from './library/Library';

import UpgradeModal from './UpgradeModal';
import ContentModule from './content/ContentModule';
import { DashboardSkeleton } from './SkeletonLoader';

// Services & Types
import { authService } from '../services/authService';
import { flashcardService } from '../services/flashcardService';
import { PlannerTask, ErrorEntry, SimuladoResult, Message, User as UserType } from '../types';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    // Navigation State
    const navItems = [
        { id: "Dashboard", label: "Início", icon: <LayoutDashboard size={20} /> },
        { id: "Planner", label: "Planner", icon: <Calendar size={20} /> },
        { id: "Notas", label: "Notas", icon: <FileText size={20} /> },
        { id: "Conteúdos", label: "Conteúdos", icon: <Sparkles size={20} /> },
        { id: "Biblioteca", label: "Biblioteca", icon: <BookOpen size={20} /> },
        { id: "Tutores", label: "Tutores", icon: <GraduationCap size={20} /> },
        { id: "Lista de Erros", label: "Erros", icon: <AlertOctagon size={20} /> },
        { id: "Flashcards", label: "Cards", icon: <Zap size={20} /> },
        { id: "Simulados", label: "Simulados", icon: <Clock size={20} /> }
    ];
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [tabs, setTabs] = useState(navItems);

    // User Menu State
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // User State
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Data States
    const [todayHours, setTodayHours] = useState<number>(0);
    const [weekHours, setWeekHours] = useState<number>(0);
    const [monthHours, setMonthHours] = useState<number>(0);
    const [dailyTasks, setDailyTasks] = useState<PlannerTask[]>([]);

    // Widget States
    const [activeTutorsCount, setActiveTutorsCount] = useState(0);
    const [simuladosCount, setSimuladosCount] = useState(0);
    const [lastTutorMessage, setLastTutorMessage] = useState<{ subject: string, message: string } | null>(null);
    const [recentErrors, setRecentErrors] = useState<ErrorEntry[]>([]);
    const [dueFlashcardsCount, setDueFlashcardsCount] = useState(0);
    const [latestSimulado, setLatestSimulado] = useState<SimuladoResult | null>(null);
    const [globalSimuladosAvg, setGlobalSimuladosAvg] = useState(0);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [inputHours, setInputHours] = useState('');

    // --------------------------------------------------------------------------
    // Effects
    // --------------------------------------------------------------------------

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load User
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (!user) {
                    onLogout();
                    return;
                }
                setCurrentUser(user);
            } catch (error) {
                console.error("Erro ao carregar usuário", error);
                toast.error("Sessão expirada. Faça login novamente.");
                onLogout();
            } finally {
                setIsLoadingUser(false);
            }
        };
        loadUser();
    }, []);

    // Load Data
    useEffect(() => {
        if (!currentUser) return;

        const loadData = async () => {
            // 1. Metrics
            const metricsKey = 'hpc_metrics_' + currentUser.id;
            const savedMetrics = localStorage.getItem(metricsKey);
            if (savedMetrics) {
                const parsed = JSON.parse(savedMetrics);
                setTodayHours(parsed.today || 0);
                setWeekHours(parsed.week || 0);
                setMonthHours(parsed.month || 0);
            }

            // 2. Flashcards
            try {
                const cards = await flashcardService.fetchFlashcards();
                const due = cards.filter(c => c.nextReview <= Date.now()).length;
                setDueFlashcardsCount(due);
            } catch (e) {
                console.error("Failed to load flashcards summary", e);
            }

            // 3. LocalStorage Data
            try {
                // Errors
                const errorsKey = `hpc_error_list_${currentUser.id}`;
                const errorsStr = localStorage.getItem(errorsKey);
                if (errorsStr) {
                    const parsed: ErrorEntry[] = JSON.parse(errorsStr);
                    if (Array.isArray(parsed)) setRecentErrors(parsed.slice(0, 3));
                }

                // Tutors
                const tutorsKey = `hpc_tutor_history_${currentUser.id}`;
                const tutorsStr = localStorage.getItem(tutorsKey);
                if (tutorsStr) {
                    const parsed = JSON.parse(tutorsStr);
                    const subjects = Object.keys(parsed);
                    setActiveTutorsCount(subjects.length);
                    let foundMsg = null;
                    for (const sub of subjects) {
                        const msgs: Message[] = parsed[sub];
                        if (msgs && msgs.length > 0) {
                            foundMsg = { subject: sub, message: msgs[msgs.length - 1].text };
                            break;
                        }
                    }
                    setLastTutorMessage(foundMsg);
                }

                // Simulados
                const simuladosKey = `hpc_simulados_history_${currentUser.id}`;
                const simuladosStr = localStorage.getItem(simuladosKey);
                if (simuladosStr) {
                    const parsed: SimuladoResult[] = JSON.parse(simuladosStr);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setSimuladosCount(parsed.length);
                        setLatestSimulado(parsed[0]);
                        let sumPct = 0;
                        parsed.forEach(sim => {
                            let correct = 0, total = 0;
                            sim.areas.forEach(a => { correct += a.correct; total += a.total; });
                            if (total > 0) sumPct += (correct / total);
                        });
                        setGlobalSimuladosAvg(Math.round((sumPct / parsed.length) * 100));
                    }
                }

                // Planner Tasks
                const plannerKey = `hpc_planner_tasks_${currentUser.id}`;
                const tasks = localStorage.getItem(plannerKey);
                if (tasks) {
                    const parsed = JSON.parse(tasks);
                    const todayStr = new Date().toLocaleDateString('pt-BR');
                    const todayTasks = parsed.filter((t: PlannerTask) => t.scope === 'Daily' && t.date === todayStr);
                    setDailyTasks(todayTasks);
                }

            } catch (e) {
                console.error("Error loading local storage data", e);
            }
        };

        loadData();
    }, [activeTab, currentUser]);


    // --------------------------------------------------------------------------
    // Handlers
    // --------------------------------------------------------------------------

    const handleUpdateUser = (updatedUser: UserType) => {
        setCurrentUser(updatedUser);
    };

    const reloadUser = async () => {
        const user = await authService.getCurrentUser();
        if (user) setCurrentUser(user);
    };

    const handleAddSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        const val = parseFloat(inputHours);
        if (!isNaN(val) && val > 0) {
            const newToday = +(todayHours + val).toFixed(1);
            const newWeek = +(weekHours + val).toFixed(1);
            const newMonth = +(monthHours + val).toFixed(1);
            setTodayHours(newToday);
            setWeekHours(newWeek);
            setMonthHours(newMonth);

            const metricsKey = `hpc_metrics_${currentUser.id}`;
            localStorage.setItem(metricsKey, JSON.stringify({ today: newToday, week: newWeek, month: newMonth }));
            setIsModalOpen(false);
            setInputHours('');
            toast.success("Sessão registrada com sucesso!");
        }
    };

    const toggleTaskWidget = (id: string) => {
        if (!currentUser) return;
        const plannerKey = `hpc_planner_tasks_${currentUser.id}`;
        const allTasks: PlannerTask[] = JSON.parse(localStorage.getItem(plannerKey) || '[]');
        const updated = allTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        localStorage.setItem(plannerKey, JSON.stringify(updated));
        const todayStr = new Date().toLocaleDateString('pt-BR');
        setDailyTasks(updated.filter(t => t.scope === 'Daily' && t.date === todayStr));
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const changeTab = (tab: string) => {
        if (!currentUser) return;
        const restricted = ['Notas', 'Biblioteca', 'Tutores', 'Lista de Erros', 'Flashcards', 'Simulados', 'Conteúdos'];
        const isPro = currentUser.subscription_tier === 'pro';

        if (restricted.includes(tab) && !isPro) {
            setShowUpgradeModal(true);
            return;
        }
        setActiveTab(tab);
    };

    const jellyVariant = {
        hover: {
            scale: 1.05,
            rotate: [0, -2, 2, -1, 1, 0],
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            } as any
        },
        tap: { scale: 0.95 }
    };

    const DraggableNavItem = ({ item, isActive, isLocked, changeTab }: any) => {
        const controls = useDragControls();
        const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePosition({ x, y });
        };

        return (
            <Reorder.Item key={item.id} value={item} style={{ position: 'relative' }} dragListener={false} dragControls={controls}>
                <div
                    className={`
                    relative w-full flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group
                    ${isActive
                            ? 'text-blue-600 dark:text-white font-bold shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }
                `}
                    onMouseMove={handleMouseMove}
                >
                    {/* Mouse Spotlight Effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{
                            background: `radial-gradient(circle 150px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.12) 0%, transparent 70%)`
                        }}
                    />

                    {/* Drag Handle */}
                    <div
                        onPointerDown={(e) => controls.start(e)}
                        className="cursor-grab active:cursor-grabbing p-1 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                        <GripVertical size={14} />
                    </div>

                    {/* Button Content Wrapper */}
                    <button
                        onClick={() => changeTab(item.id)}
                        className="flex-1 flex items-center gap-3.5 text-left w-full outline-none"
                    >
                        {/* Interactive Background Liquid */}
                        <div className={`
                            absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none
                            ${isActive
                                ? 'glass-active'
                                : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                            }
                        `} />

                        {/* Active Glow */}
                        {isActive && (
                            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl blur-xl pointer-events-none" />
                        )}

                        <span className="relative z-10">{item.icon}</span>
                        <span className="relative z-10 flex-1">{item.label}</span>

                        {isLocked && <Lock size={12} className="relative z-10 text-zinc-400 dark:text-white/30" />}
                    </button>
                </div>
            </Reorder.Item>
        );
    };

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------

    if (isLoadingUser || !currentUser) {
        return (
            <div className="min-h-screen bg-transparent">
                <DashboardSkeleton />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-white font-sans selection:bg-blue-500/30">

            {/* --- MACOS TAHOE LIQUID GLASS SIDEBAR --- */}
            {/* Floating, decoupled sidebar with deep blur */}
            <aside className="fixed left-4 top-4 bottom-4 w-72 rounded-[32px] glass-spatial z-50 flex flex-col justify-between p-6 transition-all duration-300">

                {/* Logo & Gradient Orb */}
                {/* Logo & Gradient Orb */}
                <div className="flex items-center gap-3 mb-10 px-2 group relative z-10">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-500 flex items-center justify-center border border-white/20">
                            <span className="font-black italic text-white text-lg drop-shadow-md">H</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight drop-shadow-sm">HPC<span className="text-blue-500 dark:text-blue-400">.</span></h1>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase opacity-80">Club Member</p>
                    </div>
                </div>

                {/* Global Search - Floating Bubble */}
                <div className="mb-6 relative group px-2">
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-2xl blur-md shadow-inner opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3 bg-zinc-100 dark:bg-black/20 hover:bg-zinc-200 dark:hover:bg-black/40 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 rounded-2xl px-4 py-3 transition-all cursor-pointer group-active:scale-95">
                        <Search size={18} className="text-zinc-500 dark:text-white/40 group-hover:text-zinc-800 dark:group-hover:text-white/80 transition-colors" />
                        <span className="text-sm text-zinc-500 dark:text-white/40 font-medium group-hover:text-zinc-800 dark:group-hover:text-white/70">Buscar...</span>
                        <span className="ml-auto text-xs bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-white/30 px-1.5 py-0.5 rounded border border-black/5 dark:border-white/5 font-mono">⌘K</span>
                    </div>
                </div>

                {/* Navigation - Squircle Buttons with Drag & Drop */}
                <Reorder.Group axis="y" values={tabs} onReorder={setTabs} className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-2 -mx-2 list-none">
                    {tabs.map((item) => {
                        const isActive = activeTab === item.id;
                        const isLocked = ['Notas', 'Biblioteca', 'Tutores', 'Lista de Erros', 'Flashcards', 'Simulados', 'Conteúdos'].includes(item.id) && currentUser.subscription_tier !== 'pro';

                        return (
                            <DraggableNavItem
                                key={item.id}
                                item={item}
                                isActive={isActive}
                                isLocked={isLocked}
                                changeTab={changeTab}
                            />
                        );
                    })}
                </Reorder.Group>

                {/* User Profile Section */}
                <div className="pt-4 mt-auto px-2 relative" ref={userMenuRef}>
                    <AnimatePresence>
                        {userMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-full left-0 right-0 mb-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(0,0,0,0.7)] p-2 z-[100] origin-bottom overflow-hidden"
                            >
                                <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 mb-1">
                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Sua Conta</p>
                                </div>

                                <button
                                    onClick={() => { changeTab('Perfil'); setUserMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-2xl transition-all duration-200 font-semibold group/item"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all shadow-sm">
                                        <User size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Meu Perfil</p>
                                        <p className="text-[10px] opacity-50 font-medium">Ver detalhes da conta</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { changeTab('Configurações'); setUserMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-2xl transition-all duration-200 font-semibold group/item"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all shadow-sm">
                                        <SettingsIcon size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Configurações</p>
                                        <p className="text-[10px] opacity-50 font-medium">Preferências do sistema</p>
                                    </div>
                                </button>

                                <div className="h-px bg-zinc-200 dark:bg-white/5 my-1.5 mx-2" />

                                <button
                                    onClick={(e) => { e.stopPropagation(); onLogout(); }}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-200 font-semibold group/item"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-red-500 group-hover/item:text-white transition-all shadow-sm">
                                        <LogOut size={18} />
                                    </div>
                                    <span className="font-bold">Sair do App</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div
                        className={`
                            relative w-full flex items-center gap-3 p-2 rounded-[28px] border transition-all duration-500 backdrop-blur-md z-[60] overflow-hidden
                            ${userMenuOpen
                                ? 'bg-zinc-200/50 dark:bg-zinc-800/80 border-black/10 dark:border-white/20 shadow-lg scale-[0.98]'
                                : 'bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20 hover:shadow-xl'}
                        `}
                    >
                        {/* Interactive Zone: Profile */}
                        <button
                            onClick={() => changeTab('Perfil')}
                            className="flex-1 flex items-center gap-3 p-1 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/profile"
                        >
                            {/* Avatar Squircle */}
                            <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/10 shadow-inner relative group-hover/profile:scale-105 transition-transform duration-300">
                                {currentUser.photo_url ? (
                                    <img src={currentUser.photo_url} alt={currentUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">{currentUser.name.substring(0, 2).toUpperCase()}</span>
                                )}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
                            </div>

                            {/* Info */}
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate text-spatial">{currentUser.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${currentUser.subscription_tier === 'pro' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
                                    <p className="text-[10px] text-zinc-500 dark:text-white/40 truncate text-spatial-caption">
                                        {currentUser.subscription_tier === 'pro' ? 'PRO ACCOUNT' : 'FREE PLAN'}
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Interactive Zone: Menu Trigger */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setUserMenuOpen(!userMenuOpen);
                            }}
                            className={`
                                w-10 h-10 flex items-center justify-center rounded-[18px] transition-all duration-300
                                ${userMenuOpen
                                    ? 'bg-blue-500 text-white shadow-lg rotate-90'
                                    : 'bg-black/5 dark:bg-white/5 text-zinc-400 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10 hover:text-zinc-800 dark:hover:text-white hover:scale-105'}
                                border border-black/5 dark:border-white/5
                            `}
                        >
                            <SettingsIcon size={18} className={userMenuOpen ? 'animate-spin-slow' : ''} />
                        </button>
                    </div>
                </div>

            </aside>

            {/* --- BACKGROUND AMBIENCE --- */}
            {/* Subtle animated blobs to enhance glass effect */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-transparent">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 overflow-y-auto h-full relative pl-80 pr-4 py-4">

                {/* Modals Layer */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl backdrop-blur-sm
                                    bg-transparent hover:bg-black/5 dark:hover:bg-white/10
                                    border border-transparent hover:border-black/10 dark:hover:border-white/10
                                    text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white
                                    transition-all duration-200"
                            >
                                <X size={20} />
                            </button>
                            <div className="mb-8 text-center">
                                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30">
                                    <Clock size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white text-spatial-title">Focus Session</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Registre seu tempo de foco.</p>
                            </div>
                            <form onSubmit={handleAddSession}>
                                <div className="mb-6">
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            autoFocus
                                            value={inputHours}
                                            onChange={(e) => setInputHours(e.target.value)}
                                            className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 px-6 text-center text-3xl font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/60 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-800"
                                            placeholder="0.0"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-medium text-zinc-400 dark:text-zinc-600 text-lg">h</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full font-bold py-4 rounded-xl backdrop-blur-md
                                        bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                                        border border-white/20 shadow-lg shadow-blue-500/30
                                        hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95
                                        ring-1 ring-white/10
                                        transition-all duration-300"
                                >
                                    Confirmar Sessão
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onSuccess={() => { setShowUpgradeModal(false); reloadUser(); }} />}

                {/* Page Content Container - Adjusted for fixed sidebar */}
                <div className="max-w-[1600px] mx-auto min-h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                        >
                            {activeTab === "Dashboard" && (
                                <DashboardWidgets
                                    currentUser={currentUser}
                                    todayHours={todayHours}
                                    weekHours={weekHours}
                                    monthHours={monthHours}
                                    dailyTasks={dailyTasks}
                                    toggleTaskWidget={toggleTaskWidget}
                                    changeTab={(tab) => {
                                        const isLocked = ['Notas', 'Biblioteca', 'Tutores', 'Lista de Erros', 'Flashcards', 'Simulados', 'Conteúdos'].includes(tab) && currentUser.subscription_tier !== 'pro';
                                        if (isLocked) { setShowUpgradeModal(true); return; }
                                        setActiveTab(tab);
                                    }}
                                    lastTutorMessage={lastTutorMessage}
                                    recentErrors={recentErrors}
                                    dueFlashcardsCount={dueFlashcardsCount}
                                    latestSimulado={latestSimulado}
                                    setIsModalOpen={setIsModalOpen}
                                    getGreeting={getGreeting}
                                />
                            )}

                            {activeTab === "Planner" && <TaskPlanner />}
                            {activeTab === "Notas" && <NotesModule />}
                            {activeTab === "Conteúdos" && <ContentModule />}
                            {activeTab === "Biblioteca" && <Library userId={currentUser.id} />}
                            {activeTab === "Tutores" && <Tutors />}
                            {activeTab === "Lista de Erros" && <ErrorList />}
                            {activeTab === "Flashcards" && <Flashcards />}
                            {activeTab === "Simulados" && <Simulados />}
                            {activeTab === "Perfil" && <Profile currentUser={currentUser} onUpdate={handleUpdateUser} />}
                            {activeTab === "Configurações" && <Settings />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div >
    );
};

export default Dashboard;

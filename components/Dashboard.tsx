import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';

import Whiteboard from './whiteboard/Whiteboard';
import { Menu, X, Clock, Loader2, ChevronRight, User, Settings as SettingsIcon, LogOut, Lock, LayoutDashboard, Calendar, BookOpen, GraduationCap, AlertOctagon, Zap, FileText, ChevronDown, GripVertical, Sparkles, Share2, Play, Mic, TrendingUp, BoxSelect, PanelLeftClose, PanelLeftOpen } from 'lucide-react';


import { toast } from 'sonner';

// Components
import DashboardWidgets from './dashboard/DashboardWidgets';
import AddSessionModal from './dashboard/AddSessionModal';
import Tutors from './Tutors';
import ErrorList from './ErrorList';
import Flashcards from './Flashcards';
import Simulados from './Simulados';
import TaskPlanner from './TaskPlanner';
import Planner from './Planner';
import Profile from './Profile';
import Settings from './Settings';
import NotesModule from './notes/NotesModule';
import Library from './library/Library';

import UpgradeModal from './UpgradeModal';
import ContentModule from './content/ContentModule';
import { DashboardSkeleton } from './SkeletonLoader';
import FocusMode from './dashboard/FocusMode';
import ExperienceBar from './gamification/ExperienceBar';

// Lazy load NexusGraph to prevent bundle issues blocking main render
const NexusGraph = React.lazy(() => import('./nexus/NexusGraph'));

// Services & Types
import { authService } from '../services/authService';
import { flashcardService } from '../services/flashcardService';
import { PlannerTask, ErrorEntry, SimuladoResult, Message, User as UserType } from '../types';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    // Navigation State
    const allNavItems = [
        { id: "Dashboard", label: "Início", icon: <LayoutDashboard size={20} /> },
        { id: "Planner", label: "Planner", icon: <Calendar size={20} /> },
        { id: "Notas", label: "Notas", icon: <FileText size={20} />, restricted: true },
        { id: "Nexus", label: "Nexus", icon: <Share2 size={20} />, adminOnly: true },
        { id: "Analytics", label: "Analytics", icon: <TrendingUp size={20} />, adminOnly: true },
        { id: "Whiteboard", label: "Quadro", icon: <BoxSelect size={20} />, adminOnly: true },
        { id: "Conteúdos", label: "Conteúdos", icon: <Sparkles size={20} />, restricted: true },
        { id: "Biblioteca", label: "Biblioteca", icon: <BookOpen size={20} />, restricted: true, adminOnly: true },
        { id: "Tutores", label: "Tutores", icon: <GraduationCap size={20} />, restricted: true },
        { id: "Lista de Erros", label: "Erros", icon: <AlertOctagon size={20} />, restricted: true },
        { id: "Flashcards", label: "Cards", icon: <Zap size={20} />, restricted: true },
        { id: "Simulados", label: "Simulados", icon: <Clock size={20} />, restricted: true }
    ];

    const [activeTab, setActiveTab] = useState('Dashboard');

    // User State
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // DEFINIÇÃO DE ADMINISTRADOR - Ajuste os emails permitidos aqui
    const ADMIN_EMAILS = ['admin@hpc.com', 'otavio100206@gmail.com'];
    const isUserAdmin = currentUser ? ADMIN_EMAILS.includes(currentUser.email) : false;

    const [tabs, setTabs] = useState(allNavItems);

    // Update tabs when isAdmin changes or user loads
    useEffect(() => {
        if (currentUser) {
            // Filter out admin-only items for non-admins
            const filteredItems = allNavItems.filter(item => {
                if (item.adminOnly && !isUserAdmin) return false;
                return true;
            });
            setTabs(filteredItems);
        }
    }, [currentUser, isUserAdmin]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Handlers
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // User Menu State


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
    const [focusModeOpen, setFocusModeOpen] = useState(false);


    const handleFocusSessionComplete = (minutes: number) => {
        if (!currentUser) return;
        const newToday = +(todayHours + minutes / 60).toFixed(1);
        const newWeek = +(weekHours + minutes / 60).toFixed(1);
        const newMonth = +(monthHours + minutes / 60).toFixed(1);
        setTodayHours(newToday);
        setWeekHours(newWeek);
        setMonthHours(newMonth);

        const metricsKey = `hpc_metrics_${currentUser.id} `;
        localStorage.setItem(metricsKey, JSON.stringify({ today: newToday, week: newWeek, month: newMonth }));
    };

    // --------------------------------------------------------------------------
    // Effects
    // --------------------------------------------------------------------------



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

    // Handle Payment Return
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const paymentDetails = query.get('payment');

        if (paymentDetails === 'success') {
            toast.success("Pagamento realizado com sucesso! Bem-vindo ao PRO!");
            // Remove param from URL without reload
            window.history.replaceState({}, document.title, window.location.pathname);
            // Reload user to get new subscription status
            reloadUser();
        } else if (paymentDetails === 'canceled') {
            toast.info("Pagamento cancelado. Se precisar de ajuda, entre em contato.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
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
                const errorsKey = `hpc_error_list_${currentUser.id} `;
                const errorsStr = localStorage.getItem(errorsKey);
                if (errorsStr) {
                    const parsed: ErrorEntry[] = JSON.parse(errorsStr);
                    if (Array.isArray(parsed)) setRecentErrors(parsed.slice(0, 3));
                }

                // Tutors
                const tutorsKey = `hpc_tutor_history_${currentUser.id} `;
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
                const simuladosKey = `hpc_simulados_history_${currentUser.id} `;
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
                const plannerKey = `hpc_planner_tasks_${currentUser.id} `;
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

    const handleAddSession = (hours: number) => {
        if (!currentUser) return;
        const newToday = +(todayHours + hours).toFixed(1);
        const newWeek = +(weekHours + hours).toFixed(1);
        const newMonth = +(monthHours + hours).toFixed(1);
        setTodayHours(newToday);
        setWeekHours(newWeek);
        setMonthHours(newMonth);

        const metricsKey = `hpc_metrics_${currentUser.id} `;
        localStorage.setItem(metricsKey, JSON.stringify({ today: newToday, week: newWeek, month: newMonth }));
        setIsModalOpen(false);
        toast.success("Sessão registrada com sucesso!");
    };

    const toggleTaskWidget = (id: string) => {
        if (!currentUser) return;
        const plannerKey = `hpc_planner_tasks_${currentUser.id} `;
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
                    relative w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl text-[12px] font-medium transition-all duration-300 group
                    ${isActive
                            ? 'shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
                            : 'hover:bg-white/5'
                        }
                    `}
                    onMouseMove={handleMouseMove}
                >
                    {/* Mouse Spotlight Effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{
                            background: `radial-gradient(circle 120px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`
                        }}
                    />

                    {/* Active Background - Glass Pill */}
                    {isActive && (
                        <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/10 rounded-2xl backdrop-blur-md pointer-events-none transition-all duration-300 border border-blue-500/30" />
                    )}

                    {/* Drag Handle */}
                    <div
                        onPointerDown={(e) => controls.start(e)}
                        className={`cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 z-20 
                        ${isActive ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/10'}`}
                    >
                        <GripVertical size={12} />
                    </div>

                    {/* Button Content Wrapper */}
                    <button
                        onClick={() => changeTab(item.id)}
                        className={`flex-1 flex items-center gap-2 text-left w-full outline-none relative z-10 transition-colors duration-300 ${isActive ? 'text-blue-500 dark:text-blue-300 font-bold' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-200'}`}
                    >
                        <span className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover:scale-105'}`}>{item.icon}</span>
                        <span className="flex-1 truncate">{item.label}</span>

                        {isLocked && <Lock size={12} className="ml-auto text-amber-500/70" />}
                    </button>

                    {/* Active Indicator Dot */}
                    {isActive && (
                        <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_currentColor]"
                        />
                    )}
                </div>
            </Reorder.Item>
        );
    };

    const ProLockOverlay = ({ onUpgrade }: { onUpgrade: () => void }) => (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative glass-spatial p-8 rounded-[32px] max-w-md border border-white/20 shadow-2xl space-y-6"
            >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                    <Lock size={40} className="text-white fill-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Recurso de Elite</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Este módulo faz parte do plano <strong>HPC AI PRO</strong>.
                        Eleve seus estudos para o próximo nível agora.
                    </p>
                </div>
                <button
                    onClick={onUpgrade}
                    className="w-full font-black py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    SEJA PRO AGORA
                </button>
            </motion.div>
        </div>
    );

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

            <AnimatePresence>
                {focusModeOpen && (
                    <FocusMode
                        onClose={() => setFocusModeOpen(false)}
                        onSessionComplete={handleFocusSessionComplete}
                        userId={currentUser.id}
                    />
                )}
            </AnimatePresence>

            <AddSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddSession}
            />



            {/* Reopen Sidebar Button */}
            <div className={`fixed left-6 bottom-6 z-40 transition-all duration-500 ${isSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-10' : 'opacity-100 translate-x-0'} ${activeTab === 'Dashboard' && isMobile ? 'hidden' : ''}`}>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-3 rounded-2xl bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-cyan-500/20 hover:scale-110 active:scale-95 transition-all group"
                >
                    <PanelLeftOpen size={24} className="group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -208, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -208, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
                        className={`
                            fixed md:relative z-50 h-full w-52 flex flex-col 
                            glass-hydro border-r border-white/40 dark:border-white/5 
                            shadow-2xl md:shadow-none
                        `}
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center"
                            >
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="relative group/logo">
                                        {/* Dynamic Background Glow */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                                rotate: [0, 90, 180, 270, 360]
                                            }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-violet-600/30 blur-2xl rounded-full"
                                        />

                                        {/* VisionOS Icon Container */}
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 overflow-hidden border border-white/20">
                                            <img
                                                src="/logo-hpc.png"
                                                alt="HPC Logo"
                                                className="w-full h-full object-contain mix-blend-screen brightness-110 contrast-125 scale-110"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 leading-tight">
                                            High Performance Club
                                        </h1>
                                    </div>
                                </div>
                            </motion.div>


                        </div>

                        {/* Navigation Tabs */}
                        <Reorder.Group axis="y" values={tabs} onReorder={setTabs} className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide py-1">
                            {tabs.map((item: any) => {
                                const isLocked = item.restricted && currentUser.subscription_tier !== 'pro' && !isUserAdmin;
                                return (
                                    <DraggableNavItem
                                        key={item.id}
                                        item={item}
                                        isActive={activeTab === item.id}
                                        isLocked={isLocked}
                                        changeTab={changeTab}
                                    />
                                );
                            })}
                        </Reorder.Group>

                        {/* User Profile Section */}
                        <div className="p-4 border-t border-white/20 dark:border-white/5 mt-auto bg-white/40 dark:bg-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <div
                                    className="flex-1 flex items-center gap-3 p-2 rounded-2xl hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer group min-w-0 active:scale-95 border border-transparent hover:border-white/20"
                                    onClick={() => setActiveTab('Perfil')}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-0.5 shadow-lg flex-shrink-0 group-hover:ring-2 ring-blue-500/50 transition-all">
                                        <img src={currentUser.photo_url || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1 uppercase tracking-wider">
                                            {currentUser.subscription_tier === 'pro' ? <span className="text-amber-500 flex items-center gap-0.5"><Sparkles size={10} /> PRO</span> : "Free Plan"}
                                        </p>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90 border border-transparent hover:border-white/10"
                                        title="Recolher"
                                    >
                                        <PanelLeftClose size={18} />
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                        title="Sair"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>


                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-300">
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scrollbar-hide relative bg-transparent">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
                            className="max-w-7xl mx-auto space-y-6 pb-20"
                        >

                            {((tabs.find(t => t.id === activeTab) as any)?.restricted || (tabs.find(t => t.id === activeTab) as any)?.adminOnly) && currentUser.subscription_tier !== 'pro' && !isUserAdmin ? (
                                <div className="relative min-h-[600px] w-full">
                                    <ProLockOverlay onUpgrade={() => setShowUpgradeModal(true)} />
                                    <div className="blur-[8px] pointer-events-none select-none h-full w-full">
                                        {activeTab === "Notas" && <NotesModule />}
                                        {activeTab === "Conteúdos" && <ContentModule />}
                                        {activeTab === "Biblioteca" && <Library userId={currentUser.id} isAdmin={isUserAdmin} />}
                                        {activeTab === "Tutores" && <Tutors />}
                                        {activeTab === "Lista de Erros" && <ErrorList />}
                                        {activeTab === "Flashcards" && <Flashcards />}
                                        {activeTab === "Simulados" && <Simulados isAdmin={isUserAdmin} />}
                                        {activeTab === "Nexus" && (
                                            <div className="h-[calc(100vh-3rem)] w-full">
                                                <React.Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-400 dark:text-white/50 font-medium tracking-widest animate-pulse">CARREGANDO NEXUS...</div>}>
                                                    <NexusGraph />
                                                </React.Suspense>
                                            </div>
                                        )}
                                        {activeTab === "Analytics" && <AnalyticsDashboard />}
                                        {activeTab === "Whiteboard" && <Whiteboard />}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {activeTab === "Dashboard" && (
                                        <DashboardWidgets
                                            currentUser={currentUser}
                                            isAdmin={isUserAdmin}
                                            todayHours={todayHours}
                                            weekHours={weekHours}
                                            monthHours={monthHours}
                                            dailyTasks={dailyTasks}
                                            toggleTaskWidget={toggleTaskWidget}
                                            changeTab={(tab) => {
                                                setActiveTab(tab);
                                            }}
                                            lastTutorMessage={lastTutorMessage}
                                            recentErrors={recentErrors}
                                            dueFlashcardsCount={dueFlashcardsCount}
                                            latestSimulado={latestSimulado}
                                            setIsModalOpen={setIsModalOpen}
                                            onOpenFocusMode={() => setFocusModeOpen(true)}
                                            getGreeting={getGreeting}
                                            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                        />
                                    )}

                                    {activeTab === "Planner" && (
                                        isUserAdmin ? <Planner isAdmin={true} /> : <TaskPlanner isAdmin={false} />
                                    )}
                                    {activeTab === "Notas" && <NotesModule />}
                                    {activeTab === "Conteúdos" && <ContentModule />}
                                    {activeTab === "Biblioteca" && <Library userId={currentUser.id} isAdmin={isUserAdmin} />}
                                    {activeTab === "Tutores" && <Tutors />}
                                    {activeTab === "Lista de Erros" && <ErrorList />}
                                    {activeTab === "Flashcards" && <Flashcards />}
                                    {activeTab === "Simulados" && <Simulados isAdmin={isUserAdmin} />}
                                    {activeTab === "Nexus" && (
                                        <div className="h-[calc(100vh-3rem)] w-full">
                                            <React.Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-400 dark:text-white/50 font-medium tracking-widest animate-pulse">CARREGANDO NEXUS...</div>}>
                                                <NexusGraph />
                                            </React.Suspense>
                                        </div>
                                    )}


                                    {activeTab === "Analytics" && <AnalyticsDashboard />}
                                    {activeTab === "Whiteboard" && <Whiteboard />}
                                    {activeTab === "Perfil" && <Profile currentUser={currentUser} onUpdate={handleUpdateUser} isAdmin={isUserAdmin} />}
                                    {activeTab === "Configurações" && <Settings currentUser={currentUser} />}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence >
                </div >
            </main >
        </div >
    );
};

export default Dashboard;

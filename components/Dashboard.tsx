import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
// Lazy load ContentModule to prevent large data bundle from blocking initial render
const ContentModule = React.lazy(() => import('./content/ContentModuleNew'));
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
    useEffect(() => {
        console.log("Dashboard: Component Mounted");
        return () => console.log("Dashboard: Component Unmounted");
    }, []);
    // ... rest of component
    // Navigation State
    const allNavItems = [
        { id: "Dashboard", label: "Início", icon: <LayoutDashboard size={18} /> },
        { id: "Planner", label: "Planner", icon: <Calendar size={18} /> },
        { id: "Notas", label: "Notas", icon: <FileText size={18} /> },
        { id: "Nexus", label: "Nexus", icon: <Share2 size={18} />, adminOnly: true },
        { id: "Analytics", label: "Analytics", icon: <TrendingUp size={18} />, adminOnly: true },
        { id: "Whiteboard", label: "Quadro", icon: <BoxSelect size={18} />, adminOnly: true },
        { id: "Conteúdos", label: "Conteúdos", icon: <Sparkles size={18} />, restricted: true },
        { id: "Biblioteca", label: "Biblioteca", icon: <BookOpen size={18} />, restricted: true, adminOnly: true },
        { id: "Tutores", label: "Tutores", icon: <GraduationCap size={18} />, restricted: true },
        { id: "Lista de Erros", label: "Erros", icon: <AlertOctagon size={18} />, restricted: true },
        { id: "Flashcards", label: "Cards", icon: <Zap size={18} />, restricted: true },
        { id: "Simulados", label: "Simulados", icon: <Clock size={18} />, restricted: true }
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
            // Create a timeout promise that rejects after 5 seconds
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Dashboard Auth Timeout')), 5000));
            try {
                // Race the auth check against the timeout
                const user = await Promise.race([authService.getCurrentUser(), timeout]) as any;

                if (!user) {
                    onLogout();
                    return;
                }
                setCurrentUser(user);
            } catch (error) {
                console.error("Erro ao carregar usuário no Dashboard", error);
                // Instead of logging out immediately on timeout, maybe we can rely on cached data or retry?
                // For now, let's force logout to be safe but with feedback
                toast.error("Erro de conexão. Tentando reconectar...");
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

    const NavItem = ({ item, isActive, isLocked, changeTab }: any) => {
        const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMousePosition({ x, y });
        };

        return (
            <div
                className={`
                relative w-full py-1 flex flex-col items-center justify-center rounded-[14px] cursor-pointer transition-all duration-300 group
                ${isActive
                        ? 'scale-100 z-10'
                        : 'hover:bg-white/5 active:scale-95'
                    }
                `}
                onMouseMove={handleMouseMove}
                onClick={() => changeTab(item.id)}
            >
                {/* Mouse Spotlight Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[14px]"
                    style={{
                        background: `radial-gradient(circle 80px at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`
                    }}
                />

                {/* Active Background - Glowing Rounded Square */}
                {isActive && (
                    <div className="absolute inset-0 bg-linear-to-b from-blue-500 to-indigo-600 rounded-[14px] shadow-[0_4px_12px_rgba(59,130,246,0.4)] pointer-events-none transition-all duration-300 border border-white/20" />
                )}

                {/* Button Content Wrapper */}
                <div className={`relative z-10 flex flex-col items-center justify-center gap-0.5 text-center w-full transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    <span className={`transition-all duration-300 ${isActive ? 'drop-shadow-sm' : 'group-hover:scale-105'}`}>
                        {item.icon}
                    </span>
                    <span className={`text-[8.5px] font-semibold tracking-wide leading-none ${isActive ? 'text-blue-50' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {item.label}
                    </span>

                    {isLocked && <Lock size={8} className="absolute top-0 right-1 text-amber-500/80" />}
                </div>

                {/* Active Indicator Dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/50 shadow-[0_0_8px_currentColor] hidden"
                    />
                )}
            </div>
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
                            fixed top-3 left-3 bottom-3 z-50 flex flex-col items-center
                            w-[84px] min-w-[84px]
                            glass-hydro
                            rounded-[32px] border border-white/10
                            shadow-2xl shadow-black/40 overflow-hidden
                        `}
                    >
                        {/* Header */}
                        <div className="pt-3 pb-1 flex flex-col items-center justify-center w-full shrink-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group cursor-pointer"
                            >
                                {/* VisionOS Icon Container */}
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 overflow-hidden ring-1 ring-white/20">
                                    <img
                                        src="/logo-hpc.png"
                                        alt="HPC"
                                        className="w-full h-full object-contain mix-blend-screen brightness-110 contrast-125 scale-110"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex-1 w-full flex flex-col items-center overflow-y-auto px-1 py-1 space-y-1 scrollbar-hide">
                            {tabs.map((item: any) => {
                                const isLocked = item.restricted && currentUser.subscription_tier !== 'pro' && !isUserAdmin;
                                return (
                                    <NavItem
                                        key={item.id}
                                        item={item}
                                        isActive={activeTab === item.id}
                                        isLocked={isLocked}
                                        changeTab={changeTab}
                                    />
                                );
                            })}
                        </div>

                        {/* User Profile Section */}
                        <div className="p-1 mt-auto flex flex-col items-center gap-1.5 pb-3 shrink-0">

                            {/* Collapse Sidebar Button */}
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/10 transition-all"
                                title="Recolher Menu"
                            >
                                <PanelLeftClose size={16} />
                            </button>

                            {/* Profile Avatar */}
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => setActiveTab('Perfil')}
                            >
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-0.5 shadow-lg transition-transform duration-300 ${activeTab === 'Perfil' ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}>
                                    <img src={currentUser.photo_url || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={onLogout}
                                className="p-1.5 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                title="Sair"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </motion.aside >
                )}
            </AnimatePresence >

            {/* Mobile Overlay */}
            <AnimatePresence>
                {
                    isMobile && isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                        />
                    )
                }
            </AnimatePresence >

            {/* Main Content Area */}
            <main className={`flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-[100px]' : ''}`} >
                <div className={`flex-1 overflow-x-hidden scrollbar-hide relative bg-transparent ${activeTab === 'Notas' ? 'p-0 overflow-hidden' : 'overflow-y-auto p-4 md:p-6 lg:p-8'}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
                            className={`mx-auto transition-all ${activeTab === 'Notas' ? 'h-full w-full max-w-none pb-0' : 'max-w-7xl space-y-6 pb-20'}`}
                        >

                            {((tabs.find(t => t.id === activeTab) as any)?.restricted || (tabs.find(t => t.id === activeTab) as any)?.adminOnly) && currentUser.subscription_tier !== 'pro' && !isUserAdmin ? (
                                <div className="relative min-h-[600px] w-full">
                                    <ProLockOverlay onUpgrade={() => setShowUpgradeModal(true)} />
                                    <div className="blur-[8px] pointer-events-none select-none h-full w-full">
                                        {activeTab === "Notas" && <NotesModule />}
                                        {activeTab === "Conteúdos" && (
                                            <React.Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
                                                <ContentModule />
                                            </React.Suspense>
                                        )}
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
                                    {activeTab === "Conteúdos" && (
                                        <React.Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
                                            <ContentModule />
                                        </React.Suspense>
                                    )}
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

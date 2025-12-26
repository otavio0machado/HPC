import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Clock, Loader2, ChevronDown, User, Settings as SettingsIcon, LogOut, Lock } from 'lucide-react';
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
  const navItems = ["Dashboard", "Planner", "Notas", "Biblioteca", "Tutores", "Lista de Erros", "Flashcards", "Simulados"];
  const [activeTab, setActiveTab] = useState("Dashboard");

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
          // Get last message
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
    const restricted = ['Notas', 'Biblioteca', 'Tutores', 'Lista de Erros', 'Flashcards', 'Simulados'];
    const isPro = currentUser.subscription_tier === 'pro';

    if (restricted.includes(tab) && !isPro) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveTab(tab);
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  if (isLoadingUser || !currentUser) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-12 px-4 sm:px-6 lg:px-8 relative bg-zinc-950 transition-colors duration-500">

      {/* Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-blue-600/10 text-blue-500">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Registrar Sessão</h3>
              <p className="text-zinc-400 text-sm mt-1">Adicione as horas estudadas agora.</p>
            </div>
            <form onSubmit={handleAddSession}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Horas</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    autoFocus
                    value={inputHours}
                    onChange={(e) => setInputHours(e.target.value)}
                    className="w-full rounded-lg py-3 px-4 text-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700"
                    placeholder="Ex: 1.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-zinc-400">h</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
              >
                Confirmar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onSuccess={() => {
            setShowUpgradeModal(false);
            reloadUser();
          }}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Glassmorphism */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white hover:text-blue-400 transition-colors duration-300 cursor-default">
                High Performance Club<span className="text-blue-500 animate-pulse">.</span>
              </h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Dashboard de Elite</p>
            </div>
          </div>

          {/* Enhanced User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border transition-all duration-300 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{currentUser.name.split(' ')[0]}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-zinc-500">{currentUser.subscription_tier === 'pro' ? 'Membro Pro' : 'Membro Free'}</p>
                  {currentUser.subscription_tier !== 'pro' && (
                    <span onClick={(e) => { e.stopPropagation(); setShowUpgradeModal(true); }} className="text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full cursor-pointer hover:opacity-90 font-bold hover:scale-110 transition-transform">UPGRADE</span>
                  )}
                </div>
              </div>
              <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Enhanced Dropdown Menu with Animation */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border overflow-hidden z-20 bg-zinc-900/95 backdrop-blur-xl border-zinc-800"
                >
                  <div className="p-4 border-b border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800/50">
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { changeTab('Perfil'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all text-zinc-300 hover:bg-blue-600/10 hover:text-blue-400 group">
                      <User size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Meu Perfil</span>
                    </button>
                    <button onClick={() => { changeTab('Configurações'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all text-zinc-300 hover:bg-blue-600/10 hover:text-blue-400 group">
                      <SettingsIcon size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span className="font-medium">Configurações</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-white/10">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium group">
                      <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                      <span>Sair do Club</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Enhanced Top Navigation with Better Feedback */}
        <nav className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            const isLocked = ['Notas', 'Biblioteca', 'Tutores', 'Lista de Erros', 'Flashcards', 'Simulados'].includes(item) && currentUser.subscription_tier !== 'pro';

            return (
              <motion.button
                key={item}
                onClick={() => changeTab(item)}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 relative overflow-hidden
                  ${isActive
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white -z-10 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
                {isLocked && (
                  <Lock size={12} className="opacity-70 animate-pulse" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "Dashboard" && (
              <DashboardWidgets
                currentUser={currentUser}
                todayHours={todayHours}
                weekHours={weekHours}
                monthHours={monthHours}
                dailyTasks={dailyTasks}
                toggleTaskWidget={toggleTaskWidget}
                changeTab={changeTab}
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
    </div>
  );
};

export default Dashboard;
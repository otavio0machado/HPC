import React, { useState, useEffect, useRef } from 'react';
import Tutors from './Tutors';
import ErrorList from './ErrorList';
import Flashcards from './Flashcards';
import Simulados from './Simulados';
import TaskPlanner from './TaskPlanner';
import Profile from './Profile';
import Settings from './Settings';
import { Trophy, Clock, Calendar, LogOut, Plus, X, AlertTriangle, Zap, ArrowRight, LayoutList, MessageSquare, Activity, CheckCircle2, Circle, User, Settings as SettingsIcon, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { flashcardService } from '../services/flashcardService';
import { PlannerTask, ErrorEntry, SimuladoResult, Message, User as UserType } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navItems = ["Dashboard", "Planner", "Tutores", "Lista de Erros", "Flashcards", "Simulados"];
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // User Menu State
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // State for metrics
  const [todayHours, setTodayHours] = useState<number>(0);
  const [weekHours, setWeekHours] = useState<number>(0);
  const [monthHours, setMonthHours] = useState<number>(0);

  // Real-time Data States
  const [activeTutorsCount, setActiveTutorsCount] = useState(0);
  const [simuladosCount, setSimuladosCount] = useState(0);
  const [dailyTasks, setDailyTasks] = useState<PlannerTask[]>([]);

  // New States for Content Widgets
  const [lastTutorMessage, setLastTutorMessage] = useState<{ subject: string, message: string } | null>(null);
  const [recentErrors, setRecentErrors] = useState<ErrorEntry[]>([]);
  const [dueFlashcardsCount, setDueFlashcardsCount] = useState(0);
  const [latestSimulado, setLatestSimulado] = useState<SimuladoResult | null>(null);
  const [globalSimuladosAvg, setGlobalSimuladosAvg] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputHours, setInputHours] = useState('');

  // Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Load User Async
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          // Se não conseguirmos o usuário (ex: refresh sem sessão), volta pro login
          onLogout();
          return;
        }
        setCurrentUser(user);
      } catch (error) {
        console.error("Erro ao carregar usuário", error);
        onLogout();
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUser();
  }, []); // Run once on mount

  // Load data logic
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      // 1. Metrics (LocalStorage only for now)
      const metricsKey = 'hpc_metrics_' + currentUser.id;
      const savedMetrics = localStorage.getItem(metricsKey);
      if (savedMetrics) {
        const parsed = JSON.parse(savedMetrics);
        setTodayHours(parsed.today || 0);
        setWeekHours(parsed.week || 0);
        setMonthHours(parsed.month || 0);
      }

      // 2. Flashcards (Supabase)
      try {
        const cards = await flashcardService.fetchFlashcards();
        const due = cards.filter(c => c.nextReview <= Date.now()).length;
        setDueFlashcardsCount(due);
      } catch (e) {
        console.error("Failed to load flashcards summary", e);
      }

      // 3. Other LocalStorage Items (Wrapped in Try/Catch)
      try {
        const errorsKey = `hpc_error_list_${currentUser.id}`;
        const errorsStr = localStorage.getItem(errorsKey);
        if (errorsStr) {
          const parsed: ErrorEntry[] = JSON.parse(errorsStr);
          if (Array.isArray(parsed)) setRecentErrors(parsed.slice(0, 3));
        }

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

  const handleAdd = (e: React.FormEvent) => {
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

  const calculateSimuladoPercentage = (result: SimuladoResult) => {
    let correct = 0, total = 0;
    result.areas.forEach(a => { correct += a.correct; total += a.total });
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  };

  const handleUpdateUser = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);
  };

  if (isLoadingUser || !currentUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
        <span className="ml-2">Carregando Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-12 px-4 sm:px-6 lg:px-8 relative bg-zinc-950 transition-colors duration-500">
      {/* Modal - Register Session */}
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
            <form onSubmit={handleAdd}>
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-zinc-800">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tighter text-white">
                High Performance Club<span className="text-blue-500">.</span>
              </h1>
              <p className="text-zinc-400 text-sm mt-0.5">Dashboard de Elite</p>
            </div>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-all bg-white/5 border-white/10 hover:bg-white/10"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-blue-600 text-white">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-white">{currentUser.name.split(' ')[0]}</p>
                <p className="text-[10px] text-zinc-500">Membro Pro</p>
              </div>
              <ChevronDown size={14} className="text-zinc-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200 bg-zinc-900 border-zinc-800">
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-bold text-white">{currentUser.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { setActiveTab('Perfil'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-zinc-300 hover:bg-white/10"><User size={16} /> Meu Perfil</button>
                  <button onClick={() => { setActiveTab('Configurações'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-zinc-300 hover:bg-white/10"><SettingsIcon size={16} /> Configurações</button>
                </div>
                <div className="p-2 border-t border-white/10">
                  <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><LogOut size={16} /> Sair do Club</button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === item ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105" : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"}`}
            >
              {item}
            </button>
          ))}
        </nav>

        {activeTab === "Dashboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{getGreeting()}, <span className="text-blue-500">{currentUser.name.split(' ')[0]}</span>.</h2>
                <p className="text-zinc-400">Pronto para dominar o conteúdo hoje? Aqui está seu resumo.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveTab('Lista de Erros')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"><AlertTriangle size={14} className="text-red-500" /> Registrar Erro</button>
                <button onClick={() => setActiveTab('Tutores')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"><Sparkles size={14} className="text-purple-500" /> Perguntar ao Tutor</button>
                <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 hover:scale-105"><Plus size={14} /> Registrar Sessão</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 h-fit">
                <div className="bg-zinc-900/50 border-zinc-800 border p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors group relative">
                  <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500/20 transition-colors"><Clock size={20} /></div><span className="text-zinc-400 text-sm font-medium">Horas Hoje</span></div>
                  <p className="text-4xl font-bold text-white tracking-tight">{todayHours}h <span className="text-sm font-normal text-zinc-500 ml-2 align-middle">/ 6h meta</span></p>
                </div>
                <div className="bg-zinc-900/50 border-zinc-800 border p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors group">
                  <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 group-hover:bg-purple-500/20 transition-colors"><Calendar size={20} /></div><span className="text-zinc-400 text-sm font-medium">Horas Semana</span></div>
                  <p className="text-4xl font-bold text-white tracking-tight">{weekHours}h</p>
                </div>
                <div className="bg-zinc-900/50 border-zinc-800 border p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors group">
                  <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:bg-yellow-500/20 transition-colors"><Trophy size={20} /></div><span className="text-zinc-400 text-sm font-medium">Horas Mês</span></div>
                  <p className="text-4xl font-bold text-white tracking-tight">{monthHours}h</p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border-zinc-800 border rounded-2xl p-6 flex flex-col h-full min-h-[200px]">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white flex items-center gap-2"><LayoutList size={18} className="text-emerald-500" /> Foco do Dia</h3><button onClick={() => setActiveTab('Planner')} className="text-zinc-500 text-xs hover:text-blue-400 flex items-center gap-1 transition-colors">Ver tudo <ArrowRight size={12} /></button></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                  {dailyTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs text-center p-4 border border-dashed border-zinc-800 rounded-xl"><p>Nenhuma tarefa para hoje.</p><button onClick={() => setActiveTab('Planner')} className="text-blue-500 mt-1 hover:underline">Adicionar no Planner</button></div>
                  ) : (
                    dailyTasks.map(task => (
                      <div key={task.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer" onClick={() => toggleTaskWidget(task.id)}>
                        <div className={`mt-0.5 ${task.completed ? 'text-emerald-500' : 'text-zinc-500'}`}>{task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}</div>
                        <span className={`text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{task.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-zinc-900/50 border-zinc-800 border rounded-2xl p-6 hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col justify-between" onClick={() => setActiveTab('Tutores')}>
                <div><div className="flex items-center justify-between mb-4"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><MessageSquare size={18} /></div><ArrowRight size={16} className="text-zinc-600 group-hover:text-blue-500 transition-colors" /></div><h3 className="text-white font-bold mb-1">Tutor IA</h3>{lastTutorMessage ? <p className="text-xs text-zinc-400 line-clamp-2">última: "{lastTutorMessage.message}"</p> : <p className="text-xs text-zinc-500">Nenhuma conversa recente.</p>}</div>
                <span className="text-xs text-blue-500 font-medium mt-4">Continuar conversa</span>
              </div>
              <div className="bg-zinc-900/50 border-zinc-800 border rounded-2xl p-6 hover:border-red-500/30 transition-all group cursor-pointer flex flex-col justify-between" onClick={() => setActiveTab('Lista de Erros')}>
                <div><div className="flex items-center justify-between mb-4"><div className="p-2 bg-red-500/10 rounded-lg text-red-500"><AlertTriangle size={18} /></div><ArrowRight size={16} className="text-zinc-600 group-hover:text-red-500 transition-colors" /></div><h3 className="text-white font-bold mb-1">Erros Recentes</h3>{recentErrors.length > 0 ? <div className="flex flex-col gap-1">{recentErrors.slice(0, 2).map(err => <div key={err.id} className="text-xs text-zinc-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {err.subject}</div>)}</div> : <p className="text-xs text-zinc-500">Sem erros registrados.</p>}</div>
                <span className="text-xs text-red-500 font-medium mt-4">Ver lista completa</span>
              </div>
              <div className="bg-zinc-900/50 border-zinc-800 border rounded-2xl p-6 hover:border-yellow-500/30 transition-all group cursor-pointer flex flex-col justify-between" onClick={() => setActiveTab('Flashcards')}>
                <div><div className="flex items-center justify-between mb-4"><div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Zap size={18} /></div><ArrowRight size={16} className="text-zinc-600 group-hover:text-yellow-500 transition-colors" /></div><h3 className="text-white font-bold mb-1">Flashcards</h3><p className="text-xs text-zinc-400">{dueFlashcardsCount > 0 ? `${dueFlashcardsCount} cards para revisar.` : "Revisão em dia!"}</p></div>
                <span className="text-xs text-yellow-500 font-medium mt-4">Iniciar sessão</span>
              </div>
              <div className="bg-zinc-900/50 border-zinc-800 border rounded-2xl p-6 hover:border-emerald-500/30 transition-all group cursor-pointer flex flex-col justify-between" onClick={() => setActiveTab('Simulados')}>
                <div><div className="flex items-center justify-between mb-4"><div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Activity size={18} /></div><ArrowRight size={16} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" /></div><h3 className="text-white font-bold mb-1">Simulados</h3><div className="flex items-end gap-2"><span className="text-2xl font-bold text-white">{latestSimulado ? `${calculateSimuladoPercentage(latestSimulado)}%` : '-'}</span><span className="text-xs text-zinc-500 mb-1">último resultado</span></div></div>
                <span className="text-xs text-emerald-500 font-medium mt-4">Analisar performance</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Planner" && <TaskPlanner />}
        {activeTab === "Tutores" && <Tutors />}
        {activeTab === "Lista de Erros" && <ErrorList />}
        {activeTab === "Flashcards" && <Flashcards />}
        {activeTab === "Simulados" && <Simulados />}
        {activeTab === "Perfil" && currentUser && <Profile currentUser={currentUser} onUpdate={handleUpdateUser} />}
        {activeTab === "Configurações" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
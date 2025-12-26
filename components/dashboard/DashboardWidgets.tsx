import React, { useState } from 'react';
import {
    Clock,
    Calendar,
    Trophy,
    LayoutList,
    ArrowRight,
    CheckCircle2,
    Circle,
    MessageSquare,
    AlertTriangle,
    Zap,
    Activity,
    Plus
} from 'lucide-react';
import { PlannerTask, ErrorEntry, SimuladoResult } from '../../types';

interface DashboardWidgetsProps {
    currentUser: any;
    todayHours: number;
    weekHours: number;
    monthHours: number;
    dailyTasks: PlannerTask[];
    toggleTaskWidget: (id: string) => void;
    changeTab: (tab: string) => void;
    lastTutorMessage: { subject: string, message: string } | null;
    recentErrors: ErrorEntry[];
    dueFlashcardsCount: number;
    latestSimulado: SimuladoResult | null;
    setIsModalOpen: (isOpen: boolean) => void;
    getGreeting: () => string;
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
    currentUser,
    todayHours,
    weekHours,
    monthHours,
    dailyTasks,
    toggleTaskWidget,
    changeTab,
    lastTutorMessage,
    recentErrors,
    dueFlashcardsCount,
    latestSimulado,
    setIsModalOpen,
    getGreeting
}) => {

    const calculateSimuladoPercentage = (result: SimuladoResult) => {
        let correct = 0, total = 0;
        result.areas.forEach(a => { correct += a.correct; total += a.total });
        return total === 0 ? 0 : Math.round((correct / total) * 100);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                        {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{currentUser.name.split(' ')[0]}</span>.
                    </h2>
                    <p className="text-zinc-400">Aqui está o seu panorama de hoje.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95">
                        <Plus size={14} /> Registrar Sessão
                    </button>
                </div>
            </div>

            {/* Metrics & Focus Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Time Metrics Column */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">

                    <MetricCard
                        icon={Clock}
                        color="blue"
                        label="Horas Hoje"
                        value={`${todayHours}h`}
                        subValue="/ 6h meta"
                    />
                    <MetricCard
                        icon={Calendar}
                        color="purple"
                        label="Horas Semana"
                        value={`${weekHours}h`}
                    />
                    <MetricCard
                        icon={Trophy}
                        color="yellow"
                        label="Horas Mês"
                        value={`${monthHours}h`}
                    />

                </div>

                {/* Daily Focus / Tasks */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col h-full min-h-[200px] hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <LayoutList size={18} className="text-emerald-500" /> Foco do Dia
                        </h3>
                        <button onClick={() => changeTab('Planner')} className="text-zinc-500 text-xs hover:text-blue-400 flex items-center gap-1 transition-colors">
                            Ver tudo <ArrowRight size={12} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                        {dailyTasks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs text-center p-4 border border-dashed border-zinc-800 rounded-xl">
                                <p>Nenhuma tarefa prioritária.</p>
                                <button onClick={() => changeTab('Planner')} className="text-blue-500 mt-1 hover:underline">Adicionar no Planner</button>
                            </div>
                        ) : (
                            dailyTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                                    onClick={() => toggleTaskWidget(task.id)}
                                >
                                    <div className={`mt-0.5 transition-colors ${task.completed ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                        {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                    </div>
                                    <span className={`text-sm transition-all ${task.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <QuickAccessCard
                    title="Tutor IA"
                    icon={MessageSquare}
                    color="blue"
                    onClick={() => changeTab('Tutores')}
                    actionText="Continuar conversa"
                >
                    {lastTutorMessage ? (
                        <p className="text-xs text-zinc-400 line-clamp-2 italic">"{lastTutorMessage.message}"</p>
                    ) : (
                        <p className="text-xs text-zinc-500">Nenhuma conversa recente.</p>
                    )}
                </QuickAccessCard>

                <QuickAccessCard
                    title="Erros Recentes"
                    icon={AlertTriangle}
                    color="red"
                    onClick={() => changeTab('Lista de Erros')}
                    actionText="Ver lista completa"
                >
                    {recentErrors.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                            {recentErrors.slice(0, 2).map(err => (
                                <div key={err.id} className="text-xs text-zinc-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                                    <span className="truncate">{err.subject}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-zinc-500">Sem erros registrados.</p>
                    )}
                </QuickAccessCard>

                <QuickAccessCard
                    title="Flashcards"
                    icon={Zap}
                    color="yellow"
                    onClick={() => changeTab('Flashcards')}
                    actionText="Iniciar sessão"
                >
                    <p className="text-xs text-zinc-400">
                        {dueFlashcardsCount > 0 ? (
                            <span className="text-yellow-500 font-bold">{dueFlashcardsCount} cards pendentes</span>
                        ) : (
                            "Revisão em dia!"
                        )}
                    </p>
                </QuickAccessCard>

                <QuickAccessCard
                    title="Simulados"
                    icon={Activity}
                    color="emerald"
                    onClick={() => changeTab('Simulados')}
                    actionText="Analisar performance"
                >
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white tracking-tighter">
                            {latestSimulado ? `${calculateSimuladoPercentage(latestSimulado)}%` : '-'}
                        </span>
                        <span className="text-xs text-zinc-500 mb-1">último resultado</span>
                    </div>
                </QuickAccessCard>

            </div>
        </div>
    );
};

// Sub-components for cleaner code

const MetricCard = ({ icon: Icon, color, label, value, subValue }: any) => {
    const colorClasses: any = {
        blue: "bg-blue-500/10 text-blue-500",
        purple: "bg-purple-500/10 text-purple-500",
        yellow: "bg-yellow-500/10 text-yellow-500",
        emerald: "bg-emerald-500/10 text-emerald-500"
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all group">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg transition-colors ${colorClasses[color]}`}>
                    <Icon size={18} />
                </div>
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tighter">
                {value} <span className="text-sm font-normal text-zinc-500 ml-1 align-middle">{subValue}</span>
            </p>
        </div>
    );
};

const QuickAccessCard = ({ title, icon: Icon, color, onClick, actionText, children }: any) => {
    const colorClasses: any = {
        blue: "text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20",
        red: "text-red-500 bg-red-500/10 group-hover:bg-red-500/20",
        yellow: "text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/20"
    };

    const borderHoverClasses: any = {
        blue: "hover:border-blue-500/30",
        red: "hover:border-red-500/30",
        yellow: "hover:border-amber-500/30",
        emerald: "hover:border-emerald-500/30"
    }

    const textHoverClasses: any = {
        blue: "group-hover:text-blue-400",
        red: "group-hover:text-red-400",
        yellow: "group-hover:text-amber-400",
        emerald: "group-hover:text-emerald-400"
    }

    return (
        <div
            onClick={onClick}
            className={`bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 transition-all group cursor-pointer flex flex-col justify-between min-h-[160px] ${borderHoverClasses[color]}`}
        >
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg transition-colors ${colorClasses[color]}`}>
                        <Icon size={18} />
                    </div>
                    <ArrowRight size={16} className={`text-zinc-700 transition-colors ${textHoverClasses[color]}`} />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                {children}
            </div>
            <span className={`text-xs font-bold mt-4 uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity ${colorClasses[color].split(' ')[0]}`}>
                {actionText}
            </span>
        </div>
    );
};

export default DashboardWidgets;

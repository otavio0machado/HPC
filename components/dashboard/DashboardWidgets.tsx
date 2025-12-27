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
    Plus,
    Target
} from 'lucide-react';
import { PlannerTask, ErrorEntry, SimuladoResult } from '../../types';
import { motion } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import SpotlightCard from '../SpotlightCard';


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

            {/* Welcome Section & Quick Action */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-2">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 text-spatial-title">
                        {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">{currentUser.name.split(' ')[0]}</span>.
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-spatial">Pronto para superar seus limites hoje?</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle showLabel={false} />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white 
                            bg-gradient-to-r from-emerald-600 to-teal-600 backdrop-blur-md
                            rounded-xl border border-white/20 
                            shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50
                            ring-1 ring-white/10
                            transition-all duration-300 
                            hover:scale-[1.02] active:scale-95
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
                    >
                        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-600 opacity-20 blur-lg transition-all duration-300 group-hover:opacity-40" />
                        <span className="relative flex items-center gap-2 z-10">
                            <Plus size={18} /> Registrar Sessão
                        </span>
                    </button>
                </div>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* Main Metric - Hours Today */}
                <div className="md:col-span-1 lg:col-span-1 row-span-1">
                    <MetricCard
                        icon={Clock}
                        gradient="from-blue-600 to-indigo-600"
                        label="Foco Hoje"
                        value={`${todayHours}h`}
                        subValue="/ 6h meta"
                        trend="+12% vs ontem"
                    />
                </div>

                {/* Secondary Metrics */}
                <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                    <MetricCard
                        icon={Calendar}
                        gradient="from-violet-600 to-purple-600"
                        label="Semana"
                        value={`${weekHours}h`}
                        variant="compact"
                    />
                    <MetricCard
                        icon={Trophy}
                        gradient="from-amber-500 to-orange-600"
                        label="Mês"
                        value={`${monthHours}h`}
                        variant="compact"
                    />
                </div>

                {/* Focus of the Day / Tasks */}
                <div className="md:col-span-3 lg:col-span-1 row-span-2">
                    <SpotlightCard className="h-full rounded-[32px]" intensity="medium">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{
                                scale: 1.02,
                                y: -6,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }
                            }}
                            className="
                            glass-hydro h-full
                            rounded-[32px] p-6 flex flex-col relative overflow-hidden group
                            transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm ring-1 ring-emerald-500/20">
                                        <LayoutList size={20} />
                                    </div>
                                    <h3 className="font-bold text-zinc-800 dark:text-white text-lg text-spatial-title">Daily Targets</h3>
                                </div>
                                <button onClick={() => changeTab('Planner')} className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 hover:bg-white/[0.05] backdrop-blur-sm hover:scale-110">
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 relative z-10 pr-2">
                                {dailyTasks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm text-center p-4 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-2xl">
                                        <Target size={24} className="mb-2 opacity-50" />
                                        <p>Sem tarefas prioritárias.</p>
                                        <button onClick={() => changeTab('Planner')} className="text-emerald-500 dark:text-emerald-400 mt-2 hover:underline font-medium text-xs">Definir Metas</button>
                                    </div>
                                ) : (
                                    dailyTasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleTaskWidget(task.id)}
                                            className={`
                                                flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300
                                                backdrop-blur-sm border
                                                ${task.completed
                                                    ? 'bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/10'
                                                    : 'bg-white/[0.05] dark:bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] hover:shadow-lg'
                                                }
                                            `}
                                        >
                                            <div className={`mt-0.5 transition-colors ${task.completed ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                                {task.completed ? <CheckCircle2 size={18} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> : <Circle size={18} />}
                                            </div>
                                            <span className={`text-sm font-medium transition-all ${task.completed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                {task.title}
                                            </span>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </SpotlightCard>
                </div>

                {/* Tutor IA - Large Card */}
                <div className="md:col-span-2 lg:col-span-2 row-span-1">
                    <BentoCard
                        title="Tutor IA"
                        icon={MessageSquare}
                        gradient="from-blue-600 to-cyan-500"
                        onClick={() => changeTab('Tutores')}
                        actionText="Continuar Estudo"
                        bgImage="radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.15), transparent 70%)"
                    >
                        {lastTutorMessage ? (
                            <div className="mt-auto bg-white/[0.05] dark:bg-white/[0.03] backdrop-blur-md rounded-xl p-4 border border-white/[0.08] relative overflow-hidden shadow-lg ring-1 ring-white/[0.03]">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 italic relative z-10">"{lastTutorMessage.message}"</p>
                            </div>
                        ) : (
                            <div className="mt-auto">
                                <p className="text-zinc-500 text-sm">Nenhuma conversa ativa.</p>
                                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">Inicie uma sessão para tirar dúvidas.</p>
                            </div>
                        )}
                    </BentoCard>
                </div>

                {/* Stats Grid - Remaining Space */}
                <div className="md:col-span-1 lg:col-span-1 row-span-1">
                    <BentoCard
                        title="Flashcards"
                        icon={Zap}
                        gradient="from-yellow-400 to-amber-600"
                        onClick={() => changeTab('Flashcards')}
                        actionText={dueFlashcardsCount > 0 ? "Revisar Agora" : "Ver Baralhos"}
                    >
                        <div className="mt-auto flex items-end gap-2">
                            {dueFlashcardsCount > 0 ? (
                                <>
                                    <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{dueFlashcardsCount}</span>
                                    <span className="text-amber-600 dark:text-amber-500 font-bold text-sm mb-1.5 animate-pulse">pendentes</span>
                                </>
                            ) : (
                                <span className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Tudo revisado! 🎉</span>
                            )}
                        </div>
                    </BentoCard>
                </div>


                {/* Simulados & Errors */}
                <div className="md:col-span-1 lg:col-span-1 row-span-1">
                    <BentoCard
                        title="Simulados"
                        icon={Activity}
                        gradient="from-emerald-500 to-teal-500"
                        onClick={() => changeTab('Simulados')}
                        actionText="Novo Simulado"
                    >
                        <div className="mt-auto">
                            <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
                                {latestSimulado ? `${calculateSimuladoPercentage(latestSimulado)}%` : '-'}
                            </span>
                            <span className="text-zinc-500 text-xs block mt-1">Média Global: 78%</span>
                        </div>
                    </BentoCard>
                </div>

                {/* Compact Error List */}
                <div className="md:col-span-2 lg:col-span-2 row-span-1">
                    <BentoCard
                        title="Central de Erros"
                        icon={AlertTriangle}
                        gradient="from-red-500 to-rose-600"
                        onClick={() => changeTab('Lista de Erros')}
                        actionText="Analisar Falhas"
                        horizontal={true}
                    >
                        {recentErrors.length > 0 ? (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mt-2">
                                {recentErrors.slice(0, 3).map(err => (
                                    <div key={err.id} className="flex-shrink-0 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-zinc-300 flex items-center gap-2 hover:bg-white/10 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span className="max-w-[120px] truncate">{err.subject}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-xs mt-2">Nenhum erro recente registrado.</p>
                        )}
                    </BentoCard>
                </div>

            </div>
        </div >
    );
};

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

interface MetricCardProps {
    icon: React.ElementType;
    gradient: string;
    label: string;
    value: string;
    subValue?: string;
    trend?: string;
    variant?: 'default' | 'compact';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, gradient, label, value, subValue, trend, variant = 'default' }) => {
    return (
        <SpotlightCard
            className="h-full rounded-[32px]"
            intensity="medium"
            spotlightSize={600}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    scale: 1.02,
                    y: -4,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }
                }}
                className={`
            relative overflow-hidden rounded-[32px] p-6 h-full flex flex-col justify-between group
            glass-hydro
            hover:border-white/[0.2]
            transition-all duration-500 cursor-pointer
        `}
            >
                {/* Background Gradient Blob */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-[80px] opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700`} />

                <div className="flex justify-between items-start relative z-10">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/30 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 backdrop-blur-sm ring-1 ring-white/20`}>
                        <Icon size={variant === 'default' ? 24 : 20} />
                    </div>
                    {trend && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-400/20 backdrop-blur-md">
                            {trend}
                        </span>
                    )}
                </div>

                <div className="relative z-10 mt-4">
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-xs mb-1 text-spatial-caption">{label}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className={`${variant === 'default' ? 'text-4xl' : 'text-3xl'} font-black text-zinc-900 dark:text-white text-spatial-title`}>
                            {value}
                        </span>
                        {subValue && <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">{subValue}</span>}
                    </div>
                </div>
            </motion.div>
        </SpotlightCard>
    );
};

interface BentoCardProps {
    title: string;
    icon: React.ElementType;
    gradient: string;
    onClick: () => void;
    actionText: string;
    children: React.ReactNode;
    bgImage?: string;
    horizontal?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, icon: Icon, gradient, onClick, actionText, children, bgImage, horizontal }) => {
    return (
        <SpotlightCard
            className="h-full rounded-[32px]"
            intensity="medium"
            spotlightSize={700}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                    scale: 1.02,
                    y: -6,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`
                relative overflow-hidden rounded-[32px] p-6 h-full group cursor-pointer
                glass-hydro
                hover:border-white/[0.2]
                transition-all duration-500
                flex flex-col
            `}
            >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700`} />

                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/[0.05] dark:bg-white/[0.03] backdrop-blur-sm text-zinc-600 dark:text-zinc-300 group-hover:text-white group-hover:bg-gradient-to-br ${gradient} transition-all duration-500 shadow-lg ring-1 ring-white/[0.05]`}>
                            <Icon size={20} />
                        </div>
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors text-spatial-title">{title}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/[0.05] backdrop-blur-sm flex items-center justify-center -mr-2 opacity-0 group-hover:opacity-100 group-hover:mr-0 group-hover:scale-110 transition-all duration-500 shadow-lg ring-1 ring-white/[0.05]">
                        <ArrowRight size={14} className="text-zinc-600 dark:text-white" />
                    </div>
                </div>

                <div className={`flex-1 relative z-10 flex ${horizontal ? 'flex-col justify-center' : 'flex-col'}`}>
                    {children}
                </div>
            </motion.div>
        </SpotlightCard>
    );
};

export default DashboardWidgets;

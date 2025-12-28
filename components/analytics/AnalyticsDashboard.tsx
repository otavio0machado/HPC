import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, Legend, Cell
} from 'recharts';
import { simuladosService } from '../../services/simuladosService';
import { SimuladoResult } from '../../types';
import { TrendingUp, Target, Brain, AlertTriangle, Loader2 } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
    const [simulados, setSimulados] = useState<SimuladoResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await simuladosService.fetchSimulados();
                // Sort by date ascending for charts
                setSimulados(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-500 shadow-blue-500/50 drop-shadow-lg" size={48} />
                    <p className="text-zinc-500 font-medium tracking-wide animate-pulse">CARREGANDO ANALYTICS...</p>
                </div>
            </div>
        );
    }

    if (simulados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-zinc-500">
                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center max-w-lg text-center">
                    <div className="p-6 rounded-full bg-white/5 mb-6 shadow-inner ring-1 ring-white/10">
                        <Target size={64} className="opacity-50 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Sem dados suficientes</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Realize simulados para desbloquear a análise biométrica de performance e obter insights detalhados sobre seu progresso.
                    </p>
                </div>
            </div>
        );
    }

    // --- DATA PREPARATION ---

    // 1. History (Line Chart)
    const historyData = simulados.map(s => {
        const totalCorrect = s.areas.reduce((acc, a) => acc + a.correct, 0);
        const totalQuestions = s.areas.reduce((acc, a) => acc + a.total, 0);
        const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        return {
            date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            score: s.totalScore || percentage,
            fullDate: s.date
        };
    });

    // 2. Radar Data (Latest Simulado vs Average)
    const latest = simulados[simulados.length - 1];
    const radarData = latest.areas.map(area => {
        const allThisArea = simulados.flatMap(s => s.areas.filter(a => a.name === area.name));
        const avgCorrect = allThisArea.reduce((acc, curr) => acc + (curr.correct / curr.total), 0) / allThisArea.length;

        return {
            subject: area.name,
            Você: Math.round((area.correct / area.total) * 100),
            Média: Math.round(avgCorrect * 100),
            fullMark: 100
        };
    });

    // 3. Difficulty / Areas weakness (Bar Chart)
    const areasAgg: Record<string, { correct: number, total: number }> = {};
    simulados.forEach(s => {
        s.areas.forEach(a => {
            if (!areasAgg[a.name]) areasAgg[a.name] = { correct: 0, total: 0 };
            areasAgg[a.name].correct += a.correct;
            areasAgg[a.name].total += a.total;
        });
    });

    const performanceData = Object.entries(areasAgg).map(([name, val]) => ({
        name,
        percentage: Math.round((val.correct / val.total) * 100)
    })).sort((a, b) => b.percentage - a.percentage); // Best to worst

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                    <p className="font-bold text-white mb-2 text-sm border-b border-white/10 pb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <p className="text-xs font-medium text-zinc-300">
                                {entry.name}: <span className="text-white font-bold">{entry.value}%</span>
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10 max-w-[1600px] mx-auto"
        >

            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-4 tracking-tight drop-shadow-md">
                        <span className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/10 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                            <TrendingUp size={32} className="text-white" />
                        </span>
                        Analytics Biométrico
                    </h2>
                    <p className="text-lg text-zinc-400 font-medium pl-1 max-w-2xl">
                        Análise profunda e em tempo real da sua evolução cognitiva e performance de prova.
                    </p>
                </div>
            </header>

            {/* HERO INSIGHT CARD */}
            {latest.aiAnalysis && (
                <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-spatial p-8 rounded-[40px] relative overflow-hidden group border border-white/10"
                >
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md">
                                <Brain size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    Insight da Última Prova
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-xs font-bold text-blue-200 uppercase tracking-widest border border-white/10 shadow-sm">Novo</span>
                                </h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                                        {latest.aiAnalysis.replace(/(\*\*|__)/g, '')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 1. Evolution Chart (Larger width) */}
                <div className="lg:col-span-8 glass-hydro p-8 rounded-[40px] min-h-[450px] flex flex-col group hover:border-white/20 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                             <TrendingUp size={20} />
                        </div>
                        Evolução Temporal
                    </h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#71717a" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#71717a" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    domain={[0, 100]} 
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    name="Pontuação"
                                    stroke="#06b6d4"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', shadow: '0 0 10px white' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Radar Chart (Proficiency) */}
                <div className="lg:col-span-4 glass-hydro p-8 rounded-[40px] min-h-[450px] flex flex-col group hover:border-white/20 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                         <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                             <Target size={20} />
                         </div>
                        Competências
                    </h3>
                    <div className="flex-1 w-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#ffffff15" />
                                <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }} 
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Você"
                                    dataKey="Você"
                                    stroke="#c084fc"
                                    strokeWidth={3}
                                    fill="#c084fc"
                                    fillOpacity={0.4}
                                />
                                <Radar
                                    name="Média"
                                    dataKey="Média"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="#3b82f6"
                                    fillOpacity={0.1}
                                    strokeDasharray="4 4"
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Strengths & Weaknesses (Full Width) */}
                <div className="lg:col-span-12 glass-card p-8 rounded-[40px] drop-shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                            <AlertTriangle size={20} />
                        </div>
                        Desempenho por Área de Conhecimento
                    </h3>
                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff08" />
                                <XAxis type="number" domain={[0, 100]} stroke="#71717a" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#e4e4e7" 
                                    fontSize={13} 
                                    fontWeight={500}
                                    width={140} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff03' }} />
                                <Bar dataKey="percentage" name="Acertos" radius={[0, 8, 8, 0]} barSize={24}>
                                    {performanceData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth={0}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default AnalyticsDashboard;

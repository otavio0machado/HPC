import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend, Cell } from 'recharts';
import { simuladosService } from '../../services/simuladosService';
import { SimuladoResult } from '../../types';
import { TrendingUp, Target, Brain, AlertTriangle, Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

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
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (simulados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-zinc-500">
                <Target size={64} className="mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-white mb-2">Sem dados suficientes</h3>
                <p>Realize simulados para desbloquear a análise biométrica de performance.</p>
            </div>
        );
    }

    // --- DATA PREPARATION ---

    // 1. History (Line Chart)
    const historyData = simulados.map(s => {
        // Calculate average percentage correct if totalScore is not set
        const totalCorrect = s.areas.reduce((acc, a) => acc + a.correct, 0);
        const totalQuestions = s.areas.reduce((acc, a) => acc + a.total, 0);
        const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        return {
            date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            score: s.totalScore || percentage, // Use TRI or Percentage
            fullDate: s.date
        };
    });

    // 2. Radar Data (Latest Simulado vs Average)
    const latest = simulados[simulados.length - 1];
    const radarData = latest.areas.map(area => {
        // Find average for this area across all simulados
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
    // Aggregate all correct/total by area
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


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            <header className="mb-8">
                <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <span className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl text-white shadow-lg">
                        <TrendingUp size={32} />
                    </span>
                    Analytics Biométrico
                </h2>
                <p className="text-zinc-400">Análise profunda da sua evolução cognitiva e performance de prova.</p>
            </header>

            {/* ERROR / INSIGHT HERO */}
            {latest.aiAnalysis && (
                <div className="glass-card p-8 rounded-[32px] border border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <Brain size={120} />
                    </div>
                    <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                        <Brain size={24} /> Insight da Última Prova
                    </h3>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-zinc-200 leading-relaxed font-medium">
                            {latest.aiAnalysis.replace(/(\*\*|__)/g, '') /* Simple cleanup */}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Evolution Chart */}
                <div className="glass-hydro p-8 rounded-[32px] min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6">Evolução Temporal</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historyData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Radar Chart (Proficiency) */}
                <div className="glass-hydro p-8 rounded-[32px] min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6">Raio-X de Competências</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Você"
                                    dataKey="Você"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    fill="#ec4899"
                                    fillOpacity={0.3}
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
                                <Legend />
                                <Tooltip contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: 'none' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Strengths & Weaknesses */}
                <div className="lg:col-span-2 glass-card p-8 rounded-[32px]">
                    <h3 className="text-lg font-bold text-white mb-6">Desempenho por Área</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
                                <XAxis type="number" domain={[0, 100]} stroke="#71717a" hide />
                                <YAxis dataKey="name" type="category" stroke="#e4e4e7" fontSize={12} width={100} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid #333' }} />
                                <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={24}>
                                    {performanceData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#ef4444'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDashboard;

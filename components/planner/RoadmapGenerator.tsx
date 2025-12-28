import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, Calendar as CalendarIcon, Clock, Zap, CheckCircle2, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { roadmapService, RoadmapResponse } from '../../services/roadmapService';
import { toast } from 'sonner';

interface RoadmapGeneratorProps {
    onClose: () => void;
    onSuccess: () => void;
}

const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('Intermediário');
    const [hours, setHours] = useState(4);
    const [deadline, setDeadline] = useState('');

    // Result State
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);

    const handleGenerate = async () => {
        if (!goal || !deadline) {
            toast.error("Preencha todos os campos!");
            return;
        }

        setLoading(true);
        try {
            const result = await roadmapService.generateRoadmap(
                goal,
                hours,
                new Date(deadline),
                level
            );
            setRoadmap(result);
            setStep(2);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar GPS. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!roadmap) return;
        setLoading(true);
        try {
            const success = await roadmapService.saveToPlanner(roadmap);
            if (success) {
                toast.success(`GPS Ativado! ${roadmap.tasks.length} missões adicionadas.`);
                onSuccess();
                onClose();
            } else {
                toast.error("Erro ao salvar no Planner.");
            }
        } catch (e) {
            toast.error("Erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl glass-hydro border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                            <Map size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">GPS de Estudos</h2>
                    </div>
                    <p className="text-zinc-400 text-sm pl-12 font-medium">A inteligência artificial irá traçar a rota exata até sua aprovação.</p>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">

                    {step === 1 && (
                        <div className="space-y-6">

                            {/* Goal Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-2">
                                    <Target size={14} className="text-blue-500" /> Qual seu Objetivo Final?
                                </label>
                                <input
                                    type="text"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder="Ex: Passar em Medicina na UFRGS em 1º lugar..."
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/30 transition-all font-medium placeholder:text-zinc-700"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Level */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-2">
                                        <Zap size={14} className="text-yellow-500" /> Nível Atual
                                    </label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 px-4 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Iniciante" className="bg-zinc-900">Iniciante (Base Fraca)</option>
                                        <option value="Intermediário" className="bg-zinc-900">Intermediário (Já estuda)</option>
                                        <option value="Avançado" className="bg-zinc-900">Avançado (Só revisando)</option>
                                    </select>
                                </div>

                                {/* Deadline */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-2 mb-2">
                                        <CalendarIcon size={14} className="text-red-500" /> Data da Prova
                                    </label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Hours Slider */}
                            <div className="glass-spatial p-5 rounded-3xl border border-white/5">
                                <div className="flex justify-between text-sm font-bold text-zinc-300 mb-4">
                                    <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500"><Clock size={14} className="text-emerald-500" /> Dedicação Diária</span>
                                    <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">{hours} Horas</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    step="0.5"
                                    value={hours}
                                    onChange={(e) => setHours(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-zinc-700/50 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-2">
                                    <span>Soft (1h)</span>
                                    <span>Hardcore (12h)</span>
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 2 && roadmap && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Summary Card */}
                            <div className="p-8 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                                <div className="absolute top-[-20%] right-[-10%] p-8 opacity-20 group-hover:scale-110 transition-transform duration-700"><Target size={140} /></div>
                                <h3 className="text-sm font-bold opacity-80 mb-3 uppercase tracking-wider">Sua Missão</h3>
                                <p className="text-3xl font-black leading-tight max-w-[85%] tracking-tight">"{roadmap.goalSummary}"</p>
                                <div className="mt-6 flex gap-4 text-xs font-bold bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                    <span>{roadmap.totalWeeks} Semanas</span>
                                    <span className="opacity-50">|</span>
                                    <span>{roadmap.tasks.length} Missões Geradas</span>
                                </div>
                            </div>

                            {/* Phases */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {roadmap.phases.map((phase, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-wider">Fase {idx + 1}</div>
                                        <div className="font-bold text-zinc-200 mb-1 text-sm">{phase.phaseName}</div>
                                        <div className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded w-fit border border-blue-500/10">{phase.focus}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Tasks */}
                            <div>
                                <h4 className="text-zinc-500 text-xs font-black mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <CalendarIcon size={12} /> Preview da Semana 1
                                </h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                    {roadmap.tasks.filter(t => t.week === 1).map((task, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                                            <span className="text-xs font-medium text-zinc-300">{task.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col-reverse sm:flex-row justify-end gap-3 backdrop-blur-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>

                    {step === 1 && (
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`
                                group flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white 
                                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                                shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02]
                                transition-all disabled:opacity-50 disabled:pointer-events-none
                            `}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            {loading ? "Calculando Rota..." : "Gerar Rota"}
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            onClick={handleApply}
                            disabled={loading}
                            className={`
                                flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white 
                                bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500
                                shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02]
                                transition-all disabled:opacity-50 disabled:pointer-events-none
                            `}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            {loading ? "Salvando..." : "Confirmar & Aplicar"}
                        </button>
                    )}
                </div>

            </motion.div>
        </div>
    );
};

export default RoadmapGenerator;

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
                className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                            <Map size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-white">GPS de Estudos</h2>
                    </div>
                    <p className="text-zinc-400 text-sm">A inteligência artificial irá traçar a rota exata até sua aprovação.</p>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">

                    {step === 1 && (
                        <div className="space-y-6">

                            {/* Goal Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                    <Target size={16} className="text-blue-500" /> Qual seu Objetivo Final?
                                </label>
                                <input
                                    type="text"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder="Ex: Passar em Medicina na UFRGS em 1º lugar..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Level */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                        <Zap size={16} className="text-yellow-500" /> Nível Atual
                                    </label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Iniciante">Iniciante (Base Fraca)</option>
                                        <option value="Intermediário">Intermediário (Já estuda)</option>
                                        <option value="Avançado">Avançado (Só revisando)</option>
                                    </select>
                                </div>

                                {/* Deadline */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                        <CalendarIcon size={16} className="text-red-500" /> Data da Prova
                                    </label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Hours Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-bold text-zinc-300">
                                    <span className="flex items-center gap-2"><Clock size={16} className="text-green-500" /> Horas por Dia</span>
                                    <span className="text-blue-400">{hours}h</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    step="0.5"
                                    value={hours}
                                    onChange={(e) => setHours(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                                />
                                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                                    <span>Soft (1h)</span>
                                    <span>Hardcore (12h)</span>
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 2 && roadmap && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Summary Card */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-20"><Target size={100} /></div>
                                <h3 className="text-lg font-bold opacity-80 mb-2">Sua Missão</h3>
                                <p className="text-2xl font-black leading-tight max-w-[90%]">"{roadmap.goalSummary}"</p>
                                <div className="mt-4 flex gap-4 text-sm font-bold opacity-70">
                                    <span>{roadmap.totalWeeks} Semanas</span>
                                    <span>•</span>
                                    <span>{roadmap.tasks.length} Missões Geradas</span>
                                </div>
                            </div>

                            {/* Phases */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {roadmap.phases.map((phase, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Fase {idx + 1}</div>
                                        <div className="font-bold text-white mb-1">{phase.phaseName}</div>
                                        <div className="text-xs text-blue-400">{phase.focus}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Tasks */}
                            <div>
                                <h4 className="text-zinc-400 text-sm font-bold mb-3 uppercase tracking-wider">Preview da Semana 1</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                    {roadmap.tasks.filter(t => t.week === 1).map((task, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-sm text-zinc-200">{task.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col-reverse sm:flex-row justify-end gap-3">
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

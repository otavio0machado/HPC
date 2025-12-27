import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { ExamType, SubjectFocus, StudyPlanResponse } from '../types';
import { BrainCircuit, Loader2, CheckCircle2, Calendar } from 'lucide-react';

const Planner: React.FC = () => {
  const [exam, setExam] = useState<ExamType>(ExamType.ENEM);
  const [subject, setSubject] = useState<SubjectFocus>(SubjectFocus.MATH);
  const [hours, setHours] = useState<number>(2);
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await generateStudyPlan(exam, subject, hours);
      setPlan(result);
    } catch (err) {
      setError("Não foi possível gerar o plano no momento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="planner" className="py-24 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 mb-4 flex items-center justify-center gap-3 drop-shadow-md tracking-tight">
            <BrainCircuit className="text-blue-400" size={32} /> IA de Performance
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
            Experimente nossa tecnologia. Gere um micro-ciclo de estudos de 5 dias focado na sua maior dificuldade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Controls */}
          <div className="glass-hydro p-8 rounded-[36px] border border-white/20">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300"><Calendar size={20} /></span>
              Configurar Ciclo
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 ml-1">Foco do Exame</label>
                <div className="flex gap-2 p-1.5 glass-spatial rounded-xl">
                  {(Object.keys(ExamType) as Array<keyof typeof ExamType>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setExam(ExamType[key])}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${exam === ExamType[key] ? 'bg-white/20 text-white shadow-lg backdrop-blur-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {ExamType[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 ml-1">Matéria Dificuldade</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectFocus)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none appearance-none cursor-pointer hover:bg-black/30 transition-colors font-medium"
                >
                  {Object.values(SubjectFocus).map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 ml-1">Horas/Dia: <span className="text-white text-base ml-1">{hours}h</span></label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-2 font-mono">
                  <span>1h</span>
                  <span>8h</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Gerar Estratégia"}
              </button>
              {error && <p className="text-red-400 text-sm mt-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
            </div>
          </div>

          {/* Result Display */}
          <div className="lg:col-span-2">
            {!plan && !loading && (
              <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center text-zinc-600 p-8 text-center glass-hydro">
                <BrainCircuit size={48} className="mb-4 opacity-20" />
                <p>Seu plano de alta performance aparecerá aqui.</p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[400px] border border-white/10 rounded-[32px] flex flex-col items-center justify-center glass-hydro">
                <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                <p className="text-zinc-400 animate-pulse">Analisando padrão de prova...</p>
                <p className="text-zinc-500 text-sm mt-2">Otimizando cronograma...</p>
              </div>
            )}

            {plan && (
              <div className="glass-hydro rounded-[36px] overflow-hidden shadow-2xl border border-white/20">
                <div className="p-8 border-b border-white/10 bg-white/5 backdrop-blur-md">
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{plan.weeklyGoal}</h3>
                  <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                    <CheckCircle2 size={22} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-200 leading-relaxed font-medium">{plan.strategyNote}</p>
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  {plan.schedule.map((day, idx) => (
                    <div key={idx} className="p-6 hover:bg-white/5 transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-400 font-bold text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/5 group-hover:bg-white/10 transition-colors uppercase tracking-wider">{day.day}</span>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-xs font-bold text-blue-300 border border-blue-500/20">
                            {day.focus}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-5 pl-2">
                        {day.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-4 text-zinc-300 text-sm group-hover:text-zinc-200 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                            {task}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-xs text-zinc-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Pro Tip</span>
                        <span className="italic">{day.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Planner;
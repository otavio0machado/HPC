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
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <BrainCircuit className="text-blue-500" /> IA de Performance
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Experimente nossa tecnologia. Gere um micro-ciclo de estudos de 5 dias focado na sua maior dificuldade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Controls */}
          <div className="glass-hydro p-6 rounded-[32px]">
            <h3 className="text-lg font-medium text-white mb-6">Configurar Ciclo</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Foco do Exame</label>
                <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                  {(Object.keys(ExamType) as Array<keyof typeof ExamType>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setExam(ExamType[key])}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${exam === ExamType[key] ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                      {ExamType[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Matéria Dificuldade</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectFocus)}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none appearance-none cursor-pointer hover:bg-black/30 transition-colors"
                >
                  {Object.values(SubjectFocus).map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Horas/Dia disponíveis: <span className="text-white">{hours}h</span></label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-zinc-600 mt-2">
                  <span>1h</span>
                  <span>8h</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Gerar Estratégia"}
              </button>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
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
              <div className="glass-hydro rounded-[32px] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.weeklyGoal}</h3>
                  <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                    <CheckCircle2 size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-200">{plan.strategyNote}</p>
                  </div>
                </div>

                <div className="divide-y divide-zinc-800">
                  {plan.schedule.map((day, idx) => (
                    <div key={idx} className="p-6 hover:bg-zinc-900/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 font-mono text-sm">{day.day}</span>
                          <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-700">
                            {day.focus}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-4">
                        {day.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-3 text-zinc-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 flex-shrink-0"></div>
                            {task}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-xs text-zinc-500 italic">
                        <span className="font-semibold text-emerald-500 not-italic">Pro Tip:</span> {day.tip}
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
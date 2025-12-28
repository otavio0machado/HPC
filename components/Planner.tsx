import React, { useState } from 'react';
import { generateStudyPlan } from '../services/aiService';
import { ExamType, SubjectFocus, StudyPlanResponse } from '../types';
import { BrainCircuit, Loader2, CheckCircle2, Calendar, ChevronDown, Clock, Sparkles, Target } from 'lucide-react';

const Planner: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
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
        {/* Header Section - Only for Admin in Beta 2 */}
        {isAdmin && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 mb-4 flex items-center justify-center gap-3 drop-shadow-md tracking-tight">
              <BrainCircuit className="text-blue-400" size={32} /> IA de Performance
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
              Experimente nossa tecnologia. Gere um micro-ciclo de estudos de 5 dias focado na sua maior dificuldade.
            </p>
          </div>
        )}

        {isAdmin ? (
          <div className="max-w-4xl mx-auto">
            {/* Form Card */}
            <div className="glass-card rounded-[32px] p-8 md:p-12 mb-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-700" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Foco do Exame</label>
                  <div className="relative">
                    <select
                      value={exam}
                      onChange={(e) => setExam(e.target.value as ExamType)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                    >
                      <option value={ExamType.ENEM}>ENEM</option>
                      <option value={ExamType.UFRGS}>UFRGS</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Maior Dificuldade</label>
                  <div className="relative">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as SubjectFocus)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                    >
                      {Object.values(SubjectFocus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Horas Disponíveis</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                    />
                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors" size={18} />
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 border border-white/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span className="tracking-wide">PROCESSANDO INTELIGÊNCIA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="animate-pulse" />
                    <span className="tracking-wide text-lg">GERAR CRONOGRAMA OTIMIZADO</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-3xl mb-12 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
                <div className="bg-red-500/20 p-2 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Plan Display */}
            {plan && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="glass-spatial p-8 rounded-[32px] border-l-4 border-l-blue-500">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Target className="text-blue-400" size={18} />
                    </div>
                    Meta do Ciclo
                  </h3>
                  <p className="text-zinc-300 leading-relaxed font-medium">{plan.weeklyGoal}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plan.schedule.map((dayPlan, idx) => (
                    <div key={idx} className="glass-card p-8 rounded-[32px] hover:border-blue-500/30 transition-all duration-500 group">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">{dayPlan.day}</span>
                        <Calendar size={18} className="text-zinc-600" />
                      </div>
                      <h4 className="font-bold text-white mb-4 text-lg line-clamp-2 min-h-[3.5rem]">{dayPlan.focus}</h4>
                      <ul className="space-y-3 mb-6">
                        {dayPlan.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm font-medium leading-relaxed">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center py-20 px-6 glass-card rounded-[40px] border-dashed border-white/10">
            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
              <Calendar size={40} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Planner Beta 1.0</h3>
            <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
              As ferramentas automáticas de performance via IA serão liberadas na atualização Beta 2.0.
              Utilize o agendamento manual no seu Planner de Tarefas por enquanto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Planner;
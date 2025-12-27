import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, X, Activity, TrendingUp, AlertCircle, FileText, CheckCircle2, Calculator, ChevronDown, ChevronUp, BrainCircuit, Loader2, Sparkles, BookOpen, Clock, Target, ArrowRight, Check, Timer, Image as ImageIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { simuladosService } from '../services/simuladosService';
import { ExamType, SimuladoResult, SimuladoArea, GeneratedQuestion, SimulationConfig } from '../types';
import { analyzeExamPerformance, generateExams } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const Simulados: React.FC = () => {
  const [history, setHistory] = useState<SimuladoResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modes: 'list' | 'config' | 'taking' | 'result' | 'manual_entry'
  const [viewMode, setViewMode] = useState<'list' | 'config' | 'taking' | 'result' | 'manual_entry'>('list');

  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Manual Entry State
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(ExamType.ENEM);
  const [essayScore, setEssayScore] = useState<string>('');
  const [areasInput, setAreasInput] = useState<Record<string, string>>({});

  // AI Simulation State
  const [simConfig, setSimConfig] = useState<SimulationConfig>({
    type: ExamType.ENEM,
    area: 'Matemática',
    difficulty: 'Médio',
    count: 5,
    mode: 'Rápido'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeExam, setActiveExam] = useState<GeneratedQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({}); // questionId -> optionIndex
  const [examResult, setExamResult] = useState<{ score: number, correct: number, total: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await simuladosService.fetchSimulados();
      setHistory(data);
    } catch (e) {
      console.error("Failed to load simulados", e);
      toast.error("Erro ao carregar simulados.");
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration for Exam Inputs (Manual Entry)
  const examConfig = {
    [ExamType.ENEM]: {
      areas: ['Linguagens', 'Humanas', 'Natureza', 'Matemática'],
      totalPerArea: 45
    },
    [ExamType.UFRGS]: {
      areas: ['Física', 'Literatura', 'Ling. Estrangeira', 'Português', 'Biologia', 'Química', 'Geografia', 'História', 'Matemática'],
      totalPerArea: 25
    },
    [ExamType.BOTH]: { areas: [], totalPerArea: 0 }
  };

  // --- Handlers ---

  const handleManualInputChange = (area: string, value: string) => {
    setAreasInput(prev => ({ ...prev, [area]: value }));
  };

  const calculateGlobalPercentage = (result: SimuladoResult): number => {
    let totalCorrect = 0;
    let totalQuestions = 0;

    result.areas.forEach(a => {
      totalCorrect += a.correct;
      totalQuestions += a.total;
    });

    if (totalQuestions === 0) return 0;
    return Math.round((totalCorrect / totalQuestions) * 100);
  };

  const handleSaveManualSimulado = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = examConfig[selectedExamType];
    const areas: SimuladoArea[] = config.areas.map(name => ({
      name,
      correct: parseInt(areasInput[name] || '0'),
      total: config.totalPerArea
    }));

    await saveSimuladoToDb({
      date: new Date().toLocaleDateString('pt-BR'),
      examType: selectedExamType,
      areas,
      essayScore: essayScore ? parseInt(essayScore) : undefined,
    });

    setViewMode('list');
    setAreasInput({});
    setEssayScore('');
  };

  const saveSimuladoToDb = async (simuladoData: Omit<SimuladoResult, 'id'>) => {
    try {
      const saved = await simuladosService.createSimulado(simuladoData);
      if (saved) {
        setHistory(prev => [saved, ...prev]);
        toast.success("Simulado registrado!");
        handleAnalyze(saved.id, saved); // Auto trigger analysis
        return true;
      } else {
        toast.error("Erro ao salvar simulado.");
        return false;
      }
    } catch (e) {
      toast.error("Erro inesperado ao salvar.");
      return false;
    }
  };

  const handleAnalyze = async (id: string, simuladoData?: SimuladoResult) => {
    setAnalyzingId(id);
    const simulado = simuladoData || history.find(h => h.id === id);
    if (!simulado) return;

    try {
      const analysis = await analyzeExamPerformance(simulado);
      setHistory(prev => prev.map(h => h.id === id ? { ...h, aiAnalysis: analysis } : h));
      await simuladosService.updateSimuladoAnalysis(id, analysis);
      toast.success("Análise de IA gerada!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Erro ao gerar análise: ${error.message || error}`);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remover este simulado?")) {
      const oldHistory = [...history];
      setHistory(history.filter(h => h.id !== id));
      try {
        await simuladosService.deleteSimulado(id);
        toast.success("Simulado removido.");
      } catch (e) {
        setHistory(oldHistory);
        toast.error("Erro ao remover simulado.");
      }
    }
  };

  // --- AI GENERATION HANDLERS ---

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    try {
      const questions = await generateExams(simConfig);
      if (questions && questions.length > 0) {
        setActiveExam(questions);
        setUserAnswers({});
        setViewMode('taking');
      } else {
        toast.error("Não foi possível gerar o simulado. Tente novamente.");
      }
    } catch (e) {
      toast.error("Erro na geração do simulado.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    activeExam.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    setExamResult({
      score: Math.round((correctCount / activeExam.length) * 100),
      correct: correctCount,
      total: activeExam.length
    });
    setViewMode('result');
  };

  const handleSaveAIResult = async () => {
    if (!examResult) return;

    // Create a generic area for this AI exam
    const aiArea: SimuladoArea = {
      name: `Simulado IA - ${simConfig.area}`,
      correct: examResult.correct,
      total: examResult.total
    };

    await saveSimuladoToDb({
      date: new Date().toLocaleDateString('pt-BR'),
      examType: simConfig.type,
      areas: [aiArea],
      essayScore: undefined,
    });

    setViewMode('list');
    setExamResult(null);
    setActiveExam([]);
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-500">
        <Loader2 className="animate-spin mb-2 text-blue-500" size={32} />
        <span className="ml-2">Carregando Simulados...</span>
      </div>
    );
  }

  // --- RENDER FUNCTIONS ---

  if (viewMode === 'config') {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setViewMode('list')} className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 backdrop-blur-md">
          <ChevronDown className="rotate-90" size={20} /> Voltar para lista
        </button>

        <div className="glass-hydro rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />

          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Sparkles className="text-blue-400" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Gerador de Simulados IA</h2>
              <p className="text-zinc-400 font-medium">Crie provas personalizadas com questões inéditas.</p>
            </div>
          </div>

          <div className="space-y-8">

            {/* Mode Selection */}
            <div className="bg-black/20 p-5 rounded-[24px] border border-white/5 backdrop-blur-sm">
              <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest pl-1">Modo de Simulação</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSimConfig(p => ({ ...p, mode: 'Rápido' }))}
                  className={`flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border transition-all duration-300 group ${simConfig.mode === 'Rápido' ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/10'}`}
                >
                  <Timer size={32} className={`transition-transform duration-300 ${simConfig.mode === 'Rápido' ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} />
                  <div className="text-center">
                    <span className="font-bold block text-lg">Modo Rápido</span>
                    <span className="text-xs opacity-70 font-medium">Questões diretas</span>
                  </div>
                </button>
                <button
                  onClick={() => setSimConfig(p => ({ ...p, mode: 'Maratona' }))}
                  className={`flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border transition-all duration-300 group ${simConfig.mode === 'Maratona' ? 'bg-purple-600/20 border-purple-500/50 text-purple-100 shadow-[0_0_20px_rgba(147,51,234,0.2)]' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/10'}`}
                >
                  <BookOpen size={32} className={`transition-transform duration-300 ${simConfig.mode === 'Maratona' ? 'scale-110 text-purple-400' : 'group-hover:scale-110'}`} />
                  <div className="text-center">
                    <span className="font-bold block text-lg">Modo Maratona</span>
                    <span className="text-xs opacity-70 font-medium">Textos longos e Imagens</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Tipo de Prova</label>
              <div className="flex gap-4">
                {[ExamType.ENEM, ExamType.UFRGS].map(type => (
                  <button
                    key={type}
                    onClick={() => setSimConfig(p => ({ ...p, type }))}
                    className={`flex-1 py-4 px-6 rounded-2xl border font-bold text-lg transition-all duration-300 shadow-lg ${simConfig.type === type ? 'bg-blue-600 border-blue-500 text-white shadow-blue-900/40 transform scale-[1.02]' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Área de Conhecimento</label>
              <div className="relative">
                <select
                  value={simConfig.area}
                  onChange={(e) => setSimConfig(p => ({ ...p, area: e.target.value }))}
                  className="w-full appearance-none bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all hover:bg-black/30 cursor-pointer"
                >
                  {['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Literatura', 'Português', 'Linguagens', 'Humanas', 'Natureza'].map(area => (
                    <option key={area} value={area} className="bg-zinc-900">{area}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Dificuldade</label>
                <div className="relative">
                  <select
                    value={simConfig.difficulty}
                    onChange={(e) => setSimConfig(p => ({ ...p, difficulty: e.target.value as any }))}
                    className="w-full appearance-none bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all hover:bg-black/30 cursor-pointer"
                  >
                    <option value="Fácil" className="bg-zinc-900">Fácil</option>
                    <option value="Médio" className="bg-zinc-900">Médio</option>
                    <option value="Difícil" className="bg-zinc-900">Difícil</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Nº Questões</label>
                <div className="relative">
                  <select
                    value={simConfig.count}
                    onChange={(e) => setSimConfig(p => ({ ...p, count: parseInt(e.target.value) }))}
                    className="w-full appearance-none bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all hover:bg-black/30 cursor-pointer"
                  >
                    <option value={3} className="bg-zinc-900">3 Questões</option>
                    <option value={5} className="bg-zinc-900">5 Questões</option>
                    <option value={10} className="bg-zinc-900">10 Questões</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-full bg-white hover:bg-zinc-200 text-black font-black text-lg py-5 rounded-2xl transition-all hover:scale-[1.01] shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mt-8 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border border-white/50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Gerando Prova...
                </>
              ) : (
                <>
                  <BrainCircuit size={24} /> INICIAR SIMULADO
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'taking') {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest">
              {simConfig.mode === 'Maratona' ? '🔥 MODO MARATONA' : '⚡ MODO RÁPIDO'}: {simConfig.type} - {simConfig.area}
            </span>
          </div>
          <button onClick={() => { if (confirm("Sair do simulado? O progresso será perdido.")) setViewMode('list') }} className="text-xs text-zinc-500 hover:text-white underline">Cancelar</button>
        </div>

        <div className="space-y-12">
          {activeExam.map((q, qIndex) => (
            <div key={q.id} className="glass-hydro rounded-[32px] overflow-hidden group hover:border-white/20 transition-all duration-300 shadow-xl">

              {/* Question Header / Number */}
              <div className="px-10 pt-10 flex justify-between">
                <span className="text-zinc-400 font-bold text-sm tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">QUESTÃO {qIndex + 1}</span>
              </div>

              <div className="p-10">
                {/* Support Text (Marathon Mode) */}
                {q.supportText && (
                  <div className="mb-8 p-8 bg-black/20 rounded-[24px] border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest mb-4">
                      <BookOpen size={16} /> Texto de Apoio
                    </div>
                    <p className="text-zinc-200 text-base leading-loose whitespace-pre-line font-serif border-l-2 border-zinc-700 pl-6">
                      {q.supportText}
                    </p>
                  </div>
                )}

                {/* Image Placeholder (Marathon Mode) */}
                {q.imageDescription && (
                  <div className="mb-8 aspect-video bg-black/30 rounded-[24px] border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                    <ImageIcon size={48} className="text-zinc-600 mb-4" />
                    <p className="text-zinc-400 text-sm italic max-w-md font-medium">
                      "{q.imageDescription}"
                    </p>
                    <span className="text-zinc-600 text-xs mt-3 font-mono uppercase bg-black/40 px-2 py-1 rounded border border-white/5">[Imagem da Questão]</span>
                  </div>
                )}

                <div className="mb-10">
                  <p className="text-xl text-white leading-relaxed font-medium font-serif">{q.text}</p>
                </div>

                <div className="space-y-4">
                  {q.options.map((opt, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => handleAnswerSelect(q.id, optIndex)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all flex items-start gap-5 group/opt ${userAnswers[q.id] === optIndex
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:border-white/10'
                        }`}
                    >
                      <span className={`w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full text-sm font-bold border transition-all ${userAnswers[q.id] === optIndex ? 'bg-blue-500 border-blue-500 text-white scale-110 shadow-lg' : 'border-zinc-700 text-zinc-500 group-hover/opt:border-zinc-500 group-hover/opt:text-zinc-300'}`}>
                        {['A', 'B', 'C', 'D', 'E'][optIndex]}
                      </span>
                      <span className="flex-1 text-base pt-1 font-medium leading-relaxed">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end pb-20">
          <button
            onClick={handleSubmitExam}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg shadow-green-900/20 transition-all hover:scale-105 backdrop-blur-md border border-white/20"
          >
            Finalizar Prova
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'result' && examResult) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="glass-hydro rounded-[40px] overflow-hidden mb-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/20">
          <div className="bg-gradient-to-b from-white/10 to-transparent p-12 text-center border-b border-white/10 relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] pointer-events-none" />
            <h2 className="text-blue-200 uppercase tracking-[0.2em] text-xs font-black mb-6 relative z-10 bg-blue-500/10 inline-block px-4 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">Resultado do Simulado</h2>
            <div className="flex justify-center items-end gap-3 mb-4 relative z-10">
              <span className={`text-8xl font-black tracking-tighter drop-shadow-2xl ${examResult.score >= 70 ? 'text-emerald-400' : examResult.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {examResult.score}%
              </span>
              <span className="text-zinc-400 font-bold mb-6 text-xl tracking-wide uppercase">acertos</span>
            </div>
            <p className="text-zinc-300 font-medium relative z-10 text-lg">Você acertou <strong className="text-white bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 mx-1">{examResult.correct}</strong> de <strong className="text-white bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 mx-1">{examResult.total}</strong> questões.</p>
          </div>

          <div className="p-10 space-y-10 bg-black/20 backdrop-blur-sm">
            {activeExam.map((q, index) => {
              const isCorrect = userAnswers[q.id] === q.correctOptionIndex;
              return (
                <div key={q.id} className={`border-b border-white/5 pb-10 last:border-0 last:pb-0 ${isCorrect ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
                  <div className="flex gap-6">
                    <div className={`mt-1 min-w-[40px] h-10 rounded-xl flex items-center justify-center shadow-lg ${isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {isCorrect ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-200 font-medium mb-5 text-lg leading-relaxed">{q.text}</p>

                      <div className="glass-card bg-black/40 rounded-2xl p-6 mb-4 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                          Sua Resposta
                        </p>
                        <div className={`flex items-start gap-3 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                          <span className="font-black text-lg bg-white/5 w-8 h-8 flex items-center justify-center rounded-lg">{['A', 'B', 'C', 'D', 'E'][userAnswers[q.id] || 0]}</span>
                          <span className="font-medium text-base pt-1">{q.options[userAnswers[q.id] || 0]}</span>
                        </div>
                      </div>

                      {!isCorrect && (
                        <div className="glass-card bg-emerald-900/10 border-emerald-500/20 rounded-2xl p-6 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                          <p className="text-xs text-emerald-600 mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Resposta Correta
                          </p>
                          <div className="flex items-start gap-3 text-emerald-400">
                            <span className="font-black text-lg bg-emerald-500/20 w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-500/20">{['A', 'B', 'C', 'D', 'E'][q.correctOptionIndex]}</span>
                            <span className="font-medium text-base pt-1">{q.options[q.correctOptionIndex]}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 text-sm text-zinc-400 bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05]">
                        <strong className="text-blue-200 block mb-2 flex items-center gap-2 uppercase text-xs tracking-wider font-bold">
                          <BrainCircuit size={14} /> Explicação
                        </strong>
                        <div className="leading-relaxed text-base">{q.explanation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-8 bg-black/40 border-t border-white/10 flex justify-between items-center backdrop-blur-md">
            <button onClick={() => setViewMode('list')} className="text-zinc-500 hover:text-white text-sm px-6 py-3 hover:bg-white/10 rounded-xl transition-all font-bold tracking-wide">Descartar Resultado</button>
            <button
              onClick={handleSaveAIResult}
              className="bg-white text-black font-black py-4 px-10 rounded-2xl hover:bg-zinc-200 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 backdrop-blur-md border border-white/20 active:scale-95"
            >
              <CheckCircle2 size={20} /> SALVAR NO HISTÓRICO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DEFAULT LIST VIEW (Dashboard) ---

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Central de Simulados</h2>
          </div>
          <p className="text-zinc-400 text-sm tracking-wide">O que não é medido não pode ser melhorado.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setViewMode('manual_entry') }}
            className="bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10 backdrop-blur-md hover:border-white/20 hover:scale-[1.02] shadow-lg"
          >
            <Calculator size={18} /> Lançar Manual
          </button>

          <button
            onClick={() => setViewMode('config')}
            className="bg-white/90 hover:bg-white text-black font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-md border border-white/20"
          >
            <BrainCircuit size={20} /> Gerar com IA
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: History */}
        <div className="lg:col-span-2 space-y-6">
          {history.length === 0 ? (
            <div className="glass-hydro border-dashed border-white/10 rounded-[32px] p-12 text-center">
              <Activity size={48} className="mx-auto mb-4 text-zinc-600" />
              <h3 className="text-white font-bold text-lg">Sem dados de performance</h3>
              <p className="text-zinc-500 mt-2">Adicione seu primeiro simulado para gerar inteligência de prova.</p>
            </div>
          ) : (
            history.map((sim) => {
              const globalPct = calculateGlobalPercentage(sim);
              return (
                <div key={sim.id} className="glass-card rounded-[32px] overflow-hidden hover:border-white/20 transition-all duration-300 group hover:shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${sim.examType === ExamType.ENEM ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-orange-900/30 text-orange-300 border-orange-800'}`}>
                          {sim.examType}
                        </span>
                        <span className="text-zinc-500 text-sm">{sim.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(sim.id)}
                          className="text-zinc-600 hover:text-red-400 p-2 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      {/* Main Stat */}
                      <div className="md:col-span-1 flex flex-col justify-center">
                        <div className={`text-4xl font-bold mb-1 ${globalPct >= 80 ? 'text-emerald-400' : globalPct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {globalPct}%
                        </div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Taxa de Acerto</div>
                        {sim.essayScore && (
                          <div className="mt-3 text-sm text-zinc-300 font-medium flex items-center gap-1">
                            <FileText size={14} className="text-zinc-500" /> Redação: <span className="text-white">{sim.essayScore}</span>
                          </div>
                        )}
                      </div>

                      {/* Detailed Stats Grid */}
                      <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sim.areas.map(area => {
                          const pct = Math.round((area.correct / area.total) * 100);
                          return (
                            <div key={area.name} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/50">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs text-zinc-400 truncate max-w-[80px]" title={area.name}>{area.name}</span>
                                <span className={`text-xs font-bold ${pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                                  {area.correct}/{area.total}
                                </span>
                              </div>
                              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full ${getBarColor(pct)}`} style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="border-t border-zinc-800 pt-4 bg-zinc-950/30 -mx-6 px-6 -mb-6 pb-6">
                      {sim.aiAnalysis ? (
                        <div className="animate-in fade-in duration-500">
                          <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold text-sm">
                            <BrainCircuit size={16} /> Análise de Elite
                          </div>
                          <div className="text-sm text-zinc-300 leading-relaxed bg-blue-900/10 border border-blue-500/10 p-4 rounded-xl">
                            <ReactMarkdown
                              components={{
                                strong: ({ node, ...props }) => <span className="text-white font-bold" {...props} />,
                              }}
                            >
                              {sim.aiAnalysis}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAnalyze(sim.id)}
                          disabled={analyzingId === sim.id}
                          className="w-full py-3 border border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          {analyzingId === sim.id ? (
                            <Activity className="animate-spin" size={16} />
                          ) : (
                            <BrainCircuit size={16} />
                          )}
                          {analyzingId === sim.id ? 'Processando dados...' : 'Gerar Análise de Performance IA'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Global Stats Widget */}
        <div className="space-y-6">
          <div className="glass-hydro p-8 rounded-[32px] sticky top-24">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg tracking-tight">
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                <TrendingUp size={20} />
              </div>
              Métricas Globais
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Simulados Realizados</span>
                  <span className="text-white font-bold">{history.length}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-full opacity-50"></div>
                </div>
              </div>

              {history.length > 0 && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Média Geral de Acertos</span>
                      <span className="text-white font-bold">
                        {Math.round(history.reduce((acc, curr) => acc + calculateGlobalPercentage(curr), 0) / history.length)}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">Gap de Performance</h4>
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-yellow-500 mt-0.5" />
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Para atingir medicina na UFRGS (aprox. 85%), você precisa aumentar sua média em
                        <span className="text-white font-bold ml-1">
                          {Math.max(0, 85 - Math.round(history.reduce((acc, curr) => acc + calculateGlobalPercentage(curr), 0) / history.length))}%
                        </span>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Input Modal */}
      {viewMode === 'manual_entry' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <div className="glass-hydro rounded-[40px] w-full max-w-2xl shadow-[0_0_100px_rgba(37,99,235,0.2)] relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-white/20">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/20">
                  <Calculator size={22} className="text-blue-400" />
                </div>
                Registrar Simulado
              </h3>
              <button onClick={() => setViewMode('list')} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Tipo de Prova</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedExamType(ExamType.ENEM)}
                    className={`flex-1 py-4 rounded-2xl border font-bold text-lg transition-all duration-300 ${selectedExamType === ExamType.ENEM ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transform scale-[1.02]' : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-black/40'}`}
                  >
                    ENEM
                  </button>
                  <button
                    onClick={() => setSelectedExamType(ExamType.UFRGS)}
                    className={`flex-1 py-4 rounded-2xl border font-bold text-lg transition-all duration-300 ${selectedExamType === ExamType.UFRGS ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transform scale-[1.02]' : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-black/40'}`}
                  >
                    UFRGS
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveManualSimulado}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                  {examConfig[selectedExamType].areas.map((area) => (
                    <div key={area}>
                      <label className="block text-xs font-bold text-zinc-400 mb-2 pl-1">{area}</label>
                      <div className="relative group">
                        <input
                          type="number"
                          min="0"
                          max={examConfig[selectedExamType].totalPerArea}
                          value={areasInput[area] || ''}
                          onChange={(e) => handleManualInputChange(area, e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/40 text-center font-mono text-lg transition-all shadow-inner group-hover:border-white/20"
                          placeholder="0"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">
                          /{examConfig[selectedExamType].totalPerArea}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-10 bg-black/20 p-6 rounded-2xl border border-white/5">
                  <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-zinc-500" /> Nota da Redação (Opcional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="20"
                    value={essayScore}
                    onChange={(e) => setEssayScore(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 text-xl font-mono text-center placeholder:text-zinc-700 transition-all focus:bg-black/40"
                    placeholder="Ex: 920"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-zinc-200 transition-transform hover:scale-[1.01] shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-md border border-white/20 active:scale-95 text-lg"
                >
                  PROCESSAR RESULTADOS
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulados;
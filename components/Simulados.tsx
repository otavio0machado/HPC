import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, X, Activity, TrendingUp, AlertCircle, FileText, CheckCircle2, Calculator, ChevronDown, ChevronUp, BrainCircuit, Loader2, Sparkles, BookOpen, Clock, Target, ArrowRight, Check, Timer, Image as ImageIcon, PenTool, Flame, Zap, Trophy, History } from 'lucide-react';
import { authService } from '../services/authService';
import { simuladosService } from '../services/simuladosService';
import { ExamType, SimuladoResult, SimuladoArea, GeneratedQuestion, SimulationConfig } from '../types';
import { analyzeExamPerformance, generateExams } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import EssayReview from './simulados/EssayReview';
import { motion, AnimatePresence } from 'framer-motion';

const Simulados: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const [history, setHistory] = useState<SimuladoResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modes: 'list' | 'config' | 'taking' | 'result' | 'manual_entry' | 'essay'
  const [viewMode, setViewMode] = useState<'list' | 'config' | 'taking' | 'result' | 'manual_entry' | 'essay'>('list');

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-3xl mx-auto"
      >
        <button
          onClick={() => setViewMode('list')}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 backdrop-blur-md"
        >
          <ChevronDown className="rotate-90" size={20} /> Voltar para lista
        </button>

        <div className="glass-spatial p-8 relative overflow-hidden rounded-[32px]">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/5">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 p-5 rounded-2xl border border-blue-500/30 shadow-[0_0_25px_rgba(37,99,235,0.2)]">
              <Sparkles className="text-blue-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight text-spatial-title">Gerador de Simulados IA</h2>
              <p className="text-zinc-400 font-medium text-spatial-body mt-1">Configure sua prova e receba questões inéditas em segundos.</p>
            </div>
          </div>

          <div className="space-y-8">

            {/* Mode Selection */}
            <div className="bg-black/20 p-6 rounded-[24px] border border-white/5 backdrop-blur-sm">
              <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Zap size={14} /> Modo de Simulação
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSimConfig(p => ({ ...p, mode: 'Rápido' }))}
                  className={`relative overflow-hidden flex flex-col items-center justify-center gap-4 py-8 px-4 rounded-3xl border transition-all duration-300 group
                    ${simConfig.mode === 'Rápido'
                      ? 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/50 text-blue-100 shadow-[0_0_30px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/30'
                      : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.08] hover:border-white/10 hover:shadow-lg'
                    }`}
                >
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${simConfig.mode === 'Rápido' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-zinc-500 group-hover:bg-white/10 group-hover:text-blue-400'}
                  `}>
                    <Timer size={28} />
                  </div>
                  <div className="text-center z-10">
                    <span className="font-bold block text-lg mb-1">Modo Rápido</span>
                    <span className={`text-xs font-medium ${simConfig.mode === 'Rápido' ? 'text-blue-200' : 'text-zinc-500'}`}>Questões diretas</span>
                  </div>
                </button>
                <button
                  onClick={() => setSimConfig(p => ({ ...p, mode: 'Maratona' }))}
                  className={`relative overflow-hidden flex flex-col items-center justify-center gap-4 py-8 px-4 rounded-3xl border transition-all duration-300 group
                    ${simConfig.mode === 'Maratona'
                      ? 'bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/50 text-purple-100 shadow-[0_0_30px_rgba(147,51,234,0.15)] ring-1 ring-purple-500/30'
                      : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.08] hover:border-white/10 hover:shadow-lg'
                    }`}
                >
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${simConfig.mode === 'Maratona' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-zinc-500 group-hover:bg-white/10 group-hover:text-purple-400'}
                  `}>
                    <BookOpen size={28} />
                  </div>
                  <div className="text-center z-10">
                    <span className="font-bold block text-lg mb-1">Modo Maratona</span>
                    <span className={`text-xs font-medium ${simConfig.mode === 'Maratona' ? 'text-purple-200' : 'text-zinc-500'}`}>Textos longos e Imagens</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Tipo de Prova</label>
                  <div className="flex gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
                    {[ExamType.ENEM, ExamType.UFRGS].map(type => (
                      <button
                        key={type}
                        onClick={() => setSimConfig(p => ({ ...p, type }))}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300
                          ${simConfig.type === type
                            ? 'bg-zinc-800/80 text-white shadow-lg border border-white/10'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Dificuldade</label>
                  <div className="relative">
                    <select
                      value={simConfig.difficulty}
                      onChange={(e) => setSimConfig(p => ({ ...p, difficulty: e.target.value as any }))}
                      className="w-full appearance-none bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                    >
                      <option value="Fácil" className="bg-zinc-900">Fácil (Iniciante)</option>
                      <option value="Médio" className="bg-zinc-900">Médio (Padrão)</option>
                      <option value="Difícil" className="bg-zinc-900">Difícil (Desafio)</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Área de Conhecimento</label>
                  <div className="relative">
                    <select
                      value={simConfig.area}
                      onChange={(e) => setSimConfig(p => ({ ...p, area: e.target.value }))}
                      className="w-full appearance-none bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                    >
                      {['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Literatura', 'Português', 'Linguagens', 'Humanas', 'Natureza'].map(area => (
                        <option key={area} value={area} className="bg-zinc-900">{area}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Quantidade</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 5, 10].map(count => (
                      <button
                        key={count}
                        onClick={() => setSimConfig(p => ({ ...p, count }))}
                        className={`py-4 rounded-2xl border font-bold transition-all
                          ${simConfig.count === count
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                            : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300'
                          }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg py-5 rounded-2xl transition-all hover:scale-[1.01] shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border border-white/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 blur-xl" />
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span className="relative z-10">Gerando Prova...</span>
                </>
              ) : (
                <>
                  <BrainCircuit size={24} />
                  <span className="relative z-10">INICIAR SIMULADO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'taking') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8 bg-black/40 backdrop-blur-md sticky top-4 z-50 p-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <span className="text-white font-bold tracking-wide text-sm">
              {simConfig.mode === 'Maratona' ? '🔥 MODO MARATONA' : '⚡ MODO RÁPIDO'}: <span className="opacity-70 font-normal">{simConfig.type} - {simConfig.area}</span>
            </span>
          </div>
          <button onClick={() => { if (confirm("Sair do simulado? O progresso será perdido.")) setViewMode('list') }} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-colors border border-white/5">
            CANCELAR
          </button>
        </div>

        <div className="space-y-16 pb-32">
          {activeExam.map((q, qIndex) => (
            <div key={q.id} className="glass-hydro group hover:border-white/20 transition-all duration-500 relative rounded-[32px]">
              {/* Question Header */}
              <div className="px-10 pt-10 flex justify-between relative z-10">
                <span className="text-zinc-500 font-bold text-xs tracking-[0.2em] bg-black/20 px-4 py-2 rounded-full border border-white/5 shadow-inner">
                  QUESTÃO {String(qIndex + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="p-10 relative z-10">
                {/* Support Text (Marathon Mode) */}
                {q.supportText && (
                  <div className="mb-8 p-8 bg-black/20 rounded-[28px] border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">
                      <BookOpen size={14} /> Texto de Apoio
                    </div>
                    <p className="text-zinc-300 text-base leading-loose whitespace-pre-line font-serif border-l-2 border-zinc-800 pl-6">
                      {q.supportText}
                    </p>
                  </div>
                )}

                {/* Image Placeholder (Marathon Mode) */}
                {q.imageDescription && (
                  <div className="mb-8 aspect-video bg-gradient-to-br from-black/40 to-black/20 rounded-[24px] border border-white/10 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md relative overflow-hidden group/img">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <ImageIcon size={48} className="text-zinc-600 mb-6 group-hover/img:scale-110 transition-transform duration-500" />
                    <p className="text-zinc-400 text-sm italic max-w-md font-medium relative z-10">
                      "{q.imageDescription}"
                    </p>
                    <span className="text-zinc-600 text-[10px] mt-4 font-mono uppercase bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">Visualização não disponível</span>
                  </div>
                )}

                <div className="mb-12">
                  <p className="text-xl md:text-2xl text-white leading-relaxed font-medium font-serif tracking-wide">{q.text}</p>
                </div>

                <div className="space-y-4">
                  {q.options.map((opt, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => handleAnswerSelect(q.id, optIndex)}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-6 group/opt relative overflow-hidden
                        ${userAnswers[q.id] === optIndex
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_30px_rgba(37,99,235,0.15)]'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:border-white/10 hover:text-zinc-200'
                        }`}
                    >
                      <span className={`w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold border transition-all duration-300
                        ${userAnswers[q.id] === optIndex
                          ? 'bg-blue-500 border-blue-500 text-white scale-110 rotate-3 shadow-lg'
                          : 'border-zinc-700 bg-black/20 text-zinc-500 group-hover/opt:border-zinc-500 group-hover/opt:text-zinc-300'
                        }`}>
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

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-40 flex justify-center">
          <button
            onClick={handleSubmitExam}
            className="pointer-events-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-16 rounded-2xl text-lg shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all hover:scale-105 backdrop-blur-xl border border-white/20 flex items-center gap-3 group"
          >
            <CheckCircle2 className="group-hover:scale-110 transition-transform" />
            Finalizar Prova
          </button>
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'result' && examResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto pb-20"
      >
        <div className="glass-spatial p-0 overflow-hidden mb-12 relative rounded-[32px]">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none" />

          <div className="p-16 text-center border-b border-white/5 relative z-10 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="inline-flex items-center gap-2 mb-8 bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-md shadow-lg">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-zinc-300 uppercase tracking-widest text-xs font-bold">Resultado Final</span>
            </div>

            <div className="relative inline-block mb-6">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - examResult.score / 100)}
                  className={`${examResult.score >= 70 ? 'text-emerald-500' : examResult.score >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-7xl font-black tracking-tighter ${examResult.score >= 70 ? 'text-emerald-400' : examResult.score >= 50 ? 'text-yellow-400' : 'text-red-400'} drop-shadow-2xl`}>
                  {examResult.score}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-bold text-emerald-400">{examResult.correct}</span>
                <span className="text-xs uppercase tracking-wider text-emerald-500/70 font-bold">Acertos</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-bold text-white">{examResult.total}</span>
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Questões</span>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-10 bg-black/20">
            {activeExam.map((q, index) => {
              const isCorrect = userAnswers[q.id] === q.correctOptionIndex;
              return (
                <div key={q.id} className={`border-b border-white/5 pb-10 last:border-0 last:pb-0 ${isCorrect ? 'opacity-90' : 'opacity-100'}`}>
                  <div className="flex gap-6">
                    <div className={`mt-1 min-w-[48px] h-12 rounded-2xl flex items-center justify-center shadow-lg ${isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {isCorrect ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-200 font-medium mb-6 text-xl leading-relaxed font-serif">{q.text}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                          <p className="text-xs text-zinc-500 mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                            Sua Resposta
                          </p>
                          <div className={`flex items-start gap-3 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span className="font-black text-lg bg-white/5 w-8 h-8 flex items-center justify-center rounded-lg">{['A', 'B', 'C', 'D', 'E'][userAnswers[q.id] || 0]}</span>
                            <span className="font-medium text-base pt-1">{q.options[userAnswers[q.id] || 0]}</span>
                          </div>
                        </div>

                        {!isCorrect && (
                          <div className="bg-emerald-900/10 border border-emerald-500/10 rounded-2xl p-5">
                            <p className="text-xs text-emerald-600 mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                              Resposta Correta
                            </p>
                            <div className="flex items-start gap-3 text-emerald-400">
                              <span className="font-black text-lg bg-emerald-500/20 w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-500/20">{['A', 'B', 'C', 'D', 'E'][q.correctOptionIndex]}</span>
                              <span className="font-medium text-base pt-1">{q.options[q.correctOptionIndex]}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 bg-blue-900/10 p-6 rounded-2xl border border-blue-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 bg-blue-500/5 rounded-full blur-2xl" />
                        <strong className="text-blue-300 block mb-3 flex items-center gap-2 uppercase text-xs tracking-wider font-bold relative z-10">
                          <BrainCircuit size={16} /> Explicação
                        </strong>
                        <div className="leading-relaxed text-zinc-300 text-sm md:text-base relative z-10">{q.explanation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-8 bg-black/40 border-t border-white/10 flex justify-end gap-4 backdrop-blur-md">
            <button onClick={() => setViewMode('list')} className="text-zinc-400 hover:text-white px-6 py-3 hover:bg-white/5 rounded-xl transition-all font-bold tracking-wide border border-transparent hover:border-white/10">Descartar</button>
            <button
              onClick={handleSaveAIResult}
              className="bg-white text-black font-black py-4 px-10 rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 backdrop-blur-md border border-white/20 active:scale-95"
            >
              <CheckCircle2 size={20} /> SALVAR NO HISTÓRICO
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- DEFAULT LIST VIEW (Dashboard) ---

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
              <Clock className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-lg font-sans">Simulados</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium max-w-2xl text-spatial-body">
            Domine o formato da prova. O que não é medido não pode ser <span className="text-blue-600 dark:text-blue-400">melhorado</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <button
              onClick={() => { setViewMode('essay') }}
              className="glass-button bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3 transition-all hover:-translate-y-0.5"
            >
              <PenTool size={18} /> <span className="font-bold">Redação AI</span>
            </button>
          )}

          <button
            onClick={() => { setViewMode('manual_entry') }}
            className="glass-button bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3 transition-all hover:-translate-y-0.5"
          >
            <Calculator size={18} /> <span className="font-bold">Lançar Nota</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setViewMode('config')}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black font-bold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/20"
            >
              <BrainCircuit size={20} /> <span className="tracking-tight">GERAR IA</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column: History */}
        <div className="xl:col-span-2 space-y-6">
          {history.length === 0 ? (
            <div className="glass-spatial border-dashed border-white/10 p-16 text-center rounded-[32px]">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                <History size={32} className="text-zinc-600" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Sem histórico recente</h3>
              <p className="text-zinc-500">Realize seu primeiro simulado para desbloquear métricas de performance.</p>
            </div>
          ) : (
            history.map((sim) => {
              const globalPct = calculateGlobalPercentage(sim);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={sim.id}
                  className="glass-spatial group hover:border-white/20 transition-all duration-300 overflow-visible relative rounded-[32px]"
                >
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-white/5
                          ${globalPct >= 80 ? 'bg-emerald-500/10 text-emerald-400' : globalPct >= 60 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}
                        `}>
                          {globalPct}%
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${sim.examType === ExamType.ENEM ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                              {sim.examType}
                            </span>
                            <span className="text-zinc-500 text-sm font-medium">{sim.date}</span>
                          </div>
                          <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Simulado Geral</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sim.essayScore && (
                          <div className="px-4 py-2 bg-white/50 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5 flex items-center gap-2">
                            <PenTool size={14} className="text-pink-500 dark:text-pink-400" />
                            <span className="text-zinc-600 dark:text-zinc-400 text-sm font-bold">Redação:</span>
                            <span className="text-zinc-900 dark:text-white font-bold">{sim.essayScore}</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleDelete(sim.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                      {sim.areas.map(area => {
                        const pct = Math.round((area.correct / area.total) * 100);
                        return (
                          <div key={area.name} className="bg-black/20 p-3 rounded-xl border border-white/5 hover:bg-black/40 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] uppercase font-bold text-zinc-500 truncate w-20" title={area.name}>{area.name}</span>
                              <span className={`text-xs font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {area.correct}/{area.total}
                              </span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className={`h-full ${getBarColor(pct)}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* AI Analysis Section */}
                    <div className="border-t border-white/5 pt-6 relative">
                      {sim.aiAnalysis ? (
                        <div className="animate-in fade-in duration-500 bg-blue-900/5 rounded-2xl p-5 border border-blue-500/10">
                          <div className="flex items-center gap-2 mb-3 text-blue-300 font-bold text-xs uppercase tracking-widest">
                            <BrainCircuit size={14} /> Análise de Performance
                          </div>
                          <div className="text-sm text-zinc-300 leading-relaxed font-medium">
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
                          className="w-full py-4 border border-dashed border-zinc-700/50 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 hover:border-zinc-500 transition-all text-sm font-bold flex items-center justify-center gap-3 group"
                        >
                          {analyzingId === sim.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Sparkles size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                          )}
                          {analyzingId === sim.id ? 'Analisando dados...' : 'Gerar Análise com IA'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right Column: Global Stats Widget */}
        <div className="space-y-6">
          <div className="glass-spatial p-8 sticky top-24 rounded-[32px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/20">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-white font-bold text-lg tracking-tight">Métricas Globais</h3>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-zinc-400">Total de Simulados</span>
                  <span className="text-white font-bold">{history.length}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full opacity-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              {history.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                      <div className="text-3xl font-black text-white mb-1">
                        {Math.round(history.reduce((acc, curr) => acc + calculateGlobalPercentage(curr), 0) / history.length)}%
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Média Geral</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                      <div className="text-3xl font-black text-white mb-1">
                        {history.reduce((acc, curr) => acc + curr.areas.reduce((a, c) => a + c.total, 0), 0)}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Questões</div>
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-orange-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 bg-orange-500/5 rounded-full blur-xl" />
                    <h4 className="text-xs text-orange-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2 relative z-10">
                      <Flame size={14} /> Gap de Aprovação
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed relative z-10 font-medium">
                      Meta Medicina UFRGS: <span className="text-white font-bold">85%</span>.
                      Faltam <span className="text-white font-bold border-b border-orange-500/50 pb-0.5">
                        {Math.max(0, 85 - Math.round(history.reduce((acc, curr) => acc + calculateGlobalPercentage(curr), 0) / history.length))}%
                      </span> para o objetivo.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Essay Review Mode */}
      {viewMode === 'essay' && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="min-h-screen p-6 md:p-12">
            <button onClick={() => setViewMode('list')} className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 backdrop-blur-md">
              <ChevronDown className="rotate-90" size={20} /> Voltar
            </button>
            <EssayReview />
          </div>
        </div>
      )}

      {/* Manual Input Modal */}
      <AnimatePresence>
        {viewMode === 'manual_entry' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-spatial rounded-[40px] w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-xl font-black text-white flex items-center gap-4 tracking-tight">
                  <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/20 text-blue-400">
                    <Calculator size={22} />
                  </div>
                  Registrar Simulado
                </h3>
                <button onClick={() => setViewMode('list')} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="mb-8 p-1 bg-black/20 rounded-2xl border border-white/5 inline-flex w-full">
                  {[ExamType.ENEM, ExamType.UFRGS].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedExamType(type)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300
                        ${selectedExamType === type
                          ? 'bg-zinc-800 text-white shadow-lg'
                          : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSaveManualSimulado}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {examConfig[selectedExamType].areas.map((area) => (
                      <div key={area} className="group">
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 pl-1 uppercase tracking-widest group-hover:text-blue-400 transition-colors">{area}</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={examConfig[selectedExamType].totalPerArea}
                            value={areasInput[area] || ''}
                            onChange={(e) => handleManualInputChange(area, e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] text-center font-mono text-lg transition-all"
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

                  <div className="border-t border-white/5 pt-6 pb-2 mb-6">
                    <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest pl-1">Nota da Redação (Opcional)</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={essayScore}
                      onChange={(e) => setEssayScore(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.06] font-mono text-lg transition-all"
                      placeholder="Ex: 920"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                  >
                    SALVAR RESULTADO
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Simulados;
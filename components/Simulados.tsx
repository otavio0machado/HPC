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
        <button onClick={() => setViewMode('list')} className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ChevronDown className="rotate-90" size={20} /> Voltar para lista
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-500/20">
              <Sparkles className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Gerador de Simulados IA</h2>
              <p className="text-zinc-400">Crie provas personalizadas com questões inéditas.</p>
            </div>
          </div>

          <div className="space-y-6">

            {/* Mode Selection */}
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
              <label className="block text-sm font-medium text-zinc-400 mb-3">Modo de Simulação</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSimConfig(p => ({ ...p, mode: 'Rápido' }))}
                  className={`flex flex-col items-center gap-2 py-4 px-4 rounded-xl border transition-all ${simConfig.mode === 'Rápido' ? 'bg-blue-600/20 border-blue-500 text-blue-100' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  <Timer size={24} />
                  <span className="font-bold">Modo Rápido</span>
                  <span className="text-xs opacity-70">Questões diretas</span>
                </button>
                <button
                  onClick={() => setSimConfig(p => ({ ...p, mode: 'Maratona' }))}
                  className={`flex flex-col items-center gap-2 py-4 px-4 rounded-xl border transition-all ${simConfig.mode === 'Maratona' ? 'bg-purple-600/20 border-purple-500 text-purple-100' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  <BookOpen size={24} />
                  <span className="font-bold">Modo Maratona</span>
                  <span className="text-xs opacity-70">Textos longos e Imagens</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tipo de Prova</label>
              <div className="flex gap-3">
                {[ExamType.ENEM, ExamType.UFRGS].map(type => (
                  <button
                    key={type}
                    onClick={() => setSimConfig(p => ({ ...p, type }))}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold transition-all ${simConfig.type === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Área de Conhecimento</label>
              <select
                value={simConfig.area}
                onChange={(e) => setSimConfig(p => ({ ...p, area: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                {['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Literatura', 'Português', 'Linguagens', 'Humanas', 'Natureza'].map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Dificuldade</label>
                <select
                  value={simConfig.difficulty}
                  onChange={(e) => setSimConfig(p => ({ ...p, difficulty: e.target.value as any }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nº Questões</label>
                <select
                  value={simConfig.count}
                  onChange={(e) => setSimConfig(p => ({ ...p, count: parseInt(e.target.value) }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={3}>3 Questões</option>
                  <option value={5}>5 Questões</option>
                  <option value={10}>10 Questões</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.01] shadow-xl flex items-center justify-center gap-2 mt-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Gerando Prova...
                </>
              ) : (
                <>
                  <BrainCircuit size={20} /> Gerar Simulado Agora
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
            <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors">

              {/* Question Header / Number */}
              <div className="px-8 pt-8 flex justify-between">
                <span className="text-zinc-500 font-mono text-sm">QUESTÃO {qIndex + 1}</span>
              </div>

              <div className="p-8">
                {/* Support Text (Marathon Mode) */}
                {q.supportText && (
                  <div className="mb-6 p-6 bg-zinc-950 rounded-xl border-l-4 border-zinc-700">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
                      <BookOpen size={14} /> Texto de Apoio
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-serif">
                      {q.supportText}
                    </p>
                  </div>
                )}

                {/* Image Placeholder (Marathon Mode) */}
                {q.imageDescription && (
                  <div className="mb-6 aspect-video bg-black/50 rounded-xl border border-dashed border-zinc-700 flex flex-col items-center justify-center p-8 text-center">
                    <ImageIcon size={48} className="text-zinc-700 mb-4" />
                    <p className="text-zinc-500 text-sm italic max-w-md">
                      "{q.imageDescription}"
                    </p>
                    <span className="text-zinc-700 text-xs mt-2 font-mono uppercase">[Imagem da Questão]</span>
                  </div>
                )}

                <div className="mb-8">
                  <p className="text-lg text-white leading-relaxed font-serif font-medium">{q.text}</p>
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => handleAnswerSelect(q.id, optIndex)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${userAnswers[q.id] === optIndex
                          ? 'bg-blue-900/20 border-blue-500/50 text-blue-100'
                          : 'bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                        }`}
                    >
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border ${userAnswers[q.id] === optIndex ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700 text-zinc-600'}`}>
                        {['A', 'B', 'C', 'D', 'E'][optIndex]}
                      </span>
                      <span className="flex-1 text-sm pt-0.5">{opt}</span>
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
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg shadow-green-900/20 transition-all hover:scale-105"
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 text-center border-b border-zinc-800">
            <h2 className="text-zinc-400 uppercase tracking-widest text-sm font-bold mb-4">Resultado do Simulado</h2>
            <div className="flex justify-center items-end gap-2 mb-2">
              <span className={`text-7xl font-black ${examResult.score >= 70 ? 'text-emerald-400' : examResult.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {examResult.score}%
              </span>
              <span className="text-zinc-500 font-bold mb-4 text-xl">acertos</span>
            </div>
            <p className="text-zinc-400">Você acertou <strong className="text-white">{examResult.correct}</strong> de <strong className="text-white">{examResult.total}</strong> questões.</p>
          </div>

          <div className="p-8 space-y-8 bg-zinc-950/30">
            {activeExam.map((q, index) => {
              const isCorrect = userAnswers[q.id] === q.correctOptionIndex;
              return (
                <div key={q.id} className={`border-b border-zinc-800 pb-8 last:border-0 last:pb-0 ${isCorrect ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
                  <div className="flex gap-4">
                    <div className={`mt-1 min-w-[32px] h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {isCorrect ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-300 font-medium mb-3">{q.text}</p>

                      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 mb-3">
                        <p className="text-sm text-zinc-500 mb-2 font-bold uppercase text-[10px] tracking-wider">Sua Resposta</p>
                        <div className={`flex items-center gap-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                          <span className="font-bold">{['A', 'B', 'C', 'D', 'E'][userAnswers[q.id] || 0]})</span>
                          <span>{q.options[userAnswers[q.id] || 0]}</span>
                        </div>
                      </div>

                      {!isCorrect && (
                        <div className="bg-emerald-900/10 border border-emerald-500/10 rounded-lg p-4 mb-3">
                          <p className="text-sm text-emerald-700 mb-2 font-bold uppercase text-[10px] tracking-wider">Resposta Correta</p>
                          <div className="flex items-center gap-2 text-emerald-400">
                            <span className="font-bold">{['A', 'B', 'C', 'D', 'E'][q.correctOptionIndex]})</span>
                            <span>{q.options[q.correctOptionIndex]}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 text-sm text-zinc-400 bg-zinc-900 p-4 rounded-xl border border-zinc-800/50">
                        <strong className="text-zinc-300 block mb-1">Explicação:</strong>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center">
            <button onClick={() => setViewMode('list')} className="text-zinc-500 hover:text-white text-sm">Descartar Resultado</button>
            <button
              onClick={handleSaveAIResult}
              className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-zinc-200 transition-transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> Salvar no Histórico
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Central de Simulados</h2>
          </div>
          <p className="text-zinc-400 text-sm">O que não é medido não pode ser melhorado.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setViewMode('manual_entry') }}
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700"
          >
            <Calculator size={18} /> Lançar Manual
          </button>

          <button
            onClick={() => setViewMode('config')}
            className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl"
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
            <div className="border border-dashed border-zinc-800 rounded-2xl p-12 text-center bg-zinc-900/30">
              <Activity size={48} className="mx-auto mb-4 text-zinc-700" />
              <h3 className="text-white font-bold text-lg">Sem dados de performance</h3>
              <p className="text-zinc-500 mt-2">Adicione seu primeiro simulado para gerar inteligência de prova.</p>
            </div>
          ) : (
            history.map((sim) => {
              const globalPct = calculateGlobalPercentage(sim);
              return (
                <div key={sim.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group">
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
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl sticky top-24">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} /> Métricas Globais
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator size={20} className="text-blue-500" /> Registrar Simulado
              </h3>
              <button onClick={() => setViewMode('list')} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="mb-6">
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Tipo de Prova</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedExamType(ExamType.ENEM)}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${selectedExamType === ExamType.ENEM ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'}`}
                  >
                    ENEM
                  </button>
                  <button
                    onClick={() => setSelectedExamType(ExamType.UFRGS)}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${selectedExamType === ExamType.UFRGS ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'}`}
                  >
                    UFRGS
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveManualSimulado}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {examConfig[selectedExamType].areas.map((area) => (
                    <div key={area}>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">{area}</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={examConfig[selectedExamType].totalPerArea}
                          value={areasInput[area] || ''}
                          onChange={(e) => handleManualInputChange(area, e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-center font-mono"
                          placeholder="0"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">
                          /{examConfig[selectedExamType].totalPerArea}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nota da Redação (Opcional)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="20"
                    value={essayScore}
                    onChange={(e) => setEssayScore(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ex: 920"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-transform hover:scale-[1.01] shadow-xl"
                >
                  Processar Resultados
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
import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, X, Activity, TrendingUp, AlertCircle, FileText, CheckCircle2, Calculator, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { authService } from '../services/authService';
import { ExamType, SimuladoResult, SimuladoArea } from '../types';
import { analyzeExamPerformance } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Simulados: React.FC = () => {
  const [history, setHistory] = useState<SimuladoResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  
  // Form State
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(ExamType.ENEM);
  const [essayScore, setEssayScore] = useState<string>('');
  const [areasInput, setAreasInput] = useState<Record<string, string>>({});

  const STORAGE_KEY = authService.getUserStorageKey('hpc_simulados_history');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load simulados");
      }
    }
  }, []);

  const saveHistory = (newHistory: SimuladoResult[]) => {
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Configuration for Exam Inputs
  const examConfig = {
    [ExamType.ENEM]: {
      areas: ['Linguagens', 'Humanas', 'Natureza', 'Matemática'],
      totalPerArea: 45
    },
    [ExamType.UFRGS]: {
      areas: ['Física', 'Literatura', 'Ling. Estrangeira', 'Português', 'Biologia', 'Química', 'Geografia', 'História', 'Matemática'],
      totalPerArea: 25
    },
    [ExamType.BOTH]: { areas: [], totalPerArea: 0 } // Not used for input
  };

  const handleInputChange = (area: string, value: string) => {
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

  const handleSaveSimulado = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const config = examConfig[selectedExamType];
    const areas: SimuladoArea[] = config.areas.map(name => ({
      name,
      correct: parseInt(areasInput[name] || '0'),
      total: config.totalPerArea
    }));

    const newSimulado: SimuladoResult = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('pt-BR'),
      examType: selectedExamType,
      areas,
      essayScore: essayScore ? parseInt(essayScore) : undefined,
    };

    const newHistory = [newSimulado, ...history];
    saveHistory(newHistory);
    setIsModalOpen(false);
    setAreasInput({});
    setEssayScore('');

    // Auto trigger analysis for the new exam
    handleAnalyze(newSimulado.id, newSimulado);
  };

  const handleAnalyze = async (id: string, simuladoData?: SimuladoResult) => {
    setAnalyzingId(id);
    const simulado = simuladoData || history.find(h => h.id === id);
    
    if (!simulado) return;

    try {
      const analysis = await analyzeExamPerformance(simulado);
      
      const updatedHistory = history.map(h => 
        h.id === id ? { ...h, aiAnalysis: analysis } : h
      );
      
      // If we passed explicit data (newly created), we need to update the state correctly
      // actually history state might not have updated yet in the closure if called immediately
      // simpler to just map the existing state or the provided one.
      
      if (simuladoData) {
         // It was a new save, re-read current state logic might be tricky due to closures
         // So we trust the functional update
         setHistory(prev => prev.map(h => h.id === id ? { ...h, aiAnalysis: analysis } : h));
         const currentSaved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
         const updatedSaved = currentSaved.map((h: SimuladoResult) => h.id === id ? { ...h, aiAnalysis: analysis } : h);
         localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSaved));
      } else {
         saveHistory(updatedHistory);
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Remover este simulado?")) {
      const newHistory = history.filter(h => h.id !== id);
      saveHistory(newHistory);
    }
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
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl"
        >
          <Plus size={20} /> Lançar Novo Simulado
        </button>
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
                                  strong: ({node, ...props}) => <span className="text-white font-bold" {...props} />,
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

      {/* Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator size={20} className="text-blue-500" /> Registrar Simulado
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
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

              <form onSubmit={handleSaveSimulado}>
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
                          onChange={(e) => handleInputChange(area, e.target.value)}
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
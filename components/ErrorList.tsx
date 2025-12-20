import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Brain, Eye, Clock, X, CheckCircle2, Search, BookOpen, BarChart3 } from 'lucide-react';
import { authService } from '../services/authService';
import { ErrorEntry } from '../types';

const subjects = [
  'Matemática', 'Física', 'Química', 'Biologia', 
  'História', 'Geografia', 'Português', 'Inglês'
];

const causes = [
  { id: 'Conteúdo', icon: <BookOpen size={16} />, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { id: 'Atenção', icon: <Eye size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { id: 'Interpretação', icon: <Brain size={16} />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { id: 'Tempo', icon: <Clock size={16} />, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
];

const ErrorList: React.FC = () => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  
  // Dynamic storage key based on logged user
  const STORAGE_KEY = authService.getUserStorageKey('hpc_error_list');

  // Form State
  const [subject, setSubject] = useState(subjects[0]);
  const [description, setDescription] = useState('');
  const [cause, setCause] = useState<ErrorEntry['cause']>('Conteúdo');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setErrors(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load errors");
      }
    }
  }, []);

  const saveErrors = (newErrors: ErrorEntry[]) => {
    setErrors(newErrors);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newErrors));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newError: ErrorEntry = {
      id: crypto.randomUUID(),
      subject,
      description,
      cause,
      date: new Date().toLocaleDateString('pt-BR')
    };

    saveErrors([newError, ...errors]);
    setIsModalOpen(false);
    setDescription('');
    setCause('Conteúdo');
  };

  const handleDelete = (id: string) => {
    const newErrors = errors.filter(e => e.id !== id);
    saveErrors(newErrors);
  };

  const filteredErrors = errors.filter(e => 
    e.description.toLowerCase().includes(filter.toLowerCase()) || 
    e.subject.toLowerCase().includes(filter.toLowerCase())
  );

  // Stats
  const totalErrors = errors.length;
  
  // Calculate counts safely with explicit typing
  const causeCounts = errors.reduce((acc: Record<string, number>, curr) => {
    acc[curr.cause] = (acc[curr.cause] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const subjectCounts = errors.reduce((acc: Record<string, number>, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const mostCommonCause = errors.length > 0 
    ? Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0][0]
    : '-';
    
  const mostFrequentSubject = errors.length > 0 
    ? Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Lista de Erros</h2>
          </div>
          <p className="text-zinc-400 text-sm">O segredo da evolução é não cometer o mesmo erro duas vezes.</p>
        </div>
        
        <div className="flex gap-3">
            {mostFrequentSubject && (
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 flex flex-col items-center justify-center min-w-[140px]">
                 <span className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1"><AlertTriangle size={10} /> Maior Ofensor</span>
                 <span className="text-sm font-bold text-white">{mostFrequentSubject[0]} ({mostFrequentSubject[1]})</span>
               </div>
            )}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-xs text-zinc-500 uppercase font-bold">Total</span>
            <span className="text-xl font-bold text-white">{totalErrors}</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-xs text-zinc-500 uppercase font-bold">Maior Motivo</span>
            <span className="text-sm font-bold text-white truncate max-w-[100px]">{mostCommonCause}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar erro..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-600"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20 whitespace-nowrap"
        >
          <Plus size={20} /> Novo Erro
        </button>
      </div>

      {filteredErrors.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4 text-zinc-600">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-zinc-400 text-lg">Nenhum erro registrado.</p>
          <p className="text-zinc-600 text-sm mt-1">Isso é bom, ou você não está fazendo simulados o suficiente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredErrors.map((error) => {
            const causeData = causes.find(c => c.id === error.cause) || causes[0];
            return (
              <div key={error.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group relative">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700">
                    {error.subject}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border ${causeData.bg} ${causeData.color} ${causeData.border}`}>
                    {causeData.icon}
                    {error.cause}
                  </div>
                </div>
                
                <p className="text-zinc-200 text-sm leading-relaxed mb-4 min-h-[60px]">
                  {error.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <span className="text-xs text-zinc-600">{error.date}</span>
                  <button 
                    onClick={() => handleDelete(error.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> Registrar Erro
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Matéria</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Motivo Principal</label>
                  <select 
                    value={cause}
                    onChange={(e) => setCause(e.target.value as ErrorEntry['cause'])}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    {causes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Descrição do Erro</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que exatamente você errou? (Ex: Esqueci de converter km/h para m/s)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 min-h-[100px] resize-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-zinc-400 hover:text-white font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Salvar Erro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorList;
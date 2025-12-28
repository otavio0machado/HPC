import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Brain, Eye, Clock, X, CheckCircle2, Search, BookOpen, User, Image as ImageIcon, Sparkles, Loader2, Edit2, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, AlertOctagon, ChevronDown } from 'lucide-react';
import { authService } from '../services/authService';
import { analyzeErrorImage } from '../services/geminiService';
import { flashcardService, Flashcard } from '../services/flashcardService';
import { toast } from 'sonner';
import { ErrorEntry } from '../types';

const subjects = [
  'Matemática', 'Física', 'Química', 'Biologia',
  'História', 'Geografia', 'Português', 'Inglês', 'Filosofia', 'Sociologia'
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

  // View & Filter States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterText, setFilterText] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterCause, setFilterCause] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'subject'>('date-desc');

  // Dynamic storage key based on logged user
  const STORAGE_KEY = authService.getUserStorageKey('hpc_error_list');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subject, setSubject] = useState(subjects[0]);
  const [description, setDescription] = useState('');
  const [cause, setCause] = useState<ErrorEntry['cause']>('Conteúdo');

  // AI Analysis State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedFlashcards, setSuggestedFlashcards] = useState<{ front: string, back: string, selected: boolean }[]>([]);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeErrorImage(imagePreview);
      if (result) {
        setDescription(result.description);
        if (subjects.includes(result.subject)) {
          setSubject(result.subject);
        }
        if (['Conteúdo', 'Atenção', 'Interpretação', 'Tempo'].includes(result.cause)) {
          setCause(result.cause as any);
        }

        setSuggestedFlashcards(result.flashcards.map(f => ({ ...f, selected: true })));
        toast.success("Análise concluída com sucesso!");
      } else {
        toast.error("Não foi possível analisar a imagem.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro na análise.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openModal = (errorToEdit?: ErrorEntry) => {
    if (errorToEdit) {
      setEditingId(errorToEdit.id);
      setSubject(errorToEdit.subject);
      setDescription(errorToEdit.description);
      setCause(errorToEdit.cause);
      setImagePreview(null); // Reset image for edit
      setSuggestedFlashcards([]);
    } else {
      setEditingId(null);
      setSubject(subjects[0]);
      setDescription('');
      setCause('Conteúdo');
      setImagePreview(null);
      setSuggestedFlashcards([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    let newErrors = [...errors];

    if (editingId) {
      // Update existing
      newErrors = newErrors.map(err =>
        err.id === editingId
          ? { ...err, subject, description, cause }
          : err
      );
      toast.success("Erro atualizado!");
    } else {
      // Create new
      const newError: ErrorEntry = {
        id: crypto.randomUUID(),
        subject,
        description,
        cause,
        date: new Date().toLocaleDateString('pt-BR')
      };
      newErrors = [newError, ...newErrors];

      // Handle Flashcards only on creation
      const selectedCards = suggestedFlashcards.filter(f => f.selected);
      if (selectedCards.length > 0) {
        try {
          await Promise.all(selectedCards.map(card =>
            flashcardService.createFlashcard({
              front: card.front,
              back: card.back,
              folderPath: ['Erros', subject],
              nextReview: Date.now(),
              interval: 0,
              ease: 2.5,
              repetitions: 0
            } as Flashcard)
          ));
          toast.success(`${selectedCards.length} flashcards criados!`);
        } catch (e) {
          console.error("Error creating flashcards", e);
          toast.error("Erro ao criar alguns flashcards.");
        }
      } else {
        toast.success("Erro registrado!");
      }
    }

    saveErrors(newErrors);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const newErrors = errors.filter(e => e.id !== id);
    saveErrors(newErrors);
    toast.success("Erro removido.");
  };

  // Filter and Sort Logic
  const filteredErrors = errors
    .filter(e => {
      const matchesText = e.description.toLowerCase().includes(filterText.toLowerCase()) ||
        e.subject.toLowerCase().includes(filterText.toLowerCase());
      const matchesSubject = filterSubject ? e.subject === filterSubject : true;
      const matchesCause = filterCause ? e.cause === filterCause : true;
      return matchesText && matchesSubject && matchesCause;
    });

  const sortedErrors = [...filteredErrors].sort((a, b) => {
    // Sort logic
    if (sortBy === 'subject') return a.subject.localeCompare(b.subject);

    const parseDate = (d: string) => {
      const parts = d.split('/');
      if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
      return 0;
    };

    if (sortBy === 'date-desc') return parseDate(b.date) - parseDate(a.date);
    if (sortBy === 'date-asc') return parseDate(a.date) - parseDate(b.date);
    return 0;
  });


  // Stats
  const totalErrors = errors.length;
  const causeCounts = errors.reduce((acc: Record<string, number>, curr) => {
    acc[curr.cause] = (acc[curr.cause] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const subjectCounts = errors.reduce((acc: Record<string, number>, curr) => {
    acc[curr.subject] = (acc[curr.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentSubject = errors.length > 0 ? Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0] : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 animate-pulse" />
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 border border-white/20">
                <AlertOctagon className="text-white" size={20} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-sm">Caderno de Erros</h2>
          </div>
          <p className="text-zinc-400 text-base font-medium pl-14">Transforme falhas em aprendizado.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {mostFrequentSubject && (
            <div className="glass-spatial rounded-[24px] pl-5 pr-8 py-4 flex flex-col justify-center min-w-[140px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-red-500/10 blur-2xl rounded-full translate-y-1/2 translate-x-1/2" />

              <span className="text-[10px] text-red-300 uppercase font-bold tracking-wider mb-1">Atenção Necessária</span>
              <span className="text-2xl font-black text-white leading-none mb-1">{mostFrequentSubject[0]}</span>
              <span className="text-xs text-zinc-400 font-medium">{mostFrequentSubject[1]} erros registrados</span>
            </div>
          )}
          <div className="glass-spatial rounded-[24px] px-8 py-4 flex flex-col justify-center min-w-[120px] items-start relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Total de Erros</span>
            <span className="text-3xl font-black text-white leading-none">{totalErrors}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-lg group-hover:bg-blue-500/10 transition-colors opacity-0 group-hover:opacity-100" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-blue-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar nos seus erros..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full glass-card bg-zinc-900/30 hover:bg-zinc-900/50 border-white/5 hover:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 shadow-sm relative z-10"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative group">
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-zinc-300" size={14} />
              <select
                className="glass-card bg-zinc-900/30 border-white/5 text-zinc-300 text-sm rounded-2xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-white/20 appearance-none min-w-[140px] hover:bg-zinc-900/50 transition-all cursor-pointer font-medium"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="" className="bg-zinc-900">Matéria</option>
                {subjects.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
              </select>
            </div>

            <div className="relative group">
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-zinc-300" size={14} />
              <select
                className="glass-card bg-zinc-900/30 border-white/5 text-zinc-300 text-sm rounded-2xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-white/20 appearance-none min-w-[140px] hover:bg-zinc-900/50 transition-all cursor-pointer font-medium"
                value={filterCause}
                onChange={(e) => setFilterCause(e.target.value)}
              >
                <option value="" className="bg-zinc-900">Motivo</option>
                {causes.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.id}</option>)}
              </select>
            </div>

            <div className="relative group">
              <ArrowUpDown size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-zinc-300" />
              <select
                className="glass-card bg-zinc-900/30 border-white/5 text-zinc-300 text-sm rounded-2xl pl-10 pr-8 py-3.5 focus:outline-none focus:border-white/20 appearance-none hover:bg-zinc-900/50 transition-all cursor-pointer font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date-desc" className="bg-zinc-900">Recentes</option>
                <option value="date-asc" className="bg-zinc-900">Antigos</option>
                <option value="subject" className="bg-zinc-900">Matéria</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-start">
          <div className="flex items-center glass-card bg-white/5 border border-white/10 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>

          <button
            onClick={() => openModal()}
            className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(220,38,38,0.4)] whitespace-nowrap text-sm border border-white/10"
          >
            <Plus size={18} /> Registrar Novo Erro
          </button>
        </div>
      </div>

      {/* Content */}
      {sortedErrors.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl bg-[var(--glass-bg)] flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center shadow-inner mb-4">
            <CheckCircle2 size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-lg font-medium">Nenhum erro encontrado.</p>
          <p className="text-zinc-600 text-sm mt-1">Ajuste os filtros ou registre um novo erro para começar o tracking.</p>
        </div>
      ) : (
        <div className={`
          ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3'}
        `}>
          {sortedErrors.map((error) => {
            const causeData = causes.find(c => c.id === error.cause) || causes[0];
            return (
              <div key={error.id} className={`
                glass-card rounded-[28px] hover:border-white/30 transition-all duration-300 group relative
                ${viewMode === 'grid' ? 'p-6 flex flex-col hover:shadow-2xl hover:-translate-y-1' : 'p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/5'}
              `}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Matéria</span>
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-900/50 text-xs font-bold text-zinc-200 border border-white/10 backdrop-blur-md">
                          {error.subject}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${causeData.bg} ${causeData.color} ${causeData.border}`}>
                        {causeData.icon}
                        {error.cause}
                      </div>
                    </div>

                    <div className="flex-1 bg-zinc-950/20 rounded-xl p-4 border border-white/5 mb-4 group-hover:border-white/10 transition-colors">
                      <p className="text-zinc-300 text-sm leading-relaxed min-h-[60px] line-clamp-4 font-medium">
                        {error.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        <span className="text-xs text-zinc-500 font-mono font-medium">{error.date}</span>
                      </div>
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(error)}
                          className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(error.id)}
                          className="text-zinc-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0 flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-white/5 pr-6">
                        <span className="text-xs font-mono text-zinc-500">{error.date.split('/')[0]}/{error.date.split('/')[1]}</span>
                        <span className="text-[10px] font-bold text-zinc-600">{error.date.split('/')[2]}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-sm font-bold text-white">{error.subject}</span>
                          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${causeData.bg} ${causeData.color} ${causeData.border}`}>
                            {error.cause}
                          </div>
                        </div>
                        <p className="text-zinc-400 text-sm truncate font-medium pr-4">{error.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(error)}
                        className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(error.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="glass-hydro rounded-[36px] w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5 flex-shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                {editingId ? 'Editar Erro' : 'Registrar Erro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* Image Upload Section */}
              {!editingId && (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Foto da Questão (IA)</label>
                  <div className="flex items-start gap-4">
                    <label className="flex-shrink-0 w-32 h-32 bg-zinc-950/50 border border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative shadow-inner">
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      {imagePreview ? (
                        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="text-white" size={20} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                            <ImageIcon size={20} className="text-zinc-500 group-hover:text-blue-400" />
                          </div>
                          <span className="text-[10px] text-zinc-500 group-hover:text-blue-400 font-bold uppercase tracking-wide">Inserir Foto</span>
                        </>
                      )}
                    </label>

                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Envie uma foto do erro. Nossa IA analisará a questão, identificará a causa e criará flashcards automaticamente.
                      </p>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
                        >
                          {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          {isAnalyzing ? 'Analisando...' : 'Analisar com IA'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-wider">Matéria</label>
                  <div className="relative">
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm appearance-none font-medium transition-all"
                    >
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-wider">Motivo do Erro</label>
                  <div className="relative">
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <select
                      value={cause}
                      onChange={(e) => setCause(e.target.value as ErrorEntry['cause'])}
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm appearance-none font-medium transition-all"
                    >
                      {causes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-wider">Descrição do Erro</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que aconteceu... (Ex: Confundi a fórmula de Bhaskara)"
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 min-h-[140px] resize-none text-sm placeholder:text-zinc-600 leading-relaxed custom-scrollbar shadow-inner"
                />
              </div>

              {/* Suggested Flashcards */}
              {suggestedFlashcards.length > 0 && !editingId && (
                <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-xs font-bold text-purple-200 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Brain size={14} /> Flashcards Sugeridos
                  </h4>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {suggestedFlashcards.map((card, idx) => (
                      <div key={idx} className={`p-3 rounded-xl flex gap-3 items-start cursor-pointer transition-all border ${card.selected ? 'bg-purple-600/20 border-purple-500/50' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                        onClick={() => {
                          const newCards = [...suggestedFlashcards];
                          newCards[idx].selected = !newCards[idx].selected;
                          setSuggestedFlashcards(newCards);
                        }}>
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${card.selected ? 'bg-purple-500 border-purple-500' : 'border-zinc-600 bg-transparent'}`}>
                          {card.selected && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-zinc-200 mb-1">P: {card.front}</div>
                          <div className="text-xs text-zinc-500 font-medium">R: {card.back}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="p-5 border-t border-white/5 bg-zinc-950/50 flex gap-3 flex-shrink-0 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-zinc-400 hover:text-white font-bold transition-colors text-sm rounded-xl hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors text-sm shadow-xl"
              >
                {editingId ? 'Salvar Alterações' : 'Salvar Erro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorList;
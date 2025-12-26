import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Brain, Eye, Clock, X, CheckCircle2, Search, BookOpen, User, Image as ImageIcon, Sparkles, Loader2, Edit2, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, AlertOctagon } from 'lucide-react';
import { authService } from '../services/authService';
import { analyzeErrorImage } from '../services/geminiService';
import { flashcardService, Flashcard } from '../services/flashcardService';
import { toast } from 'sonner';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
            <h2 className="text-2xl font-bold text-white tracking-tight">O Caderno de Erros</h2>
          </div>
          <p className="text-zinc-400 text-sm">Identifique padrões e elimine suas fraquezas.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {mostFrequentSubject && (
            <div className="bg-gradient-to-br from-red-900/50 to-red-950/50 border border-red-500/20 rounded-2xl px-5 py-3 flex flex-col items-center justify-center min-w-[120px] shadow-lg shadow-red-900/20 backdrop-blur-sm">
              <span className="text-[10px] text-red-300 uppercase font-bold flex items-center gap-1.5 mb-1"><AlertOctagon size={12} /> Ponto Fraco</span>
              <span className="text-xl font-black text-white">{mostFrequentSubject[0]}</span>
              <span className="text-[10px] text-red-400/70 font-mono tracking-wider">{mostFrequentSubject[1]} erros</span>
            </div>
          )}
          <div className="bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-2xl px-5 py-3 flex flex-col items-center justify-center min-w-[100px] backdrop-blur-md">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 tracking-wider">Total</span>
            <span className="text-2xl font-black text-white">{totalErrors}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Buscar erro..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-[var(--glass-bg)] border border-[var(--border-glass)] text-zinc-300 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 appearance-none min-w-[140px]"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">Todas Matérias</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="bg-[var(--glass-bg)] border border-[var(--border-glass)] text-zinc-300 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 appearance-none min-w-[140px]"
              value={filterCause}
              onChange={(e) => setFilterCause(e.target.value)}
            >
              <option value="">Todos Motivos</option>
              {causes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
            <div className="relative">
              <select
                className="bg-[var(--glass-bg)] border border-[var(--border-glass)] text-zinc-300 text-sm rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-red-500 appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date-desc">Recentes</option>
                <option value="date-asc">Antigos</option>
                <option value="subject">Matéria</option>
              </select>
              <ArrowUpDown size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-start">
          <div className="flex items-center bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>

          <button
            onClick={() => openModal()}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-red-900/20 whitespace-nowrap text-sm"
          >
            <Plus size={18} /> Registrar Erro
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
                bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-2xl hover:border-white/20 transition-all group relative backdrop-blur-xl
                ${viewMode === 'grid' ? 'p-6 flex flex-col' : 'p-4 flex flex-col sm:flex-row sm:items-center gap-4'}
              `}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-lg bg-zinc-950/50 text-xs font-bold text-zinc-300 border border-white/5">
                        {error.subject}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${causeData.bg} ${causeData.color} ${causeData.border}`}>
                        {causeData.icon}
                        {error.cause}
                      </div>
                    </div>

                    <p className="text-zinc-200 text-sm leading-relaxed mb-6 min-h-[60px] line-clamp-4 font-medium">
                      {error.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-zinc-600 font-mono">{error.date}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openModal(error)}
                          className="text-zinc-600 hover:text-blue-400 transition-colors p-2 hover:bg-blue-500/10 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(error.id)}
                          className="text-zinc-600 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-950/50 text-zinc-400 border border-white/5">
                          {error.subject}
                        </span>
                        <span className="text-xs text-zinc-600 font-mono">• {error.date}</span>
                      </div>
                      <p className="text-zinc-200 text-sm truncate font-medium">{error.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${causeData.bg} ${causeData.color} ${causeData.border} whitespace-nowrap`}>
                        {causeData.icon}
                        {error.cause}
                      </div>
                      <div className="flex gap-1 border-l border-white/5 pl-4">
                        <button
                          onClick={() => openModal(error)}
                          className="text-zinc-500 hover:text-blue-400 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(error.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5 flex-shrink-0">
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
                    <label className="flex-shrink-0 w-24 h-24 bg-black/40 border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative">
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon size={24} className="text-zinc-600 group-hover:text-zinc-400 mb-1" />
                          <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 font-bold uppercase">Upload</span>
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
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-wider">Matéria</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-red-500 text-sm appearance-none font-medium"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-wider">Motivo</label>
                  <select
                    value={cause}
                    onChange={(e) => setCause(e.target.value as ErrorEntry['cause'])}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-red-500 text-sm appearance-none font-medium"
                  >
                    {causes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1.5 tracking-wider">Descrição do Erro</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que aconteceu... (Ex: Confundi a fórmula de Bhaskara)"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 min-h-[120px] resize-none text-sm placeholder:text-zinc-600"
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
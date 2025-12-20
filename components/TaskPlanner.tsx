import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Calendar as CalendarIcon, Target, Flag, ArrowRight, Layout, RefreshCcw, ChevronLeft, ChevronRight, Clock, Book, BookOpen, Bookmark, Percent, BarChart } from 'lucide-react';
import { authService } from '../services/authService';
import { PlannerTask, TaskScope, TaskPriority, StudyMaterial } from '../types';

const TaskPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'materials'>('calendar');

  // --- STATES FOR TASKS ---
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // For Calendar Navigation
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected day
  
  // Form State Tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');

  // --- STATES FOR MATERIALS ---
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  // Form State Materials
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialSubject, setNewMaterialSubject] = useState('Matemática');
  const [newMaterialTotal, setNewMaterialTotal] = useState('');

  const TASKS_KEY = authService.getUserStorageKey('hpc_planner_tasks');
  const MATERIALS_KEY = authService.getUserStorageKey('hpc_study_materials');

  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_KEY);
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedMaterials = localStorage.getItem(MATERIALS_KEY);
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
  }, []);

  // --- TASK LOGIC ---

  const saveTasks = (updatedTasks: PlannerTask[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: PlannerTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
      scope: 'Daily', // Defaulting to daily for calendar items
      priority: newPriority,
      createdAt: Date.now(),
      date: selectedDate.toLocaleDateString('pt-BR'),
      time: newTaskTime || undefined
    };

    saveTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskTime('');
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const clearCompleted = () => {
    const selectedDateStr = selectedDate.toLocaleDateString('pt-BR');
    const updated = tasks.filter(t => {
      // Keep if not completed OR if it belongs to another date
      return !t.completed || t.date !== selectedDateStr;
    });
    saveTasks(updated);
  };

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    const days = [];
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    setCurrentDate(newDate);
  };

  const selectedDateStr = selectedDate.toLocaleDateString('pt-BR');
  const tasksForSelectedDate = tasks
    .filter(t => t.date === selectedDateStr)
    .sort((a, b) => {
       // Sort by time if available, then by priority
       if (a.time && b.time) return a.time.localeCompare(b.time);
       if (a.time) return -1;
       if (b.time) return 1;
       const pMap = { High: 3, Medium: 2, Low: 1 };
       return pMap[b.priority] - pMap[a.priority];
    });

  const progress = tasksForSelectedDate.length > 0 
    ? Math.round((tasksForSelectedDate.filter(t => t.completed).length / tasksForSelectedDate.length) * 100) 
    : 0;

  // --- MATERIALS LOGIC ---

  const saveMaterials = (updated: StudyMaterial[]) => {
    setMaterials(updated);
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(updated));
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !newMaterialTotal) return;

    const newMat: StudyMaterial = {
        id: crypto.randomUUID(),
        title: newMaterialTitle,
        subject: newMaterialSubject,
        totalChapters: parseInt(newMaterialTotal),
        currentChapter: 0,
        lastUpdated: Date.now()
    };

    saveMaterials([...materials, newMat]);
    setNewMaterialTitle('');
    setNewMaterialTotal('');
  };

  const updateProgress = (id: string, delta: number) => {
      const updated = materials.map(m => {
          if (m.id !== id) return m;
          const newCurrent = Math.min(Math.max(0, m.currentChapter + delta), m.totalChapters);
          return { ...m, currentChapter: newCurrent, lastUpdated: Date.now() };
      });
      saveMaterials(updated);
  };

  const deleteMaterial = (id: string) => {
      if(confirm('Remover esta apostila?')) {
          saveMaterials(materials.filter(m => m.id !== id));
      }
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const subjectsList = ['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Português', 'Literatura', 'Inglês', 'Redação'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Planner Estratégico</h2>
          </div>
          <p className="text-zinc-400 text-sm">Organize seu tempo e acompanhe seu progresso nas apostilas.</p>
        </div>
        
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'calendar' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <CalendarIcon size={16} /> Agenda
            </button>
            <button 
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'materials' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Book size={16} /> Apostilas
            </button>
        </div>
      </div>

      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Calendar Grid */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                    <h3 className="text-xl font-bold text-white capitalize">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><ChevronRight size={20} /></button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <div key={i} className="text-xs font-bold text-zinc-500 uppercase">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentDate).map((date, idx) => {
                        if (!date) return <div key={idx} className="aspect-square"></div>;
                        
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const dateStr = date.toLocaleDateString('pt-BR');
                        const hasTasks = tasks.some(t => t.date === dateStr && !t.completed);
                        const allCompleted = tasks.some(t => t.date === dateStr) && tasks.filter(t => t.date === dateStr).every(t => t.completed);

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(date)}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border
                                    ${isSelected 
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                                        : isToday 
                                            ? 'bg-zinc-800 border-zinc-700 text-blue-400' 
                                            : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                                    }
                                `}
                            >
                                <span className={`text-sm font-bold ${isSelected ? 'scale-110' : ''}`}>{date.getDate()}</span>
                                <div className="flex gap-0.5 mt-1 h-1.5">
                                    {hasTasks && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>}
                                    {allCompleted && !hasTasks && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`}></div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right: Task List for Selected Day */}
            <div className="lg:col-span-5 flex flex-col h-full">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                             <h3 className="text-white font-bold flex items-center gap-2">
                                <CalendarIcon size={18} className="text-blue-500" />
                                {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                             </h3>
                             <p className="text-xs text-zinc-500 mt-1">
                                {new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(selectedDate)}
                             </p>
                        </div>
                        {tasksForSelectedDate.some(t => t.completed) && (
                            <button onClick={clearCompleted} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                                <RefreshCcw size={12} /> Limpar
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-zinc-400">Conclusão Diária</span>
                            <span className="text-white font-bold">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="mb-6 space-y-2">
                         <div className="flex gap-2">
                            <div className="relative w-24 flex-shrink-0">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input 
                                    type="time" 
                                    value={newTaskTime}
                                    onChange={(e) => setNewTaskTime(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-8 pr-2 text-white text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Nova tarefa..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-xl transition-colors">
                                <Plus size={20} />
                            </button>
                         </div>
                         <div className="flex gap-2 justify-end">
                            {(['Low', 'Medium', 'High'] as TaskPriority[]).map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setNewPriority(p)}
                                    className={`px-2 py-1 rounded text-[10px] uppercase font-bold border transition-all ${newPriority === p ? getPriorityColor(p) : 'border-transparent text-zinc-600 hover:bg-zinc-800'}`}
                                >
                                    {p === 'High' ? 'Alta' : p === 'Medium' ? 'Média' : 'Baixa'}
                                </button>
                            ))}
                         </div>
                    </form>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                        {tasksForSelectedDate.length === 0 ? (
                            <div className="h-32 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                                <span className="text-sm">Dia livre.</span>
                            </div>
                        ) : (
                            tasksForSelectedDate.map(task => (
                                <div 
                                    key={task.id}
                                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        task.completed 
                                        ? 'bg-zinc-950/50 border-zinc-900 opacity-60' 
                                        : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800'
                                    }`}
                                >
                                    <button 
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-zinc-600 hover:text-emerald-500'}`}
                                    >
                                        {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                    </button>
                                    
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                            {task.title}
                                        </p>
                                        {task.time && (
                                            <p className="text-xs text-blue-400 flex items-center gap-1 mt-0.5">
                                                <Clock size={10} /> {task.time}
                                            </p>
                                        )}
                                    </div>

                                    <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>

                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'materials' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left: Add Material & Stats */}
             <div className="space-y-6">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                         <Bookmark size={20} className="text-purple-500" /> Nova Apostila
                     </h3>
                     <form onSubmit={handleAddMaterial} className="space-y-4">
                         <div>
                             <label className="text-xs font-medium text-zinc-500 mb-1 block">Título do Livro/Apostila</label>
                             <input 
                                type="text"
                                value={newMaterialTitle}
                                onChange={e => setNewMaterialTitle(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                placeholder="Ex: Matemática Vol 1"
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="text-xs font-medium text-zinc-500 mb-1 block">Matéria</label>
                                 <select 
                                    value={newMaterialSubject}
                                    onChange={e => setNewMaterialSubject(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                                 >
                                     {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                             </div>
                             <div>
                                 <label className="text-xs font-medium text-zinc-500 mb-1 block">Total Capítulos</label>
                                 <input 
                                    type="number"
                                    min="1"
                                    value={newMaterialTotal}
                                    onChange={e => setNewMaterialTotal(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Ex: 12"
                                 />
                             </div>
                         </div>
                         <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20">
                             Adicionar Material
                         </button>
                     </form>
                 </div>

                 {materials.length > 0 && (
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                             <BarChart size={32} className="text-zinc-400" />
                         </div>
                         <p className="text-zinc-500 text-sm">Total de Materiais</p>
                         <h4 className="text-3xl font-bold text-white mb-1">{materials.length}</h4>
                         <p className="text-xs text-zinc-600">
                             Progresso Geral: {Math.round(materials.reduce((acc, m) => acc + (m.currentChapter/m.totalChapters), 0) / materials.length * 100)}%
                         </p>
                     </div>
                 )}
             </div>

             {/* Right: Grid of Materials */}
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
                 {materials.length === 0 ? (
                     <div className="col-span-full py-16 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                         <BookOpen size={48} className="mb-4 opacity-20" />
                         <p>Nenhuma apostila cadastrada.</p>
                     </div>
                 ) : (
                     materials.map(mat => {
                         const pct = Math.round((mat.currentChapter / mat.totalChapters) * 100);
                         return (
                             <div key={mat.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group hover:border-zinc-700 transition-all">
                                 <button 
                                    onClick={() => deleteMaterial(mat.id)}
                                    className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                 >
                                     <Trash2 size={16} />
                                 </button>

                                 <div className="flex items-start gap-4 mb-4">
                                     <div className="w-12 h-16 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center shadow-lg">
                                         <Book size={20} className="text-zinc-600" />
                                     </div>
                                     <div>
                                         <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">{mat.subject}</span>
                                         <h4 className="text-white font-bold leading-tight mt-0.5">{mat.title}</h4>
                                         <p className="text-zinc-500 text-xs mt-1">
                                             Capítulo {mat.currentChapter} de {mat.totalChapters}
                                         </p>
                                     </div>
                                 </div>

                                 <div className="flex items-center gap-3 mb-2">
                                     <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                         <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${pct}%` }}></div>
                                     </div>
                                     <span className="text-xs font-bold text-white w-8 text-right">{pct}%</span>
                                 </div>

                                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/50">
                                     <button 
                                        onClick={() => updateProgress(mat.id, -1)}
                                        disabled={mat.currentChapter <= 0}
                                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                                     >
                                         <ChevronLeft size={18} />
                                     </button>
                                     <span className="text-xs text-zinc-500 font-medium">ATUALIZAR PROGRESSO</span>
                                     <button 
                                        onClick={() => updateProgress(mat.id, 1)}
                                        disabled={mat.currentChapter >= mat.totalChapters}
                                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                                     >
                                         <ChevronRight size={18} />
                                     </button>
                                 </div>
                             </div>
                         );
                     })
                 )}
             </div>
          </div>
      )}
    </div>
  );
};

export default TaskPlanner;
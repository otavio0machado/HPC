import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, Database, Trash2, Check, Smartphone, Monitor } from 'lucide-react';
import { authService } from '../services/authService';

const Settings: React.FC = () => {
  const [examFocus, setExamFocus] = useState('AMBOS');
  const [theme, setTheme] = useState('dark');
  
  // Mock Settings Storage
  const STORAGE_KEY = authService.getUserStorageKey('hpc_preferences');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        setExamFocus(parsed.examFocus || 'AMBOS');
        setTheme(parsed.theme || 'dark');
    }
  }, []);

  const savePreference = (key: string, value: any) => {
     const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
     const updated = { ...current, [key]: value };
     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleFocusChange = (val: string) => {
      setExamFocus(val);
      savePreference('examFocus', val);
  };

  const handleClearData = (key: string) => {
      if(confirm('Tem certeza? Isso apagará o histórico local selecionado.')) {
          const userKey = authService.getUserStorageKey(key);
          localStorage.removeItem(userKey);
          alert('Dados limpos com sucesso. Recarregue a página para ver o efeito.');
      }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-zinc-400" /> Configurações
        </h2>
        <p className="text-zinc-400 mt-1">Personalize sua experiência no High Performance Club.</p>
      </div>

      <div className="space-y-6">
         {/* Study Preferences */}
         <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Preferências de Estudo</h3>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                    <label className="text-white font-medium block">Foco Principal</label>
                    <p className="text-sm text-zinc-500">Isso ajusta o algoritmo do Planner e as sugestões dos Tutores.</p>
                </div>
                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    {['ENEM', 'UFRGS', 'AMBOS'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleFocusChange(opt)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${examFocus === opt ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
         </section>

         {/* Interface */}
         <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Interface & Aparência</h3>
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                        <span className="text-white font-medium block">Tema do Sistema</span>
                        <span className="text-sm text-zinc-500">Atualmente apenas o Modo Dark Elite está disponível.</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">Padrão</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Monitor size={20} />
                    </div>
                    <div>
                        <span className="text-white font-medium block">Densidade de Informação</span>
                        <span className="text-sm text-zinc-500">Ajustar tamanho de fontes e espaçamentos.</span>
                    </div>
                </div>
                <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option>Confortável</option>
                    <option>Compacto</option>
                </select>
            </div>
         </section>

         {/* Data Management */}
         <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Database size={18} className="text-emerald-500" /> Gestão de Dados
            </h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <div>
                        <span className="text-white font-medium block text-sm">Cache de Tutores</span>
                        <span className="text-xs text-zinc-500">Limpar histórico de conversas com IAs.</span>
                    </div>
                    <button 
                        onClick={() => handleClearData('hpc_tutor_history')}
                        className="text-zinc-500 hover:text-red-400 p-2 transition-colors"
                        title="Limpar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <div>
                        <span className="text-white font-medium block text-sm">Histórico de Simulados</span>
                        <span className="text-xs text-zinc-500">Resetar estatísticas de performance.</span>
                    </div>
                    <button 
                        onClick={() => handleClearData('hpc_simulados_history')}
                        className="text-zinc-500 hover:text-red-400 p-2 transition-colors"
                        title="Limpar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <div>
                        <span className="text-white font-medium block text-sm">Flashcards e Repetições</span>
                        <span className="text-xs text-zinc-500">Reiniciar progresso do algoritmo SM-2.</span>
                    </div>
                    <button 
                        onClick={() => handleClearData('hpc_flashcards')}
                        className="text-zinc-500 hover:text-red-400 p-2 transition-colors"
                        title="Limpar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default Settings;
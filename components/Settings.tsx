import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, Database, Trash2, Check, Smartphone, Monitor, Palette, Grip } from 'lucide-react';
import { authService } from '../services/authService';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
    const [examFocus, setExamFocus] = useState('AMBOS');
    const { theme } = useTheme();

    // Mock Settings Storage
    const STORAGE_KEY = authService.getUserStorageKey('hpc_preferences');

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setExamFocus(parsed.examFocus || 'AMBOS');
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
        if (confirm('Tem certeza? Isso apagará o histórico local selecionado.')) {
            const userKey = authService.getUserStorageKey(key);
            localStorage.removeItem(userKey);
            alert('Dados limpos com sucesso. Recarregue a página para ver o efeito.');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4 md:p-0">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/10">
                        <SettingsIcon className="text-zinc-600 dark:text-zinc-400" size={24} />
                    </div>
                    Configurações
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">Personalize sua experiência no High Performance Club.</p>
            </div>

            <div className="space-y-8">
                {/* Study Preferences */}
                <section className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                            <Grip size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Preferências de Estudo</h3>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <label className="text-zinc-900 dark:text-white font-bold block mb-1">Foco Principal</label>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md">O algoritmo do Planner e as sugestões dos Tutores serão otimizados para o exame selecionado.</p>
                        </div>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950/50 p-1.5 rounded-xl border border-zinc-200 dark:border-white/10">
                            {['ENEM', 'UFRGS', 'AMBOS'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleFocusChange(opt)}
                                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${examFocus === opt ? 'bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-lg backdrop-blur-md border border-zinc-200 dark:border-white/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Interface - Enhanced with working ThemeToggle */}
                <section className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                            <Palette size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Interface & Aparência</h3>
                    </div>

                    <div className="space-y-8 divide-y divide-zinc-200 dark:divide-white/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400">
                                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                </div>
                                <div>
                                    <span className="text-zinc-900 dark:text-white font-bold block">Tema do Sistema</span>
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Escolha entre Dark e Light mode.</span>
                                </div>
                            </div>
                            <ThemeToggle showLabel={true} />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400">
                                    <Monitor size={18} />
                                </div>
                                <div>
                                    <span className="text-zinc-900 dark:text-white font-bold block">Densidade de Informação</span>
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Ajustar tamanho de fontes e espaçamentos.</span>
                                </div>
                            </div>
                            <div className="relative">
                                <select className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 outline-none focus:border-blue-500 active:bg-zinc-100 dark:active:bg-zinc-900 appearance-none min-w-[150px]">
                                    <option>Confortável</option>
                                    <option>Compacto</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Database size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Gestão de Dados</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-950/30 hover:bg-white dark:hover:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-white/5 transition-colors group">
                            <div>
                                <span className="text-zinc-900 dark:text-white font-bold block text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">Cache de Tutores</span>
                                <span className="text-xs text-zinc-500">Limpar histórico de conversas com IAs.</span>
                            </div>
                            <button
                                onClick={() => handleClearData('hpc_tutor_history')}
                                className="text-zinc-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-xl transition-all bg-white/[0.02] border border-transparent hover:border-red-500/20 backdrop-blur-sm"
                                title="Limpar Cache"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-950/30 hover:bg-white dark:hover:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-white/5 transition-colors group">
                            <div>
                                <span className="text-zinc-900 dark:text-white font-bold block text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">Histórico de Simulados</span>
                                <span className="text-xs text-zinc-500">Resetar estatísticas de performance.</span>
                            </div>
                            <button
                                onClick={() => handleClearData('hpc_simulados_history')}
                                className="text-zinc-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-xl transition-all bg-white/[0.02] border border-transparent hover:border-red-500/20 backdrop-blur-sm"
                                title="Limpar Histórico"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-950/30 hover:bg-white dark:hover:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-white/5 transition-colors group">
                            <div>
                                <span className="text-zinc-900 dark:text-white font-bold block text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">Flashcards e Repetições</span>
                                <span className="text-xs text-zinc-500">Reiniciar progresso do algoritmo SM-2.</span>
                            </div>
                            <button
                                onClick={() => handleClearData('hpc_flashcards')}
                                className="text-zinc-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-xl transition-all bg-white/[0.02] border border-transparent hover:border-red-500/20 backdrop-blur-sm"
                                title="Limpar Progresso"
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
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Plus } from 'lucide-react';

interface AddSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (hours: number) => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [inputHours, setInputHours] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(inputHours);
        if (!isNaN(val) && val > 0) {
            onAdd(val);
            setInputHours('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-900/40 border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden group backdrop-blur-3xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">Registrar Sessão</h3>
                                    <p className="text-xs text-zinc-500 font-medium">Adicione horas manualmente</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group/input">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Duração (Horas)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        required
                                        value={inputHours}
                                        onChange={(e) => setInputHours(e.target.value)}
                                        placeholder="0.0"
                                        className="w-full bg-black/20 border border-white/5 rounded-3xl py-5 px-6 text-2xl font-mono text-white placeholder-zinc-700 focus:outline-none focus:bg-black/40 focus:border-blue-500/30 transition-all text-center"
                                        autoFocus
                                    />
                                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-zinc-600 font-medium text-sm">
                                        h
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Adicionar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddSessionModal;

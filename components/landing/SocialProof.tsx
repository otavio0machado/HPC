import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Star, ShieldCheck, Flame } from 'lucide-react';

const stats = [
    { value: "IA", label: "Personalizada" },
    { value: "100%", label: "Foco no Aluno" },
    { value: "24/7", label: "Disponibilidade" },
    { value: "5.0", label: "Qualidade" },
];

const SocialProof: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Gradient Background Strip */}
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-600/5 -z-10" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">Impulsionado por Dados, Validado por Resultados</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5 backdrop-blur-md rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500 group shadow-lg shadow-black/5"
                        >
                            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-2 tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.value}</div>
                            <div className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Zap, BarChart3, Atom, FastForward, Focus } from 'lucide-react';

const methods = [
    {
        icon: Brain,
        title: 'Neural Active Recall',
        description: 'Não apenas leia. Force sua mente a reconstruir caminhos neurais. Nosso sistema dispara os gatilhos certos para consolidar memória de longo prazo.'
    },
    {
        icon: Zap,
        title: 'Algoritmo de Flash-Sync',
        description: 'Repetição espaçada baseada na sua curva individual de esquecimento. Otimize seu tempo estudando com mais eficiência.'
    },
    {
        icon: Atom,
        title: 'Foco Bio-Adaptativo',
        description: 'Identificação cirúrgica de gaps cognitivos. A IA adapta o conteúdo em tempo real para te manter no estado de Flow constante.'
    },
    {
        icon: FastForward,
        title: 'Hacking de Velocidade',
        description: 'Técnicas de compressão de aprendizado integradas para você cobrir o conteúdo necessário sem fadiga mental.'
    }
];

const Methodology: React.FC = () => {
    return (
        <section id="metodologia" className="py-32 relative overflow-hidden">
            {/* Background Bio-Light */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[140px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            <Focus size={12} />
                            BIOHACKING PARA ESTUDANTES
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-8 leading-[0.9]">
                            O FIM DO <span className="text-blue-600 dark:text-blue-500 underline decoration-blue-500/30 decoration-8 underline-offset-8">ESTUDO PASSIVO</span>
                        </h2>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
                            A maioria estuda de forma ineficiente. O HPC implementa os protocolos de <span className="text-zinc-900 dark:text-white font-bold">Ciência Cognitiva</span> para garantir sua evolução.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {methods.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-6 rounded-[32px] bubble-hover group overflow-hidden relative"
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                            <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                                        </div>
                                        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{item.title}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors font-medium">{item.description}</p>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[50px] group-hover:bg-blue-500/10 transition-all duration-700" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", damping: 20 }}
                        className="relative"
                    >
                        {/* Interactive Neural Net Visualization Placeholder */}
                        <div className="absolute -inset-20 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-full blur-[80px] opacity-60 animate-pulse" />

                        <div className="relative glass-spatial rounded-[48px] p-12 aspect-square flex flex-col items-center justify-center shadow-2xl overflow-hidden group border-t border-white/40 dark:border-white/20">
                            {/* Animated Background Rings */}
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="absolute border border-black/5 dark:border-white/5 rounded-full animate-ping"
                                    style={{
                                        width: `${i * 35}%`,
                                        height: `${i * 35}%`,
                                        animationDuration: `${i * 4}s`
                                    }}
                                />
                            ))}

                            <div className="relative z-10 text-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] border-8 border-white dark:border-white/10 mb-8 overflow-hidden group-hover:scale-110 transition-transform duration-700 relative"
                                >
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                                    <Brain size={88} className="text-white opacity-95 fill-white/20 drop-shadow-md" />
                                </motion.div>
                                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">NEURAL CORE</h3>
                                <div className="text-xl font-bold text-zinc-500 dark:text-zinc-400 mb-2">Otimização Contínua</div>
                                <p className="text-zinc-600 dark:text-blue-200 font-bold uppercase tracking-widest text-xs bg-blue-100 dark:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30">Eficácia Cognitiva</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Methodology;

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
        description: 'Repetição espaçada baseada na sua curva individual de esquecimento. Otimize seu tempo estudando 3x menos com 10x mais retenção.'
    },
    {
        icon: Atom,
        title: 'Foco Bio-Adaptativo',
        description: 'Identificação cirúrgica de gaps cognitivos. A IA adapta o conteúdo em tempo real para te manter no estado de Flow constante.'
    },
    {
        icon: FastForward,
        title: 'Hacking de Velocidade',
        description: 'Técnicas de compressão de aprendizado integradas para você cobrir o edital em tempo recorde sem fadiga mental.'
    }
];

const Methodology: React.FC = () => {
    return (
        <section id="metodologia" className="py-32 relative overflow-hidden bg-zinc-950">
            {/* Background Bio-Light */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            <Focus size={12} />
                            BIOHACKING PARA ESTUDANTES
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8 leading-[0.9]">
                            O FIM DO <span className="text-blue-500 underline decoration-blue-500/30 decoration-8 underline-offset-8">ESTUDO PASSIVO</span>
                        </h2>
                        <p className="text-xl text-zinc-400 mb-10 leading-relaxed font-medium">
                            A maioria estuda "errado". O HPC implementa os protocolos de <span className="text-white">Ciência Cognitiva</span> utilizados nos centros de excelência do mundo para garantir sua aprovação.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {methods.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative"
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                                            <item.icon className="w-6 h-6 text-blue-400 group-hover:text-white" />
                                        </div>
                                        <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{item.description}</p>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all" />
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
                        <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl opacity-50 animate-pulse" />

                        <div className="relative bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 aspect-square flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
                            {/* Animated Background Rings */}
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="absolute border border-blue-500/10 rounded-full animate-ping"
                                    style={{
                                        width: `${i * 30}%`,
                                        height: `${i * 30}%`,
                                        animationDuration: `${i * 3}s`
                                    }}
                                />
                            ))}

                            <div className="relative z-10 text-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)] border-4 border-white/10 mb-8 overflow-hidden group-hover:scale-110 transition-transform duration-700"
                                >
                                    <Brain size={80} className="text-white opacity-90 fill-white/20" />
                                </motion.div>
                                <h3 className="text-2xl font-black text-white mb-2">NEURAL CORE</h3>
                                <div className="text-5xl font-black text-blue-400 mb-2">98.2%</div>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Eficácia Cognitiva Medida</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Methodology;

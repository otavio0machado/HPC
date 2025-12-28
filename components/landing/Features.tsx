import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Users, BarChart3, Brain, Layers, Cpu, Fingerprint, Activity } from 'lucide-react';

const params = {
    features: [
        {
            icon: <Fingerprint className="w-6 h-6" />,
            title: "DNA da Aprovação",
            description: "Algoritmos de IA que identificam seus furos de conhecimento em tempo real e criam o caminho mais curto até a vaga."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Deep Memory (SRS 2.0)",
            description: "Sistema de repetição espaçada de nível militar que garante a retenção de 95% do conteúdo para o dia da prova."
        },
        {
            icon: <Activity className="w-6 h-6" />,
            title: "Performance Monitor",
            description: "Visualize sua evolução cerebral com gráficos de precisão e tempo de resposta, como um atleta de elite."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Modo Flow Instantâneo",
            description: "Interface desenhada sob princípios de neurodesign para eliminar distrações e dobrar seu foco em segundos."
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Banco Cognitivo",
            description: "Milhares de questões categorizadas por carga cognitiva, facilitando a subida de nível degrau por degrau."
        },
        {
            icon: <Layers className="w-6 h-6" />,
            title: "HPC Connect",
            description: "Sincronização total. Seus estudos, notas e progresso disponíveis em qualquer dispositivo, instantaneamente."
        }
    ]
};

const Features: React.FC = () => {
    return (
        <section id="features" className="py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm"
                    >
                        Módulos de Alta Performance
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter"
                    >
                        SUA MENTE EM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400">OUTRO NÍVEL</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-medium"
                    >
                        Ferramentas projetadas com neurociência e engenharia de dados para transformar seu aprendizado em uma vantagem competitiva.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {params.features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-8 rounded-[32px] glass-card overflow-hidden flex flex-col justify-between"
                        >
                            {/* Card Glow */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium text-sm md:text-base group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

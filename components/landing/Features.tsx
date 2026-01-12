import React from 'react';
import { motion } from 'framer-motion';
import {
    Fingerprint, Brain, Activity, Zap, Cpu, Layers,
    BookOpen, MessageSquare, Calendar, BarChart3,
    Sparkles, Target, ArrowRight
} from 'lucide-react';

const features = [
    {
        icon: Fingerprint,
        title: "DNA da Aprovação",
        description: "Algoritmos de IA que identificam seus furos de conhecimento em tempo real e criam o caminho mais curto até a vaga.",
        color: "from-blue-500 to-cyan-400",
        badge: "IA Avançada"
    },
    {
        icon: Brain,
        title: "Deep Memory (SRS 2.0)",
        description: "Sistema de repetição espaçada de nível militar que garante a retenção de 95% do conteúdo para o dia da prova.",
        color: "from-purple-500 to-pink-400",
        badge: "Neurociência"
    },
    {
        icon: Activity,
        title: "Performance Monitor",
        description: "Visualize sua evolução cerebral com gráficos de precisão e tempo de resposta, como um atleta de elite.",
        color: "from-emerald-500 to-teal-400",
        badge: "Analytics"
    },
    {
        icon: Zap,
        title: "Modo Flow Instantâneo",
        description: "Interface desenhada sob princípios de neurodesign para eliminar distrações e dobrar seu foco em segundos.",
        color: "from-orange-500 to-amber-400",
        badge: "UX Premium"
    },
    {
        icon: Cpu,
        title: "Banco Cognitivo",
        description: "Milhares de questões categorizadas por carga cognitiva, facilitando a subida de nível degrau por degrau.",
        color: "from-rose-500 to-red-400",
        badge: "+10K Questões"
    },
    {
        icon: Layers,
        title: "HPC Connect",
        description: "Sincronização total. Seus estudos, notas e progresso disponíveis em qualquer dispositivo, instantaneamente.",
        color: "from-indigo-500 to-violet-400",
        badge: "Multi-device"
    }
];

const additionalFeatures = [
    { icon: BookOpen, label: "Notas Inteligentes", desc: "Markdown + IA" },
    { icon: MessageSquare, label: "Tutor IA 24/7", desc: "Tire dúvidas" },
    { icon: Calendar, label: "Cronograma Smart", desc: "Auto-organizado" },
    { icon: BarChart3, label: "Relatórios Detalhados", desc: "Insights profundos" },
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-[150px] -z-10" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6 backdrop-blur-md shadow-sm"
                    >
                        <Sparkles size={14} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                            Recursos Premium
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter"
                    >
                        Tudo que você precisa
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400">
                            em um só lugar
                        </span>
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

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Glow effect on hover */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-[36px] blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-500`} />

                            <div className="relative h-full glass-card p-8 rounded-[32px] overflow-hidden flex flex-col">
                                {/* Background gradient */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-full blur-3xl group-hover:opacity-15 transition-opacity duration-500`} />

                                <div className="relative z-10 flex-1">
                                    {/* Badge */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                            {feature.badge}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Bottom accent */}
                                <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Features Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl blur-xl" />

                    <div className="relative glass-spatial rounded-3xl p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                    E muito mais...
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Novas funcionalidades são adicionadas constantemente
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                {additionalFeatures.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-sm"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-900 dark:text-white">{item.label}</div>
                                            <div className="text-xs text-zinc-500">{item.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
                    >
                        <Target className="w-5 h-5" />
                        Explorar Todas as Funcionalidades
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default Features;

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Atom, FastForward, Target, Lightbulb, Puzzle, ArrowRight } from 'lucide-react';

const methods = [
    {
        icon: Brain,
        title: 'Active Recall Neural',
        subtitle: 'Memorização Acelerada',
        description: 'Force sua mente a reconstruir caminhos neurais. Nosso sistema dispara os gatilhos certos para consolidar memória de longo prazo.',
        color: 'from-blue-500 to-cyan-400',
        stats: '95% retenção'
    },
    {
        icon: Zap,
        title: 'Repetição Espaçada 2.0',
        subtitle: 'Algoritmo Inteligente',
        description: 'Baseado na sua curva individual de esquecimento. A IA otimiza cada revisão para máxima eficiência.',
        color: 'from-purple-500 to-pink-400',
        stats: '3x mais eficiente'
    },
    {
        icon: Atom,
        title: 'Flow Adaptativo',
        subtitle: 'Foco Bio-Adaptativo',
        description: 'Identificação cirúrgica de gaps cognitivos. O conteúdo adapta em tempo real para manter você no estado de Flow.',
        color: 'from-emerald-500 to-teal-400',
        stats: 'Foco contínuo'
    },
    {
        icon: FastForward,
        title: 'Speed Learning',
        subtitle: 'Compressão de Conteúdo',
        description: 'Técnicas de aprendizado acelerado integradas para cobrir mais conteúdo sem fadiga mental.',
        color: 'from-orange-500 to-amber-400',
        stats: '2x mais rápido'
    }
];

const processSteps = [
    { icon: Target, label: 'Diagnóstico', description: 'IA analisa seu nível' },
    { icon: Puzzle, label: 'Personalização', description: 'Plano único para você' },
    { icon: Lightbulb, label: 'Execução', description: 'Estudo otimizado' },
    { icon: Brain, label: 'Evolução', description: 'Melhoria contínua' },
];

const Methodology: React.FC = () => {
    return (
        <section id="metodologia" className="py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                        <Brain size={14} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Ciência Cognitiva Aplicada
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-6"
                    >
                        Metodologia que
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400">
                            Transforma Resultados
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
                    >
                        Combinamos as técnicas mais avançadas de neurociência e inteligência artificial
                        para criar uma experiência de aprendizado sem precedentes.
                    </motion.p>
                </div>

                {/* Process Steps - Horizontal Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="relative glass-card rounded-3xl p-8 md:p-12 overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5" />

                        <div className="relative z-10">
                            <div className="text-center mb-10">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Como Funciona</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">4 passos para sua aprovação</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                                {processSteps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative text-center group"
                                    >
                                        {/* Connector line */}
                                        {idx < processSteps.length - 1 && (
                                            <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30" />
                                        )}

                                        {/* Step number */}
                                        <div className="relative z-10 w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                            <step.icon className="w-8 h-8 text-white" />
                                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600">
                                                {idx + 1}
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{step.label}</h4>
                                        <p className="text-xs text-zinc-500">{step.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Methods Grid */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {methods.map((method, idx) => (
                        <motion.div
                            key={method.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative group"
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${method.color} rounded-[32px] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                            <div className="relative glass-card rounded-[28px] p-8 h-full flex flex-col overflow-hidden">
                                {/* Background gradient */}
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${method.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className="relative z-10 flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                            <method.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${method.color} bg-opacity-10 border border-white/10`}>
                                            <span className="text-xs font-bold text-white">{method.stats}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                                        {method.subtitle}
                                    </div>
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {method.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {method.description}
                                    </p>
                                </div>

                                {/* Learn more link */}
                                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group/btn">
                                        <span>Saiba mais</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Neural Core Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-[40px] blur-3xl" />

                    <div className="relative glass-spatial rounded-[40px] p-12 md:p-16 text-center overflow-hidden">
                        {/* Animated rings */}
                        {[1, 2, 3, 4].map(i => (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-500/10 rounded-full"
                                style={{
                                    width: `${i * 150}px`,
                                    height: `${i * 150}px`,
                                }}
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.1, 0.3]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                            />
                        ))}

                        <div className="relative z-10">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-4 ring-white/20"
                            >
                                <Brain size={56} className="text-white" />
                            </motion.div>

                            <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4">
                                Neural Core Engine
                            </h3>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
                                O coração da nossa plataforma: um sistema de IA que aprende com você
                                e otimiza seu aprendizado em tempo real.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                {['Machine Learning', 'Análise Preditiva', 'Personalização IA'].map((tag, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-semibold text-blue-600 dark:text-blue-400"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Methodology;

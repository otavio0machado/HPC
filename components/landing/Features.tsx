import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Users, BarChart3, Brain, Layers } from 'lucide-react';

const params = {
    features: [
        {
            icon: <Target className="w-6 h-6" />,
            title: "Direcionamento Estratégico",
            description: "Análise de dados de mais de 10 anos de provas para focar apenas no que realmente cai."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Retenção Ativa",
            description: "Flashcards e repetição espaçada integrados para garantir que você não esqueça o que estudou."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Métricas de Evolução",
            description: "Dashboards detalhados com sua performance por matéria, assunto e competência."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Velocidade de Resolução",
            description: "Treine para resolver questões mais rápido com nosso cronômetro inteligente e simulados."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Comunidade de Elite",
            description: "Networking com outros estudantes de alta performance para troca de experiências."
        },
        {
            icon: <Layers className="w-6 h-6" />,
            title: "Material Organizado",
            description: "Tudo que você precisa em um só lugar, sem perder tempo procurando conteúdo."
        }
    ]
};

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-900/5 -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        Tecnologia a favor da sua <br />
                        <span className="text-blue-500">Aprovação</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 max-w-2xl mx-auto"
                    >
                        Substituímos o "estudar muito" pelo "estudar certo". Conheça as ferramentas que vão acelerar seus resultados.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {params.features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-lg shadow-black/20">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

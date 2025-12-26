import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: "10k+", label: "Questões Resolvidas" },
    { value: "85%", label: "Aprovação em Federais" },
    { value: "4.9/5", label: "Satisfação dos Alunos" },
    { value: "24/7", label: "Suporte e Mentoria" },
];

const SocialProof: React.FC = () => {
    return (
        <section className="py-20 border-y border-zinc-900 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;

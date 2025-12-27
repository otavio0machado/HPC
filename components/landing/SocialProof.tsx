import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: "12M+", label: "Neurons Maped" },
    { value: "94%", label: "Approval Rate" },
    { value: "+150k", label: "Study Hours" },
    { value: "4.9/5", label: "Community Trust" },
];

const SocialProof: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">Propelled by Data, Validated by Results</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 border border-white/5 backdrop-blur-md rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500 group"
                        >
                            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter group-hover:text-blue-400 transition-colors">{stat.value}</div>
                            <div className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;

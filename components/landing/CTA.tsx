import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTAProps {
    onCtaClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onCtaClick }) => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-zinc-950 -z-10" />

            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-white mb-8"
                >
                    Sua Aprovação Começa Agora
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto"
                >
                    Junte-se à comunidade que está redefinindo o padrão de preparação para vestibulares de alta concorrência.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    onClick={onCtaClick}
                    className="px-10 py-5 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all hover:scale-105 shadow-xl shadow-blue-900/20 flex items-center gap-2 mx-auto"
                >
                    Quero ser Membro HPC <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-sm text-zinc-500"
                >
                    Garantia incondicional de 7 dias.
                </motion.p>
            </div>
        </section>
    );
};

export default CTA;

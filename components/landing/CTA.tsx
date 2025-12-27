import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield } from 'lucide-react';

interface CTAProps {
    onCtaClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onCtaClick }) => {
    return (
        <section className="py-40 relative overflow-hidden bg-black">
            {/* Energy Fields */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />

            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.85]">
                        O PROTOCOLO ESTÁ <br />
                        <span className="text-blue-500">PRONTO PARA VOCÊ</span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl md:text-3xl text-zinc-400 mb-16 max-w-3xl mx-auto font-medium"
                >
                    Não deixe sua vaga nas mãos do acaso. Ative o sistema HPC e tome o controle do seu futuro hoje mesmo.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative inline-block"
                >
                    <div className="absolute -inset-4 bg-blue-600 rounded-2xl blur-2xl opacity-40 animate-pulse" />
                    <button
                        onClick={onCtaClick}
                        className="relative px-12 py-6 rounded-2xl bg-white text-black font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group"
                    >
                        ATIVAR PROTOCOLO PRO
                        <Rocket className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 text-blue-600 fill-blue-600/10" />
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex items-center justify-center gap-4 text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs"
                >
                    <Shield size={16} className="text-blue-500" />
                    Acesso imediato e 100% seguro
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, ArrowRight, Sparkles, Star } from 'lucide-react';

interface CTAProps {
    onCtaClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onCtaClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="py-32 md:py-40 relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]"
                />

                {/* Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-10"
                >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-white/80">Transforme seus resultados hoje</span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
                >
                    <span className="block">Sua aprovação</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient bg-size-300">
                        começa agora
                    </span>
                </motion.h2>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Não deixe sua vaga nas mãos do acaso.
                    <span className="text-white"> Ative o sistema HPC</span> e tome o controle do seu futuro.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative inline-block"
                >
                    {/* Animated glow */}
                    <motion.div
                        animate={{
                            scale: isHovered ? [1, 1.1, 1] : 1,
                            opacity: isHovered ? [0.5, 0.8, 0.5] : 0.4
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl"
                    />

                    <motion.button
                        onClick={onCtaClick}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative px-12 py-6 rounded-2xl bg-white text-black font-black text-xl md:text-2xl shadow-2xl flex items-center gap-4 group overflow-hidden"
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            animate={{ x: isHovered ? ['-100%', '200%'] : '-100%' }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent skew-x-12"
                        />

                        <span className="relative z-10">COMEÇAR AGORA</span>
                        <motion.span
                            animate={{ x: isHovered ? 8 : 0, rotate: isHovered ? -45 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            <Rocket className="w-7 h-7 text-blue-600 group-hover:text-purple-600 transition-colors" />
                        </motion.span>
                    </motion.button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-8"
                >
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Shield size={18} className="text-emerald-500" />
                        <span className="text-sm font-semibold">Pagamento 100% seguro</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Zap size={18} className="text-blue-500" />
                        <span className="text-sm font-semibold">Acesso imediato</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Star size={18} className="text-amber-500" />
                        <span className="text-sm font-semibold">Garantia de 7 dias</span>
                    </div>
                </motion.div>

                {/* Social proof */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 flex flex-col items-center"
                >
                    <div className="flex -space-x-3 mb-4">
                        {['M', 'J', 'A', 'P', 'L'].map((initial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-black flex items-center justify-center text-white font-bold text-sm shadow-lg"
                            >
                                {initial}
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-zinc-400 text-sm">
                        <span className="text-white font-semibold">+2.800 estudantes</span> já estão estudando com o HPC
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

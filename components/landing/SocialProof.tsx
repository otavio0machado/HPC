import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Sparkles, Clock, Award, Star, Users, BookOpen, TrendingUp } from 'lucide-react';

interface CounterProps {
    end: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    duration?: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({
    end,
    suffix = '',
    prefix = '',
    decimals = 0,
    duration = 2500
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(easeOutQuart * end);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration, isInView]);

    return (
        <span ref={ref}>
            {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
        </span>
    );
};

const stats = [
    {
        icon: Brain,
        value: 15000,
        suffix: "+",
        label: "Flashcards Criados",
        color: "from-blue-500 to-cyan-400",
        description: "Conteúdo inteligente"
    },
    {
        icon: Users,
        value: 2847,
        suffix: "+",
        label: "Estudantes Ativos",
        color: "from-purple-500 to-pink-400",
        description: "Comunidade crescendo"
    },
    {
        icon: Award,
        value: 98,
        suffix: "%",
        label: "Taxa de Aprovação",
        color: "from-emerald-500 to-teal-400",
        description: "Resultados comprovados"
    },
    {
        icon: Star,
        value: 4.9,
        suffix: "",
        label: "Avaliação Média",
        color: "from-amber-500 to-orange-400",
        decimals: 1,
        description: "Satisfação garantida"
    },
];

const testimonials = [
    {
        name: "Maria S.",
        course: "Medicina UFRGS",
        avatar: "M",
        text: "Passei em 3º lugar! O sistema de repetição espaçada mudou minha forma de estudar.",
        rating: 5
    },
    {
        name: "João P.",
        course: "Engenharia UFRGS",
        avatar: "J",
        text: "A IA identificou exatamente onde eu precisava melhorar. Resultado: aprovado!",
        rating: 5
    },
    {
        name: "Ana C.",
        course: "Direito UFRGS",
        avatar: "A",
        text: "Organizou meus estudos de forma que eu nunca consegui sozinha. Recomendo demais!",
        rating: 5
    }
];

const SocialProof: React.FC = () => {
    return (
        <section className="py-28 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            y: [-50, -200],
                            x: [0, (i % 2 === 0 ? 20 : -20)]
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "easeOut"
                        }}
                        className="absolute w-2 h-2 rounded-full bg-blue-400/30"
                        style={{ left: `${10 + i * 12}%`, top: '80%' }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Sparkles size={14} className="text-blue-500" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Resultados Reais
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
                        Números que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Impressionam</span>
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-lg">
                        Milhares de estudantes já transformaram seus resultados com nossa plataforma
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, type: "spring", damping: 20 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="relative group"
                        >
                            {/* Glow effect on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                            <div className="relative glass-card rounded-3xl p-6 md:p-8 h-full flex flex-col items-center text-center overflow-hidden">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Value */}
                                <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2 group-hover:scale-105 transition-transform">
                                    <AnimatedCounter
                                        end={stat.value}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals || 0}
                                    />
                                </div>

                                {/* Label */}
                                <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                                    {stat.description}
                                </div>

                                {/* Decorative corner */}
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                            O que nossos aprovados dizem
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                whileHover={{ y: -5 }}
                                className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                            >
                                {/* Quote mark */}
                                <div className="absolute top-4 right-4 text-6xl font-serif text-blue-500/10 select-none">"</div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-zinc-900 dark:text-white text-sm">{testimonial.name}</div>
                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">✓ {testimonial.course}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 flex flex-wrap justify-center items-center gap-6 md:gap-12"
                >
                    {[
                        { icon: TrendingUp, text: "Metodologia Comprovada" },
                        { icon: Clock, text: "Suporte 24/7" },
                        { icon: BookOpen, text: "Conteúdo Atualizado" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-zinc-500 text-sm">
                            <item.icon size={16} className="text-blue-500" />
                            <span className="font-semibold">{item.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default SocialProof;

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Star, ShieldCheck, Flame } from 'lucide-react';

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-zinc-950">
            {/* Hypnotic Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[180px] -z-10 animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
                        O INVESTIMENTO QUE VAI <span className="text-blue-500">MUDAR SUA VIDA</span>
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-medium">
                        Acesso total à plataforma número 1 em aprovação por um valor simbólico.
                    </p>
                </motion.div>

                {/* Single Plan "The Beast" Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="relative max-w-2xl mx-auto group"
                >
                    {/* Animated Outer Glow (Subtler for Glass) */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-[40px] blur-lg opacity-40 group-hover:opacity-60 animate-gradient bg-300% transition-opacity duration-500" />

                    <div className="relative glass-hydro rounded-[38px] p-8 md:p-12 overflow-hidden">
                        {/* Top Badge */}
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-2xl shadow-xl z-20">
                            Oferta Exclusiva de Lançamento
                        </div>

                        <div className="flex flex-col items-center mb-10 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-inner shadow-white/5">
                                <Zap className="w-8 h-8 text-blue-400 fill-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-md">PLANO HPC PRO</h3>
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-zinc-400 line-through text-2xl font-bold">R$ 59,90</span>
                                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black px-2 py-1 rounded">ECONOMIZE 50%</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-zinc-400 uppercase">Apenas</span>
                                <span className="text-7xl font-black text-white tracking-tighter drop-shadow-xl">R$ 29,90</span>
                                <span className="text-xl font-bold text-zinc-400">/mês</span>
                            </div>
                            <p className="text-zinc-400 mt-4 text-center font-medium">
                                Cancele quando quiser. Sem letras miúdas.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left relative z-10">
                            {[
                                { icon: Sparkles, text: "Brain-Mapping AI" },
                                { icon: Flame, text: "Modo Estudo Ultra-Focado" },
                                { icon: Star, text: "Banco com +100k Questões" },
                                { icon: ShieldCheck, text: "Análise de Neuro-Desempenho" },
                                { icon: Check, text: "Acesso Mobile & Desktop" },
                                { icon: Check, text: "Cronograma Dinâmico" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
                                    <item.icon className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span className="text-sm font-bold text-zinc-200">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* HIGH DOPAMINE CTA */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-6 px-8 rounded-2xl font-black text-xl 
                                flex items-center justify-center gap-3 
                                bg-white text-black
                                border border-white/30 
                                shadow-[0_0_40px_rgba(255,255,255,0.3)] 
                                hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]
                                ring-4 ring-white/10
                                transition-all duration-300
                                relative overflow-hidden group z-10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 transform skew-x-12" />
                            <Zap className="fill-blue-600 text-blue-600 relative z-10" />
                            <span className="relative z-10">GARANTIR MINHA VAGA AGORA</span>
                        </motion.button>

                        <div className="mt-8 flex items-center justify-center gap-6 text-zinc-500 relative z-10">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Transação Segura
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Acesso Imediato
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scarcity Trigger */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-12 text-zinc-500 text-sm font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Apenas 12 vagas restantes com este desconto
                </motion.p>
            </div>
        </section>
    );
};

export default Pricing;

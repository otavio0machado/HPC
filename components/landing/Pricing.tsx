import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Star, ShieldCheck, Flame } from 'lucide-react';
import { authService } from '../../services/authService';
import { toast } from 'sonner';

interface PricingProps {
    onNavigate?: (view: 'landing' | 'auth' | 'dashboard') => void;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                if (onNavigate) onNavigate('auth');
                else window.location.href = '/auth'; // Fallback
                return;
            }

            const result = await authService.createCheckoutSession();
            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                toast.error(result.message || "Erro ao iniciar checkout");
            }
        } catch (error) {
            console.error("Pricing checkout error:", error);
            toast.error("Erro interno no checkout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 drop-shadow-sm">
                        O INVESTIMENTO NA SUA <span className="text-blue-600 dark:text-blue-500">APROVAÇÃO</span>
                    </h2>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-medium">
                        Acesso total à plataforma de inteligência que vai acelerar seus resultados.
                    </p>
                </motion.div>

                {/* Single Plan "The Beast" Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="relative max-w-lg mx-auto group"
                >
                    <div className="relative glass-spatial rounded-[38px] p-8 md:p-12 overflow-hidden">
                        {/* Top Badge */}
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-bl-2xl shadow-lg z-20">
                            Oferta Exclusiva
                        </div>

                        <div className="flex flex-col items-center mb-10 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                                <Zap className="w-10 h-10 text-white fill-white" />
                            </div>
                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">PLANO PRO</h3>
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-zinc-400 line-through text-xl font-bold">R$ 59,90</span>
                                <span className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-black px-2 py-1 rounded">ECONOMIZE 50%</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase">Apenas</span>
                                <span className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">R$ 29,90</span>
                                <span className="text-xl font-bold text-zinc-500 dark:text-zinc-400">/mês</span>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-center font-medium">
                                Cancele quando quiser. Sem fidelidade.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="flex flex-col gap-4 mb-10 text-left relative z-10 w-full pl-4">
                            {[
                                { icon: Sparkles, text: "Brain-Mapping AI" },
                                { icon: Flame, text: "Modo Estudo Ultra-Focado" },
                                { icon: Star, text: "Banco de Questões Completo" },
                                { icon: ShieldCheck, text: "Análise de Neuro-Desempenho" },
                                { icon: Check, text: "Acesso Mobile & Desktop" },
                                { icon: Check, text: "Cronograma Dinâmico" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <item.icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-base font-medium text-zinc-700 dark:text-zinc-200">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* HIGH DOPAMINE CTA */}
                        <motion.button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-5 px-8 rounded-xl font-bold text-lg
                                flex items-center justify-center gap-3
                                bg-zinc-900 dark:bg-white text-white dark:text-black
                                shadow-xl hover:shadow-2xl
                                transition-all duration-300
                                relative overflow-hidden group z-10 disabled:opacity-70"
                        >
                            {isLoading ? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Zap className="fill-current w-5 h-5" />}
                            <span className="relative z-10">{isLoading ? 'PROCESSANDO...' : 'GARANTIR ACESSO AGORA'}</span>
                        </motion.button>

                        <div className="mt-8 flex items-center justify-center gap-6 text-zinc-400 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Check className="w-3 h-3 text-green-500" />
                                Compra Segura
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Check className="w-3 h-3 text-green-500" />
                                Acesso Imediato
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scarcity Trigger - Removed exact number */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-12 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Novas vagas abertas
                </motion.p>
            </div >
        </section >
    );
};

export default Pricing;

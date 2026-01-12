import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Star, ShieldCheck, Flame, Crown, RefreshCw, Gift, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { toast } from 'sonner';

interface PricingProps {
    onNavigate?: (view: 'landing' | 'auth' | 'dashboard') => void;
}

const features = [
    { icon: Sparkles, text: "Brain-Mapping AI Completo" },
    { icon: Flame, text: "Modo Estudo Ultra-Focado" },
    { icon: Star, text: "Banco de Questões Completo" },
    { icon: ShieldCheck, text: "Análise de Neuro-Desempenho" },
    { icon: Check, text: "Acesso Mobile & Desktop" },
    { icon: Check, text: "Cronograma Dinâmico" },
    { icon: Check, text: "Tutor IA Ilimitado" },
    { icon: Check, text: "Notas Inteligentes" },
];

const freeFeatures = [
    "5 Flashcards por dia",
    "Acesso limitado ao banco de questões",
    "Estatísticas básicas",
];

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                if (onNavigate) onNavigate('auth');
                else window.location.href = '/auth';
                return;
            }

            const result = await authService.createCheckoutSession();
            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                toast.error(result.message || "Erro ao iniciar checkout");
            }
        } catch {
            toast.error("Erro interno no checkout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="pricing" className="py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-full blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Crown size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            Oferta Especial
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
                        Invista na sua
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"> Aprovação</span>
                    </h2>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Acesso completo à plataforma que vai transformar seus resultados
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-[32px] p-8 relative overflow-hidden"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Grátis</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Para experimentar</p>
                        </div>

                        <div className="mb-8">
                            <div className="text-5xl font-black text-zinc-900 dark:text-white">R$ 0</div>
                            <div className="text-zinc-500">para sempre</div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {freeFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-zinc-500" />
                                    </div>
                                    <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            onClick={() => onNavigate?.('auth')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 px-6 rounded-xl font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Começar Grátis
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-[36px] blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-gradient bg-size-300" />

                        <div className="relative glass-spatial rounded-[32px] p-8 overflow-hidden">
                            {/* Popular badge */}
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-6 py-2 rounded-bl-2xl shadow-lg z-20">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={12} />
                                    Mais Popular
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-6 h-6 text-amber-500" />
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Pro</h3>
                                </div>
                                <p className="text-zinc-600 dark:text-zinc-400">Acesso completo</p>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xl text-zinc-400 line-through">R$ 59,90</span>
                                    <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                        -50%
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-zinc-900 dark:text-white">R$ 29,90</span>
                                    <span className="text-zinc-500">/mês</span>
                                </div>
                                <div className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                                    <RefreshCw size={14} />
                                    Cancele quando quiser
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                {features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <feature.icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-zinc-700 dark:text-zinc-200 font-medium">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-5 px-8 rounded-xl font-bold text-lg relative overflow-hidden group/btn disabled:opacity-70"
                            >
                                {/* Button background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />

                                {/* Shimmer */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                />

                                <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Zap className="w-5 h-5 fill-current" />
                                    )}
                                    {isLoading ? 'PROCESSANDO...' : 'GARANTIR ACESSO PRO'}
                                </span>
                            </motion.button>

                            {/* Trust badges */}
                            <div className="mt-6 flex items-center justify-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    Compra Segura
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    Acesso Imediato
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Guarantee Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-zinc-900 dark:text-white">Garantia de 7 dias</div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Não gostou? Devolvemos 100% do valor</div>
                        </div>
                    </div>
                </motion.div>

                {/* Scarcity */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                >
                    <p className="text-zinc-500 text-sm font-medium flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Promoção por tempo limitado • Preço aumenta em breve
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Crown, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import UpgradeModal from './UpgradeModal';

interface SubscriptionPortalProps {
    user: any;
}

const SubscriptionPortal: React.FC<SubscriptionPortalProps> = ({ user }) => {
    // const { user, refreshUser } = useAuth(); removed
    const [loading, setLoading] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Derived state
    const isPro = user?.subscription_tier === 'pro';

    const handlePortalRedirect = async () => {
        setLoading(true);
        try {
            const result = await authService.createPortalSession();
            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                toast.error(result.message || "Erro ao acessar portal de assinatura.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3" />

            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Assinatura & Planos</h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Current Plan Card */}
                <div className="flex-1 bg-white dark:bg-zinc-950/30 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Seu Plano Atual</h4>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                                        {isPro ? 'High Performance PRO' : 'Plano Gratuito'}
                                    </h2>
                                    {isPro && (
                                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20">PRO</span>
                                    )}
                                </div>
                            </div>
                            {isPro ? (
                                <div className="p-3 rounded-full bg-green-500/10 text-green-500 shadow-inner ring-1 ring-green-500/20">
                                    <Check size={24} />
                                </div>
                            ) : (
                                <div className="p-3 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-400">
                                    <Crown size={24} />
                                </div>
                            )}
                        </div>

                        {isPro ? (
                            <div className="space-y-4">
                                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center gap-3 text-sm text-green-700 dark:text-green-300">
                                    <Check size={16} />
                                    <span>Sua assinatura está ativa e operante.</span>
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Próxima cobrança: <span className="font-medium text-zinc-900 dark:text-zinc-200">Gerenciado via Stripe</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    Você está utilizando a versão gratuita. Faça o upgrade para desbloquear IA avançada, simulados ilimitados e flashcards inteligentes.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['IA Tutor', 'Simulados', 'Estatísticas', 'Sem Limites'].map((feat, i) => (
                                        <span key={i} className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative Gradient Blob */}
                    {isPro && <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />}
                </div>

                {/* Actions Card */}
                <div className="flex-1 lg:max-w-xs flex flex-col gap-4">
                    {isPro ? (
                        <>
                            <button
                                onClick={handlePortalRedirect}
                                disabled={loading}
                                className="flex-1 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold p-6 rounded-2xl
                                    hover:scale-[1.02] active:scale-[0.98] transition-all duration-300
                                    shadow-xl shadow-black/5 dark:shadow-white/5
                                    flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {loading ? (
                                    <Loader2 className="animate-spin" size={32} />
                                ) : (
                                    <div className="p-3 rounded-full bg-white/10 dark:bg-black/5 group-hover:bg-white/20 dark:group-hover:bg-black/10 transition-colors">
                                        <ExternalLink size={24} />
                                    </div>
                                )}
                                <span className="text-center">
                                    {loading ? 'Redirecionando...' : 'Gerenciar Assinatura'}
                                </span>
                                <span className="text-xs font-normal opacity-60">
                                    Alterar plano, pagamento ou cancelar
                                </span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="flex-1 w-full relative overflow-hidden rounded-2xl p-6
                                bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                                hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                flex flex-col items-center justify-center gap-2 group text-center"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 p-3 opacity-20">
                                <Crown size={64} />
                            </div>

                            <span className="font-bold text-xl relative z-10">Virar PRO</span>
                            <span className="text-sm opacity-90 relative z-10">Desbloqueie todo o potencial</span>
                        </button>
                    )}

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <AlertCircle size={16} className="shrink-0 text-zinc-400" />
                        <p>
                            Pagamentos processados com segurança pelo Stripe. Você pode cancelar a qualquer momento.
                        </p>
                    </div>
                </div>
            </div>

            {showUpgradeModal && (
                <UpgradeModal
                    onClose={() => setShowUpgradeModal(false)}
                    onSuccess={() => {
                        setShowUpgradeModal(false);
                        window.location.reload();
                        toast.success("Upgrade realizado com sucesso!");
                    }}
                />
            )}
        </section>
    );
};

export default SubscriptionPortal;

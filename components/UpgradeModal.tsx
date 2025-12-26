import React, { useState } from 'react';
import { X, Check, Zap, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface UpgradeModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const result = await authService.createCheckoutSession();

            if (result.success && result.url) {
                // Redirect to Stripe
                window.location.href = result.url;
            } else {
                toast.error(result.message || "Erro ao iniciar processo de pagamento.");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado. Tente novamente.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header Background */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-10 text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                        <Zap size={32} className="text-white fill-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Desbloqueie o Poder Total</h3>
                    <p className="text-zinc-400 mb-8">
                        O plano Gratuito dá acesso apenas ao Planner. Para acessar Notas, Tutores, Flashcards e Simulados, faça o upgrade.
                    </p>

                    <div className="space-y-3 mb-8 text-left">
                        <div className="flex items-center gap-3 text-zinc-300">
                            <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check size={12} /></div>
                            <span>Acesso ilimitado a Tutores IA</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check size={12} /></div>
                            <span>Flashcards Inteligentes</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check size={12} /></div>
                            <span>Simulados com Correção IA</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <div className="p-1 rounded-full bg-green-500/20 text-green-500"><Check size={12} /></div>
                            <span>Sistema de Notas Avançado</span>
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Processando...
                            </>
                        ) : (
                            "Virar PRO agora"
                        )}
                    </button>

                    <p className="text-xs text-zinc-500 mt-4">Somente simulação. Nenhum pagamento real.</p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;

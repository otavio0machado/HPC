import React from 'react';
import { Check } from 'lucide-react';

const pricingTiers = [
    {
        name: 'Básico',
        price: 'R$ 0',
        description: 'Para quem está começando a organizar os estudos.',
        features: [
            'Planejador Semanal Básico',
            'Acesso a materiais gratuitos',
            'Comunidade no Discord'
        ],
        highlight: false,
        cta: 'Começar Grátis',
    },
    {
        name: 'Pro',
        price: 'R$ 29,90',
        period: '/mês',
        description: 'Otimize seu tempo e maximize sua performance.',
        features: [
            'Planejador AI Personalizado',
            'Banco de Questões Ilimitado',
            'Análise de Desempenho Avançada',
            'Flashcards Inteligentes',
            'Suporte Prioritário'
        ],
        highlight: true,
        cta: 'Assinar Pro',
    },
    {
        name: 'Extensivo',
        price: 'R$ 499',
        period: '/ano',
        description: 'Preparação completa para garantir sua aprovação.',
        features: [
            'Tudo do plano Pro',
            'Mentorias Mensais ao Vivo',
            'Correção de Redação',
            'Simulados Exclusivos',
            'Acesso Vitalício aos Conteúdos'
        ],
        highlight: false,
        cta: 'Garantir Vaga',
    }
];

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-4 drop-shadow-lg">
                        Invista no seu <span className="text-blue-400">Futuro</span>
                    </h2>
                    <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                        Escolha o plano ideal para sua jornada de aprovação. Sem compromisso, cancele quando quiser.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`rounded-[32px] p-8 flex flex-col transition-all duration-300 ${tier.highlight
                                ? 'glass-card border-blue-500/30 scale-105 z-10 shadow-[0_20px_60px_rgba(59,130,246,0.15)] ring-1 ring-blue-400/20'
                                : 'glass-card hover:bg-white/5 opacity-90 hover:opacity-100 ring-1 ring-white/5'
                                }`}
                        >
                            <div className="mb-6">
                                <h3 className={`text-lg font-bold mb-2 ${tier.highlight ? 'text-blue-400' : 'text-white'}`}>{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white tracking-tight">{tier.price}</span>
                                    {tier.period && <span className="text-sm text-zinc-400 font-medium">{tier.period}</span>}
                                </div>
                                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{tier.description}</p>
                            </div>

                            <div className="flex-grow">
                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <div className={`p-0.5 rounded-full ${tier.highlight ? 'bg-blue-500/20' : 'bg-white/10'} shrink-0 mt-0.5`}>
                                                <Check className={`w-3.5 h-3.5 ${tier.highlight ? 'text-blue-400' : 'text-white/70'}`} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${tier.highlight
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30 hover:scale-[1.02] hover:shadow-blue-900/50'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 hover:scale-[1.02]'
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;

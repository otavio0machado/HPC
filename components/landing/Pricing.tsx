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
        <section id="pricing" className="py-24 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-4">
                        Invista no seu <span className="text-blue-500">Futuro</span>
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Escolha o plano ideal para sua jornada de aprovação. Sem compromisso, cancele quando quiser.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`rounded-2xl p-8 border flex flex-col ${tier.highlight
                                    ? 'bg-zinc-900 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10'
                                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors'
                                }`}
                        >
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    {tier.period && <span className="text-sm text-zinc-500">{tier.period}</span>}
                                </div>
                                <p className="text-sm text-zinc-400 mt-2">{tier.description}</p>
                            </div>

                            <div className="flex-grow">
                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                                            <Check className="w-5 h-5 text-blue-500 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${tier.highlight
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
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

import React from 'react';
import { Target, Brain, Zap, BarChart3 } from 'lucide-react';

const methods = [
    {
        icon: Brain,
        title: 'Active Recall',
        description: 'Esqueça a leitura passiva. Nosso sistema força seu cérebro a buscar a informação, fortalecendo as conexões neurais e a memória de longo prazo.'
    },
    {
        icon: Zap,
        title: 'Spaced Repetition',
        description: 'O algoritmo inteligente calcula o momento exato para você revisar cada conteúdo, evitando a curva do esquecimento.'
    },
    {
        icon: Target,
        title: 'Foco Direcionado',
        description: 'Pare de estudar o que você já sabe. A IA identifica seus pontos fracos e cria micro-ciclos de estudo para eliminá-los.'
    },
    {
        icon: BarChart3,
        title: 'Metríficas Reais',
        description: 'Acompanhe sua evolução com dados concretos. Saiba exatamente o quanto você progrediu em cada matéria e probabilidade de aprovação.'
    }
];

const Methodology: React.FC = () => {
    return (
        <section id="metodologia" className="py-24 bg-zinc-950 border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-6">
                            Uma metodologia baseada em <span className="text-blue-500">Ciência Cognitiva</span>
                        </h2>
                        <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                            O HPC não é apenas uma plataforma de estudos, é um sistema de alta performance desenhado para hackear seu aprendizado. Utilizamos os princípios mais modernos da neurociência para garantir que cada minuto de estudo conte.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {methods.map((item) => (
                                <div key={item.title} className="flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-semibold text-white">{item.title}</h3>
                                    <p className="text-sm text-zinc-500 leading-snug">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50"></div>
                        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 aspect-square flex items-center justify-center overflow-hidden">
                            {/* Abstract visual representation */}
                            <div className="relative w-full h-full">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-4 opacity-50">
                                        <div className="w-24 h-24 rounded-lg bg-zinc-800 border border-zinc-700"></div>
                                        <div className="w-24 h-24 rounded-lg bg-zinc-800 border border-zinc-700"></div>
                                        <div className="w-24 h-24 rounded-lg bg-zinc-800 border border-zinc-700"></div>
                                        <div className="w-24 h-24 rounded-lg bg-zinc-800 border border-zinc-700 text-blue-500 flex items-center justify-center font-mono text-xs">+15%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Methodology;

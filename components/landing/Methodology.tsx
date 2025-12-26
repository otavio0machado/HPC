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
        <section id="metodologia" className="py-24 relative overflow-hidden">
            {/* Background Blob for depth */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-6 drop-shadow-lg">
                            Uma metodologia baseada em <span className="text-blue-400">Ciência Cognitiva</span>
                        </h2>
                        <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
                            O HPC não é apenas uma plataforma de estudos, é um sistema de alta performance desenhado para hackear seu aprendizado. Utilizamos os princípios mais modernos da neurociência para garantir que cada minuto de estudo conte.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {methods.map((item) => (
                                <div key={item.title} className="glass-card p-5 rounded-2xl hover-lift group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-snug">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-50 animate-pulse"></div>
                        <div className="glass-card rounded-[32px] p-8 aspect-square flex items-center justify-center overflow-hidden relative">
                            {/* Abstract visual representation */}
                            <div className="relative w-full h-full">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[60px] animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"></div>
                                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"></div>
                                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"></div>
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/20 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] animate-bounce">+15%</div>
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

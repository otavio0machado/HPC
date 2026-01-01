import React from 'react';

export const LessonProbabilidade = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. A Matemática da Incerteza</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Probabilidade calcula a chance de algo acontecer. Nascida dos jogos de azar (Pascal & Fermat), hoje domina a economia e a física quântica.
                </p>
                <div className="bg-zinc-800 p-4 rounded mt-4 text-center font-mono text-white">
                    {'P(A) = Favoráveis / Totais'}
                </div>
            </div>

            {/* Venn Diagram Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Union (OR) */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-indigo-500">∪</div>
                    <h3 className="text-lg font-bold text-white mb-2">União (OU)</h3>
                    <p className="text-xs text-zinc-400 mb-3">Soma as chances. Cuidado para não contar a interseção 2x.</p>
                    <div className="font-mono text-indigo-400 text-sm bg-black/20 p-2 rounded break-all">
                        {'P(AUB) = P(A) + P(B) - P(A∩B)'}
                    </div>
                </div>

                {/* Intersection (AND) */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-pink-500">∩</div>
                    <h3 className="text-lg font-bold text-white mb-2">Interseção (E)</h3>
                    <p className="text-xs text-zinc-400 mb-3">Multiplica. Acontecer um E o outro.</p>
                    <div className="font-mono text-pink-400 text-sm bg-black/20 p-2 rounded break-all">
                        {'P(A∩B) = P(A) . P(B)'}
                        <span className="text-[10px] text-zinc-500 block text-center mt-1">(Se independentes)</span>
                    </div>
                </div>
            </div>

            {/* Conditional Probability */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold text-white mb-2">Probabilidade Condicional</h3>
                <p className="text-sm text-zinc-400 mb-4">
                    "Qual a chance de A, <strong className="text-white">dado que B aconteceu?</strong>"
                    <br />O evento B reduz o seu Espaço Amostral. O denominador muda.
                </p>
                <div className="flex justify-center">
                    <div className="font-mono text-yellow-400 text-lg bg-black/30 px-4 py-2 rounded">
                        {'P(A|B) = P(A∩B) / P(B)'}
                    </div>
                </div>
            </div>

            {/* Case Study: False Positive */}
            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-bold text-red-400 mb-2">O Paradoxo do Falso Positivo</h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    Doença rara (1%). Teste 99% preciso. Deu Positivo. Você está doente?
                    <br /><strong className="text-white">Provavelmente NÃO.</strong> (A chance é ~50%).
                    <br />Por quê? Em 1000 pessoas, ha 10 doentes (quase todos positivos) e 990 saudáveis (onde 1% falha = 10 falsos positivos).
                    <br />Total de positivos: 20. Você é um deles. Só 10 são reais.
                </p>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-red-500/10 rounded text-red-200">Bayes</span>
                    <span className="px-2 py-1 bg-red-500/10 rounded text-red-200">Contra-intuitivo</span>
                </div>
            </div>
        </div>
    );
};

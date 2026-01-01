import React from 'react';

export const LessonEstatistica = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. Ordem no Caos</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Vivemos na era do Big Data. A <strong className="text-white">Estatística</strong> resume milhões de dados em decisões.
                    As <strong className="text-white">Matrizes</strong> são a linguagem como os computadores organizam esses dados.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Estatística Descritiva</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-blue-500">
                        <strong className="text-blue-400 block mb-1">Média</strong>
                        <p className="text-xs text-zinc-500">Soma / Total. Sensível a extremos.</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-green-500">
                        <strong className="text-green-400 block mb-1">Mediana</strong>
                        <p className="text-xs text-zinc-500">O valor do meio. A verdade social (salários).</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-red-500">
                        <strong className="text-red-400 block mb-1">Desvio Padrão</strong>
                        <p className="text-xs text-zinc-500">Confiabilidade. Dados espalhados = Alto DP.</p>
                    </div>
                </div>
            </div>

            {/* Matrices & Systems */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🔢</span>
                    <h3 className="text-xl font-bold text-white">Matrizes e Sistemas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <strong className="text-indigo-300 block mb-1">Determinante (Det)</strong>
                        <p className="text-zinc-400 text-xs">
                            Se {'Det ≠ 0'}, o sistema tem solução única (Retas cruzam).
                            <br />Se {'Det = 0'}, é Impossível ou Indeterminado (Paralelas).
                        </p>
                    </div>
                    <div>
                        <strong className="text-purple-300 block mb-1">Aplicações Reais</strong>
                        <p className="text-zinc-400 text-xs">
                            Computação Gráfica (Rotação 3D), Google PageRank, Redes Neurais.
                            Tudo são multiplicações de matrizes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-500/20">
                <h2 className="text-xl font-bold text-yellow-400 mb-2">A Falácia da Média (Bill Gates)</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Um bar tem 10 desempregados (Renda R$ 0). Bill Gates entra.
                    <br />Média de Renda: <strong className="text-white">Milionária</strong>.
                    <br />Mediana: <strong className="text-white">R$ 0</strong> (Continua igual).
                    <br />Lição: Em países desiguais, a Média mente. Olhe sempre para a Mediana.
                </p>
            </div>
        </div>
    );
};

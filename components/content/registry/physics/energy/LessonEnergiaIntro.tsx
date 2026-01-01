import React from 'react';

export const LessonEnergiaIntro = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-violet-400">1. Energia e Trabalho</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Energia é a capacidade de realizar <strong className="text-white">Trabalho</strong>.
                    Trabalho não é cansaço. É deslocar algo com força.
                    <br />Se a parede não mexe, Trabalho = 0 (mesmo que você sue).
                </p>
            </div>

            {/* Concepts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Work */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-500">
                    <strong className="text-yellow-400 block mb-1">Trabalho (τ)</strong>
                    <div className="bg-black/20 p-2 rounded text-center mb-1">
                        <code className="text-white text-sm">{'τ = F . d . cos(θ)'}</code>
                    </div>
                    <p className="text-xs text-zinc-500">Se θ=90° (pendicular), não trabalha.</p>
                </div>

                {/* Power */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-orange-500">
                    <div className="flex justify-between">
                        <strong className="text-orange-400 block mb-1">Potência (W)</strong>
                        <span className="text-xs text-zinc-500">Rapidez</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded text-center mb-1">
                        <code className="text-white text-sm">{'Pot = Trabalho / Tempo'}</code>
                    </div>
                    <p className="text-xs text-zinc-500">Fusca vs Ferrari: Mesmo trabalho, tempos diferentes.</p>
                </div>
            </div>

            {/* Mechanical Energy Types */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white">Energia Mecânica (Soma)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-black/20 rounded-xl">
                        <span className="text-2xl block mb-1">🏃</span>
                        <strong className="text-blue-400 text-sm">Cinética</strong>
                        <div className="mt-1 text-xs text-zinc-400">{'mV² / 2'}</div>
                        <span className="text-[10px] text-red-400 block mt-1">Velocidade ²</span>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                        <span className="text-2xl block mb-1">🏔️</span>
                        <strong className="text-emerald-400 text-sm">Pot. Gravitacional</strong>
                        <div className="mt-1 text-xs text-zinc-400">{'m.g.h'}</div>
                        <span className="text-[10px] text-zinc-500 block mt-1">Depende da Altura</span>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                        <span className="text-2xl block mb-1">🌀</span>
                        <strong className="text-purple-400 text-sm">Pot. Elástica</strong>
                        <div className="mt-1 text-xs text-zinc-400">{'kx² / 2'}</div>
                        <span className="text-[10px] text-zinc-500 block mt-1">Molas</span>
                    </div>
                </div>
                <div className="bg-indigo-500/10 p-3 rounded text-center border border-indigo-500/30">
                    <strong className="text-indigo-300 text-sm block mb-1">Conservação da Energia</strong>
                    <code className="text-white text-xs">{'Em(antes) = Em(depois)'}</code>
                    <p className="text-[10px] text-zinc-400 mt-1">(Sem atrito, a energia só se transforma)</p>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎢</span>
                    <h2 className="text-xl font-bold text-blue-400">Estudo de Caso: O Looping</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Qual a altura mínima para não cair no loop?
                    <br />Pela conservação da energia e força centrípeta:
                    <br /><code className="text-white">{'h = 2,5 . R'}</code>
                    <br />Tem que ser 2,5 vezes o raio. Menos que isso, a gravidade vence no topo.
                </p>
            </div>
        </div>
    );
};

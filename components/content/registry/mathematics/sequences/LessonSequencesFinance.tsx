import React from 'react';

export const LessonSequencesFinance = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. O Poder dos Padrões</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Sequências são listas que seguem uma regra.
                    <br />• <strong className="text-white">PA (Aritmética):</strong> Soma constante. (Linear).
                    <br />• <strong className="text-white">PG (Geométrica):</strong> Multiplicação constante. (Exponencial).
                    <br />Isso é a base do dinheiro (Juros Simples vs Compostos).
                </p>
            </div>

            {/* PA vs PG Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold text-white mb-2">Progressão Aritmética (PA)</h3>
                    <p className="text-xs text-zinc-500 mb-3">Escada (Soma r)</p>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between"><span className="text-zinc-400">Geral:</span> <span className="text-blue-400">aₙ = a₁ + (n-1)r</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400">Soma:</span> <span className="text-blue-400">(a₁ + aₙ)n / 2</span></div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 border-l-4 border-orange-500">
                    <h3 className="text-lg font-bold text-white mb-2">Progressão Geométrica (PG)</h3>
                    <p className="text-xs text-zinc-500 mb-3">Multiplicativa (Vezes q)</p>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between"><span className="text-zinc-400">Geral:</span> <span className="text-orange-400">aₙ = a₁ . qⁿ⁻¹</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400">Soma Inf:</span> <span className="text-orange-400">a₁ / (1-q)</span></div>
                    </div>
                </div>
            </div>

            {/* Linear vs Compound Interest */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-indigo-400">2. Matemática Financeira</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                        <strong className="text-blue-300 block mb-1">Juros Simples (PA)</strong>
                        <p className="text-xs text-zinc-400 mb-2">Juro incide só no capital inicial. Crescimento linear.</p>
                        <div className="text-center font-mono text-indigo-400 font-bold bg-black/20 rounded p-1">J = C.i.t</div>
                    </div>
                    <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                        <strong className="text-orange-300 block mb-1">Juros Compostos (PG)</strong>
                        <p className="text-xs text-zinc-400 mb-2">Juro sobre juro. Crescimento Exponencial. Regra do mercado.</p>
                        <div className="text-center font-mono text-indigo-400 font-bold bg-black/20 rounded p-1">M = C(1+i)ᵗ</div>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-bold text-red-400 mb-2">Alerta: Cartão de Crédito</h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                    Por que as dívidas explodem? Porque são calculadas em <strong className="text-white">Juros Compostos (PG)</strong>.
                    Uma dívida de 1.000 a 10% a.m. não vira 2.200 em um ano (Simples), vira mais de 3.100.
                    O tempo joga contra quem deve e a favor de quem investe.
                </p>
            </div>
        </div>
    );
};

import React from 'react';

export const LessonCombinatoria = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. Introdução: A Arte de Contar</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Se perguntarem "quantas senhas de 4 dígitos existem?", você não escreve todas. Você usa a <strong className="text-white">Combinatória</strong>.
                    O grande divisor de águas é: <strong className="text-white">A ORDEM IMPORTA?</strong>
                    <br />Se sim (Senha 123 ≠ 321), é Arranjo/Permutação.
                    <br />Se não (Salada Maçã+Banana = Banana+Maçã), é Combinação.
                </p>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Permutation */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-emerald-500">
                    <strong className="text-emerald-400 block mb-1">Permutação (Pn)</strong>
                    <p className="text-xs text-zinc-400 mb-2">Usa <strong className="text-white">TODOS</strong>. Troca lugar.</p>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'Pn = n!'}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Ex: Anagramas (AMOR).</p>
                </div>

                {/* Arrangement */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                    <strong className="text-blue-400 block mb-1">Arranjo (An,p)</strong>
                    <p className="text-xs text-zinc-400 mb-2">Escolhe ALGUNS. <strong className="text-white">Ordem IMPORTA</strong>.</p>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'An,p = n! / (n-p)!'}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Ex: Pódio (Ouro/Prata).</p>
                </div>

                {/* Combination */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                    <strong className="text-purple-400 block mb-1">Combinação (Cn,p)</strong>
                    <p className="text-xs text-zinc-400 mb-2">Escolhe ALGUNS. <strong className="text-white">NÃO Importa</strong>.</p>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'Cn,p = n! / p!(n-p)!'}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Ex: Equipes, Mega-Sena.</p>
                </div>
            </div>

            {/* Factorial Info */}
            <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="text-2xl">❗</div>
                <div>
                    <strong className="text-white block">Fatorial (n!)</strong>
                    <p className="text-xs text-zinc-400">
                        Multiplica descendo até 1. O crescimento é explosivo.
                        <br />5! = 120. 10! = 3.6 milhões.
                    </p>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🤑</span>
                    <h2 className="text-xl font-bold text-green-400">Estudo de Caso: Mega-Sena</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    Por que é difícil ganhar? É uma <strong className="text-white">Combinação</strong> de 60 números, escolhendo 6.
                    A ordem do sorteio não importa.
                    <br />Resultado: {'50.063.860'} possibilidades.
                    <br />Sua chance: 1 em 50 milhões. (Mais fácil cair um raio: 1 em 1 milhão).
                </p>
            </div>
        </div>
    );
};

import React from 'react';

export const LessonImpulsoIntro = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-violet-400">1. O Poder do Impacto</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Imagine um caminhão a 10 km/h e uma bicicleta a 10 km/h. O caminhão é mais difícil de parar.
                    Agora, uma bala a 1000 km/h vs uma bola de gude. A bala causa mais estrago.
                    <br />Essa união de Massa e Velocidade é a <strong className="text-white">Quantidade de Movimento (Q)</strong>.
                </p>
            </div>

            {/* Formulas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Momentum */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-indigo-500">
                    <h3 className="text-lg font-bold text-white mb-2">Quantidade de Movimento (Q)</h3>
                    <p className="text-xs text-zinc-500 mb-4">"Massa em movimento". Vetorial (tem direção).</p>
                    <div className="bg-black/20 p-3 rounded text-center">
                        <code className="text-indigo-400 font-bold text-lg">{'Q = m . v'}</code>
                    </div>
                    <p className="text-[10px] text-zinc-500 text-center mt-2">kg.m/s</p>
                </div>

                {/* Impulse */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-pink-500">
                    <h3 className="text-lg font-bold text-white mb-2">Impulso (I)</h3>
                    <p className="text-xs text-zinc-500 mb-4">A "dose" de força no tempo.</p>
                    <div className="bg-black/20 p-3 rounded text-center">
                        <code className="text-pink-400 font-bold text-lg">{'I = F . Δt'}</code>
                    </div>
                    <p className="text-[10px] text-zinc-500 text-center mt-2">Área do gráfico Fxt</p>
                </div>
            </div>

            {/* Theorem */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-white mb-2">Teorema do Impulso</h3>
                <p className="text-sm text-zinc-400 mb-4">
                    Para mudar a velocidade (Q), você precisa gastar Impulso.
                </p>
                <div className="bg-black/30 px-6 py-3 rounded-xl border border-white/10">
                    <code className="text-2xl text-yellow-400 font-bold">{'I = ΔQ'}</code>
                    <div className="text-xs text-zinc-500 mt-1">Impulso = Qfinal - Qinicial</div>
                </div>
            </div>

            {/* Collisions */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Tipos de Colisão</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-green-500">
                        <strong className="text-green-400 block mb-1">Elástica</strong>
                        <p className="text-xs text-zinc-400 mb-2">Bate e volta (Perfeita).</p>
                        <div className="text-[10px] bg-black/20 p-1 rounded text-center text-white">
                            Conserva Q e Energia
                        </div>
                    </div>
                    {/* Add other collision types if needed based on the original content, for now sticking to what was seen */}
                </div>
            </div>

            {/* Case Study - Car Crash (Implicitly mentioned in description, adding generic safety placeholder if not fully visible, but based on context seen) */}
            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-bold text-red-400 mb-2">Segurança Automotiva (Airbag)</h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                    O Airbag não diminui a velocidade do impacto, ele <strong className="text-white">AUMENTA O TEMPO</strong> ($\Delta t$) da colisão.
                    <br />Como $F = I / \Delta t$, se o tempo aumenta, a Força sobre seu rosto diminui drasticamente.
                    <br />O cinto de segurança faz o mesmo (estica um pouco).
                </p>
            </div>
        </div>
    );
};

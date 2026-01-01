import React from 'react';

export const LessonCinematicaIntro = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-violet-400">1. O Palco do Universo</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Cinemática é descrever o movimento "sem se preocupar com a causa".
                    O maior erro dos alunos: confundir <strong className="text-white">Escalar</strong> (só número) com <strong className="text-white">Vetorial</strong> (direção/sentido).
                    <br />Se você der uma volta ao mundo e voltar ao mesmo lugar: Distância = 40.000km. Deslocamento = 0.
                </p>
            </div>

            {/* Formulas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MRU */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                        <strong className="text-blue-400">MRU (Vel. Constante)</strong>
                        <span className="text-xs text-zinc-500">a = 0</span>
                    </div>
                    <div className="bg-black/20 p-2 rounded text-center mb-1">
                        <code className="text-white text-sm">{'S = S0 + v.t'}</code>
                    </div>
                    <p className="text-xs text-zinc-400 text-center">"Sorvete"</p>
                </div>

                {/* MRUV */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-red-500">
                    <div className="flex justify-between items-center mb-2">
                        <strong className="text-red-400">MRUV (Aceleração)</strong>
                        <span className="text-xs text-zinc-500">a ≠ 0</span>
                    </div>
                    <div className="space-y-1">
                        <div className="bg-black/20 p-2 rounded text-center">
                            <code className="text-white text-sm">{'V = V0 + a.t'}</code>
                        </div>
                        <div className="bg-black/20 p-2 rounded text-center">
                            <code className="text-white text-sm">{'S = S0 + V0t + at²/2'}</code>
                        </div>
                        <div className="bg-black/20 p-2 rounded text-center border border-red-500/30">
                            <code className="text-red-200 text-sm">{'V² = V0² + 2aΔS'}</code>
                        </div>
                        <p className="text-[10px] text-zinc-500 text-center">Torricelli: "Sem tempo a perder"</p>
                    </div>
                </div>
            </div>

            {/* Vectors Section */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🏹</span>
                    <h3 className="text-xl font-bold text-white">Cinemática Vetorial (Balística)</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                    Jogar uma pedra gera uma Parábola. Por quê? São 2 movimentos juntos:
                    <br />• <strong className="text-blue-400">Eixo X (Horizontal)</strong>: MRU (inércia).
                    <br />• <strong className="text-red-400">Eixo Y (Vertical)</strong>: MRUV (gravidade).
                </p>
                <div className="bg-black/30 p-3 rounded border border-white/10 text-center">
                    <span className="text-violet-300 font-mono text-sm">{'Vox = V.cos(θ)  |  Voy = V.sen(θ)'}</span>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-bold text-red-400 mb-2">Estudo de Caso: A Morte na Estrada</h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                    Por que correr é fatal? A distância de frenagem é <strong className="text-white">QUADRÁTICA</strong>.
                    <br />{'ΔS = (V² - V0²) / 2a'}
                    <br />Se você dobra a velocidade (50 → 100km/h), você precisa de <strong className="text-red-300">4x mais pista</strong> para parar.
                    A intuição é linear, mas a física é exponencial.
                </p>
            </div>
        </div>
    );
};

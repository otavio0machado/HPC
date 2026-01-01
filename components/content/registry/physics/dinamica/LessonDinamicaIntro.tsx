import React from 'react';

export const LessonDinamicaIntro = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-violet-400">1. Newton Explica Tudo</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Cinemática vê o movimento. Dinâmica explica a <strong className="text-white">CAUSA</strong> (Força).
                    Newton (1687) disse: "O estado natural não é parado. É andar para sempre. A força serve para mudar isso."
                </p>
            </div>

            {/* 3 Laws Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-zinc-500">
                    <strong className="text-white block mb-1">1ª Lei: Inércia</strong>
                    <p className="text-xs text-zinc-500">Matéria é preguiçosa. Resiste a mudar de velocidade.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-violet-500">
                    <strong className="text-violet-400 block mb-1">2ª Lei: Princípio</strong>
                    <div className="bg-black/20 p-1 rounded text-center my-2">
                        <code className="text-white font-bold">{'Fr = m.a'}</code>
                    </div>
                    <p className="text-xs text-zinc-500">Força gera Aceleração.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-pink-500">
                    <strong className="text-pink-400 block mb-1">3ª Lei: Ação/Reação</strong>
                    <p className="text-xs text-zinc-500">Pares nunca se anulam (corpos diferentes).</p>
                </div>
            </div>

            {/* Special Forces */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white">Forças Especiais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⚖️</span>
                        <div>
                            <strong className="block text-zinc-300">Peso vs Normal</strong>
                            <span className="text-xs text-zinc-500">Peso é gravidade mg. Normal é contato (não é o peso!).</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛑</span>
                        <div>
                            <strong className="block text-zinc-300">Atrito (Fat)</strong>
                            <span className="text-xs text-zinc-500">{'Fat = μ . N'}. Estático (segura) {'>'} Cinético (desliza).</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-violet-900/10 p-6 rounded-2xl border border-violet-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🛗</span>
                    <h2 className="text-xl font-bold text-violet-400">Estudo de Caso: O Elevador</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    A balança marca a <strong className="text-white">Normal</strong>, não seu peso.
                    <br />• Subindo Acelerado: Você sente "pesado" ($N = P + ma$).
                    <br />• Descendo Acelerado: Chão foge ($N = P - ma$).
                    <br />• Cabo Cortado: Você flutua ($N=0$).
                </p>
            </div>
        </div>
    );
};

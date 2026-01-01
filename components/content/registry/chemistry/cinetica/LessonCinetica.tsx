import React from 'react';

const LessonCinetica: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Termodinâmica diz "se" acontece. <strong className="text-white">Cinética</strong> diz "quando". O diamante deveria virar grafite, mas leva milhões de anos (cinética lenta).
                </p>
                <p className="text-zinc-400 leading-relaxed mt-2">
                    Já o <strong className="text-white">Equilíbrio Químico</strong> (V₁ = V₂) é a dança dinâmica onde reagentes e produtos coexistem. É vital para a indústria saber manipular esse limite.
                </p>
            </div>

            {/* Kinetics Factors */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">2. Cinética: Acelerando Reações</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                        <div className="text-2xl mb-2">🔥</div>
                        <strong className="block text-white mb-1">Temperatura</strong>
                        <span className="text-xs text-zinc-400">Mais energia = colisions mais fortes. Fator mais poderoso.</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors">
                        <div className="text-2xl mb-2">🪨</div>
                        <strong className="block text-white mb-1">Superfície</strong>
                        <span className="text-xs text-zinc-400">Pó reage mais rápido que barra. Mais área de contato.</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                        <div className="text-2xl mb-2">🧪</div>
                        <strong className="block text-white mb-1">Concentração</strong>
                        <span className="text-xs text-zinc-400">Mais moléculas no mesmo espaço = mais choques.</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                        <div className="text-2xl mb-2">⚡</div>
                        <strong className="block text-white mb-1">Catalisador</strong>
                        <span className="text-xs text-zinc-400">O Hacker. Cria atalho com menor Energia de Ativação. Não é consumido.</span>
                    </div>
                </div>
            </div>

            {/* Equilibrium & Le Chatelier */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-xl font-bold text-white mb-2">3. Equilíbrio e Le Chatelier</h2>
                <p className="text-zinc-400 text-sm">
                    "Se você perturba um sistema em equilíbrio, ele reage para neutralizar a perturbação."
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <strong className="text-blue-300 block border-b border-blue-500/20 pb-1">Pressão</strong>
                        <p className="text-xs text-zinc-400">
                            Aumentar P desloca para o lado de <strong>menor volume</strong> (menos gás).
                        </p>
                    </div>
                    <div className="space-y-2">
                        <strong className="text-red-300 block border-b border-red-500/20 pb-1">Temperatura</strong>
                        <p className="text-xs text-zinc-400">
                            Aumentar T favorece o sentido <strong>Endotérmico</strong> (absorve calor).
                        </p>
                    </div>
                    <div className="space-y-2">
                        <strong className="text-green-300 block border-b border-green-500/20 pb-1">Concentração</strong>
                        <p className="text-xs text-zinc-400">
                            Adicionar reagente desloca para os produtos (foge do excesso).
                        </p>
                    </div>
                </div>

                <div className="bg-black/20 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <strong className="text-white block">Constante Kc</strong>
                        <span className="text-zinc-500 text-xs">[Produtos] / [Reagentes]. Só muda com a Temperatura.</span>
                    </div>
                    <div className="text-2xl font-mono text-emerald-500 font-bold">Kc &gt; 1 = Rende Bem</div>
                </div>
            </div>

            {/* Case Study */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Haber-Bosch</h2>
                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-2">Amônia (NH₃) e a Fome Mundial</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                        Como produzir fertilizantes a partir do ar?
                        <br /><code className="text-blue-300">N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (Exo)</code>
                    </p>
                    <ul className="space-y-2 text-sm text-zinc-300">
                        <li><strong className="text-white">Pressão:</strong> Altíssima (200 atm) para forçar o lado de menor volume (2 mols vs 4 mols).</li>
                        <li><strong className="text-white">Temperatura:</strong> Moderada (450°C). Baixa seria melhor pro equilíbrio (Exo), mas muito lenta (Cinética).</li>
                        <li><strong className="text-white">Catalisador:</strong> Ferro, para compensar a velocidade.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LessonCinetica;

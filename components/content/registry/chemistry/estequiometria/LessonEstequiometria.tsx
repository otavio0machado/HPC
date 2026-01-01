import React from 'react';

const LessonEstequiometria: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Se a Química fosse um restaurante, a <strong className="text-white">Estequiometria</strong> seria a matemática da receita. Ela é a contabilidade dos átomos: em um sistema fechado, a massa total dos reagentes DEVE ser igual à massa dos produtos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                        <h3 className="text-emerald-400 font-bold mb-1">Lei de Lavoisier</h3>
                        <p className="text-sm text-zinc-300">"Na natureza, nada se cria, nada se perde, tudo se transforma." (Conservação das Massas)</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                        <h3 className="text-emerald-400 font-bold mb-1">Lei de Proust</h3>
                        <p className="text-sm text-zinc-300">Proporções Definidas. A água é sempre 11% H e 89% O, seja aqui ou em Marte.</p>
                    </div>
                </div>
            </div>

            {/* The Mole */}
            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-6 rounded-2xl border border-blue-500/20 flex flex-col items-center text-center">
                <h2 className="text-3xl font-black text-white mb-2">O MOL</h2>
                <div className="text-4xl font-mono text-blue-400 font-bold mb-4">6,02 × 10²³ unidades</div>
                <p className="text-zinc-300 max-w-lg">
                    Átomos são pequenos demais para contar um a um. O mol é a "dúzia" do químico. <br />
                    <span className="text-sm text-zinc-500 mt-2 block">1 Mol de qualquer gás nas CNTP ocupa <strong>22,4 Litros</strong>.</span>
                </p>
            </div>

            {/* Algorithm */}
            <div>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. O Algoritmo da Estequiometria</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="bg-emerald-500 text-black font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">1</div>
                        <div>
                            <strong className="block text-white">Escreva a Equação</strong>
                            <span className="text-zinc-400 text-sm">Quem reage com quem? O que produz?</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="bg-emerald-500 text-black font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">2</div>
                        <div>
                            <strong className="block text-white">Balanceie (Obrigatório)</strong>
                            <span className="text-zinc-400 text-sm">Use a regra do MACHO (Metal, Ametal, C, H, O). Garanta que os átomos sejam iguais nos dois lados.</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="bg-emerald-500 text-black font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">3</div>
                        <div>
                            <strong className="block text-white">Regra de Três</strong>
                            <span className="text-zinc-400 text-sm">Linha 1: Dados da equação (Mols, MM, 22.4L).<br />Linha 2: Dados do problema (X).</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Airbag</h2>
                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="text-5xl">💥</div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Salva-vidas em milissegundos</h3>
                            <p className="text-zinc-400 text-sm mb-3">
                                Azida de Sódio (NaN₃) decompõe numa colisão para inflar a bolsa com Nitrogênio (N₂).
                            </p>
                            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-blue-300 inline-block mb-3">
                                2 NaN₃(s) → 2 Na(s) + 3 N₂(g)
                            </div>
                            <p className="text-zinc-500 text-xs">
                                <strong>Erro de cálculo?</strong> Pouca massa = bolsa murcha (bate a cabeça). Muita massa = bolsa dura ou explosão. A estequiometria precisa ser exata.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonEstequiometria;

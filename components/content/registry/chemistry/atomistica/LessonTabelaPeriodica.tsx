import React from 'react';

const LessonTabelaPeriodica: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. O Mapa do Universo Químico</h2>
                <p className="text-zinc-400 leading-relaxed">
                    A Tabela Periódica não é apenas um poster de sala de aula. É literalmente o mapa de construção de tudo o que existe. Dmitry Mendeleev (1869) não apenas organizou os elementos conhecidos por massa atômica, mas <strong>previu</strong> a existência e as propriedades de elementos que ainda não haviam sido descobertos (como o Germânio, que ele chamou de eka-silício).
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    Mais tarde, Moseley reorganizou a tabela por <strong>Número Atômico (Z)</strong>, corrigindo falhas e estabelecendo a Lei Periódica: "As propriedades físicas e químicas dos elementos são funções periódicas de seus números atômicos."
                </p>

                <h2 className="text-2xl font-bold text-emerald-400 mt-8">2. Estrutura e Organização</h2>

                {/* Uploaded Image Display Placeholder if asset exists, otherwise generic description */}
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 p-2 my-6">
                    <img
                        src="/assets/periodic_trends.png"
                        alt="Tendências da Tabela Periódica"
                        className="w-full h-auto rounded-2xl opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <p className="text-center text-xs text-zinc-500 mt-2 font-mono">Tendências: Raio Atômico, Eletronegatividade e Energia de Ionização</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                            Anatomia
                        </h3>
                        <ul className="space-y-3">
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <strong className="text-emerald-300 block text-xs uppercase tracking-wider mb-1">Períodos (Linhas)</strong>
                                <span className="text-zinc-300 text-sm">São 7. Indicam o número de camadas eletrônicas. Ex: Sódio (3º período) = camadas K, L, M.</span>
                            </li>
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <strong className="text-emerald-300 block text-xs uppercase tracking-wider mb-1">Famílias (Colunas)</strong>
                                <span className="text-zinc-300 text-sm">São 18. Mesma configuração de valência ("sobrenome químico").</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-8 bg-blue-500 rounded-full" />
                            Principais Grupos
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-red-500/10 text-red-200 rounded-lg border border-red-500/20">
                                <strong>Metais Alcalinos (G1)</strong><br />Reativos, explodem na água.
                            </div>
                            <div className="p-2 bg-orange-500/10 text-orange-200 rounded-lg border border-orange-500/20">
                                <strong>Alcalinoterrosos (G2)</strong><br />Terminam em ns².
                            </div>
                            <div className="p-2 bg-yellow-500/10 text-yellow-200 rounded-lg border border-yellow-500/20">
                                <strong>Halogênios (G17)</strong><br />Geradores de sais, muito reativos.
                            </div>
                            <div className="p-2 bg-purple-500/10 text-purple-200 rounded-lg border border-purple-500/20">
                                <strong>Gases Nobres (G18)</strong><br />Inertes, octeto completo.
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-emerald-400 mt-8">3. As Propriedades Periódicas (O Coração da Matéria)</h2>
                <div className="bg-[#1A1B26] p-6 rounded-3xl border border-white/10 space-y-6 my-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-bold text-blue-300 border-b border-blue-500/30 pb-2">
                                <span>Raio Atômico</span>
                                <span>↙ (Baixo-Esquerda)</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Aumenta para baixo (mais camadas) e para a esquerda (menor atração nuclear). <br />
                                <span className="text-white">Maior: Frâncio (Fr)</span><br />
                                <span className="text-white">Menor: Hélio (He)</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-bold text-amber-300 border-b border-amber-500/30 pb-2">
                                <span>Energia de Ionização</span>
                                <span>↗ (Cima-Direita)</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Energia para arrancar um elétron. Inverso do raio. Quanto menor, mais difícil tirar.<br />
                                <span className="text-white">Maior EI: Hélio (He)</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-bold text-green-300 border-b border-green-500/30 pb-2">
                                <span>Eletronegatividade</span>
                                <span>↗ (Cima-Direita)</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                "Ganância" por elétrons. Gases nobres fora.<br />
                                <strong className="text-white">F &gt; O &gt; N &gt; Cl &gt; Br &gt; I &gt; S &gt; C &gt; P &gt; H</strong><br />
                                <span className="text-white">Rei: Flúor (F)</span>
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-emerald-400 mt-8">4. Estudo de Caso: Duelo Flúor vs. Frâncio</h2>
                <div className="flex flex-col md:flex-row gap-4 my-6">
                    <div className="flex-1 bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-green-400">Flúor (F)</h3>
                            <span className="text-xs font-mono bg-green-500/20 px-2 py-1 rounded">Grupo 17 (Topo)</span>
                        </div>
                        <p className="text-sm text-zinc-300 mb-4">
                            Minúsculo, "desesperado" por elétrons. High Energy.<br />
                            <strong>Resultado:</strong> Oxidante mais forte. Reage até com vidro.
                        </p>
                    </div>
                    <div className="flex items-center justify-center text-zinc-600 font-bold italic">VS</div>
                    <div className="flex-1 bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-blue-400">Frâncio (Fr)</h3>
                            <span className="text-xs font-mono bg-blue-500/20 px-2 py-1 rounded">Grupo 1 (Base)</span>
                        </div>
                        <p className="text-sm text-zinc-300 mb-4">
                            Gigantesco, elétron solto (blindagem).<br />
                            <strong>Resultado:</strong> Instável, radioativo. Entrega elétron facilmente (explosivo).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonTabelaPeriodica;

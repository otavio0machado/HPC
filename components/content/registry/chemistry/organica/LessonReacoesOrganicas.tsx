import React from 'react';

const LessonReacoesOrganicas: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    As <strong className="text-white">Reações Orgânicas</strong> são a alquimia moderna. É transformar petróleo em plástico, ou casca de árvore em aspirina. O segredo é quebrar ligações e formar novas.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl flex-1 border border-white/5">
                        <strong className="text-red-400 block mb-1">Cisão Homolítica</strong>
                        <span className="text-xs text-zinc-500">Quebra igual. Gera <strong className="text-white">Radicais Livres</strong>. Instável e violento.</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl flex-1 border border-white/5">
                        <strong className="text-blue-400 block mb-1">Cisão Heterolítica</strong>
                        <span className="text-xs text-zinc-500">Quebra desigual. Gera <strong className="text-white">Íons</strong>. Padrão das reações polares.</span>
                    </div>
                </div>
            </div>

            {/* Reaction Types Rules */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-400">2. As Regras do Jogo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Markovnikov */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-emerald-500">+</div>
                        <h3 className="text-lg font-bold text-white mb-2">Adição (Markovnikov)</h3>
                        <p className="text-sm text-emerald-400 font-bold mb-2">"O Rico fica mais Rico"</p>
                        <p className="text-xs text-zinc-400">
                            O Hidrogênio entra no carbono da dupla que já tem <strong>mais</strong> hidrogênios.
                        </p>
                    </div>

                    {/* Saytzeff */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-red-500">-</div>
                        <h3 className="text-lg font-bold text-white mb-2">Eliminação (Saytzeff)</h3>
                        <p className="text-sm text-red-400 font-bold mb-2">O Inverso</p>
                        <p className="text-xs text-zinc-400">
                            O Hidrogênio sai do carbono vizinho que tem <strong>menos</strong> hidrogênio.
                        </p>
                    </div>

                    {/* Oxidação */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-2">Oxidação de Álcoois (O Bafômetro)</h3>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-white/5 p-2 rounded">
                                <strong className="block text-emerald-400">Primário</strong>
                                Aldeído → Ácido
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                                <strong className="block text-yellow-400">Secundário</strong>
                                Vira Cetona
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                                <strong className="block text-red-400">Terciário</strong>
                                NÃO REAGE
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Esterification & Polymers */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">3. Polímeros e Ésteres</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-pink-500">
                        <strong className="text-pink-400 block mb-1">Esterificação</strong>
                        <span className="text-xs text-zinc-400">Ácido + Álcool = Éster + Água. (Aromas).</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-orange-500">
                        <strong className="text-orange-400 block mb-1">Saponificação</strong>
                        <span className="text-xs text-zinc-400">Gordura + Base = Sabão + Glicerina.</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-purple-500">
                        <strong className="text-purple-400 block mb-1">Polímeros</strong>
                        <span className="text-xs text-zinc-400">Adição (Plásticos) vs Condensação (Nylon/PET).</span>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">🌱</div>
                    <div>
                        <h2 className="text-xl font-bold text-green-400">Estudo de Caso: Biodiesel</h2>
                        <p className="text-xs text-green-300">Economia Verde</p>
                    </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    Reação de <strong>Transesterificação</strong>. Pegamos óleo de soja (Triglicerídeo) e reagimos com Álcool.
                    <br />Resultado: Biodiesel (Ésteres Metílicos) + Glicerina.
                    <br />Menos poluente (sem enxofre) e renovável.
                </p>
            </div>
        </div>
    );
};

export default LessonReacoesOrganicas;

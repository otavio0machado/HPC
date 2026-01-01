import React from 'react';

const LessonModelosAtomicos: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    A evolução dos Modelos Atômicos é a espinha dorsal da Química. Não se trata apenas de memorizar nomes de cientistas, mas de compreender como a humanidade passou de uma ideia filosófica abstrata para uma descrição matemática e probabilística da matéria.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    Definimos <strong>"Modelo Atômico"</strong> não como a verdade absoluta e imutável de como um átomo se parece, mas como uma representação teórica capaz de explicar os fenômenos observados experimentalmente em uma determinada época. Um modelo só é substituído quando falha em explicar uma nova descoberta. Portanto, estudar Dalton, Thomson, Rutherford e Bohr é estudar a história do método científico aplicado à constituição fundamental do universo: o átomo. Esta base é crucial para entender ligações químicas, eletricidade e até a medicina nuclear.
                </p>

                <h2 className="text-2xl font-bold text-emerald-400 mt-8">2. Contexto Histórico e Científico</h2>
                <p className="text-zinc-400 leading-relaxed">
                    A ideia de átomo nasceu na Grécia Antiga (séc. V a.C.) com os filósofos Leucipo e Demócrito. Eles propuseram que, se dividíssemos a matéria sucessivamente, chegaríamos a uma partícula indivisível (a-tomo = sem partes). Contudo, isso era pura filosofia, sem base experimental. Durante mais de 2000 anos, essa ideia ficou adormecida, ofuscada pela teoria dos quatro elementos de Aristóteles.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    A retomada científica ocorreu apenas no início do século XIX. O mundo estava vivendo a Revolução Industrial e o nascimento da Química moderna com Lavoisier. Os cientistas precisavam explicar por que as massas se conservavam nas reações e por que os elementos se combinavam em proporções fixas.
                </p>
                <div className="bg-white/5 p-4 rounded-xl border-l-4 border-emerald-500 my-6">
                    <p className="text-sm text-zinc-300 italic">
                        "Mais tarde, no final do século XIX e início do XX, a descoberta da eletricidade e da radioatividade quebrou a física clássica... Essas perguntas forçaram a evolução dos modelos."
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-emerald-400 mt-8">3. Características Fundamentais e Análise Técnica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-2">A. Modelo de Dalton (1808)</h3>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-emerald-300">Apelido:</strong> Bola de Bilhar</p>
                            <p>Esfera maciça, indivisível, indestrutível e neutra.</p>
                            <p><span className="text-red-400">Falha:</span> Não explicava eletricidade/radioatividade.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-2">B. Modelo de Thomson (1897)</h3>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-emerald-300">Apelido:</strong> Pudim de Passas</p>
                            <p>Esfera positiva com elétrons incrustados. Divisível!</p>
                            <p><span className="text-red-400">Falha:</span> Não explicava o espalhamento alfa (núcleo denso).</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-2">C. Modelo de Rutherford (1911)</h3>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-emerald-300">Apelido:</strong> Sistema Planetário</p>
                            <p>Núcleo denso e positivo, grandes vazios.</p>
                            <p><span className="text-red-400">Falha:</span> Instabilidade do elétron pela física clássica.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-2">D. Modelo de Bohr (1913)</h3>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-emerald-300">Conceito:</strong> Níveis de Energia</p>
                            <p>Órbitas estacionárias e saltos quânticos.</p>
                            <p><strong className="text-emerald-300">Importância:</strong> Explicou espectros de emissão (cores).</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-emerald-400 mt-8">4. Estudo de Caso: O Experimento da Lâmina de Ouro</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Imagine que o núcleo do átomo é uma bola de tênis no centro do Maracanã. A eletrosfera seria a arquibancada. Todo o resto é vazio. Rutherford bombardeou uma fina lâmina de ouro com partículas alfa (positivas).
                </p>
                <ul className="list-disc pl-6 text-zinc-400 space-y-2 mt-4">
                    <li>A maioria passou direto: <strong>O átomo é vazio.</strong></li>
                    <li>Algumas desviaram: <strong>O núcleo é positivo (repulsão).</strong></li>
                    <li>Pouquíssimas voltaram: <strong>O núcleo é muito denso e pequeno.</strong></li>
                </ul>

                {/* NOTE: Placeholder for images or interactive widgets */}
                <div className="w-full h-48 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700 mt-8">
                    <span className="text-zinc-500 text-sm">Diagrama interativo: Experimento de Rutherford (Em breve)</span>
                </div>
            </div>
        </div>
    );
};

export default LessonModelosAtomicos;

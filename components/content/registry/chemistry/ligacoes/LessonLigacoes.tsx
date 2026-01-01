import React from 'react';

const LessonLigacoes: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* 1. Introduction */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Se os átomos são as letras do alfabeto químico, as <strong className="text-white">Ligações Químicas</strong> são as regras gramaticais que permitem formar palavras (moléculas) e textos (substâncias complexas). Sem ligações, o universo seria uma sopa monótona de átomos gasosos isolados.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    A força motriz por trás de quase todas as ligações é a busca pela <strong className="text-emerald-300">Estabilidade</strong>. Na natureza, sistemas tendem a buscar o estado de menor energia possível. Para a maioria dos átomos representativos, essa estabilidade é alcançada através da <strong className="text-white">Regra do Octeto</strong>: a tendência de imitar a configuração eletrônica de um Gás Nobre (8 elétrons na camada de valência).
                </p>
            </div>

            {/* 2. Historical Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-2">Gilbert N. Lewis (1916)</h3>
                    <p className="text-sm text-zinc-400">
                        Revolucionou a química ao propor que as ligações envolvem o compartilhamento ou transferência de elétrons. Criou a famosa <strong className="text-emerald-300">Notação de Lewis</strong> (pontinhos).
                    </p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-2">Linus Pauling (Séc. XX)</h3>
                    <p className="text-sm text-zinc-400">
                        Aprofundou a teoria com mecânica quântica, explicando a hibridização e a natureza das ligações covalentes, permitindo prever a geometria molecular.
                    </p>
                </div>
            </div>

            {/* 3. Types of Bonds */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-400">3. Tipos de Ligações e Análise Técnica</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ionic */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 p-6 rounded-2xl border border-purple-500/20 space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 font-bold text-xs uppercase">Iônica</div>
                        </div>
                        <h3 className="text-xl font-bold text-purple-200">O Grande Roubo</h3>
                        <p className="text-xs text-zinc-400"><strong>Metal + Ametal</strong></p>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Transferência definitiva de elétrons. Gera Cátions (+) e Ânions (-) que se atraem. Forma retículos cristalinos sólidos.
                        </p>
                        <p className="text-xs text-zinc-500">Ex: NaCl (Sal)</p>
                    </div>

                    {/* Metallic */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 p-6 rounded-2xl border border-amber-500/20 space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300 font-bold text-xs uppercase">Metálica</div>
                        </div>
                        <h3 className="text-xl font-bold text-amber-200">Mar de Elétrons</h3>
                        <p className="text-xs text-zinc-400"><strong>Metal + Metal</strong></p>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Cátions mergulhados em elétrons livres (gás eletrônico). Conduzem muita eletricidade e são maleáveis.
                        </p>
                    </div>

                    {/* Covalent */}
                    <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20 space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300 font-bold text-xs uppercase">Covalente</div>
                        </div>
                        <h3 className="text-xl font-bold text-cyan-200">O Compartilhamento</h3>
                        <p className="text-xs text-zinc-400"><strong>Ametal + Ametal</strong> e <strong>H</strong></p>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Ninguém quer perder, então compartilham pares de elétrons. Pode ser polar ou apolar.
                        </p>
                        <p className="text-xs text-zinc-500">Ex: H₂O, CO₂, Diamante.</p>
                    </div>
                </div>
            </div>

            {/* Study Case */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">💧</span> Estudo de Caso: Água (Polar) vs CO₂ (Apolar)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <strong className="text-blue-300 block mb-1">Dióxido de Carbono (CO₂)</strong>
                        <p className="text-zinc-300">
                            Geometria <strong className="text-white">Linear</strong>. Os vetores de polaridade se anulam (puxam para lados opostos). Molécula <strong className="text-white">Apolar</strong>. Atração fraca = Gás.
                        </p>
                    </div>
                    <div>
                        <strong className="text-blue-300 block mb-1">Água (H₂O)</strong>
                        <p className="text-zinc-300">
                            Geometria <strong className="text-white">Angular</strong> devida aos pares de elétrons livres no Oxigênio que "empurram" os H para baixo. Molécula <strong className="text-white">Polar</strong>. Fortes ligações de hidrogênio = Líquida.
                        </p>
                    </div>
                </div>
            </div>

            {/* Connections */}
            <div className="prose prose-invert max-w-none text-sm text-zinc-400">
                <h3 className="text-emerald-400 font-bold text-lg">Conexões Interdisciplinares</h3>
                <ul className="space-y-2">
                    <li><strong className="text-white">Biologia:</strong> O modelo "Chave-Fechadura" das enzimas depende da geometria molecular correta.</li>
                    <li><strong className="text-white">Engenharia:</strong> Grafite (folhas deslizantes) e Diamante (rede rígida) são ambos Carbono pura, mas a geometria dad ligações muda tudo.</li>
                </ul>
            </div>
        </div>
    );
};

export default LessonLigacoes;

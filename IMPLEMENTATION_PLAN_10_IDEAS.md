# Plano de Implementação: As 10 Ideias do Futuro

Este documento detalha o roteiro de implementação para transformar a plataforma em um ecossistema de aprendizado de Alta Performance (HPC) completo, "dopaminérgico" e com estética VisionOS.

## 1. Nexus do Conhecimento (Knowledge Graph)
**Status:** ⏳ Pendente
**Descrição:** Visualização 3D interativa conectando Notas, Pílulas e Simulados.
**Estratégia Técnica:**
- Utilizar `react-force-graph` ou `d3.js` (ou solução customizada com Canvas/SVG e Framer Motion).
- Parsing de links internos `[[...]]` no conteúdo Markdown para gerar arestas.
- Nós "flutuantes" com física.

## 2. Modo Flow (Immersive Focus Timer)
**Status:** 🚀 Em Progresso (Prioridade Imediata)
**Descrição:** Timer Pomodoro em tela cheia com estética "breathing/liquid" e sons de foco.
**Estratégia Técnica:**
- Novo componente `FocusMode.tsx`.
- Estado de tela cheia (overlay no Dashboard).
- Animação CSS/Framer Motion sincronizada com respiração (4s in, 4s hold, 4s out).
- Integração de áudio (Howler.js ou tag `<audio>` nativa).

## 3. Gamificação & "Dopamine Box"
**Status:** ⏳ Pendente
**Descrição:** Sistema de XP, Streaks e Desbloqueáveis.
**Estratégia Técnica:**
- Adicionar colunas `xp`, `streak_current`, `streak_best` na tabela `profiles`.
- Criar tabela `achievements` e `user_unlocks`.
- Componente visual de "Level Up" com confete.

## 4. Smart Review (Repetição Espaçada Global)
**Status:** ⏳ Pendente
**Descrição:** Fila única de revisão (Flashcards + Erros + Conteúdo Difícil).
**Estratégia Técnica:**
- Algoritmo que consulta 3 fontes: `flashcards` (due < now), `simulados` (questões erradasRecentemente), `notes` (marcadas como revisão).
- Interface unificada de "Card" para resolver os itens.

## 5. Batalhas / Desafios (Social)
**Status:** ⏳ Pendente
**Descrição:** Comparação de performance com amigos ou "Eu Fantasma".
**Estratégia Técnica:**
- Tabela `friendships` ou `rivals`.
- Modo "Ghost": salvar o replay de tempo de resposta de um simulado anterior.

## 6. AI Podcast Studio
**Status:** ⏳ Pendente
**Descrição:** Transformar texto em áudio com vozes neurais.
**Estratégia Técnica:**
- Usar API Text-to-Speech (OpenAI, Google Web Speech API ou similar).
- Player de áudio persistente no rodapé.

## 7. Quadro Infinito (Infinite Whiteboard)
**Status:** ⏳ Pendente
**Descrição:** Canvas espacial para organizar conhecimento livremente.
**Estratégia Técnica:**
- Investigar `react-zoom-pan-pinch` ou construir lógica de canvas infinito customizada.
- Permitir arrastar "Nodes" (Cards, Notas) para o canvas.

## 8. Gerador de Roadmap (GPS de Estudos)
**Status:** ⏳ Pendente
**Descrição:** Criação automática de tarefas no Planner baseada em uma meta final.
**Estratégia Técnica:**
- Prompt complexo para LLM (HPC AI): "Dado a meta X e tempo Y, gere JSON de tarefas".
- Inserção em massa na tabela `tasks`.

## 9. Analytics Biométrico
**Status:** ⏳ Pendente
**Descrição:** Gráficos de correlação (Hora do dia vs. Acertos).
**Estratégia Técnica:**
- Coletar timestamps precisos de cada interação de estudo.
- Gráficos com `recharts` mostrando Heatmaps.

## 10. Duelo de Redação AI
**Status:** ⏳ Pendente
**Descrição:** Correção automática e comparativo de redações.
**Estratégia Técnica:**
- Integração LLM para correção estruturada (Competências 1-5 do ENEM).
- Visual diff para mostrar sugestões de melhoria.

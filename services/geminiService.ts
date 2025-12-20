import { GoogleGenAI, Type, Chat, Content } from "@google/genai";
import { ExamType, SubjectFocus, StudyPlanResponse, SimuladoResult } from "../types";

// Initialize the API client
// Note: In a real production app, ensure specific error handling for missing keys.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyPlan = async (
  exam: ExamType,
  subject: SubjectFocus,
  hoursPerDay: number
): Promise<StudyPlanResponse> => {
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    Crie um plano de estudos de alta performance de 5 dias focado em ${subject} para o exame ${exam}.
    O aluno tem ${hoursPerDay} horas disponíveis por dia.
    
    O plano deve ser intenso, focado em estratégia de prova e retenção ativa.
    Seja minimalista e direto.
    
    Estrutura desejada:
    - Meta da semana
    - Nota estratégica (dica de ouro para ${exam})
    - Cronograma de 5 dias
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklyGoal: {
              type: Type.STRING,
              description: "O objetivo principal da semana em uma frase impactante."
            },
            strategyNote: {
              type: Type.STRING,
              description: "Uma dica estratégica específica sobre como a banca cobra esse conteúdo."
            },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "Dia 1, Dia 2, etc." },
                  focus: { type: Type.STRING, description: "Tópico macro do dia." },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Lista de 2 a 3 atividades práticas (ex: Teoria X, 20 Questões Y)."
                  },
                  tip: { type: Type.STRING, description: "Uma micro dica de performance para o dia." }
                },
                required: ["day", "focus", "tasks", "tip"]
              }
            }
          },
          required: ["weeklyGoal", "strategyNote", "schedule"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No content generated");
    }

    return JSON.parse(responseText) as StudyPlanResponse;

  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const createTutorChat = (subject: string, history?: Content[]): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: `
        Você é um Professor Particular de Elite especializado em ${subject} para pré-vestibulares (ENEM e UFRGS).
        Seu tom é encorajador, porém extremamente técnico e focado em alta performance.
        
        Regras:
        1. Explique conceitos complexos de forma didática, usando analogias.
        2. Se o aluno perguntar algo fora do escopo de ${subject}, redirecione gentilmente.
        3. Sempre que possível, cite como esse conteúdo caiu em provas passadas do ENEM ou UFRGS.
        4. Seja conciso. Evite respostas longas demais a menos que solicitado.
        5. Use formatação Markdown (negrito, listas) para facilitar a leitura.
        6. IMPORTANTE: Para fórmulas matemáticas, use SEMPRE formato LaTeX envolto em cifrões.
           - Para equações na mesma linha (inline), use um cifrão: $E = mc^2$
           - Para equações em bloco (destacadas), use dois cifrões:
             $$
             x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
             $$
           - NÃO use \( ... \) ou \[ ... \]. Use apenas $ e $$.
      `
    }
  });
};

export const analyzeExamPerformance = async (simulado: SimuladoResult): Promise<string> => {
  const modelId = "gemini-3-flash-preview";
  
  const performanceData = simulado.areas.map(a => `${a.name}: ${a.correct}/${a.total}`).join(', ');
  const essay = simulado.essayScore ? `Redação: ${simulado.essayScore}` : 'Redação não informada';

  const prompt = `
    Atue como um Analista de Performance de Vestibulares de Elite (High Performance Coach).
    Analise os seguintes resultados de um simulado ${simulado.examType}:
    
    Dados: ${performanceData}. ${essay}.
    
    Forneça uma análise tática e direta (max 150 palavras) contendo:
    1. O "Diagnóstico Brutal": Onde o aluno está perdendo a aprovação?
    2. A "Ação de Ouro": O que priorizar nos estudos desta semana para subir a média global.
    
    Use tom profissional, sério e motivador. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Error analyzing exam:", error);
    throw error;
  }
};
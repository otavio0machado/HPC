/// <reference types="vite/client" />
import { GoogleGenAI, Type, Chat, Content } from "@google/genai";
import { ExamType, SubjectFocus, StudyPlanResponse, SimuladoResult, ErrorAnalysisResponse, GeneratedQuestion } from "../types";

// Initialize the API client
const STUDY_MODEL = "gemini-2.5-flash";

export const aiService = {
  hasKey: !!import.meta.env.VITE_GEMINI_API_KEY,
};

const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey: key });
};

// Retry helper for 429 (Rate Limit)
const generateWithRetry = async (model: any, params: any, retries = 3, delay = 2000) => {
  try {
    return await model.generateContent(params);
  } catch (error: any) {
    if ((error.status === 429 || error.code === 429 || error.message?.includes("429")) && retries > 0) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(model, params, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

export const generateStudyPlan = async (
  exam: ExamType,
  subject: SubjectFocus,
  hoursPerDay: number
): Promise<StudyPlanResponse> => {
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
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
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
  const ai = getAI();
  return ai.chats.create({
    model: STUDY_MODEL,
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
  if (!import.meta.env.VITE_GEMINI_API_KEY) return "API Key not configured.";

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
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Error analyzing exam:", error);
    throw error;
  }
};

// --- NOTE FEATURES ---

export const analyzeNoteContent = async (content: string): Promise<{ keywords: string[], summary: string }> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return { keywords: [], summary: "" };

  const prompt = `
      Analise a seguinte nota de estudo e extraia:
      1. Um resumo executivo de 1 parágrafo (max 50 palavras).
      2. As 5 palavras-chave mais importantes.
      
      Retorne em JSON: { "summary": string, "keywords": string[] }
      
      Nota: ${content.substring(0, 10000)}
    `;

  try {
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "keywords"]
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text) : { keywords: [], summary: "" };
  } catch (e) {
    console.error("Note analysis failed", e);
    return { keywords: [], summary: "" };
  }
}

export const generateFlashcardsFromNote = async (content: string): Promise<{ front: string, back: string }[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return [];

  const prompt = `
        Crie 5 a 10 flashcards de alta qualidade baseados neste texto.
        Foque em testar conceitos chave, fórmulas ou relações de causa e efeito.
        Evite perguntas muito óbvias.
        
        Retorne JSON array: [{ "front": "Pergunta", "back": "Resposta" }]
        
        Texto: ${content.substring(0, 10000)}
    `;

  try {
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ["front", "back"]
          }
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (e) {
    console.error("Flashcard gen failed", e);
    return [];
  }
}
export const refineText = async (text: string, instruction: 'improve' | 'fix' | 'shorter' | 'longer'): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return text;

  const prompts = {
    improve: "Melhore a escrita deste texto, tornando-o mais claro, profissional e envolvente, mantendo o sentido original.",
    fix: "Corrija erros gramaticais e de pontuação deste texto, mantendo o estilo original.",
    shorter: "Resuma este texto de forma concisa, mantendo apenas os pontos cruciais.",
    longer: "Expanda este texto, adicionando detalhes relevantes e explicações mais profundas sobre os conceitos mencionados."
  };

  const prompt = `
    ${prompts[instruction]}
    
    Texto Original:
    "${text}"
    
    Retorne APENAS o texto reescrito, sem aspas, sem introduções do tipo "Aqui está a versão melhorada".
  `;

  try {
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (e) {
    console.error("Refine text failed", e);
    return text; // Fallback to original
  }
}

export const analyzeErrorImage = async (imageBase64: string): Promise<ErrorAnalysisResponse | null> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return null;

  // Clean base64 string if needed (remove data:image/png;base64, prefix)
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
    Analise a imagem desta questão/erro e forneça:
    1. Uma descrição concisa do erro ou da questão (o que é, sobre o que trata).
    2. A matéria principal (Matemática, Física, etc.).
    3. O provável motivo do erro (Conteúdo, Atenção, Interpretação, Tempo).
    4. Sugira 2 flashcards (Frente/Verso) para ajudar a memorizar o conceito e evitar esse erro no futuro.

    Retorne em JSON:
    {
      "description": "string",
      "subject": "string",
      "cause": "string",
      "flashcards": [{ "front": "string", "back": "string" }]
    }
  `;

  try {
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/png", data: base64Data } } // Assuming PNG or generic image handling
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            subject: { type: Type.STRING },
            cause: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["description", "subject", "cause", "flashcards"]
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Error analysis failed", e);
    return null;
  }
};

export const generateNoteContent = async (topic: string): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return "";

  const prompt = `
    Crie uma nota de estudo completa e detalhada sobre: "${topic}".
    
    A nota deve ser formatada em Markdown (para ser renderizada em HTML) e conter:
    1. Título (H1)
    2. Introdução (resumo do conceito)
    3. Tópicos principais (H2) com explicações profundas
    4. Exemplos práticos
    5. Conclusão ou Resumo
    
    Use formatação rica: negrito, listas, citações se necessário.
    Seja didático, nível pré-vestibular/universitário.
    Retorne APENAS o conteúdo da nota, sem conversas extras.
  `;

  try {
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: prompt,
    });
    return response.text || "";
  } catch (e) {
    console.error("Note generation failed", e);
    throw e;
  }
};

export const generateExams = async (config: { type: ExamType, area: string, difficulty: string, count: number, mode: 'Rápido' | 'Maratona' }): Promise<GeneratedQuestion[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return [];

  const isMarathon = config.mode === 'Maratona';

  const prompt = `
    Crie ${config.count} questões inéditas estilo ${config.type} de ${config.area} nível ${config.difficulty}.
    
    MODO: ${config.mode.toUpperCase()}
    ${isMarathon ? `
    REGRAS PARA MODO MARATONA (Estilo Real de Prova):
    1. Inclua TEXTOS DE APOIO longos e densos (trechos de notícias, livros, artigos científicos) antes do enunciado.
    2. Inclua DESCRIÇÕES DE IMAGEM para simular gráficos, charges ou figuras que estariam na prova.
    3. As questões devem exigir interpretação do texto/imagem.
    ` : `
    REGRAS PARA MODO RÁPIDO:
    1. Foque em enunciados diretos e curtos.
    2. Sem textos gigantes de apoio.
    `}
    
    Cada questão deve ter:
    1. Enunciado claro.
    2. 5 alternativas (A, B, C, D, E).
    3. Indicação da correta (0 a 4).
    4. Explicação detalhada.
    ${isMarathon ? '5. "supportText": Texto de apoio longo (opcional mas recomendado).' : ''}
    ${isMarathon ? '6. "imageDescription": Descrição detalhada da imagem/gráfico (opcional mas recomendado).' : ''}
    
    Retorne APENAS um JSON Array puro no seguinte formato (sem markdown):
    [
      {
        "id": "1",
        "supportText": "Texto base gigante...",
        "imageDescription": "Gráfico de barras mostrando...",
        "text": "Com base no texto e no gráfico, conclui-se que...",
        "options": ["Alt A", "Alt B", "Alt C", "Alt D", "Alt E"],
        "correctOptionIndex": 2,
        "explanation": "Explicação..."
      }
    ]
  `;

  try {
    const ai = getAI();
    const response = await generateWithRetry(ai.models, {
      model: STUDY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              supportText: { type: Type.STRING, nullable: true },
              imageDescription: { type: Type.STRING, nullable: true },
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctOptionIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctOptionIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const questions = JSON.parse(text);
    return questions.map((q: any) => ({
      ...q,
      subject: config.area // Ensure subject is preserved
    }));
  } catch (e) {
    console.error("Exam generation failed", e);
    return [];
  }
};

export const generatePillsFromContent = async (text: string, pageCount: number = 0, images: string[] = []): Promise<any[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return [];

  // Determine target pill count based on page count
  let targetPillCount = 50;
  if (pageCount >= 200 && pageCount <= 500) targetPillCount = 100;
  if (pageCount > 500) targetPillCount = 150;

  console.log(`Generating approx ${targetPillCount} pills for ${pageCount} pages.`);

  // Chunking strategy
  const CHUNK_SIZE = 25000; // Slightly reduced to ensure context fits
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.substring(i, i + CHUNK_SIZE));
  }

  // Calculate distinct chunks needed. 
  // We want roughly targetPillCount. If we ask for ~8 pills per chunk:
  const pillsPerChunk = 8;
  const chunksNeeded = Math.ceil(targetPillCount / pillsPerChunk);

  // Select chunks distributed evenly throughout the text
  let selectedChunks = chunks;
  if (chunks.length > chunksNeeded) {
    const step = Math.floor(chunks.length / chunksNeeded);
    selectedChunks = [];
    for (let i = 0; i < chunksNeeded; i++) {
      const idx = Math.min(i * step, chunks.length - 1);
      selectedChunks.push(chunks[idx]);
    }
    // Always ensure last chunk is included for conclusion/summary
    if (selectedChunks[selectedChunks.length - 1] !== chunks[chunks.length - 1]) {
      selectedChunks.push(chunks[chunks.length - 1]);
    }
  }

  const processChunk = async (chunkText: string, index: number) => {
    const prompt = `
      Você é um especialista em criar material de estudo resumido ("Pílulas de Conhecimento").
      Analise o seguinte texto extraído de um PDF e gere de ${pillsPerChunk} a ${pillsPerChunk + 5} "Pílulas de Conhecimento" únicas e memorizáveis.
      
      Instruções de Formatação:
      - Use MARKDOWN RICH para o conteúdo (negrito, listas, blocos de código).
      - Use LATEX para fórmulas matemáticas e científicas (ex: $E=mc^2$ ou $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$).
      - Seja conciso mas informativo.
      - Foque em conceitos-chave, curiosidades, resumos e definições.
      
      Gere o resultado estritamente no formato JSON como um array de objetos:
      [{
          "title": "Título Curto",
          "description": "Breve descrição (1 frase)",
          "content": "Conteúdo detalhado da pílula em Markdown...",
          "readTime": "2 min"
      }]
      
      Texto: ${chunkText.substring(0, 24000)}
    `;

    try {
      const ai = getAI();
      const response = await generateWithRetry(ai.models, {
        model: STUDY_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                content: { type: Type.STRING },
                readTime: { type: Type.STRING }
              },
              required: ["title", "description", "content", "readTime"]
            }
          }
        }
      });

      let jsonText = response.text || "[]";
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      return jsonText ? JSON.parse(jsonText) : [];
    } catch (e) {
      console.error(`Pill generation failed for chunk ${index}`, e);
      return [];
    }
  };

  try {
    // Run in parallel batches to avoid hitting rate limits instantly if chunksNeeded is high
    // Batch size of 5
    const results: any[] = [];
    for (let i = 0; i < selectedChunks.length; i += 5) {
      const batch = selectedChunks.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map((chunk, idx) => processChunk(chunk, i + idx)));
      results.push(...batchResults);
      // Small delay between batches
      if (i + 5 < selectedChunks.length) await new Promise(r => setTimeout(r, 1000));
    }

    let allPills = results.flat();

    // Post-process: Assign Layouts and Images
    allPills = allPills.map(pill => {
      const rand = Math.random();
      let layout = 'default';
      let imageUrl = undefined;

      // 20% chance for specific layouts or if images are available
      if (images.length > 0 && rand > 0.7) {
        layout = 'image_top';
        // Pick random image
        imageUrl = images[Math.floor(Math.random() * images.length)];
      } else if (rand > 0.5) {
        layout = 'quote';
      } else if (rand > 0.3) {
        layout = 'list';
      }

      // Heuristic: If content has bullet points or multiple numbers, force list layout
      if (pill.content.includes('1.') || pill.content.includes('- ')) {
        layout = 'list';
      }

      return {
        ...pill,
        layout,
        imageUrl
      };
    });

    return allPills;

  } catch (error) {
    console.error("Error processing text chunks", error);
    return [];
  }
};

export const generatePillsFromPromptAndContent = async (userPrompt: string, text: string, pageCount: number = 0, images: string[] = []): Promise<any[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return [];

  // Determine target pill count based on page count
  let targetPillCount = 50;
  if (pageCount >= 200 && pageCount <= 500) targetPillCount = 100;
  if (pageCount > 500) targetPillCount = 150;

  console.log(`Generating approx ${targetPillCount} pills for ${pageCount} pages using custom prompt.`);

  // Chunking strategy
  const CHUNK_SIZE = 25000;
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.substring(i, i + CHUNK_SIZE));
  }

  // Calculate distinct chunks needed.
  const pillsPerChunk = 8;
  const chunksNeeded = Math.ceil(targetPillCount / pillsPerChunk);

  // Select chunks distributed evenly throughout the text
  let selectedChunks = chunks;
  if (chunks.length > chunksNeeded) {
    const step = Math.floor(chunks.length / chunksNeeded);
    selectedChunks = [];
    for (let i = 0; i < chunksNeeded; i++) {
      const idx = Math.min(i * step, chunks.length - 1);
      selectedChunks.push(chunks[idx]);
    }
    // Always ensure last chunk is included
    if (selectedChunks[selectedChunks.length - 1] !== chunks[chunks.length - 1]) {
      selectedChunks.push(chunks[chunks.length - 1]);
    }
  }

  const processChunk = async (chunkText: string, index: number) => {
    const prompt = `
      Você é um especialista em educação e criação de material de estudo.
      
      INSTRUÇÃO ESTRATÉGICA DO USUÁRIO:
      "${userPrompt}"
      
      Tarefa:
      Analise o texto abaixo e gere de ${pillsPerChunk} a ${pillsPerChunk + 5} "Pílulas de Conhecimento" seguindo RIGOROSAMENTE a instrução estratégica acima.
      Se a instrução for para focar em algo específico (ex: datas, fórmulas), IGNORE conteúdos que não sejam sobre isso.
      
      Instruções de Formatação:
      - Use MARKDOWN RICH para o conteúdo.
      - Use LATEX para fórmulas matemáticas e científicas (ex: $E=mc^2$).
      - Crie títulos curtos e chamativos.
      
      Gere o resultado estritamente no formato JSON como um array de objetos:
      [{
          "title": "Título Curto",
          "description": "Breve descrição (1 frase)",
          "content": "Conteúdo detalhado da pílula em Markdown...",
          "readTime": "2 min"
      }]
      
      Texto para análise: ${chunkText.substring(0, 24000)}
    `;

    try {
      const ai = getAI();
      const response = await generateWithRetry(ai.models, {
        model: STUDY_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                content: { type: Type.STRING },
                readTime: { type: Type.STRING }
              },
              required: ["title", "description", "content", "readTime"]
            }
          }
        }
      });

      let jsonText = response.text || "[]";
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      return jsonText ? JSON.parse(jsonText) : [];
    } catch (e) {
      console.error(`Custom pill generation failed for chunk ${index}`, e);
      return [];
    }
  };

  try {
    // Run in parallel batches
    const results: any[] = [];
    for (let i = 0; i < selectedChunks.length; i += 5) {
      const batch = selectedChunks.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map((chunk, idx) => processChunk(chunk, i + idx)));
      results.push(...batchResults);
      if (i + 5 < selectedChunks.length) await new Promise(r => setTimeout(r, 1000));
    }

    let allPills = results.flat();

    // Post-process: Assign Layouts and Images
    allPills = allPills.map(pill => {
      const rand = Math.random();
      let layout = 'default';
      let imageUrl = undefined;

      // 20% chance for specific layouts or if images are available
      if (images.length > 0 && rand > 0.7) {
        layout = 'image_top';
        // Pick random image
        imageUrl = images[Math.floor(Math.random() * images.length)];
      } else if (rand > 0.5) {
        layout = 'quote';
      } else if (rand > 0.3) {
        layout = 'list';
      }

      // Heuristic: If content has bullet points or multiple numbers, force list layout
      if (pill.content.includes('1.') || pill.content.includes('- ')) {
        layout = 'list';
      }

      return {
        ...pill,
        layout,
        imageUrl
      };
    });

    return allPills;

  } catch (error) {
    console.error("Error processing text chunks", error);
    return [];
  }
};

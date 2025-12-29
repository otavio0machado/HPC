import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.1.1"

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set')
        }

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        // Initialize Gemini Client
        const sys = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

        const { action, payload } = await req.json()

        console.log(`Executing AI action: ${action}`)

        let result;

        switch (action) {
            case 'generate_study_plan':
                result = await handleGenerateStudyPlan(sys, payload)
                break
            case 'tutor_chat':
                result = await handleTutorChat(sys, payload)
                break
            case 'analyze_exam':
                result = await handleAnalyzeExam(sys, payload)
                break
            case 'analyze_note':
                result = await handleAnalyzeNote(sys, payload)
                break
            case 'generate_flashcards':
                result = await handleGenerateFlashcards(sys, payload)
                break
            case 'refine_text':
                result = await handleRefineText(sys, payload)
                break
            case 'analyze_error_image':
                result = await handleAnalyzeErrorImage(sys, payload)
                break
            case 'generate_note_content':
                result = await handleGenerateNoteContent(sys, payload)
                break
            case 'generate_exams':
                result = await handleGenerateExams(sys, payload)
                break
            case 'generate_pills':
                result = await handleGeneratePills(sys, payload)
                break
            default:
                throw new Error(`Unknown action: ${action}`)
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error('Error in ai-service:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

// --- Handlers ---

const STUDY_MODEL = "gemini-1.5-flash"

async function handleGenerateStudyPlan(ai: GoogleGenAI, { exam, subject, hoursPerDay }: any) {
    const prompt = `
    Crie um plano de estudos de alta performance de 5 dias focado em ${subject} para o exame ${exam}.
    O aluno tem ${hoursPerDay} horas disponíveis por dia.
    
    O plano deve ser intenso, focado em estratégia de prova e retenção ativa.
    Seja minimalista e direto.
    
    Estrutura desejada:
    - Meta da semana
    - Nota estratégica (dica de ouro para ${exam})
    - Cronograma de 5 dias
  `

    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    weeklyGoal: { type: "STRING" },
                    strategyNote: { type: "STRING" },
                    schedule: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                day: { type: "STRING" },
                                focus: { type: "STRING" },
                                tasks: { type: "ARRAY", items: { type: "STRING" } },
                                tip: { type: "STRING" }
                            },
                            required: ["day", "focus", "tasks", "tip"]
                        }
                    }
                },
                required: ["weeklyGoal", "strategyNote", "schedule"]
            }
        }
    })

    return JSON.parse(response.text || '{}')
}

// Chat is a bit distinct because we need history, but Edge Functions are stateless.
// For now, we will just generate the LAST reply based on full history sent by client.
// This matches how 'sendMessage' works if we reconstruct the chat.
async function handleTutorChat(ai: GoogleGenAI, { message, history, subject }: any) {
    // history comes as [{role: 'user', parts: [{text: '...'}]}, ...]
    // We need to initialize a chat session

    const systemInstruction = `
    Você é um Professor Particular de Elite especializado em ${subject} para pré-vestibulares (ENEM e UFRGS).
    Seu tom é encorajador, porém extremamente técnico e focado em alta performance.
    
    Regras:
    1. Explique conceitos complexos de forma didática, usando analogias.
    2. Se o aluno perguntar algo fora do escopo de ${subject}, redirecione gentilmente.
    3. Sempre que possível, cite como esse conteúdo caiu em provas passadas do ENEM ou UFRGS.
    4. Seja conciso. Evite respostas longas demais a menos que solicitado.
    5. Use formatação Markdown (negrito, listas) para facilitar a leitura.
    6. IMPORTANTE: Para fórmulas matemáticas, use SEMPRE formato LaTeX envolto em cifrões ($ e $$).
  `

    // We act as if we are creating a new chat and sending the last message
    // But strictly speaking, the SDK 'sendMessage' expects an existing session.
    // We can just use generateContent with the full history appended with system instruction.

    // Actually, constructing the request manually is safer for stateless usage.
    const contents = [...(history || [])]
    if (message) {
        contents.push({ role: 'user', parts: [{ text: message }] })
    }

    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: contents,
        config: {
            systemInstruction: systemInstruction
        }
    })

    return { text: response.text }
}

async function handleAnalyzeExam(ai: GoogleGenAI, { simulado }: any) {
    const performanceData = simulado.areas.map((a: any) => `${a.name}: ${a.correct}/${a.total}`).join(', ');
    const essay = simulado.essayScore ? `Redação: ${simulado.essayScore}` : 'Redação não informada';

    const prompt = `
      Atue como um Analista de Performance de Vestibulares de Elite (High Performance Coach).
      Analise os seguintes resultados de um simulado ${simulado.examType}:
      
      Dados: ${performanceData}. ${essay}.
      
      Forneça uma análise tática e direta (max 150 palavras) contendo:
      1. O "Diagnóstico Brutal": Onde o aluno está perdendo a aprovação?
      2. A "Ação de Ouro": O que priorizar nos estudos desta semana para subir a média global.
      
      Use tom profissional, sério e motivador. Use Markdown.
    `
    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt
    })
    return { text: response.text }
}

async function handleAnalyzeNote(ai: GoogleGenAI, { content }: any) {
    const prompt = `
       Analise a seguinte nota de estudo e extraia:
       1. Um resumo executivo de 1 parágrafo (max 50 palavras).
       2. As 5 palavras-chave mais importantes.
       
       Retorne em JSON: { "summary": string, "keywords": string[] }
       
       Nota: ${content.substring(0, 10000)}
     `

    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    summary: { type: "STRING" },
                    keywords: { type: "ARRAY", items: { type: "STRING" } }
                }
            }
        }
    })
    return JSON.parse(response.text || '{}')
}

async function handleGenerateFlashcards(ai: GoogleGenAI, { content }: any) {
    const prompt = `
        Crie 5 a 10 flashcards de alta qualidade baseados neste texto.
        Foque em testar conceitos chave, fórmulas ou relações de causa e efeito.
        Evite perguntas muito óbvias.
        
        Retorne JSON array: [{ "front": "Pergunta", "back": "Resposta" }]
        
        Texto: ${content.substring(0, 10000)}
    `
    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        front: { type: "STRING" },
                        back: { type: "STRING" }
                    }
                }
            }
        }
    })
    return JSON.parse(response.text || '[]')
}

async function handleRefineText(ai: GoogleGenAI, { text, instruction }: any) {
    const prompts: any = {
        improve: "Melhore a escrita deste texto, tornando-o mais claro, profissional e envolvente, mantendo o sentido original.",
        fix: "Corrija erros gramaticais e de pontuação deste texto, mantendo o estilo original.",
        shorter: "Resuma este texto de forma concisa, mantendo apenas os pontos cruciais.",
        longer: "Expanda este texto, adicionando detalhes relevantes e explicações mais profundas sobre os conceitos mencionados."
    };

    const prompt = `
        ${prompts[instruction]}
        
        Texto Original:
        "${text}"
        
        Retorne APENAS o texto reescrito.
    `
    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt
    })
    return { text: response.text?.trim() }
}

async function handleAnalyzeErrorImage(ai: GoogleGenAI, { imageBase64 }: any) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
        Analise a imagem desta questão/erro e forneça:
        1. Uma descrição concisa do erro ou da questão.
        2. A matéria principal.
        3. O provável motivo do erro.
        4. Sugira 2 flashcards.

        Retorne em JSON:
        { "description": "...", "subject": "...", "cause": "...", "flashcards": [...] }
    `

    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: [
            {
                role: 'user',
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/png', data: base64Data } }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    description: { type: "STRING" },
                    subject: { type: "STRING" },
                    cause: { type: "STRING" },
                    flashcards: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: { front: { type: "STRING" }, back: { type: "STRING" } }
                        }
                    }
                }
            }
        }
    })
    return JSON.parse(response.text || '{}')
}

async function handleGenerateNoteContent(ai: GoogleGenAI, { topic }: any) {
    const prompt = `
        Crie uma nota de estudo completa e detalhada sobre: "${topic}".
        A nota deve ser formatada em Markdown (H1, H2, negrito, listas).
        Retorne APENAS o conteúdo da nota.
    `
    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt
    })
    return { text: response.text }
}

async function handleGenerateExams(ai: GoogleGenAI, { config }: any) {
    const isMarathon = config.mode === 'Maratona';
    const prompt = `
        Crie ${config.count} questões inéditas estilo ${config.type} de ${config.area} nível ${config.difficulty}.
        MODO: ${config.mode.toUpperCase()}
        
        ${isMarathon ? 'Inclua TEXTOS DE APOIO e DESCRIÇÕES DE IMAGEM.' : 'Enunciados diretos.'}
        
        Retorne JSON Array.
    `
    // Note: Implementing full schema here is verbose, simplifying for brevity but maintaining structure is key.
    // For this implementation, I'll rely on the schema definition to enforce structure.
    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        id: { type: "STRING" },
                        supportText: { type: "STRING", nullable: true },
                        imageDescription: { type: "STRING", nullable: true },
                        text: { type: "STRING" },
                        options: { type: "ARRAY", items: { type: "STRING" } },
                        correctOptionIndex: { type: "INTEGER" },
                        explanation: { type: "STRING" }
                    },
                    required: ["id", "text", "options", "correctOptionIndex", "explanation"]
                }
            }
        }
    })

    // Inject subject into response as the original service did
    const questions = JSON.parse(response.text || '[]');
    return questions.map((q: any) => ({ ...q, subject: config.area }));
}

async function handleGeneratePills(ai: GoogleGenAI, { text, userPrompt, pageCount }: any) {
    // Limited implementation for brevity. In deployed function, we should ideally handle chunking via repeated calls or ensure payload is small enough.
    // Edge Functions have 6MB payload limits and timeouts. Heavy processing like 200 pages usually hits timeout.
    // For this fix, we will implement a simplified single-chunk version or assume text is pre-chunked by client (better).
    // HOWEVER, to be safe, let's just process the first chunk here or rely on the client to loop.
    // The previous client-side service did the looping.

    // We will support a single chunk processing per call.

    const prompt = userPrompt ?
        `Instrução: ${userPrompt}. Gere Pílulas de Conhecimento JSON para este texto: ${text.substring(0, 30000)}` :
        `Gere Pílulas de Conhecimento JSON para este texto: ${text.substring(0, 30000)}`;

    const response = await ai.models.generateContent({
        model: STUDY_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        title: { type: "STRING" },
                        description: { type: "STRING" },
                        content: { type: "STRING" },
                        readTime: { type: "STRING" }
                    },
                    required: ["title", "description", "content", "readTime"]
                }
            }
        }
    })

    return JSON.parse(response.text || '[]')
}

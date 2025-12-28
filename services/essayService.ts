import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyDyp56-0B2iszL7Exe7LVlzEBYhwLgGvdA"; // MVP Key

export interface EssayCorrection {
    score: number;
    competencies: {
        c1: number; // Domínio da escrita
        c2: number; // Compreensão do tema
        c3: number; // Organização das ideias
        c4: number; // Coesão
        c5: number; // Proposta de intervenção
    };
    comments: string[];
    improvedVersion: string;
}

export const essayService = {
    async correctEssay(topic: string, text: string): Promise<EssayCorrection> {
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            const prompt = `
            Aja como um corretor especialista do ENEM.
            Corrija a seguinte redação com o tema: "${topic}".
            
            Texto:
            "${text}"

            Retorne APENAS um JSON válido (sem markdown \`\`\`json) com o seguinte formato:
            {
                "score": 0-1000,
                "competencies": {
                    "c1": 0-200,
                    "c2": 0-200,
                    "c3": 0-200,
                    "c4": 0-200,
                    "c5": 0-200
                },
                "comments": ["comentário 1", "comentário 2"],
                "improvedVersion": "versão reescrita melhorada"
            }
            `;

            // Using the @google/genai specific API structure (based on test-gemini.js)
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash", // Or gemini-1.5-flash-001 as in test
                contents: prompt,
            });

            // The response object in @google/genai seems to have .text property directly?
            // Checking test-gemini.js: console.log("Response text:", response.text);

            let textResponse = result.text;

            if (!textResponse) {
                throw new Error("No text response from AI");
            }

            // Cleanup markdown if present
            textResponse = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();

            return JSON.parse(textResponse);
        } catch (error) {
            console.error("AI Correction failed", error);
            throw new Error("Falha na correção por IA");
        }
    }
};

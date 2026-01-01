import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

// Load .env manually since dotenv might not be installed
try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log("Could not load .env file");
}

// Tenta pegar a chave do ambiente ou usa uma string vazia para forçar o erro de autenticação (ou use a chave se souber qual é segura)
const key = process.env.GEMINI_API_KEY;
console.log("Testing model: gemini-2.5-flash-lite");

try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: "Hello, confirm you are Gemini 2.5 Flash",
    });
    console.log("Success:", response.text);
} catch (e) {
    console.log("Error Status:", e.status || e.response?.status);
    console.log("Error Message:", e.message);
}

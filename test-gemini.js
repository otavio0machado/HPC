
import { GoogleGenAI } from "@google/genai";

const key = "AIzaSyDyp56-0B2iszL7Exe7LVlzEBYhwLgGvdA";
console.log("Testing key:", key);

try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-001",
        contents: "Hello, answer with 'OK'",
    });
    console.log("Response text:", response.text);
} catch (e) {
    console.error("Error:", e.message);
    if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Body:", await e.response.text());
    }
}

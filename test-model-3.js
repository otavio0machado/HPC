
import { GoogleGenAI } from "@google/genai";

const key = "AIzaSyDyp56-0B2iszL7Exe7LVlzEBYhwLgGvdA";
console.log("Testing model: gemini-3-flash");

try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
        model: "gemini-3-flash",
        contents: "Hello",
    });
    console.log("Success:", response.text);
} catch (e) {
    console.log("Error Status:", e.status || e.response?.status);
    console.log("Error Message:", e.message);
}

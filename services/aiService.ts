/// <reference types="vite/client" />
import { supabase } from '../lib/supabase';
import { ExamType, SubjectFocus, StudyPlanResponse, SimuladoResult, ErrorAnalysisResponse, GeneratedQuestion, Content } from "../types";

// Removed: local constant STUDY_MODEL and getAI() helper.

export const aiService = {
  // Key check is now irrelevant on client, or we assume it's set on server.
  hasKey: true,
};

// Helper for calling Edge Function
const invokeAI = async (action: string, payload: any) => {
  const { data, error } = await supabase.functions.invoke('ai-service', {
    body: { action, payload }
  });

  if (error) {
    console.error(`Error invoking AI action ${action}:`, error);
    throw new Error(error.message || 'Erro ao comunicar com a IA.');
  }

  // Edge Function returns JSON directly, usually wrapped in another object depending on return
  return data;
};

export const generateStudyPlan = async (
  exam: ExamType,
  subject: SubjectFocus,
  hoursPerDay: number
): Promise<StudyPlanResponse> => {
  return await invokeAI('generate_study_plan', { exam, subject, hoursPerDay });
};

// Now returns an object with text property usually, simulating the chat response
export const createTutorChat = (subject: string, history?: any[]) => {
  // Since we migrated to a stateless Edge Function, "creating" a chat object 
  // with a persistent connection is not the same. 
  // We need to return an object that mimics the `sendMessage` interface 
  // but sends the FULL history every time to the server.

  let localHistory = history || [];

  return {
    getHistory: () => Promise.resolve(localHistory),
    sendMessage: async (message: string) => {
      // Optimistically add user message
      const userMsg = { role: 'user', parts: [{ text: message }] };
      const currentHistory = [...localHistory]; // Snapshot before adding current
      localHistory.push(userMsg);

      try {
        const response = await invokeAI('tutor_chat', {
          message,
          history: currentHistory, // Send history EXCLUDING the current message if the server logic appends it, OR include it. 
          // My server logic appends it if 'message' is passed. Safe to pass previous history.
          subject
        });

        const modelMsg = { role: 'model', parts: [{ text: response.text }] };
        localHistory.push(modelMsg);

        return { response: { text: () => response.text } };

      } catch (error) {
        // Revert on failure
        localHistory.pop();
        throw error;
      }
    }
  };
};

export const analyzeExamPerformance = async (simulado: SimuladoResult): Promise<string> => {
  const data = await invokeAI('analyze_exam', { simulado });
  return data.text;
};

// --- NOTE FEATURES ---

export const analyzeNoteContent = async (content: string): Promise<{ keywords: string[], summary: string }> => {
  return await invokeAI('analyze_note', { content });
}

export const generateFlashcardsFromNote = async (content: string): Promise<{ front: string, back: string }[]> => {
  return await invokeAI('generate_flashcards', { content });
}

export const refineText = async (text: string, instruction: 'improve' | 'fix' | 'shorter' | 'longer'): Promise<string> => {
  const data = await invokeAI('refine_text', { text, instruction });
  return data.text || text;
}

export const analyzeErrorImage = async (imageBase64: string): Promise<ErrorAnalysisResponse | null> => {
  return await invokeAI('analyze_error_image', { imageBase64 });
};

export const generateNoteContent = async (topic: string): Promise<string> => {
  const data = await invokeAI('generate_note_content', { topic });
  return data.text;
};

export const generateExams = async (config: { type: ExamType, area: string, difficulty: string, count: number, mode: 'Rápido' | 'Maratona' }): Promise<GeneratedQuestion[]> => {
  return await invokeAI('generate_exams', { config });
};

// For Pills, we keep the chunking logic on client (it's complex) but call the API for processing each chunk.
export const generatePillsFromContent = async (text: string, pageCount: number = 0, images: string[] = []): Promise<any[]> => {

  // Chunking strategy from original file
  let targetPillCount = 50;
  if (pageCount >= 200 && pageCount <= 500) targetPillCount = 100;
  if (pageCount > 500) targetPillCount = 150;

  console.log(`Generating approx ${targetPillCount} pills for ${pageCount} pages (Server-Side).`);

  const CHUNK_SIZE = 25000;
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.substring(i, i + CHUNK_SIZE));
  }

  const pillsPerChunk = 8;
  const chunksNeeded = Math.ceil(targetPillCount / pillsPerChunk);

  let selectedChunks = chunks;
  if (chunks.length > chunksNeeded) {
    const step = Math.floor(chunks.length / chunksNeeded);
    selectedChunks = [];
    for (let i = 0; i < chunksNeeded; i++) {
      const idx = Math.min(i * step, chunks.length - 1);
      selectedChunks.push(chunks[idx]);
    }
    if (selectedChunks[selectedChunks.length - 1] !== chunks[chunks.length - 1]) {
      selectedChunks.push(chunks[chunks.length - 1]);
    }
  }

  const processChunk = async (chunkText: string) => {
    try {
      // Call "generate_pills" action on server
      return await invokeAI('generate_pills', { text: chunkText, pageCount });
    } catch (e) {
      console.error("Pill generation failed for chunk", e);
      return [];
    }
  };

  try {
    const results: any[] = [];
    for (let i = 0; i < selectedChunks.length; i += 5) {
      const batch = selectedChunks.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map((chunk) => processChunk(chunk)));
      results.push(...batchResults);
    }

    let allPills = results.flat();

    // Post-process: Assign Layouts and Images (Client side logic is fine here)
    allPills = allPills.map(pill => {
      const rand = Math.random();
      let layout = 'default';
      let imageUrl = undefined;

      if (images.length > 0 && rand > 0.7) {
        layout = 'image_top';
        imageUrl = images[Math.floor(Math.random() * images.length)];
      } else if (rand > 0.5) {
        layout = 'quote';
      } else if (rand > 0.3) {
        layout = 'list';
      }

      if (pill.content?.includes('1.') || pill.content?.includes('- ')) {
        layout = 'list';
      }

      return { ...pill, layout, imageUrl };
    });

    return allPills;

  } catch (error) {
    console.error("Error processing text chunks", error);
    return [];
  }
};

export const generatePillsFromPromptAndContent = async (userPrompt: string, text: string, pageCount: number = 0, images: string[] = []): Promise<any[]> => {
  // Similar logic, just passing userPrompt
  let targetPillCount = 50;
  if (pageCount >= 200 && pageCount <= 500) targetPillCount = 100;
  if (pageCount > 500) targetPillCount = 150;

  const CHUNK_SIZE = 25000;
  const chunks = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.substring(i, i + CHUNK_SIZE));
  }

  const pillsPerChunk = 8;
  const chunksNeeded = Math.ceil(targetPillCount / pillsPerChunk);

  let selectedChunks = chunks;
  if (chunks.length > chunksNeeded) {
    const step = Math.floor(chunks.length / chunksNeeded);
    selectedChunks = [];
    for (let i = 0; i < chunksNeeded; i++) {
      const idx = Math.min(i * step, chunks.length - 1);
      selectedChunks.push(chunks[idx]);
    }
    if (selectedChunks[selectedChunks.length - 1] !== chunks[chunks.length - 1]) {
      selectedChunks.push(chunks[chunks.length - 1]);
    }
  }

  const processChunk = async (chunkText: string) => {
    try {
      return await invokeAI('generate_pills', { text: chunkText, userPrompt, pageCount });
    } catch (e) {
      console.error("Custom pill generation failed for chunk", e);
      return [];
    }
  };

  try {
    const results: any[] = [];
    for (let i = 0; i < selectedChunks.length; i += 5) {
      const batch = selectedChunks.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map(chunk => processChunk(chunk)));
      results.push(...batchResults);
    }

    let allPills = results.flat();

    allPills = allPills.map(pill => {
      const rand = Math.random();
      let layout = 'default';
      let imageUrl = undefined;
      if (images.length > 0 && rand > 0.7) {
        layout = 'image_top';
        imageUrl = images[Math.floor(Math.random() * images.length)];
      } else if (rand > 0.5) {
        layout = 'quote';
      } else if (rand > 0.3) {
        layout = 'list';
      }
      if (pill.content?.includes('1.') || pill.content?.includes('- ')) {
        layout = 'list';
      }
      return { ...pill, layout, imageUrl };
    });

    return allPills;
  } catch (error) {
    console.error("Error processing text chunks", error);
    return [];
  }
};

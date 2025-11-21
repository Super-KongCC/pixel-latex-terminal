import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

// Initialize the client safely
try {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key not found or invalid.");
}

export const askGeminiLatex = async (prompt: string): Promise<string> => {
  if (!aiClient) {
    return "Error: Gemini API key not configured.";
  }

  try {
    const model = aiClient.models;
    // Using gemini-2.5-flash for speed as this is a basic text task
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a LaTeX expert. The user will ask for a mathematical formula. You must output ONLY the raw LaTeX code required to render that formula. Do not wrap it in markdown code blocks (like ```latex). Do not add explanations. If the request is unclear, provide the most likely standard LaTeX representation. Ensure standard compatibility.",
        temperature: 0.1, // Low temperature for deterministic code output
      }
    });

    const text = response.text;
    if (!text) return "Error: No response from AI.";
    
    // Clean up any accidental markdown just in case
    return text.replace(/```latex/g, '').replace(/```/g, '').trim();
  } catch (error) {
    console.error("Gemini request failed", error);
    return "Error: Failed to contact AI service.";
  }
};

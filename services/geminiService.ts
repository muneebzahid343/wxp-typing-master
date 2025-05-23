
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// This service is a placeholder as Gemini API is not directly used in the Typing Test app.
// It's included to meet the project structure requirements.

const API_KEY = process.env.API_KEY; // API Key should be in environment variables

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "Gemini API key (process.env.API_KEY) is not set. " +
    "Gemini-specific features would not work if this app used them. " +
    "This Typing Test app's core features will still function."
  );
}

export const getGeminiClient = (): GoogleGenAI | null => {
  if (!ai) {
    // console.warn("Gemini client is not initialized because API_KEY is missing.");
  }
  return ai;
};

// Example function definition (not used by the typing app, but shows correct usage)
export const generateTextWithGemini = async (promptText: string): Promise<string | null> => {
  const client = getGeminiClient();
  if (!client) {
    return "Gemini client not initialized. API_KEY might be missing.";
  }

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ parts: [{ text: promptText }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    // It's good practice to inform the user or return a specific error message.
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}`;
    }
    return "An unknown error occurred while generating text.";
  }
};

// Example for image generation (not used)
export const generateImageWithGemini = async (promptText: string): Promise<string | null> => {
    const client = getGeminiClient();
    if (!client) {
      return "Gemini client not initialized. API_KEY might be missing.";
    }
  
    try {
      const response = await client.models.generateImages({ // Corrected method name
        model: 'imagen-3.0-generate-002',
        prompt: promptText,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });
  
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
      return "No image generated.";
    } catch (error) {
      console.error("Error generating image with Gemini:", error);
      if (error instanceof Error) {
        return `Error from Gemini Image: ${error.message}`;
      }
      return "An unknown error occurred while generating image.";
    }
  };

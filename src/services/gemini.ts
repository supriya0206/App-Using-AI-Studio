import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const searchImages = async (query: string) => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `I want to find images related to: "${query}". 
    Please provide a list of relevant image descriptions and search terms that would help find high-quality visuals for this query. 
    Also, provide a brief summary of what these images should represent.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const searchQueries = response.candidates?.[0]?.groundingMetadata?.searchEntryPoint?.renderedContent;

  return {
    text,
    sources: groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri,
    })).filter((s: any) => s.title && s.uri) || [],
    searchQueries
  };
};

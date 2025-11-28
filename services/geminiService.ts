import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role, ModelId } from "../types";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Streams a chat response from the Gemini API.
 * 
 * @param modelId The ID of the model to use (e.g., 'gemini-2.5-flash')
 * @param history The conversation history
 * @param userMessage The new message from the user
 * @param onChunk Callback function to handle incoming text chunks
 */
export const streamChatResponse = async (
  modelId: ModelId,
  history: Message[],
  userMessage: string,
  onChunk: (text: string) => void
): Promise<void> => {
  
  // Transform application message history to SDK format
  // We filter out error messages and ensure proper role mapping
  const chatHistory = history
    .filter(msg => !msg.isError)
    .map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

  try {
    const chat = ai.chats.create({
      model: modelId,
      history: chatHistory,
    });

    const result = await chat.sendMessageStream({ message: userMessage });

    for await (const chunk of result) {
      const responseChunk = chunk as GenerateContentResponse;
      if (responseChunk.text) {
        onChunk(responseChunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
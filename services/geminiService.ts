
import { GoogleGenAI, GenerateContentResponse, Chat, Content, Part, GroundingChunk as SDKGroundingChunk, FinishReason } from "@google/genai";
import { GEMINI_CHAT_MODEL } from '../constants';
import type { GroundingChunk } from '../types'; // Local GroundingChunk type

let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null;

const SYSTEM_INSTRUCTION = "You are EpignosAI, a helpful AI assistant for Epignosis Hub. Your knowledge base and responses are rooted in the teachings of the Bible, understood through a mainstream Evangelical Christian lens. Your purpose is to assist users in deepening their knowledge of Christ Jesus and the Scriptures. Provide clear, biblically-grounded, and encouraging responses using plain English. Be respectful, patient, and focus on providing knowledge and understanding. If asked about topics clearly outside the scope of Christian theology, the Bible, or spiritual growth (e.g., complex secular philosophies, other religions in-depth, non-theological advice), gently state that it's outside your primary area of expertise or guide the conversation back to Christian themes. When appropriate, cite Bible verses to support your answers. You can ask clarifying questions. Avoid overly academic language unless necessary, and then explain terms simply.";

const initializeAiClient = (): boolean => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set. AI features will not be available.");
    ai = null;
    return false;
  }
  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return true;
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      ai = null; 
      return false;
    }
  }
  return true; // Already initialized
};

export const initializeChat = async (): Promise<boolean> => {
  if (!initializeAiClient() || !ai) {
    chatInstance = null;
    return false;
  }
  try {
    chatInstance = ai.chats.create({
      model: GEMINI_CHAT_MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // temperature: 0.7 
      },
    });
    return true;
  } catch (error) {
    console.error("Error creating chat session:", error);
    chatInstance = null;
    return false;
  }
};

export const resetChat = () => {
  chatInstance = null; 
}

interface SendMessageStreamResponse {
  textStream: AsyncGenerator<string>;
  sourcesStream?: AsyncGenerator<GroundingChunk[] | undefined>; 
}

export const sendMessageStream = async (
  message: string,
  imageParts?: Part[]
): Promise<SendMessageStreamResponse | null> => {
  if (!chatInstance) {
    const initialized = await initializeChat();
    if (!initialized || !chatInstance) {
      throw new Error("Chat not initialized. AI service might be unavailable or misconfigured.");
    }
  }

  try {
    const currentMessageParts: Part[] = [];

    if (imageParts && imageParts.length > 0) {
      currentMessageParts.push(...imageParts);
    }
    currentMessageParts.push({ text: message });
    
    const streamResult = await chatInstance.sendMessageStream({ message: currentMessageParts });
    
    async function* generateTextStream() {
      for await (const chunk of streamResult) {
        if (!chunk.text && chunk.candidates?.[0]?.finishReason === FinishReason.SAFETY) {
            console.warn("Content blocked due to safety reasons:", chunk);
            yield "[Content blocked due to safety policy. Please rephrase your query or try a different topic.]";
            return;
        }
        yield chunk.text;
      }
    }

    async function* generateSourcesStream() {
        for await (const chunk of streamResult) {
            // Map SDKGroundingChunk to local GroundingChunk type if necessary
            const mappedChunks: GroundingChunk[] | undefined = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(sdkChunk => ({
                web: sdkChunk.web ? { uri: sdkChunk.web.uri, title: sdkChunk.web.title } : undefined,
                retrievedContext: sdkChunk.retrievedContext ? { uri: sdkChunk.retrievedContext.uri, title: sdkChunk.retrievedContext.title } : undefined,
            }));
            yield mappedChunks;
        }
    }

    return { 
        textStream: generateTextStream(),
        sourcesStream: generateSourcesStream() 
    };

  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    if (error instanceof Error && (error.message.includes("API_KEY") || error.message.includes(" μπορούσε να επικυρωθεί") || error.message.includes("authentication"))) {
        throw new Error("There was an issue with the AI service configuration. Please contact support.");
    }
    resetChat(); 
    throw error; 
  }
};

export const generateText = async (prompt: string): Promise<string> => {
  if (!initializeAiClient() || !ai) {
    throw new Error("AI client not initialized. AI service might be unavailable or misconfigured.");
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_CHAT_MODEL, 
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for Epignosis Hub, focused on Evangelical Christian topics." 
      }
    });
    return response.text;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    if (error instanceof Error && (error.message.includes("API_KEY") || error.message.includes(" μπορούσε να επικυρωθεί") || error.message.includes("authentication"))) {
        throw new Error("There was an issue with the AI service configuration. Please contact support.");
    }
    throw error;
  }
};

export const isGeminiInitialized = (): boolean => {
  if (!ai) {
    return initializeAiClient();
  }
  return true;
};

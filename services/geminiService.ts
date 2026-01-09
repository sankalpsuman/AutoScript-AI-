
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client. API Key is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a message to the chat model and yields streaming chunks.
 * Now uses Search Grounding to genuinely "visit" and analyze the URL.
 */
export async function* streamChat(
  history: { role: string; parts: { text: string }[] }[],
  message: string
) {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      temperature: 0.1, // Near zero for strict technical accuracy
      tools: [{ googleSearch: {} }], // ENABLE GOOGLE SEARCH GROUNDING
      systemInstruction: `You are AutoScript AI, an expert Senior SDET and Architect. Your creator is Sankalp Suman.

MISSION:
- Genuinely analyze provided URLs using Google Search or internal knowledge.
- DO NOT generate generic boilerplate code.
- If a user provides a URL, you MUST research the specific site structure, features, and common flows of THAT SPECIFIC WEBSITE.
- Generate UNIQUE test scenarios for every request. If a user asks for a script for 'google.com', do not give the same script twice. Focus on different sub-features (Image Search, Account Settings, Voice Search, etc.).

CODE QUALITY:
- Language: Java
- Framework: Selenium 4 + TestNG
- Pattern: Page Object Model (POM).
- Selectors: Use highly specific and robust selectors identified from actual site analysis.
- Diversity: Ensure test cases cover Positive, Negative, and Edge cases specifically tailored to the URL's purpose.

RESPONSE STRUCTURE:
1. **Site Intelligence**: Brief technical findings about the URL's UI technology (e.g., React, Angular) and key selectors found.
2. **Unique Test Scenarios**: A list of at least 3 distinct scenarios you are automating.
3. **Architecture**: Separate Page Class(es) and Test Class.
4. **Execution Notes**: Specific tips for running these tests on the target site.

Stay technical, professional, and precise. Your goal is to provide production-grade automation that an SDET could commit to a repository immediately.`,
    },
  });

  const result = await chat.sendMessageStream({ message });

  for await (const chunk of result) {
    yield chunk.text || "";
  }
}

/**
 * Generates a LinkedIn post draft.
 */
export async function generateLinkedInPost(featureContext: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [{
        text: `Act as Sankalp Suman. Write a viral LinkedIn post about "AutoScript AI".
        
        NEW FEATURE UPDATE: Now supports full **Multi-Step User Flows** and **Genuinely Active URL Analysis** using Gemini Search Grounding.
        The AI now "visits" the URL to understand specific site structure before coding.

        Mention:
        - Built with Google Gemini API.
        - Transforms manual step descriptions into production-ready POM code.
        - Zero boilerplate: Site-specific selectors and logic.
        
        TONE: Visionary, helpful, and technically advanced.
        HASHTAGS: #AutoScriptAI #SankalpSuman #Selenium #TestAutomation #SDET #Java #GeminiAPI`
      }]
    }
  });

  return response.text || "Check out the new multi-step flow feature in AutoScript AI! Built with Gemini.";
}

/**
 * Analyzes an image using Gemini Vision capabilities.
 */
export async function analyzeImage(
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        {
          text: prompt
        }
      ]
    }
  });

  return response.text || "Could not analyze image.";
}

/**
 * Generates speech from text using Gemini TTS model.
 */
export async function generateSpeech(
  text: string,
  voiceName: string = 'Kore'
): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: {
      parts: [{ text }]
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName }
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

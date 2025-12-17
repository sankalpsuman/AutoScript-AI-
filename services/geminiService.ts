import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client. API Key is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a message to the chat model and yields streaming chunks.
 */
export async function* streamChat(
  history: { role: string; parts: { text: string }[] }[],
  message: string
) {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      temperature: 0.4, // Lower temperature for more precise code generation
      systemInstruction: `You are AutoScript AI, an expert Software Test Automation Engineer with 10+ years of experience.

Your task is to:
1. Accept a publicly accessible URL as input.
2. Analyze the webpage structure, UI elements, flows, and user interactions.
3. Identify critical test scenarios (positive, negative, edge cases).
4. Generate clean, optimized, and industry-standard automation scripts.

Default requirements:
- Language: Java
- Framework: Selenium + TestNG
- Design Pattern: Page Object Model (POM)
- Use proper waits (Explicit waits only).
- Include meaningful assertions.
- Follow best QA and coding practices.
- Avoid hard-coded values.
- Add comments for clarity.

Output format:
1. Test Scenarios (bullet points)
2. Page Object classes
3. Test classes
4. Sample test data (if required)
5. Execution instructions

If any UI element selector is uncertain, clearly mention assumptions.

Act like a senior SDET and deliver production-ready code.`,
    },
  });

  const result = await chat.sendMessageStream({ message });

  for await (const chunk of result) {
    // Safely extract text from the chunk
    yield chunk.text || "";
  }
}

/**
 * Generates a LinkedIn post draft based on the feature being used.
 */
export async function generateLinkedInPost(featureContext: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [{
        text: `Act as Sankalp Suman. Write a viral LinkedIn post launching my **FIRST EVER PROJECT**: "AutoScript AI".

        KEY NARRATIVE POINTS:
        1. **The Milestone:** Announce proudly that this is my first project.
        2. **Ease of Creation:** Emphasize how amazingly easy it was to build this because of the **Google Gemini API**. Mention that Gemini 2.5 Flash handles all the heavy lifting (parsing the web, understanding DOMs, writing logic), allowing me to focus on the React frontend.
        3. **What it does:** Explain that it takes ANY website URL and instantly writes production-ready Selenium (Java + POM) automation scripts.
        4. **Tech Stack:** React 19, TypeScript, Google GenAI SDK.
        
        TONE:
        - Excited and humble.
        - Technical but accessible.
        - "Build in Public" vibe.

        HASHTAGS:
        #FirstProject #AutoScriptAI #SankalpSuman #GeminiAPI #TestAutomation #ReactJS #BuildInPublic

        Keep it under 250 words. Use emojis.`
      }]
    }
  });

  return response.text || "Check out my first project AutoScript AI! Built with Gemini.";
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
    model: 'gemini-2.5-flash',
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
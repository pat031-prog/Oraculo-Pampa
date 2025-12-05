
// FIX: Imported SearchResult type.
import { GuardianAnalysisResult, SearchResult } from '../types';
import { GUARDIAN_SYSTEM_PROMPT } from '../constants';

// This is a placeholder for the actual GoogleGenAI class.
declare const window: any;

const getApiKey = (): string => {
    // First try to get from portable config (for portable version)
    if (typeof window !== 'undefined' && (window as any).PortableConfig) {
        const portableKey = (window as any).PortableConfig.getApiKey();
        if (portableKey && portableKey !== 'NO_API_KEY_CONFIGURED') {
            return portableKey;
        }
    }

    // Fall back to environment variable (for development)
    const key = process.env.API_KEY;
    if (!key) {
        console.error("API_KEY not configured. Please set your API key.");
        return "NO_API_KEY_CONFIGURED";
    }
    return key;
};

// Mock/placeholder since we cannot import from @google/genai
if (typeof window !== 'undefined' && !window.google?.generativeai?.GoogleGenAI) {
    if(!window.google) window.google = {};
    if(!window.google.generativeai) window.google.generativeai = {};
    window.google.generativeai.GoogleGenAI = class GoogleGenAI {
        private apiKey: string;
        public models: { generateContent: (payload: any) => Promise<any>; };
        
        constructor({ apiKey }: { apiKey: string }) { 
            this.apiKey = apiKey;
            this.models = {
                generateContent: async (payload: any): Promise<any> => {
                    const model = payload.model || 'gemini-2.5-flash';
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
                    
                    // FIX: Made mock API body construction more robust to handle optional config.
                    const body: any = {
                        contents: [{ parts: [{ text: payload.contents }] }],
                    };
                    if (payload.config?.systemInstruction) {
                        body.systemInstruction = { parts: [{ text: payload.config.systemInstruction }] };
                    }
                    if (payload.config?.tools) {
                        body.tools = payload.config.tools;
                    }

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });

                    if(response.status === 401) throw new Error("Authentication failed (401). Please check your API Key.");
                    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    
                    const jsonResponse = await response.json();
                    
                    Object.defineProperty(jsonResponse, 'text', {
                        get: function() { return this.candidates?.[0]?.content?.parts?.[0]?.text ?? ""; },
                        configurable: true,
                    });

                    return jsonResponse;
                }
            };
        }
    };
}

const initializeGenAI = () => {
    try {
        if (window.google?.generativeai?.GoogleGenAI) {
             return new window.google.generativeai.GoogleGenAI({ apiKey: getApiKey() });
        }
        console.error("Gemini SDK not loaded on window object.");
        return null;
    } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
        return null;
    }
}

const ai = initializeGenAI();

// FIX: Renamed generateSimpleContent to generateContent to match imports in components.
// UPDATED: Added useSearch parameter to enable Google Grounding.
export const generateContent = async (prompt: string, useSearch: boolean = false): Promise<string> => {
    if (!ai) return "Error: Gemini client not initialized.";
    try {
        const config = useSearch ? { tools: [{ googleSearch: {} }] } : undefined;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: config
        });
        
        if (response.promptFeedback?.blockReason) {
             throw new Error(`Request blocked: ${response.promptFeedback.blockReason}`);
        }
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw error;
    }
};

// FIX: Added generateContentWithSearch function to resolve import error in LiveAnalysisSection.
export const generateContentWithSearch = async (systemPrompt: string, userQuery: string): Promise<SearchResult> => {
    if (!ai) throw new Error("Gemini client not initialized.");
    try {
        const fullPrompt = `USER QUERY: "${userQuery}". Execute the analysis based on your system instructions.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: systemPrompt
            }
        });

        if (response.promptFeedback?.blockReason) {
            throw new Error(`Request blocked: ${response.promptFeedback.blockReason}`);
        }

        const text = response.text;
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = rawChunks.map((chunk: any) => ({
            uri: chunk.web?.uri || '',
            title: chunk.web?.title || 'Untitled',
        })).filter((source: any) => source.uri);

        return { text, sources };
    } catch (error) {
        console.error("Gemini search call failed:", error);
        throw error;
    }
};


export const runGuardianAnalysis = async (userQuery: string): Promise<GuardianAnalysisResult> => {
    if (!ai) throw new Error("Gemini client not initialized.");
    try {
        const fullPrompt = `USER QUERY: "${userQuery}". Execute the analysis based on your system instructions.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: GUARDIAN_SYSTEM_PROMPT
            }
        });

        if (response.promptFeedback?.blockReason) {
            throw new Error(`Request blocked: ${response.promptFeedback.blockReason}`);
        }

        const rawText = response.text;
        
        // Parse the response
        const parts = rawText.split('---JSON_DIRECTIVE---');
        const brief = parts[0]?.trim() || "No brief generated.";
        
        let jsonStr = "{}";
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            jsonStr = jsonMatch[1];
        } else if(parts[1]) {
            jsonStr = parts[1].trim();
        }

        return { brief, json: jsonStr };

    } catch (error) {
        console.error("Guardian Analysis API call failed:", error);
        throw error;
    }
};

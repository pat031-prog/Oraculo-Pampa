/**
 * Multi-API Service for Oráculo Pampa
 *
 * Provides abstraction layer for multiple AI providers:
 * - Google Gemini
 * - Groq
 * - DeepInfra
 * - OpenAI
 * - Anthropic Claude
 * - Custom endpoints
 */

declare const window: any;

export type ApiProvider = 'gemini' | 'groq' | 'deepinfra' | 'openai' | 'anthropic' | 'custom';

export interface ApiConfig {
    provider: ApiProvider;
    apiKey: string;
    model?: string;
    baseUrl?: string; // For custom endpoints
}

export interface ApiMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ApiResponse {
    text: string;
    provider: ApiProvider;
    model: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}

/**
 * Get API configurations from portable config or localStorage
 */
export const getApiConfigs = (): ApiConfig[] => {
    const configs: ApiConfig[] = [];

    // Try to get from PortableConfig
    if (typeof window !== 'undefined' && (window as any).PortableConfig) {
        const storedConfigs = localStorage.getItem('oraculo_pampa_api_configs');
        if (storedConfigs) {
            try {
                return JSON.parse(storedConfigs);
            } catch (e) {
                console.error('Failed to parse API configs:', e);
            }
        }
    }

    // Fallback to Gemini from environment (development mode)
    const geminiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'NO_API_KEY_CONFIGURED') {
        configs.push({
            provider: 'gemini',
            apiKey: geminiKey,
            model: 'gemini-2.0-flash-exp'
        });
    }

    return configs;
};

/**
 * Save API configurations to localStorage
 */
export const saveApiConfigs = (configs: ApiConfig[]): void => {
    localStorage.setItem('oraculo_pampa_api_configs', JSON.stringify(configs));
    console.log('✓ API configurations saved');
};

/**
 * Call Gemini API
 */
const callGemini = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    const model = config.model || 'gemini-2.0-flash-exp';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

    // Combine system and user messages
    const systemMsg = messages.find(m => m.role === 'system')?.content || '';
    const userMsg = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
    const fullPrompt = systemMsg ? `${systemMsg}\n\n${userMsg}` : userMsg;

    const body: any = {
        contents: [{ parts: [{ text: fullPrompt }] }]
    };

    if (systemMsg) {
        body.systemInstruction = { parts: [{ text: systemMsg }] };
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
        text,
        provider: 'gemini',
        model,
        usage: {
            promptTokens: data.usageMetadata?.promptTokenCount,
            completionTokens: data.usageMetadata?.candidatesTokenCount,
            totalTokens: data.usageMetadata?.totalTokenCount
        }
    };
};

/**
 * Call Groq API
 */
const callGroq = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    const model = config.model || 'llama-3.3-70b-versatile';
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
        text,
        provider: 'groq',
        model,
        usage: {
            promptTokens: data.usage?.prompt_tokens,
            completionTokens: data.usage?.completion_tokens,
            totalTokens: data.usage?.total_tokens
        }
    };
};

/**
 * Call DeepInfra API
 */
const callDeepInfra = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    const model = config.model || 'meta-llama/Llama-3.3-70B-Instruct';
    const url = 'https://api.deepinfra.com/v1/openai/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        throw new Error(`DeepInfra API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
        text,
        provider: 'deepinfra',
        model,
        usage: {
            promptTokens: data.usage?.prompt_tokens,
            completionTokens: data.usage?.completion_tokens,
            totalTokens: data.usage?.total_tokens
        }
    };
};

/**
 * Call OpenAI API
 */
const callOpenAI = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    const model = config.model || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
        text,
        provider: 'openai',
        model,
        usage: {
            promptTokens: data.usage?.prompt_tokens,
            completionTokens: data.usage?.completion_tokens,
            totalTokens: data.usage?.total_tokens
        }
    };
};

/**
 * Call Anthropic Claude API
 */
const callAnthropic = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    const model = config.model || 'claude-3-5-sonnet-20241022';
    const url = 'https://api.anthropic.com/v1/messages';

    // Separate system message
    const systemMsg = messages.find(m => m.role === 'system')?.content || '';
    const conversationMsgs = messages.filter(m => m.role !== 'system');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model,
            system: systemMsg,
            messages: conversationMsgs.map(m => ({ role: m.role, content: m.content })),
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    return {
        text,
        provider: 'anthropic',
        model,
        usage: {
            promptTokens: data.usage?.input_tokens,
            completionTokens: data.usage?.output_tokens,
            totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
        }
    };
};

/**
 * Call Custom API endpoint (OpenAI-compatible)
 */
const callCustom = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    if (!config.baseUrl) {
        throw new Error('Custom API requires baseUrl');
    }

    const model = config.model || 'default';
    const url = `${config.baseUrl}/v1/chat/completions`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
        text,
        provider: 'custom',
        model,
        usage: {
            promptTokens: data.usage?.prompt_tokens,
            completionTokens: data.usage?.completion_tokens,
            totalTokens: data.usage?.total_tokens
        }
    };
};

/**
 * Main function to call any AI provider
 */
export const callAI = async (
    config: ApiConfig,
    messages: ApiMessage[]
): Promise<ApiResponse> => {
    switch (config.provider) {
        case 'gemini':
            return callGemini(config, messages);
        case 'groq':
            return callGroq(config, messages);
        case 'deepinfra':
            return callDeepInfra(config, messages);
        case 'openai':
            return callOpenAI(config, messages);
        case 'anthropic':
            return callAnthropic(config, messages);
        case 'custom':
            return callCustom(config, messages);
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
};

/**
 * Call with automatic fallback through multiple providers
 */
export const callAIWithFallback = async (
    messages: ApiMessage[],
    preferredProvider?: ApiProvider
): Promise<ApiResponse> => {
    const configs = getApiConfigs();

    if (configs.length === 0) {
        throw new Error('No API configurations available. Please configure at least one provider.');
    }

    // Sort configs to prioritize preferred provider
    const sortedConfigs = preferredProvider
        ? [...configs.sort((a, b) => {
            if (a.provider === preferredProvider) return -1;
            if (b.provider === preferredProvider) return 1;
            return 0;
        })]
        : configs;

    let lastError: Error | null = null;

    // Try each provider in order
    for (const config of sortedConfigs) {
        try {
            console.log(`Trying provider: ${config.provider}`);
            const response = await callAI(config, messages);
            return response;
        } catch (error) {
            console.error(`Provider ${config.provider} failed:`, error);
            lastError = error as Error;
            // Continue to next provider
        }
    }

    // All providers failed
    throw new Error(`All API providers failed. Last error: ${lastError?.message}`);
};

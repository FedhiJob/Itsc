import OpenAI from 'openai';
import type { LLMConfig, LLMMessage, LLMRequest, LLMResponse } from './llm.types.js';

// Provider-agnostic: defaults to Google Gemini's OpenAI-compatible free endpoint.
// Override OPENAI_BASE_URL / OPENAI_MODEL / OPENAI_API_KEY in .env to switch
// to OpenAI, OpenRouter, Groq, or a local server (e.g. Ollama) without code changes.
const DEFAULT_MODEL = 'gemini-3.7-flash';
const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

const DEFAULT_CONFIG: LLMConfig = {
  model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
  temperature: 0.7,
  maxTokens: 500
};

export class OpenAIService {
  private client: OpenAI;
  private config: LLMConfig;

  constructor(config?: Partial<LLMConfig>) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL
    });
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generateResponse(messages: LLMMessage[]): Promise<string> {
    try {
      const request: LLMRequest = {
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      };

      const response = await this.client.chat.completions.create(request);
      
      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from LLM provider');
      }

      const content = response.choices[0]?.message?.content;
      return content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('LLM API error:', error);
      throw new Error('Failed to generate response from AI assistant');
    }
  }
}
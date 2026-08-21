import OpenAI from 'openai';
import type { LLMConfig, LLMMessage, LLMRequest, LLMResponse } from './llm.types.js';

const DEFAULT_CONFIG: LLMConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 500
};

export class OpenAIService {
  private client: OpenAI;
  private config: LLMConfig;

  constructor(config?: Partial<LLMConfig>) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
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
        throw new Error('No response from OpenAI');
      }

      const content = response.choices[0]?.message?.content;
      return content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response from AI assistant');
    }
  }
}
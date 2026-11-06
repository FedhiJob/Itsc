import { v4 as uuidv4 } from 'uuid';
import { retrieveKnowledge } from './knowledge/knowledge.retriever.js';
import { buildPrompt } from './llm/prompt.builder.js';
import { OpenAIService } from './llm/openai.service.js';
import type { ChatMessage, ChatResponse } from './chat.types.js';

export class ChatService {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  async processMessage(
    message: string,
    conversationId?: string,
    conversationHistory?: ChatMessage[]
  ): Promise<ChatResponse> {
    // Generate conversation ID if not provided
    const id = conversationId || uuidv4();

    // Retrieve relevant knowledge and structured courses from live database
    const { chunks, courses } = await retrieveKnowledge(message, conversationHistory);

    // Build prompt with knowledge, recent history, and current question
    const messages = buildPrompt(message, chunks, conversationHistory);

    // Generate response using OpenAI / Gemini with resilient fallback
    const answer = await this.openaiService.generateResponse(messages, chunks, courses);

    // Build sources from knowledge chunks
    const sources = chunks.map(chunk => ({
      title: chunk.source,
      section: chunk.section,
      content: chunk.content
    }));

    return {
      answer,
      sources,
      courses: courses.length > 0 ? courses : undefined,
      conversationId: id
    };
  }
}

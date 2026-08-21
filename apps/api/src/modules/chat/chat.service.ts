import { v4 as uuidv4 } from 'uuid';
import { retrieveKnowledge } from './knowledge/knowledge.retriever.js';
import type { KnowledgeChunk } from './knowledge/knowledge.types.js';
import { buildPrompt } from './llm/prompt.builder.js';
import { OpenAIService } from './llm/openai.service.js';
import type { ChatResponse } from './chat.types.js';

export class ChatService {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  async processMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    // Generate conversation ID if not provided
    const id = conversationId || uuidv4();

    // Retrieve relevant knowledge
    const knowledgeChunks: KnowledgeChunk[] = await retrieveKnowledge(message);

    // Build prompt with knowledge and question
    const messages = buildPrompt(message, knowledgeChunks);

    // Generate response using OpenAI
    const answer = await this.openaiService.generateResponse(messages);

    // Build sources from knowledge chunks
    const sources = knowledgeChunks.map(chunk => ({
      title: chunk.source,
      section: chunk.section,
      content: chunk.content
    }));

    return {
      answer,
      sources,
      conversationId: id
    };
  }
}
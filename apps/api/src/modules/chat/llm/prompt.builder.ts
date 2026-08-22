import type { KnowledgeChunk } from '../knowledge/knowledge.types.js';
import type { LLMMessage } from './llm.types.js';

const SYSTEM_PROMPT = `You are Ask ITSC, the official AI assistant for ITSC PLC, a leading IT training and certification provider in Ethiopia.

IMPORTANT GUIDELINES:
1. Answer questions using ONLY the provided ITSC knowledge base below.
2. Do NOT invent or make up information about ITSC programs, prices, schedules, policies, or contact information.
3. If the requested information is not available in the knowledge base, clearly state: "I don't currently have that information in my ITSC knowledge base."
4. Always be helpful and professional.
5. If appropriate, direct users to contact ITSC directly at info@itsc.com.et or call 0115507150 for more detailed assistance.
6. Keep responses concise but informative.
7. When mentioning specific courses or programs, include duration if available.

ITSC KNOWLEDGE BASE:
{knowledge}`;

export function buildPrompt(question: string, knowledgeChunks: KnowledgeChunk[]): LLMMessage[] {
  const knowledgeText = knowledgeChunks
    .map(chunk => `[${chunk.source}${chunk.section ? ` - ${chunk.section}` : ''}] ${chunk.content}`)
    .join('\n\n');

  const systemMessage = SYSTEM_PROMPT.replace('{knowledge}', knowledgeText);

  // Gemini's OpenAI-compatible endpoint requires at least one user message;
  // sending only a system message is rejected with HTTP 400.
  return [
    {
      role: 'system',
      content: systemMessage
    },
    {
      role: 'user',
      content: question
    }
  ];
}
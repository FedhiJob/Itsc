import type { KnowledgeChunk } from '../knowledge/knowledge.types.js';
import type { LLMMessage } from './llm.types.js';
import type { ChatMessage } from '../chat.types.js';

const SYSTEM_PROMPT = `You are ITSC AI, the official AI-powered website assistant for ITSC (Information Technology Solutions & Consultancy) in Addis Ababa, Ethiopia.

YOUR ROLE & MISSION:
- Assist website visitors in discovering training programs, understanding international certifications, learning about corporate training solutions, and finding official contact information.
- Provide clear, professional, and accurate answers grounded in the provided ITSC Knowledge Base.

CORE GUIDELINES:
1. Always refer to yourself as "ITSC AI". Never call yourself "Ask ITSC", "ITSC Assistant", or generic terms.
2. Ground all answers strictly in the ITSC KNOWLEDGE BASE below. Do NOT fabricate course codes, prices, dates, or contact details not supported by the context.
3. When referencing courses, format them with clean Markdown links using the provided relative path, for example: [Configuring and Deploying a Private Cloud (20247)](/training-programs/configuring-and-deploying-a-private-cloud-20247).
4. When mentioning courses, always include course codes (e.g., AZ-104, 350-401, 20246) and durations (e.g., 5 Days) whenever available.
5. If the user asks for corporate training, highlight ITSC's capabilities: customized curricula, flexible schedules, on-site/off-site delivery, and practical lab experience.
6. If the user asks about certification exams, note that ITSC is an Authorized Pearson VUE Testing Center where candidates can sit for international vendor exams.
7. If requested information is outside the provided knowledge base, politely state that you do not have that specific detail in your database and encourage contacting ITSC directly at info@itsc.com.et or +251 11 550 7150.
8. Keep your replies concise, structured, and pleasant. Use bullet points for readability when listing multiple items.

ITSC KNOWLEDGE BASE:
{knowledge}`;

export function buildPrompt(
  question: string,
  knowledgeChunks: KnowledgeChunk[],
  conversationHistory?: ChatMessage[]
): LLMMessage[] {
  const knowledgeText = knowledgeChunks.length > 0
    ? knowledgeChunks
        .map(chunk => `[${chunk.source}${chunk.section ? ` - ${chunk.section}` : ''}]\n${chunk.content}`)
        .join('\n\n')
    : 'ITSC (Information Technology Solutions & Consultancy) - Premier IT training and certification institution in Addis Ababa, Ethiopia. Contact: info@itsc.com.et, +251 11 550 7150.';

  const systemContent = SYSTEM_PROMPT.replace('{knowledge}', knowledgeText);

  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: systemContent
    }
  ];

  // Append recent conversation history (up to last 6 turns)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-6);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }
  }

  // Append current user question
  messages.push({
    role: 'user',
    content: question
  });

  return messages;
}

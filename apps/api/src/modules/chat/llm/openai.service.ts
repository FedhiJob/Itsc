import OpenAI from 'openai';
import type { LLMConfig, LLMMessage, LLMRequest } from './llm.types.js';
import type { KnowledgeChunk } from '../knowledge/knowledge.types.js';
import type { StructuredCourse } from '../chat.types.js';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || process.env.OPENAI_MODEL || 'gemini-3.1-flash-lite';
const FALLBACK_MODEL = 'gemini-flash-lite-latest';
const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

const DEFAULT_CONFIG: LLMConfig = {
  model: DEFAULT_MODEL,
  temperature: 0.7,
  maxTokens: 600
};

export class OpenAIService {
  private client: OpenAI | null = null;
  private config: LLMConfig;
  private apiKey: string | undefined;

  constructor(config?: Partial<LLMConfig> & { apiKey?: string }) {
    this.apiKey = config?.apiKey !== undefined
      ? config.apiKey
      : (process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL,
        timeout: 10000 // 10 second timeout to prevent hangs
      });
    }
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generateResponse(
    messages: LLMMessage[],
    knowledgeChunks: KnowledgeChunk[] = [],
    courses: StructuredCourse[] = []
  ): Promise<string> {
    // 1. If no client or API key is set, immediately use structured deterministic synthesis
    if (!this.client || !this.apiKey) {
      console.warn('LLM API key not configured. Generating resilient fallback response.');
      return this.synthesizeFallbackResponse(messages, knowledgeChunks, courses);
    }

    // 2. Try primary configured model, then proven working free-tier fallbacks
    const candidateModels = [
      this.config.model,
      'gemini-3.1-flash-lite',
      FALLBACK_MODEL,
      'gemini-3.5-flash'
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    for (const model of candidateModels) {
      try {
        const request: LLMRequest = {
          model,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        };

        const response = await this.client.chat.completions.create(request);
        const content = response.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return content.trim();
        }
      } catch (error: any) {
        const status = error?.status || error?.response?.status;
        const msg = error?.message || String(error);
        console.warn(`LLM attempt with model ${model} failed (status: ${status}): ${msg}`);
        // If 404 (model retired/unavailable), 503 (high demand), or 429 (rate limit), continue to next candidate
        continue;
      }
    }

    // 3. Resilient Fallback: If all LLM calls failed, generate a clean answer from knowledge & courses
    console.warn('All LLM models exhausted or rate-limited. Synthesizing grounded fallback response.');
    return this.synthesizeFallbackResponse(messages, knowledgeChunks, courses);
  }

  /**
   * Resilient fallback response generator:
   * When Google Gemini free tier hits 503 (high demand) or 429 (rate limits),
   * this builds a direct, highly relevant response from database matches.
   */
  private synthesizeFallbackResponse(
    messages: LLMMessage[],
    knowledgeChunks: KnowledgeChunk[],
    courses: StructuredCourse[]
  ): string {
    const userMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    const query = userMessage.toLowerCase().trim();

    // Case 0: Normal Greetings
    if (/^(hi|hello|hey|good\s+(morning|afternoon|evening)|greetings|selam|howdy)\b/i.test(query)) {
      return `Hello! Welcome to **ITSC AI**, your official digital assistant for ITSC (Information Technology Solutions & Consultancy).\n\nHow can I help you today? You can ask me to:\n• **Explore training programs** across Microsoft, Cisco, CompTIA, Oracle, EC-Council, and more.\n• **Search courses by certification code** (e.g. AZ-104, 350-401, 20247, SY0-701).\n• Learn about **corporate training services** and customized corporate team programs.\n• View **Pearson VUE testing center** exam scheduling.\n• Get **contact information** and office directions.`;
    }

    // Case 1: Out of scope questions
    const isOutOfScope = ['recipe', 'cooking', 'weather', 'movie', 'football', 'soccer', 'celebrity', 'horoscope', 'flight', 'hotel', 'crypto', 'bitcoin'].some(k => query.includes(k));
    if (isOutOfScope) {
      return `I am **ITSC AI**, the official assistant for ITSC in Addis Ababa, Ethiopia. I specialize exclusively in providing information about IT training programs, professional certifications, corporate training packages, and Pearson VUE exams. I do not have information regarding general non-IT topics.\n\nPlease let me know if you would like to explore our course catalogue or learn more about ITSC services!`;
    }

    // Case 2: Course Prerequisites Inquiry
    const isPrereqQuery = ['prereq', 'prerequisite', 'requirements', 'requirement', 'qualif', 'needed before'].some(k => query.includes(k));
    if (isPrereqQuery && courses.length > 0) {
      const targetCourse = courses.find(c => c.prerequisites && c.prerequisites.length > 0) || courses[0];
      if (targetCourse) {
        const prereqList = targetCourse.prerequisites && targetCourse.prerequisites.length > 0
          ? targetCourse.prerequisites.map(p => `• ${p}`).join('\n')
          : '• Basic foundational knowledge of computer systems and relevant domain fundamentals.';

        return `Official prerequisites for **[${targetCourse.title}](/training-programs/${targetCourse.slug})**${targetCourse.code ? ` (${targetCourse.code})` : ''}:\n\n${prereqList}\n\nDuration: **${targetCourse.duration || '5 Days'}** • Category: **${targetCourse.category || 'Professional IT'}**.\n\nYou can view full syllabus objectives on the [course details page](/training-programs/${targetCourse.slug}) or contact an ITSC training advisor at **info@itsc.com.et**.`;
      }
    }

    // Case 3: Course Listings found
    if (courses.length > 0) {
      const courseList = courses
        .map(c => `• **[${c.title}](/training-programs/${c.slug})**${c.code ? ` (${c.code})` : ''} — ${c.duration || 'Flexible duration'}${c.category ? ` • *${c.category}*` : ''}`)
        .join('\n');

      return `Here are the matching ITSC training programs found in our catalogue:\n\n${courseList}\n\nYou can click any course title above to view full prerequisites, course outlines, and schedules. For corporate bookings or customized cohorts, please contact ITSC at **info@itsc.com.et** or call **+251 11 550 7150**.`;
    }

    // Case 4: Contact inquiry
    if (['contact', 'phone', 'email', 'address', 'location', 'where'].some(k => query.includes(k))) {
      return `You can reach **ITSC (Information Technology Solutions & Consultancy)** through any of the following channels:\n\n• **Address:** Bole, Behind DH Geda Tower, Addis Ababa, Ethiopia\n• **Phone:** +251 11 550 7150 / +251 91 120 4444\n• **Email:** info@itsc.com.et\n• **Working Hours:** Monday – Friday: 8:30 AM – 5:30 PM, Saturday: 8:30 AM – 12:30 PM\n\nOur team is available to assist you with course registration, corporate training inquiries, and Pearson VUE exam scheduling.`;
    }

    // Case 5: Corporate training inquiry
    if (['corporate', 'company', 'organization', 'enterprise', 'workforce'].some(k => query.includes(k))) {
      return `**ITSC Corporate Training Solutions:**\n\nITSC offers tailored enterprise training programs designed to upskill technical teams and support organizational digital transformation:\n\n• **Customized Curricula:** Tailored to your organization's technology stack and business goals.\n• **Flexible Delivery:** On-site at client premises, at ITSC's modern lab facilities, or via live virtual instructor-led sessions.\n• **Enterprise Support:** Post-training evaluations, attendance tracking, and vendor certification roadmaps.\n\nTo request a corporate training proposal, contact our corporate advisory team at **info@itsc.com.et** or call **+251 11 550 7150**.`;
    }

    // Case 6: About ITSC inquiry
    if (['about', 'what is itsc', 'tell me about', 'who is', 'history', 'founded'].some(k => query.includes(k))) {
      return `**About ITSC:**\n\nEstablished in 1999, **ITSC (Information Technology Solutions & Consultancy)** is a premier provider of IT training, consultancy, and certification services in Ethiopia. Over the last 25+ years, ITSC has trained thousands of professionals across government ministries, financial institutions, telecom operators, and international organizations.\n\nITSC is an **Authorized Pearson VUE Testing Center** and partners with leading technology vendors including Microsoft, Cisco, CompTIA, Oracle, EC-Council, and Red Hat.`;
    }

    // Case 7: Knowledge chunk available
    if (knowledgeChunks.length > 0 && knowledgeChunks[0]) {
      const primaryChunk = knowledgeChunks[0];
      return `${primaryChunk.content}\n\nFor more details or personalized assistance, feel free to contact ITSC at **info@itsc.com.et** or call **+251 11 550 7150**.`;
    }

    // Case 8: General helpful fallback
    return `Hello! I am **ITSC AI**, your assistant for ITSC training programs, certifications, and corporate services.\n\nHow can I help you today? You can ask about:\n• Exploring courses by vendor (e.g., Microsoft, Cisco, CompTIA, Oracle)\n• Searching for courses by code (e.g., AZ-104, 350-401, 20247)\n• Course prerequisites, duration, and delivery options\n• Corporate training packages and customized team workshops\n• Official Pearson VUE certification testing\n• Contact and registration details`;
  }
}

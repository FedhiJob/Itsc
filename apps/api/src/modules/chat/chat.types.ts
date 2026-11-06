export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StructuredCourse {
  title: string;
  slug: string;
  code?: string | null | undefined;
  duration?: string | null | undefined;
  category?: string | undefined;
  shortDescription?: string | undefined;
  objectives?: string[] | undefined;
  prerequisites?: string[] | undefined;
}

export interface ChatRequest {
  message: string;
  conversationId?: string | undefined;
  conversationHistory?: ChatMessage[] | undefined;
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[] | undefined;
  courses?: StructuredCourse[] | undefined;
  conversationId: string;
}

export interface ChatSource {
  title: string;
  section: string | undefined;
  content: string;
}

export interface LLMConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
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
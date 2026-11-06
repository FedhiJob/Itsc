import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  courses?: StructuredCourse[] | undefined;
}

export interface ChatRequest {
  message: string;
  conversationId?: string | undefined;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }> | undefined;
}

export interface ChatResponse {
  answer: string;
  sources?: Array<{
    title: string;
    section?: string | undefined;
    content: string;
  }> | undefined;
  courses?: StructuredCourse[] | undefined;
  conversationId: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function sendChatMessage(
  message: string,
  conversationId?: string | undefined,
  conversationHistory?: ChatMessage[] | undefined
): Promise<ChatResponse> {
  const request: ChatRequest = {
    message,
    conversationId: conversationId || undefined,
    conversationHistory: conversationHistory
      ? conversationHistory.map(m => ({ role: m.role, content: m.content })).slice(-6)
      : undefined
  };

  const response = await apiClient.post<ApiResponse<ChatResponse>>('/chat', request);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to send message');
  }

  return response.data.data;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}



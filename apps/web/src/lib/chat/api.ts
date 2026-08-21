import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId: string | undefined;
}

export interface ChatResponse {
  answer: string;
  sources?: Array<{
    title: string;
    section?: string;
    content: string;
  }>;
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
  conversationId?: string
): Promise<ChatResponse> {
  const request: ChatRequest = {
    message,
    conversationId,
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
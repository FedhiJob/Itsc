'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot, User, RefreshCw } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '@/lib/chat/api';

const SUGGESTED_QUESTIONS = [
  { icon: '🎓', text: 'What training programs do you offer?' },
  { icon: '📞', text: 'How can I contact ITSC?' },
  { icon: '🏢', text: 'Tell me about corporate training' },
  { icon: '🏆', text: 'What certifications do you provide?' }
];

const WELCOME_MESSAGE = {
  role: 'assistant' as const,
  content: "👋 Hello! I'm Ask ITSC, your AI assistant. I can help you find information about our training programs, contact details, services, and more. How can I assist you today?"
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => scrollToBottom(), [messages]);

  // Open the chat when an "Ask ITSC" button anywhere on the page is clicked.
  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener("itsc:open-chat", openChat);
    return () => window.removeEventListener("itsc:open-chat", openChat);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(userMessage.content, conversationId);
      if (!conversationId) setConversationId(response.conversationId);
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact ITSC directly at info@itsc.com.et." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
          {messages.length <= 1 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="itsc-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[calc(100vw-2rem)] max-w-md h-[80vh] max-h-[600px] flex flex-col overflow-hidden sm:w-96 sm:h-[600px] sm:max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Ask ITSC</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 itsc-pulse"></span>
                  Online • AI Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearConversation}
                className="hover:bg-blue-800/50 p-2 rounded-full transition-colors"
                aria-label="Clear conversation"
                title="New conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-800/50 p-2 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl ${message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <div className="itsc-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0ms' }}></div>
                      <div className="itsc-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '150ms' }}></div>
                      <div className="itsc-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(item.text)}
                    disabled={isLoading}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about training, contact info, services..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-3 transition-all duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by AI • Responses based on ITSC knowledge base
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
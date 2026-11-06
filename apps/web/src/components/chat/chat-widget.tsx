'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, X, Bot, User, RefreshCw, BookOpen, Clock, Tag, ExternalLink, RotateCcw, AlertCircle } from 'lucide-react';
import { sendChatMessage, type ChatMessage, type StructuredCourse } from '@/lib/chat/api';

interface ExtendedChatMessage extends ChatMessage {
  isError?: boolean;
}

const STARTER_PROMPTS = [
  { icon: '🎓', text: 'Explore ITSC training programs' },
  { icon: '🔍', text: 'Find a course by certification code' },
  { icon: '🏢', text: 'What corporate training services does ITSC offer?' },
  { icon: 'ℹ️', text: 'Tell me about ITSC' },
  { icon: '📞', text: 'How can I contact ITSC?' }
];

const WELCOME_MESSAGE: ExtendedChatMessage = {
  role: 'assistant',
  content: `👋 **Welcome to ITSC AI**\n\nI am your official digital assistant for ITSC. I can help you explore training programs, locate courses by code, check prerequisites, learn about corporate training services, and find official contact details.\n\nSelect a prompt below or type your question to get started!`
};

/**
 * Lightweight inline markdown renderer for bold text and relative/absolute markdown links
 */
function FormattedMessageText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) {
      parts.push(<br key={`br-${lineIdx}`} />);
    }

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const lineElements: React.ReactNode[] = [];

    while ((match = linkRegex.exec(line)) !== null) {
      const precedingText = line.substring(lastIndex, match.index);
      if (precedingText) {
        lineElements.push(renderBoldText(precedingText, `${lineIdx}-${lastIndex}`));
      }

      const label = match[1] || '';
      const href = match[2] || '#';
      const isInternal = href.startsWith('/') || href.startsWith('#');

      lineElements.push(
        isInternal ? (
          <Link
            key={`link-${lineIdx}-${match.index}`}
            href={href}
            className="inline-flex items-center gap-0.5 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            {label}
          </Link>
        ) : (
          <a
            key={`ext-link-${lineIdx}-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            {label}
            <ExternalLink className="inline h-3 w-3" />
          </a>
        )
      );

      lastIndex = linkRegex.lastIndex;
    }

    const remainingText = line.substring(lastIndex);
    if (remainingText) {
      lineElements.push(renderBoldText(remainingText, `${lineIdx}-${lastIndex}`));
    }

    parts.push(<span key={`line-${lineIdx}`}>{lineElements}</span>);
  });

  return <div className="space-y-1">{parts}</div>;
}

function renderBoldText(text: string, keyPrefix: string): React.ReactNode {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function CourseCard({ course }: { course: StructuredCourse }) {
  return (
    <div className="mt-2 rounded-xl border border-blue-100 bg-white p-3 shadow-xs transition-all hover:border-blue-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold text-gray-900 leading-snug">
          {course.title}
        </h4>
        {course.code && (
          <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
            {course.code}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
        {course.duration && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            {course.duration}
          </span>
        )}
        {course.category && (
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-gray-400" />
            {course.category}
          </span>
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-end">
        <Link
          href={`/training-programs/${course.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View course details
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [isTyping, setIsTyping] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Open the chat when an "ITSC AI" button anywhere on the page is clicked.
  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener('itsc:open-chat', openChat);
    return () => window.removeEventListener('itsc:open-chat', openChat);
  }, []);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Escape key closes modal; returns focus to launcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        launcherButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock page scroll while the chat is open on mobile viewports
  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(undefined);
    setLastUserMessage(null);
  };

  const executeSend = async (messageText: string) => {
    const cleanText = messageText.trim();
    if (!cleanText || isLoading) return;

    const userMessage: ExtendedChatMessage = { role: 'user', content: cleanText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLastUserMessage(cleanText);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(
        cleanText,
        conversationId,
        updatedMessages
      );
      if (!conversationId) setConversationId(response.conversationId);

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          courses: response.courses
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I encountered temporary connectivity issues reaching the AI service. You can click 'Retry' below, or contact ITSC directly at **info@itsc.com.et** or **+251 11 550 7150**.",
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeSend(input);
    }
  };

  const handleRetry = () => {
    if (lastUserMessage && !isLoading) {
      executeSend(lastUserMessage);
    }
  };

  const handleStarterPrompt = (question: string) => {
    setInput(question);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          ref={launcherButtonRef}
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-blue-700 p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label="Open ITSC AI assistant"
          aria-expanded={false}
          title="Open ITSC AI assistant"
        >
          <Bot className="h-6 w-6 transition-transform group-hover:scale-110" />
          {messages.length <= 1 && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="itsc-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-blue-500"></span>
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ITSC AI digital assistant"
          className="flex h-[84vh] max-h-[640px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overscroll-contain sm:w-96 sm:h-[600px] sm:max-h-[600px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3.5 text-white">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white/20 p-2">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">ITSC AI</h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 itsc-pulse"></span>
                  Online • Official Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearConversation}
                className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Start new conversation"
                title="New conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  launcherButtonRef.current?.focus();
                }}
                className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close ITSC AI"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Subheader tagline */}
          <div className="bg-blue-50/80 px-4 py-1.5 border-b border-blue-100/60 flex items-center justify-between">
            <p className="text-[11px] text-blue-800 font-medium truncate">
              Your intelligent assistant for ITSC training and services.
            </p>
          </div>

          {/* Messages Container */}
          <div
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-gray-50/60"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[88%] ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-100 text-blue-700'
                        : message.isError
                        ? 'bg-red-100 text-red-600'
                        : 'bg-linear-to-br from-blue-600 to-blue-700 text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-3.5 w-3.5" />
                    ) : message.isError ? (
                      <AlertCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-br-xs shadow-sm'
                        : message.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-xs shadow-xs'
                        : 'bg-white text-gray-800 rounded-bl-xs shadow-xs border border-gray-200/70'
                    }`}
                  >
                    <FormattedMessageText text={message.content} />

                    {/* Retry button on error */}
                    {message.isError && (
                      <div className="mt-2.5 pt-2 border-t border-red-200/60 flex items-center justify-end">
                        <button
                          onClick={handleRetry}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 hover:text-red-900 disabled:opacity-50 transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Retry request
                        </button>
                      </div>
                    )}

                    {/* Structured Course Cards */}
                    {message.courses && message.courses.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-blue-600" />
                          Recommended Courses ({message.courses.length})
                        </p>
                        {message.courses.map((course, cIdx) => (
                          <CourseCard key={cIdx} course={course} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs border border-gray-200/70">
                    <div className="flex items-center gap-1">
                      <div
                        className="itsc-bounce w-1.5 h-1.5 bg-blue-500 rounded-full"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="itsc-bounce w-1.5 h-1.5 bg-blue-500 rounded-full"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="itsc-bounce w-1.5 h-1.5 bg-blue-500 rounded-full"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Prompts Container */}
          {messages.length <= 1 && (
            <div className="px-4 py-2.5 bg-white border-t border-gray-100">
              <p className="text-[11px] font-medium text-gray-500 mb-1.5">Suggested prompts:</p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterPrompt(item.text)}
                    disabled={isLoading}
                    className="text-[11px] bg-gray-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 transition-colors flex items-center gap-1.5 text-left disabled:opacity-50"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form with Enter-to-send and Shift+Enter for new lines */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-end space-x-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask ITSC AI about courses, codes, contact... (Enter to send)"
                className="flex-1 max-h-24 min-h-[38px] resize-none px-3.5 py-2 text-xs border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-normal"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="shrink-0 bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-2.5 transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md disabled:shadow-none mb-0.5"
                aria-label="Send message"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-gray-400">
              <span>Shift+Enter for newline</span>
              <span>Official ITSC Assistant</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

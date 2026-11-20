'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  X,
  Bot,
  User,
  RefreshCw,
  BookOpen,
  Clock,
  Tag,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  Mail,
  ChevronDown
} from 'lucide-react';
import { sendChatMessage, type ChatMessage, type StructuredCourse } from '@/lib/chat/api';

interface ExtendedChatMessage extends ChatMessage {
  isError?: boolean | undefined;
}

interface ContextPrompt {
  icon: string;
  text: string;
}

/**
 * Derives contextual suggested prompts and page banner label based on active route
 */
function getRouteContext(pathname: string): { label: string; prompts: ContextPrompt[] } {
  if (pathname.startsWith('/training-programs/')) {
    const rawSlug = pathname.replace('/training-programs/', '').split('/')[0] || '';
    const formattedTitle = rawSlug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      label: formattedTitle ? `Course: ${formattedTitle}` : 'Course Detail',
      prompts: [
        { icon: '📋', text: 'What are the prerequisites for this course?' },
        { icon: '🎯', text: 'What certification exam does this course prepare for?' },
        { icon: '📜', text: 'How do I download or review the full syllabus?' },
        { icon: '💼', text: 'Can this course be delivered for our corporate team?' },
        { icon: '📅', text: 'When is the next batch of classes starting?' }
      ]
    };
  }

  if (pathname === '/corporate-training') {
    return {
      label: 'Corporate & Enterprise Training',
      prompts: [
        { icon: '🏢', text: 'How does ITSC customize training for enterprises?' },
        { icon: '👥', text: 'Can training be conducted on-site at our organization?' },
        { icon: '📑', text: 'How do I request a corporate training quotation?' },
        { icon: '📞', text: 'Connect me with an ITSC corporate training advisor' }
      ]
    };
  }

  if (pathname === '/contact') {
    return {
      label: 'Contact & Admissions',
      prompts: [
        { icon: '📍', text: 'Where is the ITSC training facility located in Addis Ababa?' },
        { icon: '⏰', text: 'What are the office working and consultation hours?' },
        { icon: '📞', text: 'What is the official phone number and admissions email?' },
        { icon: '💬', text: 'How quickly does an advisor respond to inquiries?' }
      ]
    };
  }

  if (pathname === '/gallery') {
    return {
      label: 'Facilities & Labs',
      prompts: [
        { icon: '📸', text: "Tell me about ITSC's training labs and facilities" },
        { icon: '💻', text: 'What hands-on computer hardware and lab gear is provided?' },
        { icon: '📍', text: 'Can I visit the training center before registering?' }
      ]
    };
  }

  if (pathname.startsWith('/news')) {
    return {
      label: 'News & Announcements',
      prompts: [
        { icon: '📰', text: 'What are the latest training schedules and announcements?' },
        { icon: '🎓', text: 'When does the upcoming certification semester begin?' },
        { icon: '💡', text: 'What new technology courses were recently introduced?' }
      ]
    };
  }

  if (pathname === '/about') {
    return {
      label: 'About ITSC',
      prompts: [
        { icon: 'ℹ️', text: "What is ITSC's history and mission in Ethiopia?" },
        { icon: '🤝', text: 'What international technology partners does ITSC work with?' },
        { icon: '🏆', text: 'Are ITSC completion certificates recognized internationally?' }
      ]
    };
  }

  // Default global prompts
  return {
    label: 'Official Institutional Assistant',
    prompts: [
      { icon: '🎓', text: 'Explore ITSC certification training programs' },
      { icon: '🔍', text: 'Find a course by certification code (e.g., AZ-900, CCNA)' },
      { icon: '🏢', text: 'What corporate training programs does ITSC provide?' },
      { icon: 'ℹ️', text: 'Tell me about ITSC and its technology credentials' },
      { icon: '📞', text: 'How can I speak with a training advisor?' }
    ]
  };
}

const WELCOME_MESSAGE: ExtendedChatMessage = {
  role: 'assistant',
  content: `👋 **Welcome to ITSC AI**\n\nI am your official institutional assistant for ITSC. I can help you explore training programs, locate courses by certification code, check prerequisites, learn about corporate training services, and find official contact details.\n\nSelect a prompt below or type your question to get started!`
};

/**
 * Lightweight inline markdown renderer for bold text and relative/absolute markdown links
 */
function FormattedMessageText({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
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
            onClick={() => onNavigate?.()}
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

function CourseCard({ course, onNavigate }: { course: StructuredCourse; onNavigate?: () => void }) {
  return (
    <div className="mt-2 rounded-xl border border-blue-100 bg-white p-3 shadow-xs transition-all hover:border-brand-navy/30 hover:shadow-sm">
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

      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        <Link
          href={`/contact?subject=enrollment&source=${encodeURIComponent(`/training-programs/${course.slug}`)}&sourceLabel=${encodeURIComponent(course.title)}`}
          onClick={() => onNavigate?.()}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-brand-ink transition-colors"
        >
          <Mail className="h-3 w-3 text-brand-gold-accessible" />
          Inquire
        </Link>
        <Link
          href={`/training-programs/${course.slug}`}
          onClick={() => onNavigate?.()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View details
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [isTyping, setIsTyping] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Mobile swipe down drag tracking
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);
  const chatDialogRef = useRef<HTMLDivElement>(null);

  // Dynamic context derived from current route
  const currentContext = useMemo(() => getRouteContext(pathname), [pathname]);

  // Smooth auto-scroll throttled via requestAnimationFrame without jitter
  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    if (smooth) {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  // Monitor user scroll position to avoid jerking user when they read earlier messages
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setUserScrolledUp(distanceToBottom > 80);
  }, []);

  useEffect(() => {
    if (isOpen && !userScrolledUp) {
      scrollToBottom(true);
    }
  }, [messages, isOpen, isTyping, userScrolledUp, scrollToBottom]);

  // Custom event listener for buttons across the site
  useEffect(() => {
    const openChat = () => {
      setIsOpen(true);
      setAnnouncement('ITSC AI chat window opened.');
    };
    window.addEventListener('itsc:open-chat', openChat);
    return () => window.removeEventListener('itsc:open-chat', openChat);
  }, []);

  // Automatically hide/close the chat box when a new page loads or route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Auto-resize textarea to fit typed content dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Keyboard navigation: Escape key closes modal & Focus trapping inside chat window
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        launcherButtonRef.current?.focus();
        return;
      }

      // Focus trap within modal
      if (e.key === 'Tab' && chatDialogRef.current) {
        const focusableElements = chatDialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          el => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock page scroll while chat is open on mobile viewports (< 640px)
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

  // Mobile swipe-to-dismiss gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      dragStartYRef.current = touch.clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartYRef.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const deltaY = touch.clientY - dragStartYRef.current;
    // Only permit downward dragging
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffsetY > 75) {
      // Threshold exceeded: dismiss drawer
      setIsOpen(false);
      launcherButtonRef.current?.focus();
    }
    setDragOffsetY(0);
    setIsDragging(false);
    dragStartYRef.current = null;
  };

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(undefined);
    setLastUserMessage(null);
    setUserScrolledUp(false);
    setAnnouncement('Conversation cleared. Welcome message displayed.');
  };

  const executeSend = async (messageText: string) => {
    const cleanText = messageText.trim();
    if (!cleanText || isLoading) return;

    const userMessage: ExtendedChatMessage = { role: 'user', content: cleanText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLastUserMessage(cleanText);
    setIsLoading(true);
    setIsTyping(true);
    setUserScrolledUp(false);
    setAnnouncement('Question sent. ITSC AI is thinking...');

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
      setAnnouncement(`ITSC AI replied: ${response.answer.slice(0, 90)}...`);
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
      setAnnouncement('Connectivity issue. Retry button is available.');
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
    executeSend(question);
  };

  // Do not render the public assistant inside the administrative back-office
  if (isAdmin) {
    return null;
  }

  return (
    <>
      {/* Live Accessibility Screen Reader Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Mobile Backdrop Overlay - gentle scrim, tap to dismiss without jarring layout shifts */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            launcherButtonRef.current?.focus();
          }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity sm:hidden"
          aria-hidden="true"
        />
      )}

      {/* Floating Launcher Button (visible when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40">
          <button
            ref={launcherButtonRef}
            onClick={() => {
              setIsOpen(true);
              setAnnouncement('ITSC AI chat window opened.');
            }}
            className="itsc-press group relative flex items-center justify-center rounded-full bg-linear-to-br from-brand-navy to-brand-ink p-3.5 sm:p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold cursor-pointer"
            aria-label="Open ITSC AI assistant"
            aria-expanded={false}
            title="Open ITSC AI assistant"
          >
            <Bot className="h-6 w-6 text-brand-gold transition-transform group-hover:scale-110" />
            {messages.length <= 1 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="itsc-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-gold"></span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window Panel / Mobile Bottom Sheet */}
      {isOpen && (
        <div
          ref={chatDialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="ITSC AI digital assistant"
          style={{
            transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 flex h-[76vh] sm:h-[580px] max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100vh-4.5rem)] w-full sm:w-[410px] sm:max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overscroll-contain itsc-sheet-enter sm:itsc-popover-enter"
        >
          {/* Header & Mobile Swipe Handle */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="bg-linear-to-r from-brand-navy to-brand-ink px-4 pt-3 pb-3 text-white select-none touch-none sm:touch-auto shrink-0"
          >
            {/* Mobile Swipe Grab Handle */}
            <div className="flex justify-center pb-2 sm:hidden">
              <div className="h-1.5 w-12 rounded-full bg-white/40 hover:bg-white/60 transition-colors cursor-grab" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-brand-gold/20 p-2">
                  <Bot className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">ITSC AI</h3>
                  <p className="text-[11px] text-gray-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 itsc-pulse"></span>
                    Online • Official Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={clearConversation}
                  className="itsc-press rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
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
                  className="itsc-press rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Close ITSC AI"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Context-Aware Banner */}
          <div className="bg-brand-gold/10 px-4 py-1.5 border-b border-brand-gold/20 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-brand-ink font-semibold truncate flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gold-accessible"></span>
              {currentContext.label}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-navy/60 hidden sm:inline">
              Context-Aware
            </span>
          </div>

          {/* Messages Container with scroll tracking */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            role="log"
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-gray-50/60 relative scroll-smooth"
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
                        : 'bg-linear-to-br from-brand-navy to-brand-ink text-brand-gold'
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
                    className={`px-4 py-3 rounded-2xl text-[13px] sm:text-xs leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-linear-to-br from-brand-navy to-brand-ink text-white rounded-br-xs shadow-sm'
                        : message.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-xs shadow-xs'
                        : 'bg-white text-gray-800 rounded-bl-xs shadow-xs border border-gray-200/70'
                    }`}
                  >
                    <FormattedMessageText
                      text={message.content}
                      onNavigate={() => setIsOpen(false)}
                    />

                    {/* Retry button on error */}
                    {message.isError && (
                       <div className="mt-2.5 pt-2 border-t border-red-200/60 flex items-center justify-end">
                        <button
                          onClick={handleRetry}
                          disabled={isLoading}
                          className="itsc-press inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 hover:text-red-900 disabled:opacity-50 transition-colors cursor-pointer"
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
                          <BookOpen className="h-3 w-3 text-brand-navy" />
                          Recommended Courses ({message.courses.length})
                        </p>
                        {message.courses.map((course, cIdx) => (
                          <CourseCard
                            key={cIdx}
                            course={course}
                            onNavigate={() => setIsOpen(false)}
                          />
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
                  <div className="shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-brand-navy to-brand-ink flex items-center justify-center text-brand-gold">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs border border-gray-200/70">
                    <div className="flex items-center gap-1">
                      <div
                        className="itsc-bounce w-1.5 h-1.5 bg-brand-navy rounded-full"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="itsc-bounce w-1.5 h-1.5 bg-brand-navy rounded-full"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="itsc-bounce w-1.5 h-1.5 bg-brand-navy rounded-full"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Jump-to-bottom indicator if scrolled up */}
          {userScrolledUp && (
            <div className="relative">
              <button
                onClick={() => {
                  setUserScrolledUp(false);
                  scrollToBottom(true);
                }}
                className="itsc-press absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-brand-navy text-white text-[11px] font-medium px-3 py-1 shadow-md flex items-center gap-1 border border-white/20 hover:bg-brand-ink transition-colors cursor-pointer"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                New updates below
              </button>
            </div>
          )}

          {/* Context-Aware Starter Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 py-2.5 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-semibold text-gray-600">Suggested questions:</p>
                <span className="text-[10px] text-gray-400">Click to ask</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {currentContext.prompts.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterPrompt(item.text)}
                    disabled={isLoading}
                    className="itsc-press text-[11px] bg-gray-50 hover:bg-brand-navy/5 hover:text-brand-navy hover:border-brand-navy/30 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 transition-colors flex items-center gap-1.5 text-left disabled:opacity-50 cursor-pointer"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form with Enter-to-send, 16px mobile font to prevent auto-zoom, and safe area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-3 sm:p-3.5 bg-white pb-[env(safe-area-inset-bottom,0.75rem)] shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about courses, admissions, fees..."
                className="flex-1 max-h-32 min-h-[42px] resize-none px-3.5 py-2.5 text-[16px] sm:text-sm placeholder:text-gray-400 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-gold rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all leading-normal"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="itsc-press shrink-0 flex items-center justify-center h-[42px] w-[42px] rounded-xl bg-linear-to-br from-brand-navy to-brand-ink hover:from-brand-ink hover:to-brand-navy disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 text-white shadow-xs hover:shadow disabled:shadow-none transition-all cursor-pointer"
                aria-label="Send message"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4 text-brand-gold" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-gray-400 select-none">
              <span className="hidden sm:inline">Shift+Enter for newline</span>
              <span className="inline sm:hidden">Press Return or Send</span>
              <span className="text-[10px] text-gray-400 font-medium">Official ITSC AI</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

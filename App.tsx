import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, StopCircle, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Standard practice, but we'll use a simple random string for now to avoid package issues in this strict environment
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import EmptyState from './components/EmptyState';
import { streamChatResponse } from './services/geminiService';
import { Message, Role, ModelId } from './types';

// Simple UUID generator since we can't rely on external packages in this strict environment without package.json
const generateId = () => Math.random().toString(36).substring(2, 15);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>(ModelId.FLASH);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessageId = generateId();
    const newUserMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      text: text.trim(),
      timestamp: Date.now(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    // Create placeholder for bot message
    const botMessageId = generateId();
    const placeholderBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      text: '', // Start empty
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, placeholderBotMessage]);

    try {
      let fullResponse = '';

      // We need to pass the history *excluding* the latest optimistic messages we just added to state
      // strictly for the API call, although usually we want the API to know about the user's latest message.
      // streamChatResponse handles creating the history internally, so we pass the current state messages
      // (excluding the new user message we just added for display, or including it? 
      // The service expects `history` and `userMessage`. 
      // So we pass `messages` (previous state) as history.
      
      await streamChatResponse(
        selectedModel,
        messages, // Current history before this turn
        newUserMessage.text,
        (chunkText) => {
          fullResponse += chunkText;
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === botMessageId 
                ? { ...msg, text: fullResponse }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error("Chat error", error);
      // Replace the empty bot message with an error message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, text: "Sorry, I encountered an error. Please try again.", isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, selectedModel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      <Header currentModel={selectedModel} onModelChange={setSelectedModel} />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto relative w-full max-w-4xl mx-auto p-4 md:p-6 scroll-smooth">
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSendMessage} />
        ) : (
          <div className="flex flex-col pb-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {/* Loading Indicator within flow if needed, though streaming handles visual feedback naturally */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="w-full bg-gray-950/80 backdrop-blur-lg border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative flex items-end gap-2 bg-gray-900 border border-gray-700 rounded-2xl p-2 shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-base p-3 resize-none focus:outline-none max-h-48 rounded-xl"
              style={{ minHeight: '48px' }}
            />
            
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className={`
                mb-1 p-2.5 rounded-xl flex items-center justify-center transition-all duration-200
                ${!input.trim() || isLoading 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95'
                }
              `}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} className={input.trim() ? 'ml-0.5' : ''} />
              )}
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-xs text-gray-500">
               Gemini can make mistakes. Please double-check responses.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
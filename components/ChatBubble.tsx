import React from 'react';
import { Message, Role } from '../types';
import { User, Bot, AlertCircle } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const isError = message.isError;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isUser ? 'bg-indigo-600' : isError ? 'bg-red-500' : 'bg-emerald-600'}
          shadow-lg
        `}>
          {isUser ? <User size={16} className="text-white" /> : 
           isError ? <AlertCircle size={16} className="text-white" /> :
           <Bot size={16} className="text-white" />}
        </div>

        {/* Content */}
        <div className={`
          flex flex-col 
          ${isUser ? 'items-end' : 'items-start'}
        `}>
          <div className={`
            px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-md
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : isError
                ? 'bg-red-900/50 border border-red-500/50 text-red-200 rounded-tl-sm'
                : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-sm'
            }
          `}>
            {message.text}
          </div>
          <span className="text-xs text-gray-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
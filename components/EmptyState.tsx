import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { INITIAL_SUGGESTIONS } from '../constants';

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestionClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20 ring-1 ring-gray-700/50">
        <MessageSquarePlus size={32} className="text-indigo-400" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
        How can I help you today?
      </h2>
      <p className="text-gray-400 max-w-md mb-8">
        Experience the power of Gemini. Ask me anything from complex code generation to creative writing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {INITIAL_SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-4 bg-gray-800/40 hover:bg-gray-800 border border-gray-700/50 hover:border-indigo-500/30 rounded-xl text-left text-sm text-gray-300 transition-all duration-200 group"
          >
            <span className="group-hover:text-indigo-300 transition-colors">"{suggestion}"</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
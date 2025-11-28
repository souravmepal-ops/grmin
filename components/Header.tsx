import React from 'react';
import { Sparkles, Zap, BrainCircuit } from 'lucide-react';
import { ModelId } from '../types';
import { MODELS } from '../constants';

interface HeaderProps {
  currentModel: ModelId;
  onModelChange: (model: ModelId) => void;
}

const Header: React.FC<HeaderProps> = ({ currentModel, onModelChange }) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60 p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Gemini Quantum
            </h1>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${currentModel === model.id 
                  ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }
              `}
            >
              {model.id === ModelId.FLASH ? <Zap size={14} className="text-yellow-500" /> : <BrainCircuit size={14} className="text-blue-400" />}
              {model.name}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};

export default Header;
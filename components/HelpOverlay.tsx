import React from 'react';
import { LATEX_SYMBOLS } from '../constants';

interface HelpOverlayProps {
  onSelect: (code: string) => void;
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)] w-full max-w-4xl max-h-[80vh] flex flex-col rounded-md overflow-hidden font-[VT323]">
        
        {/* Header */}
        <div className="bg-green-500 text-black px-4 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-wider">Symbol Reference [-hn]</h2>
          <button 
            onClick={onClose}
            className="hover:bg-black hover:text-green-500 px-2 font-bold"
          >
            [X] ESC
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
          {LATEX_SYMBOLS.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="text-green-400 border-b border-green-800 pb-1 text-lg uppercase tracking-widest">
                {category.category}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {category.items.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => onSelect(item.code)}
                    className="group flex flex-col items-center justify-center p-2 border border-gray-700 hover:border-green-500 hover:bg-green-900/20 transition-all rounded"
                    title={item.code}
                  >
                    <span className="text-2xl mb-1 text-gray-200 group-hover:text-white font-mono">
                       {/* We display the label/symbol directly if it's a simple char, 
                           otherwise we might just show the name if it's complex. 
                           But here label is designed to be readable. */}
                       {item.label}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-green-300 truncate w-full text-center font-mono">
                      {item.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-800 text-center text-gray-500 text-sm">
          Click a symbol to insert it into the terminal.
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;

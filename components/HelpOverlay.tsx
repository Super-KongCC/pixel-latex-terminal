
import React, { useState } from 'react';
import { LATEX_SYMBOLS } from '../constants';

interface HelpOverlayProps {
  onSelect: (code: string) => void;
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onSelect, onClose }) => {
  const [matrixRows, setMatrixRows] = useState(2);
  const [matrixCols, setMatrixCols] = useState(2);

  const handleGenerateMatrix = () => {
    let str = "\\begin{bmatrix}\n";
    for (let r = 0; r < matrixRows; r++) {
      str += "  ";
      for (let c = 0; c < matrixCols; c++) {
        str += c < matrixCols - 1 ? " & " : "";
      }
      str += r < matrixRows - 1 ? " \\\\\n" : "\n";
    }
    str += "\\end{bmatrix}";
    onSelect(str);
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)] w-full max-w-4xl max-h-[85vh] flex flex-col rounded-md overflow-hidden font-[VT323]">
        
        {/* Header */}
        <div className="bg-green-500 text-black px-4 py-2 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold uppercase tracking-wider">Symbol Reference [-hn]</h2>
          <button 
            onClick={onClose}
            className="hover:bg-black hover:text-green-500 px-2 font-bold"
          >
            [X] ESC
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
          
          {/* Matrix Generator Tool */}
          <div className="border border-green-800 bg-green-900/10 p-4 rounded-lg">
             <h3 className="text-green-400 border-b border-green-800 pb-1 text-lg uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-xl">▦</span> Matrix Generator
             </h3>
             <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1">
                   <label className="text-gray-400 text-xs uppercase">Rows</label>
                   <input 
                      type="number" 
                      min="1" max="10" 
                      value={matrixRows}
                      onChange={(e) => setMatrixRows(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                      className="w-16 bg-black border border-green-700 text-green-400 p-1 text-center outline-none focus:border-green-400"
                   />
                </div>
                <span className="text-gray-600 mb-2">x</span>
                <div className="flex flex-col gap-1">
                   <label className="text-gray-400 text-xs uppercase">Cols</label>
                   <input 
                      type="number" 
                      min="1" max="10" 
                      value={matrixCols}
                      onChange={(e) => setMatrixCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                      className="w-16 bg-black border border-green-700 text-green-400 p-1 text-center outline-none focus:border-green-400"
                   />
                </div>
                <button 
                  onClick={handleGenerateMatrix}
                  className="bg-green-700 hover:bg-green-500 text-black font-bold px-4 py-1.5 rounded text-sm mb-px transition-colors"
                >
                  INSERT MATRIX
                </button>
             </div>
          </div>

          {/* Symbol Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LATEX_SYMBOLS.map((category) => (
                <div key={category.category} className="space-y-3 break-inside-avoid">
                <h3 className="text-green-400 border-b border-green-800 pb-1 text-lg uppercase tracking-widest">
                    {category.category}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {category.items.map((item) => (
                    <button
                        key={item.code}
                        onClick={() => onSelect(item.code)}
                        className="group flex flex-col items-center justify-center p-2 border border-gray-700 hover:border-green-500 hover:bg-green-900/20 transition-all rounded min-h-[60px]"
                        title={item.code}
                    >
                        <span className="text-xl mb-1 text-gray-200 group-hover:text-white font-mono">
                        {item.label}
                        </span>
                        <span className="text-[10px] text-gray-500 group-hover:text-green-300 truncate w-full text-center font-mono opacity-70 group-hover:opacity-100">
                        {item.code}
                        </span>
                    </button>
                    ))}
                </div>
                </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-800 text-center text-gray-500 text-sm shrink-0">
          Click a symbol to insert it. Use 'matrix(r,c)' command in terminal for quick matrices.
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;

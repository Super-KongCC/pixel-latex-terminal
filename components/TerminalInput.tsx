
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Theme, Snippet } from '../types';
import { EDITOR_SNIPPETS } from '../constants';

interface TerminalInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onHistoryNav: (direction: 'up' | 'down') => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  theme?: Theme;
  fontSize: number;
}

const getFontSizeClass = (size: number) => {
    switch(size) {
        case 1: return 'text-sm';
        case 2: return 'text-base';
        case 3: return 'text-xl';
        case 4: return 'text-2xl';
        case 5: return 'text-3xl';
        default: return 'text-xl';
    }
};

const TerminalInput: React.FC<TerminalInputProps> = ({ value, onChange, onSubmit, onHistoryNav, inputRef, theme = 'dark', fontSize }) => {
  const [matchedSnippet, setMatchedSnippet] = useState<Snippet | null>(null);
  const fontClass = getFontSizeClass(fontSize);
  
  // Auto-resize textarea
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value, inputRef, fontSize]);

  // Check for snippets when value changes
  useEffect(() => {
    if (!value) {
      setMatchedSnippet(null);
      return;
    }

    // We check if the input ENDS with a trigger. 
    // We reverse sort triggers by length to match longest specific trigger first (e.g. \begin vs \beg)
    const activeSnippet = EDITOR_SNIPPETS
      .sort((a, b) => b.trigger.length - a.trigger.length)
      .find(s => value.endsWith(s.trigger));

    setMatchedSnippet(activeSnippet || null);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Handle Tab Completion
    if (e.key === 'Tab') {
      e.preventDefault(); // Always prevent focus loss
      
      if (matchedSnippet) {
        // Perform replacement
        const before = value.slice(0, value.length - matchedSnippet.trigger.length);
        const newValue = before + matchedSnippet.insert;
        
        onChange(newValue);
        
        // Move cursor inside the block (if offset provided)
        setTimeout(() => {
          if (inputRef.current && matchedSnippet.cursorOffset) {
            const newPos = newValue.length + matchedSnippet.cursorOffset;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(newPos, newPos);
          }
        }, 10);
        
        setMatchedSnippet(null); // clear hint immediately
      }
      return;
    }

    // 2. Handle Enter (Submit vs Newline)
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow default behavior (new line)
        return;
      }
      e.preventDefault();
      onSubmit();
    } 
    
    // 3. History Nav
    else if (e.key === 'ArrowUp') {
      // Only nav history if cursor is at the top line or beginning? 
      // For terminal simplicity, usually Up Arrow always goes to history unless multiline editing.
      // Here we keep it simple: Up Arrow always triggers history if we are on first line (implied) or just standard behavior.
      // To allow multiline editing navigation, strictly we should check cursor pos.
      // But let's keep the existing props behavior:
      e.preventDefault();
      onHistoryNav('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onHistoryNav('down');
    }
  };

  return (
    <div className={`flex flex-col w-full mt-4 ${fontClass}`}>
        <div className="flex items-start gap-2 w-full relative group">
          <span className={`font-bold font-mono pt-[2px] shrink-0 select-none glow-text ${theme === 'dark' ? 'text-green-500' : 'text-green-700'}`}>
            ➜ ~ $
          </span>
          
          <div className="relative w-full">
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent font-mono outline-none resize-none overflow-hidden min-h-[24px] leading-relaxed block relative z-10
                ${theme === 'dark' ? 'text-gray-200 caret-green-500' : 'text-gray-800 caret-green-700'}`}
              spellCheck={false}
              autoFocus
            />
          </div>
        </div>

        {/* Snippet Hint Overlay */}
        {matchedSnippet && (
          <div className={`ml-10 text-xs font-mono mt-1 animate-bounce opacity-80
             ${theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'}`}>
             [TAB] {matchedSnippet.insert.split('\n')[0]}...
          </div>
        )}
    </div>
  );
};

export default TerminalInput;

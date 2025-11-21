import React, { useRef, useLayoutEffect } from 'react';
import { Theme } from '../types';

interface TerminalInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onHistoryNav: (direction: 'up' | 'down') => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  theme?: Theme;
}

const TerminalInput: React.FC<TerminalInputProps> = ({ value, onChange, onSubmit, onHistoryNav, inputRef, theme = 'dark' }) => {
  
  // Auto-resize textarea
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value, inputRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow default behavior (new line)
        return;
      }
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onHistoryNav('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onHistoryNav('down');
    }
  };

  return (
    <div className="flex items-start gap-2 mt-4 w-full">
      <span className={`font-bold font-mono pt-[2px] shrink-0 select-none glow-text ${theme === 'dark' ? 'text-green-500' : 'text-green-700'}`}>
        ➜ ~ $
      </span>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent font-mono outline-none resize-none overflow-hidden min-h-[24px] leading-6 block
          ${theme === 'dark' ? 'text-gray-200 caret-green-500' : 'text-gray-800 caret-green-700'}`}
        spellCheck={false}
        autoFocus
      />
    </div>
  );
};

export default TerminalInput;

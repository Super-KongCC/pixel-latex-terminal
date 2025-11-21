import React, { useState, useRef, useEffect } from 'react';
import TerminalInput from './TerminalInput';
import RenderedItem from './RenderedItem';
import HelpOverlay from './HelpOverlay';
import LivePreview from './LivePreview';
import { TerminalLine, OutputType, ParsedCommand, Theme, Language, TutorialLevel } from '../types';
import { HELP_TEXT, UI_TEXT, TUTORIAL_LEVELS, GAME_TEXT } from '../constants';

interface TerminalProps {
  theme: Theme;
  lang: Language;
}

const Terminal: React.FC<TerminalProps> = ({ theme, lang }) => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  
  const [input, setInput] = useState('');
  const [showHelpNav, setShowHelpNav] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // GAME STATE
  const [gameMode, setGameMode] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const t = UI_TEXT[lang];
  const gt = GAME_TEXT[lang];

  // Auto-scroll to bottom of terminal ONLY
  useEffect(() => {
    if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        // Manually set scrollTop to avoid hijacking window scroll
        containerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [history]);

  const parseInput = (text: string): ParsedCommand => {
    const flags = {
      download: false,
      copy: false,
      help: false,
      helpNav: false,
    };

    let content = text;

    // Check for flags at the end
    if (text.trim().endsWith('-h')) {
      flags.help = true;
      content = text.replace(/-h$/, '').trim();
    } else if (text.trim().endsWith('-hn')) {
      flags.helpNav = true;
      content = text.replace(/-hn$/, '').trim();
    }

    if (content.includes('-download')) {
      flags.download = true;
      content = content.replace(/-download/g, '');
    }
    if (content.includes('-copy')) {
      flags.copy = true;
      content = content.replace(/-copy/g, '');
    }

    return {
      raw: text,
      content: content.trim(),
      flags
    };
  };

  // Helper to push a simple message
  const pushMsg = (content: string, type: OutputType = OutputType.TEXT) => {
    setHistory(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: Date.now()
    }]);
  };

  // START GAME
  const startGame = () => {
    setGameMode(true);
    setCurrentLevelIndex(0);
    setScore(0);
    
    const welcomeId = Date.now().toString();
    setHistory(prev => [
        ...prev,
        { id: welcomeId, type: OutputType.GAME, content: `${gt.welcome}\n${gt.intro}`, timestamp: Date.now() }
    ]);

    // Push Level 1 question after a short delay
    setTimeout(() => {
        askLevelQuestion(0);
    }, 800);
  };

  const askLevelQuestion = (idx: number) => {
    const level = TUTORIAL_LEVELS[idx];
    if (!level) {
        // Win state
        pushMsg(`${gt.win}\n${gt.score}: ${score}/10`, OutputType.GAME);
        setGameMode(false);
        return;
    }

    pushMsg(`LEVEL ${level.id}: ${lang === 'zh' ? level.taskZh : level.taskEn}`, OutputType.GAME);
  };

  const handleGameInput = (rawInput: string) => {
     const cleanInput = rawInput.trim();
     
     // Exit game
     if (cleanInput.toLowerCase() === 'exit' || cleanInput.toLowerCase() === 'quit') {
        setGameMode(false);
        pushMsg("Exited Game Mode.", OutputType.TEXT);
        setInput('');
        return;
     }

     const level = TUTORIAL_LEVELS[currentLevelIndex];
     
     // Skip level
     if (cleanInput.toLowerCase() === 'skip') {
         pushMsg(`Skipped. Answer was: ${level.expected[0]}`, OutputType.ERROR);
         setCurrentLevelIndex(prev => prev + 1);
         setTimeout(() => askLevelQuestion(currentLevelIndex + 1), 500);
         setInput('');
         return;
     }

     // Check Answer
     // Normalize logic: remove spaces for simple comparison (unless spaces matter, but for beginners usually not crucial)
     const normInput = cleanInput.replace(/\s+/g, '');
     const possibleAnswers = level.expected.map(e => e.replace(/\s+/g, ''));
     
     const isCorrect = possibleAnswers.includes(normInput);

     // Render User's attempt first
     setHistory(prev => [...prev, {
        id: Date.now().toString(),
        type: OutputType.LATEX,
        content: cleanInput,
        command: cleanInput,
        timestamp: Date.now()
     }]);

     if (isCorrect) {
        const praise = gt.correct[Math.floor(Math.random() * gt.correct.length)];
        setScore(prev => prev + 1);
        pushMsg(praise, OutputType.GAME);
        
        setCurrentLevelIndex(prev => prev + 1);
        setTimeout(() => askLevelQuestion(currentLevelIndex + 1), 1000);
     } else {
        const scold = gt.wrong[Math.floor(Math.random() * gt.wrong.length)];
        pushMsg(`${scold}\nHint: ${lang === 'zh' ? level.hintZh : level.hintEn}`, OutputType.GAME);
     }

     setInput('');
  };


  const processCommand = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    
    // Add to command history
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
      setHistoryIndex(null); 
    }

    // ---------------------------
    // GAME MODE INTERCEPTION
    // ---------------------------
    if (gameMode) {
        handleGameInput(currentInput);
        return;
    }

    const parsed = parseInput(currentInput);
    const newLineId = Date.now().toString();

    // 0. Handle Clear
    if (parsed.content.toLowerCase() === 'clear' || parsed.content.toLowerCase() === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    // 0.1 Handle Game Start
    if (parsed.content.toLowerCase() === 'game') {
        setInput('');
        startGame();
        return;
    }

    // 1. Handle Help
    if (parsed.flags.help) {
      setHistory(prev => [...prev, {
        id: newLineId,
        type: OutputType.HELP,
        content: HELP_TEXT,
        command: parsed.raw,
        timestamp: Date.now()
      }]);
      setInput('');
      return;
    }

    // 2. Handle Help Nav
    if (parsed.flags.helpNav) {
      setShowHelpNav(true);
      setInput(''); 
      return;
    }

    setIsProcessing(true);

    try {
      let finalContent = parsed.content;
      let type = OutputType.LATEX;

      const newEntry: TerminalLine = {
        id: newLineId,
        type: type,
        content: finalContent,
        command: parsed.raw,
        timestamp: Date.now(),
        flags: parsed.flags
      };

      setHistory(prev => [...prev, newEntry]);
      setInput('');

    } catch (err) {
      setHistory(prev => [...prev, {
        id: newLineId,
        type: OutputType.ERROR,
        content: "An unknown error occurred.",
        command: parsed.raw,
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHistoryNav = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;

    let newIndex = historyIndex;

    if (direction === 'up') {
      if (newIndex === null) {
        newIndex = commandHistory.length - 1;
      } else {
        newIndex = Math.max(0, newIndex - 1);
      }
    } else {
      if (newIndex === null) return;
      if (newIndex < commandHistory.length - 1) {
        newIndex = newIndex + 1;
      } else {
        newIndex = null; // back to empty/current input
      }
    }

    setHistoryIndex(newIndex);

    if (newIndex !== null) {
      setInput(commandHistory[newIndex]);
      setTimeout(() => {
        if (inputRef.current) {
           const len = inputRef.current.value.length;
           inputRef.current.setSelectionRange(len, len);
        }
      }, 0);
    } else {
      setInput('');
    }
  };

  const handleSymbolSelect = (code: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newVal = input.substring(0, start) + code + input.substring(end);
      setInput(newVal);
      setShowHelpNav(false);
      
      setTimeout(() => {
        inputRef.current?.focus();
        const newPos = start + code.length;
        inputRef.current?.setSelectionRange(newPos, newPos);
      }, 10);
    } else {
      setInput(prev => prev + code);
      setShowHelpNav(false);
    }
  };

  // Theme Classes
  const subTextClass = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="w-full h-full flex flex-col font-[VT323] relative z-10">
      
      {/* Scrollable Content */}
      {/* ATTACH REF HERE FOR SCROLL CONTROL */}
      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-2">
        
        {/* Welcome Message */}
        {history.length === 0 && !gameMode && (
          <div className={`mb-8 text-xl ${subTextClass}`}>
            <p>{t.lastLogin}: {new Date().toLocaleString()} on ttys001</p>
            <p className={`mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.welcome}</p>
            <p>{t.helpCmd}</p>
            <p>{t.symbolCmd}</p>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>{t.navHint}</p>
            <p className={`mt-2 text-yellow-500 animate-pulse`}>Try typing 'game' to learn!</p>
          </div>
        )}

        {/* History */}
        <div className="flex flex-col text-xl">
          {history.map(line => (
            <RenderedItem key={line.id} line={line} theme={theme} lang={lang} />
          ))}
        </div>

        {/* Input */}
        <div className="text-xl">
            <TerminalInput 
              value={input}
              onChange={setInput}
              onSubmit={processCommand}
              onHistoryNav={handleHistoryNav}
              inputRef={inputRef}
              theme={theme}
            />
        </div>

        <div className="h-4" />
      </div>

      {/* Live Preview Panel (Fixed at bottom of terminal container) */}
      <LivePreview 
        latex={input} 
        onRobotClick={() => setShowHelpNav(true)} 
        theme={theme} 
        lang={lang} 
        moodOverride={gameMode ? 'TEACHER' : null}
      />

      {/* Modals */}
      {showHelpNav && (
        <HelpOverlay 
          onSelect={handleSymbolSelect} 
          onClose={() => setShowHelpNav(false)} 
        />
      )}

      {isProcessing && (
         <div className={`fixed top-4 right-4 animate-pulse font-mono text-sm px-2 py-1 border 
           ${theme === 'dark' ? 'text-green-500 bg-black border-green-500' : 'text-green-700 bg-white border-green-700'}`}>
           {t.processing}
         </div>
      )}
    </div>
  );
};

export default Terminal;
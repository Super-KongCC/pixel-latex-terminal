
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
  
  // Font size state: 1 (xs), 2 (sm), 3 (xl/normal), 4 (2xl), 5 (3xl)
  const [fontSize, setFontSize] = useState<number>(3);
  
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

  const generateMatrixLatex = (rows: number, cols: number) => {
    let str = "\\begin{bmatrix}\n";
    for(let r=0; r<rows; r++) {
      str += "  ";
      for(let c=0; c<cols; c++) {
        str += c < cols - 1 ? " & " : "";
      }
      str += r < rows - 1 ? " \\\\\n" : "\n";
    }
    str += "\\end{bmatrix}";
    return str;
  };

  const processCommand = async () => {
    // ALLOW empty inputs to act like "Enter" in a terminal
    const currentInput = input; // Do not trim immediately to detect whitespace
    
    // Add to command history only if not empty
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
      setHistoryIndex(null); 
    }

    // ---------------------------
    // GAME MODE INTERCEPTION
    // ---------------------------
    if (gameMode) {
        if (!currentInput.trim()) return; // Ignore empty enter in game mode
        handleGameInput(currentInput);
        return;
    }

    const parsed = parseInput(currentInput);
    const newLineId = Date.now().toString() + Math.random();

    // 0. Handle Clear
    if (parsed.content.toLowerCase() === 'clear' || parsed.content.toLowerCase() === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    // 0.1 Handle Font Size Command
    const fontMatch = parsed.content.match(/^font\s*[=<]?\s*(\d+)\s*[>]?$/i);
    if (fontMatch) {
        const size = parseInt(fontMatch[1]);
        if (!isNaN(size) && size >= 1 && size <= 5) {
            setFontSize(size);
            pushMsg(`Font size set to ${size}`, OutputType.TEXT);
            setInput('');
            return;
        } else {
            pushMsg(`Invalid font size. Use 1-5.`, OutputType.ERROR);
            setInput('');
            return;
        }
    }

    // 0.2 Handle Matrix Command: matrix(2,3)
    const matrixMatch = parsed.content.match(/^matrix\((\d+),\s*(\d+)\)$/i);
    if (matrixMatch) {
        const rows = parseInt(matrixMatch[1]);
        const cols = parseInt(matrixMatch[2]);
        if (rows > 0 && cols > 0 && rows <= 20 && cols <= 20) {
            const matrixCode = generateMatrixLatex(rows, cols);
            setInput(matrixCode); // Replace input for editing
            // Optionally focus
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    // Set cursor inside first gap if possible, simplistic approach:
                    const firstGap = matrixCode.indexOf("&");
                    if(firstGap > -1) inputRef.current.setSelectionRange(firstGap, firstGap);
                }
            }, 10);
            return; // Do not process as standard latex output yet
        }
    }


    // 0.3 Handle Game Start
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

    // 3. Handle Empty Input
    if (!parsed.content) {
        setHistory(prev => [...prev, {
            id: newLineId,
            type: OutputType.TEXT,
            content: "",
            command: "",
            timestamp: Date.now()
        }]);
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
    // If the code looks like a block (starts with \begin), we might want to replace input if it's empty, 
    // or append if not. But typical behavior is insert at cursor.
    
    if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newVal = input.substring(0, start) + code + input.substring(end);
      setInput(newVal);
      setShowHelpNav(false);
      
      setTimeout(() => {
        inputRef.current?.focus();
        // Try to be smart about cursor position (e.g. inside braces)
        // Very basic heuristic: if code ends with {}, put cursor inside
        // if matrix, leave cursor at end for now or find first &
        let newPos = start + code.length;
        if (code.endsWith('{}')) newPos -= 1;
        else if (code.endsWith('{  }')) newPos -= 2;
        
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
      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-2">
        
        {/* Welcome Message */}
        {history.length === 0 && !gameMode && (
          <div className={`mb-8 text-xl ${subTextClass}`}>
            <p>{t.lastLogin}: {new Date().toLocaleString()} on ttys001</p>
            <p className={`mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.welcome}</p>
            <p>{t.helpCmd}</p>
            <p>{t.symbolCmd}</p>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>{t.navHint}</p>
            <p className={`mt-2 text-yellow-500 animate-pulse`}>Try typing 'matrix(3,3)' or 'game'!</p>
          </div>
        )}

        {/* History */}
        <div className="flex flex-col">
          {history.map(line => (
            <RenderedItem key={line.id} line={line} theme={theme} lang={lang} fontSize={fontSize} />
          ))}
        </div>

        {/* Input */}
        <div className="">
            <TerminalInput 
              value={input}
              onChange={setInput}
              onSubmit={processCommand}
              onHistoryNav={handleHistoryNav}
              inputRef={inputRef}
              theme={theme}
              fontSize={fontSize}
            />
        </div>

        <div className="h-4" />
      </div>

      {/* Live Preview Panel */}
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

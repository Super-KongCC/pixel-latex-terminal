
import React, { useEffect, useRef, useState } from 'react';
import * as katexLib from 'katex';
import { Theme, Language } from '../types';
import { UI_TEXT } from '../constants';

const katex = (katexLib as any).default || katexLib;

interface LivePreviewProps {
  latex: string;
  onRobotClick?: () => void;
  theme: Theme;
  lang: Language;
  moodOverride?: 'TEACHER' | null;
}

type RobotMood = 'NEUTRAL' | 'HAPPY' | 'CONFUSED' | 'CHEEKY' | 'SLEEPY' | 'THINKING' | 'TEACHER';

const LivePreview: React.FC<LivePreviewProps> = ({ latex, onRobotClick, theme, lang, moodOverride }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [snarkyMsg, setSnarkyMsg] = useState<string>('');
  const [mood, setMood] = useState<RobotMood>('NEUTRAL');

  // Idle Timer Effect
  useEffect(() => {
    if (moodOverride) {
      setMood(moodOverride);
      return;
    }

    if (latex.trim()) {
      setSnarkyMsg('');
      return;
    }

    if (!snarkyMsg) setMood('NEUTRAL');

    const roasts = UI_TEXT[lang].roasts;
    const timer = setTimeout(() => {
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setSnarkyMsg(randomRoast);
      setMood('CHEEKY');
    }, 5000);

    return () => clearTimeout(timer);
  }, [latex, snarkyMsg, lang, moodOverride]);

  // Rendering Effect
  useEffect(() => {
    if (!previewRef.current) return;
    
    // 1. Render Latex if input exists
    if (latex.trim()) {
        try {
          // Detect environment usage to switch to display mode
          const hasEnv = latex.includes('\\begin') || latex.includes('\\[');
          
          const html = katex.renderToString(latex, {
            throwOnError: true, 
            displayMode: hasEnv, 
            output: 'html',
          });
          previewRef.current.innerHTML = html;
          previewRef.current.style.color = theme === 'dark' ? '#e2e8f0' : '#1f2937';
          if (!moodOverride) setMood('HAPPY');
        } catch (e: any) {
          const errMsg = e.message || "";
          // Smart error detection: if it's just an incomplete command/environment, show 'THINKING' instead of 'CONFUSED'
          const isIncomplete = errMsg.includes("Unexpected end of input") || 
                               errMsg.includes("Expected '}'") ||
                               latex.endsWith("\\") ||
                               latex.endsWith("{");
          
          if (isIncomplete) {
             if (!moodOverride) setMood('THINKING');
             const safeText = latex.replace(/</g, '&lt;');
             previewRef.current.innerHTML = `<span class="opacity-50 font-mono text-xs">${safeText}...</span>`;
          } else {
             // Genuine syntax error
             previewRef.current.innerHTML = '<span class="opacity-50 text-red-500 text-lg">?</span>';
             if (!moodOverride) setMood('CONFUSED');
          }
        }
        return;
    }

    // 2. Render Snarky Message if idle
    if (snarkyMsg && !moodOverride) {
        const color = theme === 'dark' ? 'text-green-400/80' : 'text-green-700/80';
        previewRef.current.innerHTML = `<span class="${color} font-mono text-sm animate-pulse">SCOTT: "${snarkyMsg}"</span>`;
        return;
    }

    // 3. Default state
    const idleColor = theme === 'dark' ? 'text-gray-600' : 'text-gray-400';
    previewRef.current.innerHTML = `<span class="${idleColor} italic text-sm">${UI_TEXT[lang].waiting}</span>`;
    if (mood !== 'CHEEKY' && !moodOverride) setMood('NEUTRAL');
    
  }, [latex, snarkyMsg, mood, theme, lang, moodOverride]);

  // SVG Faces
  const getFaceContent = () => {
    switch(mood) {
      case 'HAPPY': // Big sparkly eyes, smile
        return (
          <>
            <rect x="8" y="9" width="2" height="3" fill="currentColor" /> 
            <rect x="14" y="9" width="2" height="3" fill="currentColor" /> 
            <rect x="8" y="15" width="1" height="1" fill="currentColor" />
            <rect x="15" y="15" width="1" height="1" fill="currentColor" />
            <rect x="9" y="16" width="6" height="1" fill="currentColor" /> 
          </>
        );
      case 'CONFUSED': // Mismatched eyes, squiggly mouth
        return (
          <>
            <rect x="8" y="9" width="3" height="3" fill="currentColor" /> 
            <rect x="14" y="10" width="1" height="1" fill="currentColor" /> 
            <rect x="9" y="15" width="6" height="1" fill="currentColor" /> 
            <rect x="9" y="14" width="1" height="1" fill="currentColor" />
            <rect x="14" y="16" width="1" height="1" fill="currentColor" />
          </>
        );
      case 'CHEEKY': // Squinting, flat mouth
        return (
          <>
            <rect x="8" y="10" width="3" height="1" fill="currentColor" /> 
            <rect x="13" y="10" width="3" height="1" fill="currentColor" /> 
            <rect x="10" y="15" width="4" height="1" fill="currentColor" /> 
          </>
        );
      case 'THINKING': // Looking up
         return (
          <>
            <rect x="9" y="8" width="2" height="2" fill="currentColor" /> 
            <rect x="13" y="8" width="2" height="2" fill="currentColor" />
            <rect x="11" y="15" width="2" height="2" fill="currentColor" />
          </>
         );
      case 'TEACHER': // Glasses
         return (
          <>
             {/* Eyes */}
            <rect x="8" y="10" width="2" height="2" fill="currentColor" /> 
            <rect x="14" y="10" width="2" height="2" fill="currentColor" />
            {/* Glasses Bridge */}
            <rect x="10" y="11" width="4" height="1" fill="currentColor" opacity="0.8" />
            {/* Glasses Frame */}
            <rect x="7" y="9" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="13" y="9" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Smile */}
             <rect x="10" y="16" width="4" height="1" fill="currentColor" />
          </>
         );
      case 'SLEEPY':
      case 'NEUTRAL': // Standard
      default:
        return (
          <>
            <rect x="9" y="10" width="2" height="2" fill="currentColor" /> 
            <rect x="13" y="10" width="2" height="2" fill="currentColor" />
            <rect x="10" y="15" width="4" height="1" fill="currentColor" />
          </>
        );
    }
  }
  
  const getRobotColor = () => {
    // Dark Mode Colors
    if (theme === 'dark') {
        switch(mood) {
        case 'CONFUSED': return 'text-red-400 border-red-500/50 bg-red-900/20';
        case 'CHEEKY': return 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20';
        case 'HAPPY': return 'text-green-400 border-green-500/50 bg-green-900/20';
        case 'THINKING': return 'text-blue-400 border-blue-500/50 bg-blue-900/20';
        case 'TEACHER': return 'text-amber-400 border-amber-500/50 bg-amber-900/20';
        default: return 'text-green-400 border-green-500/30 bg-green-900/20';
        }
    } 
    // Light Mode Colors
    else {
        switch(mood) {
        case 'CONFUSED': return 'text-red-600 border-red-400 bg-red-100';
        case 'CHEEKY': return 'text-yellow-600 border-yellow-400 bg-yellow-100';
        case 'HAPPY': return 'text-green-600 border-green-400 bg-green-100';
        case 'THINKING': return 'text-blue-600 border-blue-400 bg-blue-100';
        case 'TEACHER': return 'text-amber-700 border-amber-500 bg-amber-100';
        default: return 'text-green-700 border-green-400 bg-green-50';
        }
    }
  }

  return (
    <div className={`w-full border-t-2 p-4 flex items-center gap-4 animate-in slide-in-from-bottom duration-300 transition-colors
        ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]' : 'bg-white/95 border-gray-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]'}`}>
      
      {/* Pixel Robot SVG Container */}
      <div 
        onClick={onRobotClick}
        className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border cursor-pointer transition-all group relative ${getRobotColor()} hover:scale-105 hover:shadow-lg`}
        title="I am Scott! Click me for symbols."
      >
         {/* Tooltip */}
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono border shadow-xl z-50 text-[10px]
            ${theme === 'dark' ? 'bg-gray-900 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300'}`}>
           I'm Scott! [-hn]
        </div>

        {/* SVG Character */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform">
           {/* Antenna */}
           <rect x="11" y="2" width="2" height="3" fill="currentColor" opacity="0.8" />
           <rect x="10" y="1" width="4" height="1" fill="currentColor" opacity="0.5" />
           
           {/* Head Outline */}
           <path d="M6 5H18V19H6V5Z" fill="currentColor" fillOpacity="0.1" />
           <rect x="5" y="5" width="1" height="14" fill="currentColor" />
           <rect x="18" y="5" width="1" height="14" fill="currentColor" />
           <rect x="6" y="4" width="12" height="1" fill="currentColor" />
           <rect x="6" y="19" width="12" height="1" fill="currentColor" />
           
           {/* Ear bumps */}
           <rect x="4" y="10" width="1" height="4" fill="currentColor" />
           <rect x="19" y="10" width="1" height="4" fill="currentColor" />

           {/* Face Content (Dynamic) */}
           {getFaceContent()}
        </svg>
      </div>

      {/* Speech Bubble / Preview Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full justify-center">
        <div className="text-[10px] text-gray-500 font-mono mb-1 tracking-widest uppercase flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mood === 'NEUTRAL' ? 'bg-gray-500' : mood === 'CHEEKY' ? 'bg-yellow-500 animate-pulse' : mood === 'CONFUSED' ? 'bg-red-500' : mood === 'THINKING' ? 'bg-blue-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></span>
              SCOTT.EXE
            </span>
            {snarkyMsg && !moodOverride && <span className="text-yellow-500/50 animate-pulse">● BORED</span>}
            {moodOverride === 'TEACHER' && <span className="text-amber-500 font-bold">● TEACHING MODE</span>}
        </div>
        {/* CHANGED: Added whitespace-pre-wrap and break-words to ensure long text wraps properly */}
        <div className={`border rounded px-4 py-2 overflow-x-auto custom-scrollbar min-h-[44px] transition-colors whitespace-pre-wrap break-words
            ${theme === 'dark' 
                ? (mood === 'CONFUSED' ? 'bg-black/50 border-red-900/50' : 'bg-black/50 border-gray-700') 
                : (mood === 'CONFUSED' ? 'bg-gray-50 border-red-300' : 'bg-gray-50 border-gray-300')
            }`}>
           <div ref={previewRef} className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;



import React, { useState } from 'react';
import Terminal from './components/Terminal';
import { Theme, Language, TerminalStyle } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [terminalStyle, setTerminalStyle] = useState<TerminalStyle>('MAC');

  // Toggle Handlers
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');
  const changeStyle = (style: TerminalStyle) => setTerminalStyle(style);

  // STYLE CONFIGURATIONS
  const getWindowStyles = () => {
    switch(terminalStyle) {
        case 'WIN98':
            return {
                // Dark mode uses BSOD Blue (#0000AA) background
                container: `bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] rounded-none`,
                titleBar: `bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-1 min-h-[32px] flex items-center select-none`,
                titleText: `text-white font-bold text-sm tracking-wider ml-2 font-sans`,
                trafficContainer: `flex gap-1 absolute right-2`,
                trafficCommon: `w-5 h-5 flex items-center justify-center text-xs font-bold border-t border-l border-white border-b border-r border-black bg-[#c0c0c0] hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-b-white active:border-r-white`,
                content: theme === 'dark' 
                    ? `bg-[#0000AA] m-1 mr-1 mb-1 border-2 border-t-black border-l-black border-b-white border-r-white shadow-inner` // BSOD Blue
                    : `bg-white m-1 mr-1 mb-1 border-2 border-t-black border-l-black border-b-white border-r-white`
            };
        case 'CYBER':
            return {
                // Redesigned Cyberpunk: "Neon Operator"
                // Dark: Deep void with Cyan accents. Light: High-tech Lab with Violet accents.
                container: theme === 'dark'
                    ? `bg-[#050510]/90 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-none backdrop-blur-md`
                    : `bg-slate-50/90 border border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] rounded-none backdrop-blur-md`,
                titleBar: theme === 'dark'
                    ? `bg-cyan-950/30 border-b border-cyan-500/30 px-4 py-2 relative overflow-hidden flex items-center justify-between`
                    : `bg-violet-100/50 border-b border-violet-500/20 px-4 py-2 relative overflow-hidden flex items-center justify-between`,
                titleText: theme === 'dark'
                    ? `text-cyan-400 font-bold font-mono tracking-[0.2em] text-xs uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]`
                    : `text-violet-600 font-bold font-mono tracking-[0.2em] text-xs uppercase`,
                trafficContainer: `flex gap-2 items-center absolute right-4`,
                trafficCommon: `w-3 h-3 rotate-45 border transition-all duration-300`,
                content: `bg-transparent m-0`
            };
        case 'MAC':
        default:
            return {
                container: theme === 'dark' 
                  ? 'bg-gray-900/90 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl border' 
                  : 'bg-white/90 border-gray-300 shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-xl border',
                titleBar: `px-4 py-3 flex items-center justify-center border-b sticky top-0 z-30 select-none transition-colors relative ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/80 border-gray-300'}`,
                titleText: `text-center text-sm font-bold tracking-wide font-[VT323] uppercase transition-colors hidden sm:block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`,
                trafficContainer: `flex gap-2 absolute left-4 top-1/2 -translate-y-1/2`,
                trafficCommon: `w-3 h-3 rounded-full transition-colors cursor-pointer shadow-inner hover:scale-110`,
                content: ``
            };
    }
  };

  const styles = getWindowStyles();

  return (
    <div className={`w-full min-h-screen flex flex-col xl:flex-row items-center justify-center p-4 py-8 gap-8 font-mono transition-colors duration-500 
      ${theme === 'dark' 
        ? 'bg-neutral-900 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]' 
        : 'bg-gray-100 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:20px_20px]'
      }`}>
      
      {/* Scanlines Effect */}
      {(theme === 'dark' || terminalStyle === 'CYBER') && <div className="scanlines fixed inset-0 pointer-events-none z-0"></div>}

      {/* LEFT SIDE: Scott's Manual / Intro Card */}
      <div className={`w-full max-w-md xl:w-80 shrink-0 rounded-xl border-2 p-6 flex flex-col items-center text-center relative z-10 shadow-xl transition-colors
         ${theme === 'dark' 
            ? 'bg-black/80 border-green-900/50 text-green-500 backdrop-blur-sm' 
            : 'bg-white/90 border-gray-300 text-gray-800'}`}>
         
         <div className="mb-4 border-b-2 border-dotted w-full pb-2 border-current opacity-50 font-[VT323] text-2xl tracking-widest">
            MANUAL_v1.0
         </div>

         {/* Big Decorative Scott */}
         <div className={`w-32 h-32 mb-6 rounded-xl border flex items-center justify-center shadow-inner
            ${theme === 'dark' ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-100 border-gray-300'}`}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect x="11" y="2" width="2" height="3" fill="currentColor" opacity="0.8" />
               <rect x="10" y="1" width="4" height="1" fill="currentColor" opacity="0.5" />
               <path d="M6 5H18V19H6V5Z" fill="currentColor" fillOpacity="0.1" />
               <rect x="5" y="5" width="1" height="14" fill="currentColor" />
               <rect x="18" y="5" width="1" height="14" fill="currentColor" />
               <rect x="6" y="4" width="12" height="1" fill="currentColor" />
               <rect x="6" y="19" width="12" height="1" fill="currentColor" />
               <rect x="4" y="10" width="1" height="4" fill="currentColor" />
               <rect x="19" y="10" width="1" height="4" fill="currentColor" />
               {/* Happy Face */}
               <rect x="8" y="9" width="2" height="3" fill="currentColor" /> 
               <rect x="14" y="9" width="2" height="3" fill="currentColor" /> 
               <rect x="8" y="15" width="1" height="1" fill="currentColor" />
               <rect x="15" y="15" width="1" height="1" fill="currentColor" />
               <rect x="9" y="16" width="6" height="1" fill="currentColor" /> 
            </svg>
         </div>

         <h1 className="text-3xl font-bold font-[VT323] mb-2">PIXEL LATEX</h1>
         <p className="text-sm opacity-80 mb-6 leading-relaxed">
            {lang === 'zh' 
              ? '复古风格的 LaTeX 编辑终端。支持实时预览、图片导出和互动教学模式。' 
              : 'A retro-styled terminal for editing LaTeX. Features live preview, image export, and interactive tutorials.'}
         </p>

         <div className="w-full text-left text-xs font-mono space-y-2 border-t border-dotted border-current pt-4 opacity-70">
            <div>➜ {lang === 'zh' ? '输入 "game" 开始教学' : 'Type "game" to learn'}</div>
            <div>➜ {lang === 'zh' ? '输入 "switch -win" 换肤' : 'Type "switch -win"'}</div>
            <div>➜ {lang === 'zh' ? 'Shift+Enter 换行' : 'Shift+Enter for newline'}</div>
         </div>

         <a 
           href="https://github.com/Super-KongCC/pixel-latex-terminal/tree/main" 
           target="_blank" 
           rel="noopener noreferrer"
           className="mt-6 text-xs opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 group"
         >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.98 6.14 17.98C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.477 17.52 2 12 2Z" />
            </svg>
            <span className="border-b border-transparent group-hover:border-current">GITHUB REPO</span>
         </a>
      </div>

      {/* RIGHT SIDE: Dynamic Window Container */}
      <div className={`w-full max-w-6xl h-[80vh] md:h-[90vh] flex flex-col overflow-hidden relative z-20 transition-all duration-500 ${styles.container}`}>
        
        {/* Title Bar */}
        <div className={`${styles.titleBar}`}>
          
          {/* CYBER DECORATIONS (Left) */}
          {terminalStyle === 'CYBER' && (
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-current opacity-50"></div>
          )}

          {/* Title Text */}
          <div className={`${styles.titleText} ${terminalStyle === 'CYBER' ? 'ml-0' : ''}`}>
            {terminalStyle === 'MAC' ? 'user@macbook-pro: ~/latex-editor' : 
             terminalStyle === 'WIN98' ? 'Terminal.exe' : 
             '// SYSTEM_OVERRIDE //'}
          </div>

          {/* MAC TRAFFIC LIGHTS (Acting as Switchers) */}
          {terminalStyle === 'MAC' && (
             <div className={`${styles.trafficContainer}`}>
                <div onClick={() => changeStyle('MAC')} className={`${styles.trafficCommon} bg-red-500 hover:bg-red-600 border-red-600`} title="Mac Style"></div>
                <div onClick={() => changeStyle('WIN98')} className={`${styles.trafficCommon} bg-yellow-500 hover:bg-yellow-600 border-yellow-600`} title="Win98 Style"></div>
                <div onClick={() => changeStyle('CYBER')} className={`${styles.trafficCommon} bg-green-500 hover:bg-green-600 border-green-600`} title="Cyberpunk Style"></div>
             </div>
          )}

          {/* WIN98 BUTTONS (Acting as Switchers) */}
          {terminalStyle === 'WIN98' && (
              <div className={`${styles.trafficContainer}`}>
                <button onClick={() => changeStyle('MAC')} className={`${styles.trafficCommon}`} title="Mac Style">_</button>
                <button onClick={() => changeStyle('WIN98')} className={`${styles.trafficCommon}`} title="Win98 Style">□</button>
                <button onClick={() => changeStyle('CYBER')} className={`${styles.trafficCommon} bg-red-700 text-white hover:bg-red-600`} title="Cyberpunk Style">X</button>
              </div>
          )}

          {/* CYBER BUTTONS */}
          {terminalStyle === 'CYBER' && (
              <div className={`${styles.trafficContainer}`}>
                 <button onClick={() => changeStyle('MAC')} className="text-[10px] font-bold px-1 border bg-black/50 hover:bg-white/10 transition-colors border-current opacity-60 hover:opacity-100" title="Mac Style">SYS.M</button>
                 <button onClick={() => changeStyle('WIN98')} className="text-[10px] font-bold px-1 border bg-black/50 hover:bg-white/10 transition-colors border-current opacity-60 hover:opacity-100" title="Win98 Style">SYS.W</button>
                 <button onClick={() => changeStyle('CYBER')} className="text-[10px] font-bold px-1 border bg-black/50 hover:bg-white/10 transition-colors border-current opacity-60 hover:opacity-100" title="Cyberpunk Style">SYS.C</button>
              </div>
          )}
        </div>
        
        {/* Terminal Content Area */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative flex flex-col ${styles.content}`}>
          
          {/* Integrated Controls (Language / Theme) */}
          <div className="absolute top-3 right-4 z-30 flex gap-2">
            <button 
              onClick={toggleLang}
              className={`text-[10px] font-bold px-2 py-1 rounded border transition-all font-[VT323]
                ${terminalStyle === 'CYBER' 
                    ? (theme === 'dark' ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20' : 'border-violet-500/50 text-violet-600 hover:bg-violet-500/20')
                    : (theme === 'dark' ? 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white bg-black/50' : 'border-gray-400 text-gray-500 hover:border-gray-600 hover:text-black bg-white/50')
                }
                ${terminalStyle === 'WIN98' ? 'bg-[#c0c0c0] text-black border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black' : ''}
                `}
            >
              {lang === 'en' ? 'EN' : '中文'}
            </button>
            <button 
              onClick={toggleTheme}
              className={`text-[10px] font-bold px-2 py-1 rounded border transition-all font-[VT323]
                ${terminalStyle === 'CYBER' 
                    ? (theme === 'dark' ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20' : 'border-violet-500/50 text-violet-600 hover:bg-violet-500/20')
                    : (theme === 'dark' ? 'border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-400 bg-black/50' : 'border-gray-400 text-gray-500 hover:border-gray-600 hover:text-black bg-white/50')
                }
                ${terminalStyle === 'WIN98' ? 'bg-[#c0c0c0] text-black border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black' : ''}
              `}
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          </div>

          <Terminal theme={theme} lang={lang} terminalStyle={terminalStyle} onStyleChange={changeStyle} />
        </div>

        {/* Status Bar */}
        <div className={`px-4 py-1 border-t text-[10px] flex justify-between font-[VT323] transition-colors z-10
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 text-gray-500' 
            : 'bg-gray-100 border-gray-300 text-gray-500'}
          ${terminalStyle === 'WIN98' ? '!bg-[#c0c0c0] !border-t-white !text-black !border-none shadow-[inset_0_1px_0_white]' : ''}
          ${terminalStyle === 'CYBER' ? (theme === 'dark' ? '!bg-cyan-950/30 !border-cyan-500/20 !text-cyan-500/70' : '!bg-violet-100/50 !border-violet-500/20 !text-violet-600/70') : ''}
          `}>
          <span>{lang === 'zh' ? 'LATEX 引擎: 就绪' : 'LATEX ENGINE: READY'}</span>
          <span>UTF-8 | {theme.toUpperCase()} | {terminalStyle}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
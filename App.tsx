
import React, { useState } from 'react';
import Terminal from './components/Terminal';
import { Theme, Language } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('en');

  // Toggle Handlers
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  return (
    <div className={`w-full min-h-screen flex flex-col xl:flex-row items-center justify-center p-4 py-8 gap-8 font-mono transition-colors duration-500 
      ${theme === 'dark' 
        ? 'bg-neutral-900 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]' 
        : 'bg-gray-100 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:20px_20px]'
      }`}>
      
      {/* Scanlines Effect (Only in Dark Mode) */}
      {theme === 'dark' && <div className="scanlines fixed inset-0 pointer-events-none z-0"></div>}

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
            <div>➜ {lang === 'zh' ? '输入 "-hn" 查看符号' : 'Type "-hn" for symbols'}</div>
            <div>➜ {lang === 'zh' ? 'Shift+Enter 换行' : 'Shift+Enter for newline'}</div>
         </div>

         {/* GitHub Link */}
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

      {/* RIGHT SIDE: Mac Window Terminal Container */}
      <div className={`w-full max-w-6xl h-[80vh] md:h-[90vh] backdrop-blur-md border rounded-xl shadow-2xl flex flex-col overflow-hidden relative z-20 transition-colors duration-500
        ${theme === 'dark' 
          ? 'bg-gray-900/90 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-gray-300 shadow-[0_0_50px_rgba(0,0,0,0.1)]'
        }`}>
        
        {/* Title Bar with Integrated Controls */}
        <div className={`px-4 py-3 flex items-center justify-center border-b sticky top-0 z-30 select-none transition-colors relative
          ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/80 border-gray-300'}`}>
          
          {/* Traffic Lights */}
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-inner"></div>
          </div>

          {/* Window Title */}
          <div className={`text-center text-sm font-bold tracking-wide font-[VT323] uppercase transition-colors hidden sm:block
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            user@macbook-pro: ~/latex-editor
          </div>

          {/* Integrated Controls (Right Side) */}
          <div className="absolute right-4 flex gap-3 items-center">
            <button 
              onClick={toggleLang}
              className={`text-xs font-bold px-2 py-1 rounded border transition-colors font-[VT323]
                ${theme === 'dark' 
                  ? 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white bg-gray-800' 
                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-black bg-white'}`}
            >
              {lang === 'en' ? 'EN' : '中文'}
            </button>
            <button 
              onClick={toggleTheme}
              className={`text-xs font-bold px-2 py-1 rounded border transition-colors font-[VT323]
                ${theme === 'dark' 
                  ? 'border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-400 bg-gray-800' 
                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-black bg-white'}`}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>

        {/* Terminal Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
          <Terminal theme={theme} lang={lang} />
        </div>

        {/* Status Bar */}
        <div className={`px-4 py-1 border-t text-[10px] flex justify-between font-[VT323] transition-colors
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 text-gray-500' 
            : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
          <span>{lang === 'zh' ? 'LATEX 引擎: 就绪' : 'LATEX ENGINE: READY'}</span>
          <span>UTF-8 | {theme.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default App;

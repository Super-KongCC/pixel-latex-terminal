
import React, { useEffect, useRef, useState } from 'react';
import * as katexLib from 'katex';
import { OutputType, TerminalLine, Theme, Language, TerminalStyle } from '../types';
import { toPng, toBlob } from 'html-to-image';
import { UI_TEXT } from '../constants';

const katex = (katexLib as any).default || katexLib;

interface RenderedItemProps {
  line: TerminalLine;
  theme: Theme;
  lang: Language;
  fontSize: number;
  terminalStyle?: TerminalStyle;
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

const RenderedItem: React.FC<RenderedItemProps> = ({ line, theme, lang, fontSize, terminalStyle = 'MAC' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [actionStatus, setActionStatus] = useState<'idle' | 'copied' | 'saved'>('idle');
  
  // Handle auto-download or copy if flags are set
  useEffect(() => {
      if (line.flags?.download) {
         setTimeout(() => handleDownload(), 500);
      }
      if (line.flags?.copy) {
         setTimeout(() => handleCopy(), 500);
      }
  }, [line.flags]);

  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
        // Wait a bit to ensure rendering is complete/fonts loaded
        // Determine background color based on style for the image
        let bgHex = theme === 'dark' ? '#000000' : '#ffffff';
        if (terminalStyle === 'WIN98' && theme === 'dark') bgHex = '#0000AA';
        if (terminalStyle === 'CYBER' && theme === 'dark') bgHex = '#050510';

        const dataUrl = await toPng(containerRef.current, { 
            cacheBust: true, 
            backgroundColor: bgHex,
            style: { margin: '0', boxSizing: 'border-box' }, // Reset style override, rely on element padding
            pixelRatio: 4 // Increased to 4 for high resolution
        });
        const link = document.createElement('a');
        link.download = `latex-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        
        setActionStatus('saved');
        setTimeout(() => setActionStatus('idle'), 2000);
    } catch (err) {
        console.error("Download failed", err);
    }
  };

  const handleCopy = async () => {
     if (!containerRef.current) return;
     try {
         let bgHex = theme === 'dark' ? '#000000' : '#ffffff';
         if (terminalStyle === 'WIN98' && theme === 'dark') bgHex = '#0000AA';
         if (terminalStyle === 'CYBER' && theme === 'dark') bgHex = '#050510';

         const blob = await toBlob(containerRef.current, { 
             cacheBust: true, 
             backgroundColor: bgHex,
             style: { margin: '0', boxSizing: 'border-box' },
             pixelRatio: 4 // Increased to 4 for high resolution
         });
         if (blob) {
             await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
             console.log('Copied to clipboard');
             setActionStatus('copied');
             setTimeout(() => setActionStatus('idle'), 2000);
         }
     } catch (err) {
         console.error("Copy failed", err);
     }
  };

  const fontClass = getFontSizeClass(fontSize);

  // Dynamic Text Colors based on Style
  const getTextColor = () => {
      if (terminalStyle === 'WIN98' && theme === 'dark') return 'text-white font-bold drop-shadow-sm'; // BSOD Style
      if (terminalStyle === 'CYBER') return theme === 'dark' ? 'text-cyan-50 drop-shadow-[0_0_2px_rgba(6,182,212,0.8)]' : 'text-violet-900';
      return theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  };

  const getSubTextColor = () => {
      if (terminalStyle === 'WIN98' && theme === 'dark') return 'text-gray-300';
      if (terminalStyle === 'CYBER') return theme === 'dark' ? 'text-cyan-700' : 'text-violet-400';
      return theme === 'dark' ? 'text-gray-600' : 'text-gray-400';
  };
  
  const getCommandColor = () => {
      if (terminalStyle === 'WIN98' && theme === 'dark') return 'text-white';
      if (terminalStyle === 'CYBER') return theme === 'dark' ? 'text-pink-500' : 'text-pink-600';
      return theme === 'dark' ? 'text-green-600' : 'text-green-600';
  };

  const renderContent = () => {
      switch (line.type) {
          case OutputType.LATEX:
              try {
                  // Detect display mode
                  const html = katex.renderToString(line.content, {
                      throwOnError: false,
                      displayMode: true,
                      globalGroup: true
                  });
                  return (
                      <div className="w-full overflow-x-auto">
                          <div 
                            ref={containerRef} 
                            className={`inline-block min-w-full px-4 py-4 ${getTextColor()}`}
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                      </div>
                  );
              } catch (e) {
                  return <div className="text-red-500 font-mono">Invalid LaTeX</div>;
              }
              
          case OutputType.TEXT:
               return (
                 <div className={`whitespace-pre-wrap break-words leading-relaxed font-mono ${getTextColor()} ${fontClass}`}>
                    {line.content || <span className="opacity-30 italic">&lt;empty&gt;</span>}
                 </div>
               );

          case OutputType.ERROR:
              return (
                  <div className={`text-red-500 whitespace-pre-wrap font-mono font-bold ${fontClass}`}>
                      {line.content}
                  </div>
              );
              
          case OutputType.HELP:
              return (
                  <div className={`whitespace-pre-wrap font-mono text-sm opacity-90 leading-tight p-3 border-l-4 my-2
                    ${theme === 'dark' ? 'border-green-600 bg-green-900/10 text-green-400' : 'border-green-600 bg-green-50 text-green-800'}
                    ${terminalStyle === 'WIN98' && theme === 'dark' ? '!bg-white/10 !text-white !border-white' : ''}
                    ${terminalStyle === 'CYBER' ? (theme === 'dark' ? '!border-pink-500 !bg-pink-900/10 !text-pink-300' : '!border-violet-500 !bg-violet-100 !text-violet-800') : ''}
                    `}>
                      {line.content}
                  </div>
              );

          case OutputType.GAME:
              return (
                  <div className={`whitespace-pre-wrap border-2 p-4 my-2 rounded relative overflow-hidden font-mono
                    ${theme === 'dark' ? 'border-amber-600 bg-amber-900/10 text-amber-400' : 'border-amber-500 bg-amber-50 text-amber-800'}
                    ${terminalStyle === 'WIN98' && theme === 'dark' ? '!border-white !bg-white/10 !text-yellow-300' : ''}
                    ${terminalStyle === 'CYBER' ? (theme === 'dark' ? '!border-yellow-500 !bg-yellow-900/10 !text-yellow-400' : '!border-orange-500 !bg-orange-50 !text-orange-800') : ''}
                    `}>
                      <div className="absolute top-2 right-2 opacity-50 text-2xl animate-bounce">
                         👨‍🏫
                      </div>
                      <div className={`font-bold mb-2 border-b border-current pb-1 inline-block ${fontClass}`}>PROFESSOR SCOTT:</div>
                      <div className={`mt-1 ${fontClass} leading-relaxed`}>{line.content}</div>
                  </div>
              );

          default:
              return <div>{line.content}</div>;
      }
  };

  const timeString = new Date(line.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
      <div 
        className="group w-full mb-4 relative animate-in fade-in duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
          {/* Meta Header */}
          {line.command && (
              <div className={`flex items-center gap-2 text-xs mb-1 font-mono select-none ${getSubTextColor()}`}>
                  <span className={`font-bold ${getCommandColor()}`}>➜</span>
                  <span className="opacity-70">{line.command}</span>
                  <span className="ml-auto opacity-50">[{timeString}]</span>
              </div>
          )}
          
          {/* Content */}
          <div className="relative pl-4 border-l border-transparent hover:border-gray-500 transition-colors">
              {renderContent()}
              
              {/* Action Buttons */}
              {(line.type === OutputType.LATEX) && (
                  <div className={`absolute right-0 -top-8 sm:top-0 flex flex-col items-end gap-1 transition-all duration-300 z-10
                    ${isHovered || actionStatus !== 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                      
                      <div className="flex gap-2">
                        {/* COPY BUTTON */}
                        <button 
                            onClick={handleCopy}
                            disabled={actionStatus !== 'idle'}
                            className={`
                                group/btn
                                relative overflow-hidden
                                px-2 py-1.5 text-xs font-bold border rounded flex items-center gap-1 shadow-lg backdrop-blur-md
                                transition-all duration-300 ease-out
                                hover:scale-105 active:scale-90
                                ${actionStatus === 'copied'
                                    ? 'bg-green-500 border-green-400 text-black scale-105 shadow-green-500/50'
                                    : theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-green-500 hover:text-white'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-green-500 hover:text-black'
                                }
                            `}
                            title={UI_TEXT[lang].copy}
                        >
                            {/* Animated Check Icon */}
                            {actionStatus === 'copied' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-in zoom-in duration-200">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 group-hover/btn:opacity-100">
                                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                            <span>{actionStatus === 'copied' ? (lang === 'zh' ? '成功' : 'OK') : 'COPY'}</span>
                        </button>

                        {/* DOWNLOAD BUTTON */}
                        <button 
                            onClick={handleDownload}
                            disabled={actionStatus !== 'idle'}
                            className={`
                                group/btn
                                relative overflow-hidden
                                px-2 py-1.5 text-xs font-bold border rounded flex items-center gap-1 shadow-lg backdrop-blur-md
                                transition-all duration-300 ease-out
                                hover:scale-105 active:scale-90
                                ${actionStatus === 'saved'
                                    ? 'bg-green-500 border-green-400 text-black scale-105 shadow-green-500/50'
                                    : theme === 'dark'
                                        ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-green-500 hover:text-white'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-green-500 hover:text-black'
                                }
                            `}
                            title={UI_TEXT[lang].download}
                        >
                            {actionStatus === 'saved' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-in zoom-in duration-200">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 group-hover/btn:opacity-100">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                            <span>{actionStatus === 'saved' ? (lang === 'zh' ? '成功' : 'OK') : 'SAVE'}</span>
                        </button>
                      </div>
                      
                      {/* Text Feedback (Below buttons) */}
                      <div className={`text-[10px] font-mono px-1 py-0.5 transition-all duration-300
                             ${actionStatus !== 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                             ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}
                             ${terminalStyle === 'WIN98' && theme === 'dark' ? '!text-white' : ''}
                             `}>
                             {actionStatus === 'copied' 
                                ? (lang === 'zh' ? '图片已复制到剪贴板' : 'Image copied to clipboard') 
                                : (actionStatus === 'saved' ? (lang === 'zh' ? '图片已保存' : 'Image downloaded') : '')}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};

export default RenderedItem;

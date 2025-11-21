
import React, { useEffect, useRef, useState } from 'react';
import * as katexLib from 'katex';
import { OutputType, TerminalLine, Theme, Language } from '../types';
import { toPng, toBlob } from 'html-to-image';
import { UI_TEXT } from '../constants';

const katex = (katexLib as any).default || katexLib;

interface RenderedItemProps {
  line: TerminalLine;
  theme: Theme;
  lang: Language;
}

const RenderedItem: React.FC<RenderedItemProps> = ({ line, theme, lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const t = UI_TEXT[lang];

  // Function to handle automatic actions
  const performExport = async (action: 'download' | 'copy', manual: boolean = false) => {
    if (!contentRef.current) return;
    
    const element = contentRef.current;
    setStatus('idle');

    // Theme-based colors for export
    const isDark = theme === 'dark';
    const exportBg = isDark ? '#000000' : '#ffffff';
    const exportColor = isDark ? 'white' : 'black';

    try {
      const options = {
         backgroundColor: exportBg, 
         pixelRatio: 2, 
         style: { 
             color: exportColor,
             // Ensure we capture the full width of the rendered formula
             width: element.scrollWidth ? `${element.scrollWidth}px` : 'auto', 
             height: element.offsetHeight ? `${element.offsetHeight}px` : 'auto',
         }, 
         skipAutoScale: true, 
         cacheBust: true, 
      };

      if (action === 'download') {
        const dataUrl = await toPng(element, options);
        const link = document.createElement('a');
        link.download = `latex-pixel-${line.id.slice(0, 6)}.png`;
        link.href = dataUrl;
        link.click();
        if (manual) {
            setStatus('success');
            setStatusMsg(lang === 'zh' ? '已下载!' : 'Downloaded!');
            setTimeout(() => setStatus('idle'), 2000);
        }
      } else if (action === 'copy') {
         const blob = await toBlob(element, options);
         if (blob) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                setStatus('success');
                setStatusMsg(lang === 'zh' ? '已复制!' : 'Copied!');
                setTimeout(() => setStatus('idle'), 2000);
            } catch (clipboardError) {
                if (manual) {
                    console.error("Clipboard write failed", clipboardError);
                    setStatus('error');
                    setStatusMsg('Access Denied');
                }
            }
         }
      }
    } catch (err) {
      console.error("Export failed", err);
      setStatus('error');
      setStatusMsg('Export Failed');
    }
  };

  useEffect(() => {
    if (line.type === OutputType.LATEX && containerRef.current) {
      try {
        if (!katex || typeof katex.renderToString !== 'function') {
            throw new Error("Latex Rendering Library not loaded.");
        }

        const html = katex.renderToString(line.content, {
          throwOnError: true, 
          displayMode: true,
          output: 'html',
          strict: false,
          trust: true
        });
        
        containerRef.current.innerHTML = html;

        if (line.flags?.download) {
            setTimeout(() => performExport('download', false), 500);
        }
        if (line.flags?.copy) {
            setTimeout(() => performExport('copy', false), 500);
        }

      } catch (e: any) {
        console.error("Latex Render Error:", e);
        const errorMsg = e.message || "Unknown Render Error";
        containerRef.current.innerHTML = `
          <div class="inline-block text-left p-2 bg-red-900/20 border border-red-500/50 rounded">
             <div class="text-red-400 font-bold text-xs mb-1">RENDER ERROR</div>
             <div class="text-red-300 font-mono text-sm whitespace-pre-wrap break-all max-w-lg">${errorMsg}</div>
          </div>
        `;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.content, line.type]); // Re-run if content changes


  if (line.type === OutputType.TEXT || line.type === OutputType.ERROR || line.type === OutputType.HELP) {
    const textColor = line.type === OutputType.ERROR 
        ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') 
        : (theme === 'dark' ? 'text-green-400' : 'text-green-700');

    return (
      <div className={`mb-2 whitespace-pre-wrap font-mono break-words max-w-full ${textColor}`}>
        {line.content}
      </div>
    );
  }

  if (line.type === OutputType.GAME) {
    return (
      <div className={`mb-4 p-4 border-l-4 rounded font-mono whitespace-pre-wrap break-words max-w-full leading-relaxed
        ${theme === 'dark' 
           ? 'bg-yellow-900/10 border-yellow-500 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
           : 'bg-yellow-50 border-yellow-600 text-yellow-900 shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-2 font-bold opacity-90 text-sm uppercase tracking-wider border-b pb-1 border-yellow-500/30">
           <span className="text-xl">🎓</span> PROF. SCOTT
        </div>
        <div>{line.content}</div>
      </div>
    );
  }

  return (
    <div className="mb-6 group relative">
      <div className={`flex justify-between items-end mb-1 pr-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
          <div className="text-xs font-mono select-none">
            {`> ${line.command || 'Generated Output'}`}
          </div>
          {status !== 'idle' && (
              <div className={`text-[10px] font-bold font-mono animate-pulse ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  [{statusMsg}]
              </div>
          )}
      </div>
      
      {/* FIXED: Changed to w-full and removed inline-block/nowrap to prevent tag overlap */}
      <div 
        ref={contentRef}
        className={`w-full block p-6 border rounded overflow-x-auto custom-scrollbar
           ${theme === 'dark' 
             ? 'border-gray-800 bg-gray-950 text-white/90' 
             : 'border-gray-300 bg-white text-black'}`}
      >
        {/* Wrapper div for katex injection. Removed whitespace-nowrap */}
        <div ref={containerRef} className="text-xl md:text-2xl antialiased selection:bg-green-500/30" />
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button 
           onClick={() => performExport('copy', true)}
           className={`text-xs px-2 py-1 rounded font-mono border transition-colors
             ${theme === 'dark' 
               ? 'bg-gray-800 text-green-500 hover:bg-green-900 border-green-900' 
               : 'bg-gray-100 text-green-700 hover:bg-green-200 border-green-200'}`}
         >
            [{t.copy}]
         </button>
         <button 
           onClick={() => performExport('download', true)}
           className={`text-xs px-2 py-1 rounded font-mono border transition-colors
             ${theme === 'dark' 
               ? 'bg-gray-800 text-blue-400 hover:bg-blue-900 border-blue-900' 
               : 'bg-gray-100 text-blue-700 hover:bg-blue-200 border-blue-200'}`}
         >
            [{t.download}]
         </button>
      </div>
    </div>
  );
};

export default RenderedItem;

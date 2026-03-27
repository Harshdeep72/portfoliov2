import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const COMMANDS = [
  { text: 'connect --github harshdeep72', link: 'https://github.com/harshdeep72', res: 'Establishing secure link to github.com/harshdeep72...' },
  { text: 'connect --linkedin harshdeep00', link: 'https://linkedin.com/in/harshdeep00', res: 'Handshake successful with linkedin.com/in/harshdeep00' },
  { text: 'send --email contact@harshdeep.com', link: 'mailto:contact@harshdeep.com', res: 'Opening default mail client...' }
];

export default function ContactSection() {
  const [displayedSequence, setDisplayedSequence] = useState<number>(0);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<{type: 'cmd'|'out', text: string}[]>([]);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Boot sequence
  useEffect(() => {
    if (isInView && displayedSequence < COMMANDS.length) {
      const timer = setTimeout(() => {
        setDisplayedSequence(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [displayedSequence, isInView]);

  // Auto-scroll WITHIN the terminal div only — not page-level
  useEffect(() => {
    if (!terminalBodyRef.current) return;
    terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
  }, [history, displayedSequence]);

  const handleCommandClick = (cmd: typeof COMMANDS[0], e: React.MouseEvent) => {
    e.preventDefault();
    setHistory(prev => [...prev, { type: 'cmd', text: cmd.text }, { type: 'out', text: cmd.res }]);
    setTimeout(() => {
      window.open(cmd.link, cmd.link.startsWith('mailto') ? '_self' : '_blank');
    }, 800);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    let output = `bash: ${inputVal.split(' ')[0]}: command not found`;
    const val = inputVal.toLowerCase().trim();
    
    if (val === 'help') output = 'Available commands: connect [target], send [target], clear, whoami, sudo, resume';
    else if (val === 'whoami') output = 'guest_user';
    else if (val === 'pirate') output = '🏴‍☠️  "freedom over system" — D. Monkey';
    else if (val.startsWith('sudo')) output = 'harshdeep is not in the sudoers file. This incident will be reported.';
    else if (val === 'resume' || val === 'open --resume') {
      output = '> Opening interactive system profile... [loaded]';
      setTimeout(() => window.dispatchEvent(new CustomEvent('open-resume')), 400);
    }
    else if (val === 'exit') {
      output = '> Session terminated.';
      setTimeout(() => window.dispatchEvent(new CustomEvent('close-resume')), 300);
    }
    else if (val === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    setHistory(prev => [...prev, { type: 'cmd', text: inputVal }, { type: 'out', text: output }]);
    setInputVal('');
  };

  return (
    <section ref={sectionRef} className="w-full max-w-4xl mx-auto py-32 px-6 relative z-10 flex flex-col items-center perspective-[1000px]">
      <motion.div 
        initial={{ opacity: 0, rotateX: 20, y: 50 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="w-full glass-panel rounded-sm border border-neon-primary/30 shadow-[0_0_50px_rgba(0,255,136,0.15)] overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="bg-[#020202] border-b border-white/10 px-4 py-3 flex items-center justify-between cursor-default">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
          </div>
          <span className="text-xs font-orbitron text-neutral-500 uppercase tracking-widest text-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
            TERMINAL_ACCESS
          </span>
        </div>
        
        {/* Terminal Body */}
        <div
          ref={terminalBodyRef}
          className="p-6 md:p-8 h-[400px] overflow-y-auto font-mono text-sm md:text-base flex flex-col gap-4 bg-[#0a0a0a] text-neutral-300"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Boot Sequence display */}
          <div className="flex flex-col gap-4">
            <div className="text-neon-secondary tracking-widest uppercase mb-4 opacity-70 border-b border-neon-secondary/20 pb-2 inline-block">INITIATING SECURE SHELL...</div>
            
            <AnimatePresence>
              {COMMANDS.slice(0, displayedSequence + 1).map((cmd, i) => {
                if (i > displayedSequence - 1 && i !== COMMANDS.length) return null;
                const isTyping = i === displayedSequence;
                const isCompleted = i < displayedSequence;

                return (
                  <motion.div key={`boot-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start gap-1">
                    {isCompleted && (
                      <a 
                        href={cmd.link}
                        onClick={(e) => handleCommandClick(cmd, e)}
                        className="text-neon-primary hover:text-white transition-colors duration-300 hover:text-glow-primary w-fit hover-trigger flex items-center gap-2 group"
                      >
                        <span className="text-neutral-500 select-none group-hover:text-neon-primary transition-colors">&gt; </span> 
                        {cmd.text}
                      </a>
                    )}
                    {isTyping && (
                      <div className="flex items-center text-neon-secondary">
                        <span className="text-neutral-500 mr-2 select-none">&gt;</span>
                        <span className="opacity-70">{cmd.text.substring(0, 15)}... </span>
                        <span className="w-2 h-5 bg-neon-secondary animate-pulse ml-2 inline-block box-glow-secondary mt-1"></span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Interactive History */}
          {history.map((record, i) => (
             <div key={`hist-${i}`} className={`flex items-start ${record.type ==='cmd' ? 'text-neon-primary mt-2' : 'text-neutral-400 mb-2 pl-4'}`}>
               {record.type === 'cmd' ? (
                 <><span className="text-neutral-500 mr-2 select-none opacity-50">&gt; </span> {record.text}</>
               ) : (
                 <span className="break-all">{record.text}</span>
               )}
             </div>
          ))}

          {/* Active Interactive Input */}
          {displayedSequence === COMMANDS.length && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center gap-2"
              onSubmit={handleInputSubmit}
            >
              <span className="font-bold text-neon-primary/70 select-none whitespace-nowrap">root@harshdeep:~#</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="bg-transparent border-none outline-none text-white font-mono flex-1 caret-neon-primary"
                autoComplete="off"
                spellCheck="false"
              />
            </motion.form>
          )}

        </div>
      </motion.div>
    </section>
  );
}

/**
 * SystemStatus — persistent identity marker + rotating micro-narrative system messages.
 * Zero continuous JS animations. Messages rotate with setInterval (very cheap).
 * Positioned fixed top-left so it persists across the full scroll journey.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_MESSAGES = [
  'session active',
  'monitoring traffic...',
  'packet flow stabilized',
  'anomaly detected',
  'channel encrypted',
  'no logs. no traces.',
  'system override active',
];

export default function SystemStatus() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Rotate messages every 5-9 seconds — feels occasional, not constant
    const rotate = () => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        setVisible(true);
      }, 400);
    };

    // First rotation after a random delay between 5–9s
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 5000 + Math.random() * 4000;
      timeout = setTimeout(() => {
        rotate();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-[300] flex flex-col gap-1 pointer-events-none select-none">
      {/* Identity mark — always visible */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-primary)] opacity-70" />
        <span className="font-orbitron text-[9px] tracking-[0.25em] uppercase text-neutral-500 font-bold">
          HARSHDEEP.exe // SYSTEM ACTIVE
        </span>
      </div>

      {/* Rotating micro-narrative */}
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[8px] tracking-widest uppercase pl-3.5"
            style={{ color: 'var(--neon-primary)', opacity: 0.45 }}
          >
            &gt; {STATUS_MESSAGES[msgIndex]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { damping: 28, stiffness: 180, mass: 0.6 });
  const trailY = useSpring(cursorY, { damping: 28, stiffness: 180, mass: 0.6 });

  const addRipple = useCallback((e: MouseEvent) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    // Auto-remove after animation completes
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 500);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive =
        t.tagName === 'A' || t.tagName === 'BUTTON' ||
        !!t.closest('a') || !!t.closest('button') ||
        t.classList.contains('hover-trigger');
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('click', addRipple, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('click', addRipple);
    };
  }, [addRipple, cursorX, cursorY]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Inner dot — follows cursor exactly */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full pointer-events-none hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          backgroundColor: 'var(--neon-primary)',
          scale: isHovered ? 0 : 1,
        }}
      />
      {/* Outer ring — springs behind */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] rounded-full pointer-events-none hidden md:block border"
        style={{
          x: trailX,
          y: trailY,
          width: isHovered ? 44 : 38,
          height: isHovered ? 44 : 38,
          marginLeft: isHovered ? -18 : -15,
          marginTop: isHovered ? -18 : -15,
          borderColor: isHovered ? 'var(--neon-secondary)' : 'rgba(0,255,136,0.4)',
          backgroundColor: isHovered ? 'rgba(122,0,255,0.08)' : 'transparent',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s, margin 0.2s',
        }}
      />

      {/* Click ripples — expanding circles on every click */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            className="fixed pointer-events-none hidden md:block rounded-full z-[9997]"
            style={{
              left: r.x - 20,
              top: r.y - 20,
              width: 40,
              height: 40,
              border: '1px solid rgba(0,255,136,0.55)',
            }}
            initial={{ scale: 0.2, opacity: 0.7 }}
            animate={{ scale: 2.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

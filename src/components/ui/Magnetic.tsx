import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function Magnetic({ children, strength = 40 }: { children: React.ReactElement, strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // V6 Cinematic Micro-physics standard
  const springConfig = { stiffness: 120, damping: 12, mass: 0.8 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Calculate distance from center to move element towards cursor
    x.set((clientX - centerX) * (strength / 100));
    y.set((clientY - centerY) * (strength / 100));
  };

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      style={{ x: smoothX, y: smoothY }}
      className="inline-flex relative z-50 hover-trigger"
    >
      {children}
    </motion.div>
  );
}

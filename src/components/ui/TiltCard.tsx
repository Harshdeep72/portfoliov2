import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Cinematic spec: max ±8° tilt, spring settles in ~0.25s
export default function TiltCard({
  children,
  className,
  depth = 8, // ← reduced from 20 to 8 per cinematic rules
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Snappier spring: faster settle, no bounce
  const springConfig = { stiffness: 200, damping: 28, mass: 0.6 };
  const rotateX = useSpring(y, springConfig);
  const rotateY = useSpring(x, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 768) return; // desktop only
    const rect = ref.current.getBoundingClientRect();
    const rX = ((e.clientY - rect.top) / rect.height - 0.5) * -depth;
    const rY = ((e.clientX - rect.left) / rect.width - 0.5) * depth;
    x.set(rY);
    y.set(rX);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

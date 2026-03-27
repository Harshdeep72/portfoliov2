import React from 'react';
import { motion } from 'framer-motion';

export default function AudioVisualizer({ isPlaying = true }: { isPlaying?: boolean }) {
  const bars = Array.from({ length: 16 });
  
  return (
    <div className="flex items-end gap-[3px] h-12 w-full justify-center">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-neon-primary box-glow-primary rounded-t-sm"
          animate={{ height: isPlaying ? ['20%', '100%', '40%', '80%', '10%'] : '10%' }}
          transition={{
            repeat: isPlaying ? Infinity : 0,
            duration: 0.5 + Math.random() * 0.5,
            ease: "easeInOut",
            delay: Math.random() * 0.5
          }}
          style={{ transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  );
}

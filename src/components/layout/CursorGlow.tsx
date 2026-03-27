/**
 * CursorGlow — soft radial spotlight that follows the cursor.
 * Pure CSS radial gradient, position updated via JS translate only.
 * Zero framer-motion, zero RAF loops — requestAnimationFrame with passive listener.
 * Low opacity (0.08) so it never dominates the layout. Desktop only.
 */
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return; // desktop only

    let frameId = 0;
    let tx = -200, ty = -200;

    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        tx = e.clientX;
        ty = e.clientY;
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${tx - 160}px, ${ty - 160}px)`;
        }
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[200] hidden md:block"
      style={{
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
        transform: 'translate(-200px, -200px)',
        willChange: 'transform',
      }}
    />
  );
}

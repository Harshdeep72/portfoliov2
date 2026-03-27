/**
 * CinematicPFP v2 — "The Main Character" living digital entity.
 *
 * DEPTH LAYER ARCHITECTURE (back → front):
 *   Layer 0: Ambient glow blob (moves at 0.3× mouse speed)
 *   Layer 1: Avatar SVG (moves at 1× mouse speed — the tilt)
 *   Layer 2: Overlay UI frame, stickers (moves at 0.6× mouse speed)
 *   Layer 3: Scan line (CSS animation, fires every 7s)
 *   Layer 4: Click burst: scale bounce + RGB split + glow ring
 *
 * All motion: transform + opacity only. will-change: transform.
 * Desktop-only for 3D/parallax; mobile gets idle float only.
 */
import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CinematicPFPProps {
  imageSrc?: string;
  /** When true, spikes the glow (driven by "Enter Experience" click) */
  glowSpiked?: boolean;
}

export default function CinematicPFP({ imageSrc, glowSpiked = false }: CinematicPFPProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [proximityGlow, setProximityGlow] = useState(0); // 0–1 cursor nearness

  // ── Parallax tilt basis (full speed = layer 1) ──
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Layer 0 — ambient glow: 30% speed, very soft spring
  const gX = useSpring(mx, { stiffness: 50, damping: 30 });
  const gY = useSpring(my, { stiffness: 50, damping: 30 });

  // Layer 1 — avatar tilt: 100% speed, fast spring (the main 3D feel)
  const rotX = useSpring(my, { stiffness: 200, damping: 30 });
  const rotY = useSpring(mx, { stiffness: 200, damping: 30 });

  // Layer 2 — overlay UI: 60% speed, medium spring
  const uiX = useSpring(mx, { stiffness: 90, damping: 28 });
  const uiY = useSpring(my, { stiffness: 90, damping: 28 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 768 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * 12);   // ±6° range
    my.set(-py * 12);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  // ── Periodic scan line: fires every 8–12s ──
  useEffect(() => {
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000; // 8–12s
      return setTimeout(() => {
        setScanning(true);
        setTimeout(() => setScanning(false), 1800);
      }, delay);
    };

    let t = schedule();
    const interval = setInterval(() => {
      clearTimeout(t);
      t = schedule();
    }, 13000);

    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  // ── Cursor proximity glow (desktop only) ──
  // Measures distance from cursor to PFP center; boosts glow when nearby.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current || window.innerWidth < 768) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const maxDist = 280;
      const nearness = Math.max(0, 1 - dist / maxDist);
      setProximityGlow(nearness);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Click burst ──
  const handleClick = () => {
    if (clicked) return;
    const flash = document.getElementById('screen-flash');
    if (flash) {
      flash.classList.remove('screen-flash');
      void flash.offsetWidth;
      flash.classList.add('screen-flash');
    }
    setClicked(true);
    setTimeout(() => setClicked(false), 700);
  };

  // Combined glow intensity: hover OR glowSpiked OR cursor proximity
  const glowActive = hovered || glowSpiked;
  // Glow opacity: base 0.45 + proximity boost up to 0.75, capped by hover/spike
  const glowOpacity = glowActive ? 0.9 : 0.35 + proximityGlow * 0.4;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      className="relative w-full flex items-center justify-center cursor-pointer hover-trigger"
      style={{ perspective: '900px' }}
    >
      {/* ── SPOTLIGHT: Static radial glow — PFP lit from behind ──────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 'min(500px, 130vw)',
          height: 'min(580px, 150vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,150,0.12) 0%, rgba(111,0,255,0.06) 40%, transparent 70%)',
          filter: 'blur(28px)',
          zIndex: -1,
        }}
      />

      {/* ── ENERGY RINGS — concentric, slow pulse, pure CSS ─────────── */}
      {[0, 3, 6].map((delay, i) => (
        <div key={i} className="energy-ring absolute pointer-events-none rounded-full"
          style={{
            width: `min(${420 + i * 70}px, ${110 + i * 18}vw)`,
            height: `min(${420 + i * 70}px, ${110 + i * 18}vw)`,
            border: `1px solid rgba(0,255,136,${0.18 - i * 0.04})`,
            animationDelay: `${delay}s`,
            zIndex: -1,
          }} />
      ))}

      {/* ── LAYER 0: Ambient glow blob — moves at 30% speed ─────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          x: gX,
          y: gY,
          width: 'min(420px, 110vw)',
          height: 'min(500px, 130vw)',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.13) 0%, rgba(111,0,255,0.08) 40%, transparent 70%)',
          filter: 'blur(20px)',
          willChange: 'transform',
        }}
        animate={{ opacity: glowOpacity }}
        transition={{ duration: glowActive ? 0.6 : 1.2 }}
      />

      {/* ── LAYER 1: Avatar tilt (full 3D speed) + idle float ────────── */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        // IDLE: float 4px, 5.5s, infinite
        animate={clicked
          ? { scale: [1, 0.96, 1.04, 1] }
          : { y: [0, -4, 0], scale: [1, 1.010, 1] }
        }
        transition={clicked
          ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
          : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative"
      >
        {/* Avatar frame + image */}
        <motion.div
          className="relative rounded-sm overflow-hidden pfp-hover-sweep"
          animate={{
            scale: hovered ? 1.03 : glowSpiked ? 1.04 : 1,
            borderColor: glowActive ? 'rgba(0,255,136,0.55)' : 'rgba(0,255,136,0.18)',
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 'min(390px, 85vw)',
            height: 'min(460px, 100vw)',
            border: '2px solid rgba(0,255,136,0.18)',
            boxShadow: glowActive
              ? '0 0 50px rgba(0,255,136,0.28), 0 0 100px rgba(111,0,255,0.18), inset 0 0 24px rgba(0,255,136,0.07)'
              : '0 0 20px rgba(0,255,136,0.10), inset 0 0 10px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.45s ease',
          }}
        >
          {imageSrc ? (
            <img src={imageSrc} alt="Harshdeep Singh" className="w-full h-full object-cover" draggable={false} />
          ) : (
            <CyberpunkAvatar />
          )}

          {/* Grain */}
          <div className="absolute inset-0 bg-noise opacity-[0.09] mix-blend-overlay pointer-events-none z-10" />
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines opacity-[0.18] pointer-events-none z-10" />

          {/* ── SCAN LINE — thin horizontal bar sweeps top→bottom ── */}
          {scanning && (
            <motion.div
              className="absolute left-0 right-0 z-30 pointer-events-none"
              style={{ height: 2, background: 'linear-gradient(to right, transparent, rgba(0,255,136,0.6), transparent)' }}
              initial={{ top: '-2%', opacity: 0 }}
              animate={{ top: '102%', opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 1.6, ease: 'linear', opacity: { times: [0, 0.05, 0.9, 1] } }}
            />
          )}

          {/* ── CLICK: RGB split flash overlay ── */}
          {clicked && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,60,0.12) 0%, rgba(0,255,136,0.12) 50%, rgba(111,0,255,0.12) 100%)',
                mixBlendMode: 'screen',
              }}
            />
          )}
        </motion.div>

        {/* ── CLICK BURST: expanding glow ring ── */}
        {clicked && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-sm"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.18, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ border: '2px solid var(--neon-primary)', boxShadow: '0 0 24px var(--neon-primary)' }}
          />
        )}
      </motion.div>

      {/* ── LAYER 2: Overlay UI — moves at 60% speed ─────────────────── */}
      <motion.div
        className="absolute pointer-events-none z-20"
        style={{
          x: uiX,
          y: uiY,
          width: 'min(390px, 85vw)',
          height: 'min(460px, 100vw)',
          willChange: 'transform',
        }}
      >
        {/* SYSTEM LEVEL ACCESS sticker */}
        <div className="absolute top-3 left-3">
          <div className="font-orbitron text-[7px] font-black uppercase tracking-[0.2em] text-black bg-[var(--neon-primary)] px-2 py-0.5">
            SYSTEM LEVEL ACCESS
          </div>
        </div>

        {/* Barcode top-right */}
        <div className="absolute top-3 right-3 opacity-60">
          <BarcodeSticker />
        </div>

        {/* Bottom album overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between rounded-b-sm"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}>
          <div>
            <div className="font-orbitron text-[8px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--neon-primary)' }}>HARSHDEEP.exe</div>
            <div className="font-orbitron text-[10px] text-white font-black tracking-[0.15em] uppercase">SYSTEM OVERRIDE</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[7px] text-neutral-500">v1.0</div>
            <div className="font-mono text-[7px]" style={{ color: 'var(--neon-accent)' }}>NO LOGS.</div>
            <div className="font-mono text-[7px]" style={{ color: 'var(--neon-accent)' }}>NO TRACES.</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── GENERATIVE SVG AVATAR ──────────────────────────────────────────────────
function CyberpunkAvatar() {
  return (
    <svg viewBox="0 0 340 400" width="340" height="400" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', background: '#070710' }}>
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#0a1a14" />
          <stop offset="100%" stopColor="#060610" />
        </radialGradient>
        <radialGradient id="faceLight" cx="42%" cy="33%" r="38%">
          <stop offset="0%" stopColor="rgba(0,255,136,0.22)" />
          <stop offset="65%" stopColor="rgba(0,20,10,0.04)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="purpleGlow" cx="72%" cy="68%" r="48%">
          <stop offset="0%" stopColor="rgba(111,0,255,0.14)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="1.5" /></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <clipPath id="clip"><rect width="340" height="400" /></clipPath>
      </defs>
      <g clipPath="url(#clip)">
        <rect width="340" height="400" fill="url(#bgGlow)" />
        <rect width="340" height="400" fill="url(#faceLight)" />
        <rect width="340" height="400" fill="url(#purpleGlow)" />

        {/* Perspective grid */}
        {[60,120,180,240,300].map(y => <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="rgba(0,255,136,0.025)" strokeWidth="1" />)}
        {[55,110,170,230,285].map(x => <line key={x} x1={x} y1="260" x2="170" y2="400" stroke="rgba(0,255,136,0.03)" strokeWidth="1" />)}

        {/* Body / hoodie */}
        <path d="M 45 400 L 28 282 Q 58 228 108 214 L 132 208 Q 142 188 170 184 Q 198 188 208 208 L 232 214 Q 282 228 312 282 L 295 400 Z" fill="#09090f" stroke="rgba(0,255,136,0.10)" strokeWidth="1" />
        <path d="M 98 400 L 88 302 Q 114 250 140 234 L 170 228 L 200 234 Q 226 250 252 302 L 242 400 Z" fill="#050508" />

        {/* Neck */}
        <ellipse cx="170" cy="204" rx="22" ry="17" fill="#181826" />

        {/* Head */}
        <ellipse cx="170" cy="146" rx="60" ry="70" fill="#18182a" />
        <ellipse cx="149" cy="143" rx="44" ry="56" fill="#1c1c30" opacity="0.9" />

        {/* Green neon light hit left side */}
        <path d="M 110 108 Q 128 88 155 96 Q 144 128 140 164 Q 130 180 116 170 Q 106 150 110 108 Z" fill="rgba(0,255,136,0.10)" filter="url(#soft)" />

        {/* Left eye — glowing teal iris */}
        <ellipse cx="150" cy="141" rx="11" ry="5.5" fill="#040408" />
        <ellipse cx="150" cy="141" rx="5.5" ry="5" fill="#0a0a1a" />
        <ellipse cx="150" cy="141" rx="3.2" ry="3.6" fill="#00ff88" opacity="0.92" />
        <ellipse cx="148.5" cy="140" rx="1.2" ry="1.2" fill="white" opacity="0.85" />

        {/* Right eye — shadow side */}
        <ellipse cx="190" cy="142" rx="10" ry="5" fill="#040408" />
        <ellipse cx="190" cy="142" rx="4.5" ry="4.5" fill="#0e0e1e" opacity="0.7" />
        <ellipse cx="190" cy="142" rx="2.2" ry="2.8" fill="#6f00ff" opacity="0.55" />

        {/* Brow ridges */}
        <path d="M 138 130 Q 148 126 163 130" stroke="rgba(0,255,136,0.28)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 180 131 Q 188 127 198 131" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 168 149 L 163 168 Q 166 172 170 170 Q 174 172 177 168 L 172 149 Z" fill="rgba(0,0,0,0.28)" />

        {/* Mouth — calm, focused */}
        <path d="M 156 180 Q 163 184 170 183 Q 177 184 184 180" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Hood/hair edge */}
        <path d="M 98 168 Q 94 153 98 123 Q 103 94 116 78 Q 136 58 170 56 Q 204 58 224 78 Q 237 94 242 123 Q 246 153 242 168" fill="none" stroke="rgba(0,255,136,0.07)" strokeWidth="2" />

        {/* Shoulder neon trims */}
        <path d="M 48 292 L 78 247 Q 100 224 140 214" stroke="rgba(0,255,136,0.18)" strokeWidth="1.5" fill="none" />
        <path d="M 292 292 L 262 247 Q 240 224 200 214" stroke="rgba(111,0,255,0.18)" strokeWidth="1.5" fill="none" />

        {/* Tech circuit details */}
        <g opacity="0.14" stroke="#00ff88" strokeWidth="0.8" fill="none">
          <rect x="76" y="302" width="13" height="8" rx="1" />
          <line x1="82" y1="310" x2="82" y2="318" />
          <line x1="76" y1="306" x2="68" y2="306" />
          <rect x="252" y="298" width="14" height="6" rx="1" />
          <line x1="259" y1="298" x2="259" y2="290" />
          <line x1="266" y1="301" x2="274" y2="301" />
        </g>

        {/* Bottom HUD bar */}
        <rect x="0" y="362" width="340" height="38" fill="rgba(0,0,0,0.68)" />
        <line x1="0" y1="362" x2="340" y2="362" stroke="rgba(0,255,136,0.28)" strokeWidth="1" />

        {/* Neon rim top of head */}
        <path d="M 118 93 Q 144 70 170 68 Q 196 70 222 93" stroke="rgba(0,255,136,0.35)" strokeWidth="2" fill="none" filter="url(#glow)" />

        {/* Purple shadow rim */}
        <path d="M 202 98 Q 228 130 230 166" stroke="rgba(111,0,255,0.38)" strokeWidth="2.5" fill="none" filter="url(#glow)" />
      </g>
    </svg>
  );
}

// ─── BARCODE STICKER ────────────────────────────────────────────────────────
function BarcodeSticker() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex gap-[1px]">
        {[3,1,4,2,3,1,2,4,1,3,2,1,3,4,2].map((w, i) => (
          <div key={i} style={{ width: w * 1.2, height: 16, background: 'rgba(0,255,136,0.65)' }} />
        ))}
      </div>
      <span className="font-mono text-[6px] tracking-widest" style={{ color: 'rgba(0,255,136,0.55)' }}>HS-2025-EXE</span>
    </div>
  );
}

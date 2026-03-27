import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Play, Disc3, FileText } from 'lucide-react';
import Magnetic from '../ui/Magnetic';
import CinematicPFP from '../ui/CinematicPFP';
import ResumeModal from '../ui/ResumeModal';
import InteractiveResume from '../ui/InteractiveResume';

// ── BURST HELPERS ──────────────────────────────────────────────────────────
function triggerScreenFlash() {
  const el = document.getElementById('screen-flash');
  if (!el) return;
  el.classList.remove('screen-flash');
  void el.offsetWidth;
  el.classList.add('screen-flash');
}

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Title glitch-on-entry state
  const [glitchTitle, setGlitchTitle] = useState('HARSHDEEP.exe');
  const [titleLocked, setTitleLocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // PFP glow spike — driven by "Enter Experience" click
  const [pfpGlowSpiked, setPfpGlowSpiked] = useState(false);

  // Hero activation zoom (signature moment)
  const [activationZoom, setActivationZoom] = useState(false);

  // Screen dim overlay (signature moment)
  const [dimActive, setDimActive] = useState(false);

  // Resume modals
  const [resumeOpen, setResumeOpen] = useState(false);
  const [interactiveOpen, setInteractiveOpen] = useState(false);

  // Hero entry zoom
  const [entryComplete, setEntryComplete] = useState(false);

  // Section-level camera drift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const camX = useSpring(mouseX, { stiffness: 30, damping: 30, mass: 0.5 });
  const camY = useSpring(mouseY, { stiffness: 30, damping: 30, mass: 0.5 });

  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ['start start', 'end start'] });
  const scrollY = useTransform(scrollYProgress, [0, 0.4], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // ── CINEMATIC ENTRY: Title RGB glitch then locks clean ──
  useEffect(() => {
    // Sequence: glitch 2-3 times (0-300ms), then snap to clean
    const glitches = [
      setTimeout(() => setGlitchTitle('H@RSHD33P.exe'), 80),
      setTimeout(() => setGlitchTitle('HARSHDEEP.exe'), 150),
      setTimeout(() => setGlitchTitle('H4RSH_EXE'), 200),
      setTimeout(() => setGlitchTitle('HARSHDEEP.exe'), 270),
      setTimeout(() => setTitleLocked(true), 300),
    ];
    // Entry zoom complete at 800ms
    setTimeout(() => setEntryComplete(true), 800);
    return () => glitches.forEach(clearTimeout);
  }, []);

  // ── Rare ambient glitch (avg ~1/40s — genuinely rare) ──
  useEffect(() => {
    if (!titleLocked) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.99) {
        setGlitchTitle('H@RSHD33P.exe');
        setTimeout(() => setGlitchTitle('HARSHDEEP.exe'), 80);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [titleLocked]);

  // ── Listen for terminal commands → open modals ──
  useEffect(() => {
    const openInteractive = () => setInteractiveOpen(true);
    const openPdf = () => setResumeOpen(true);
    window.addEventListener('open-resume', openInteractive);
    window.addEventListener('open-pdf-resume', openPdf);
    return () => {
      window.removeEventListener('open-resume', openInteractive);
      window.removeEventListener('open-pdf-resume', openPdf);
    };
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 8);
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 8);
  }, [mouseX, mouseY]);

  // ── SIGNATURE MOMENT: "Enter Experience" ─────────────────────────
  // Screen dims → PFP glow spikes → hero zoom 1→1.02→1 → scroll
  const handleEnterExperience = () => {
    // 1. Screen flash (green) + dim overlay simultaneously
    triggerScreenFlash();
    setDimActive(true);
    // 2. Spike PFP glow + hero zoom
    setPfpGlowSpiked(true);
    setActivationZoom(true);
    // 3. Decay dim + zoom after peak, then scroll
    setTimeout(() => {
      setDimActive(false);
      setActivationZoom(false);
    }, 280);
    setTimeout(() => {
      scrollToProjects();
      setTimeout(() => setPfpGlowSpiked(false), 400);
    }, 350);
  };

  return (
    <motion.section
      ref={sectionRef as React.RefObject<HTMLElement>}
      style={{ y: scrollY, opacity }}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[100svh] flex items-center px-6 md:px-14 py-20 overflow-hidden"
    >
      {/* ── DIM OVERLAY — signature moment screen dim ───────────────── */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-[8999]"
        animate={{ opacity: dimActive ? 0.35 : 0 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
      />

      {/* Entry zoom + activation zoom */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: activationZoom ? 1.02 : entryComplete ? 1 : 1.005 }}
        transition={activationZoom
          ? { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
          : { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
        }
        className="w-full"
      >
        {/* Camera drift wrapper */}
        <motion.div
          style={{ x: camX, y: camY }}
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-center gap-6 lg:gap-10"
        >
          {/* ── LEFT: Text column ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-xl relative"
          >
            {/* Purple ambient glow behind text block — depth without layout cost */}
            <div className="absolute -inset-8 pointer-events-none -z-10 hidden lg:block"
              style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(111,0,255,0.10) 0%, transparent 70%)' }} />
            {/* Parental Advisory */}
            <motion.div
              whileHover={{ scale: 1.06, rotateZ: -2 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="mb-7 border-2 border-white px-4 py-2 bg-black flex flex-col items-center hover-trigger w-fit"
              style={{ boxShadow: '4px 4px 0 var(--neon-primary)' }}
            >
              <span className="font-orbitron text-[10px] text-white font-bold uppercase tracking-widest">Parental</span>
              <span className="font-orbitron text-xs text-white font-black uppercase tracking-widest leading-none my-0.5">Advisory</span>
              <span className="font-orbitron text-[10px] text-white font-bold uppercase tracking-widest">Explicit Code</span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-orbitron tracking-[0.4em] text-xs md:text-sm uppercase mb-5 font-bold px-4 py-1.5 border w-fit"
              style={{ color: 'var(--neon-secondary)', borderColor: 'rgba(111,0,255,0.22)', background: 'rgba(0,0,0,0.5)' }}
            >
              System Override LP
            </motion.p>

            {/* ── MAIN TITLE — entry RGB glitch then locks ──
                During entry: glitchTitle changes rapidly (80-300ms)
                After lock: rare ambient glitch (~3% / 200ms)
                CSS rgb ghost layers add permanent depth.
            ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-7"
            >
              <h1
                className="text-5xl sm:text-7xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 tracking-tighter uppercase relative z-10 select-none leading-none transition-filter duration-300 group-hover:brightness-125"
                style={{ textShadow: '0 0 14px rgba(0,255,150,0.22), 0 0 40px rgba(0,255,150,0.08)' }}
              >
                {glitchTitle}
              </h1>
              {/* RGB ghost layers */}
              <h1 aria-hidden className="absolute inset-0 text-5xl sm:text-7xl font-black font-orbitron tracking-tighter uppercase select-none pointer-events-none opacity-40 mix-blend-screen leading-none"
                style={{ color: 'var(--neon-secondary)', left: '2px' }}>
                {glitchTitle}
              </h1>
              <h1 aria-hidden className="absolute inset-0 text-5xl sm:text-7xl font-black font-orbitron tracking-tighter uppercase select-none pointer-events-none opacity-40 mix-blend-screen leading-none"
                style={{ color: 'var(--neon-primary)', left: '-2px' }}>
                {glitchTitle}
              </h1>
            </motion.div>

            {/* Tagline + status line */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55 }}
              className="mb-10 bg-black/40 px-4 py-3 border-l-4 group cursor-default"
              style={{ borderColor: 'var(--neon-primary)' }}
            >
              <p className="text-sm md:text-base font-mono text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                &gt; Underground networks. Zero-day exploits. Building secure futures.
              </p>
              <p className="text-xs font-mono mt-1.5" style={{ color: 'var(--neon-primary)', opacity: 0.7 }}>
                &gt; status: <span className="opacity-100" style={{ color: 'var(--neon-primary)' }}>session active</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
            >
              {/* ENTER EXPERIENCE — Signature Moment button */}
              <Magnetic strength={26}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  onClick={handleEnterExperience}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="group relative flex items-center justify-center gap-3 font-orbitron font-black uppercase tracking-[0.2em] px-8 py-3.5 min-w-[220px] rounded-sm overflow-hidden cursor-pointer hover-trigger"
                  style={{ background: 'var(--neon-primary)', color: '#000', boxShadow: '0 0 24px rgba(0,255,136,0.42), 0 0 48px rgba(0,255,136,0.12)' }}
                >
                  {/* Inner glow sweep on hover */}
                  <motion.span
                    className="absolute inset-0 bg-white origin-bottom"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <Play className="w-4 h-4 relative z-10 mix-blend-difference text-white" fill="currentColor" />
                  <span className="relative z-10 mix-blend-difference text-white text-sm">Enter Experience</span>
                </motion.button>
              </Magnetic>

              <Magnetic strength={14}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEnterExperience}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="relative flex items-center justify-center gap-3 font-orbitron font-bold uppercase tracking-[0.2em] px-8 py-3.5 min-w-[220px] rounded-sm cursor-pointer bg-transparent hover-trigger text-sm overflow-hidden border border-[var(--neon-secondary)]"
                  style={{ color: 'var(--neon-secondary)' }}
                >
                  {/* Animated border shimmer */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(111,0,255,0.15) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <Disc3 className="w-4 h-4" />
                  <span>Browse Tracks</span>
                </motion.button>
              </Magnetic>

              {/* VIEW RESUME — tertiary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Magnetic strength={10}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setInteractiveOpen(true)}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm border hover-trigger cursor-pointer"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.3)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--neon-primary)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Resume
                  </motion.button>
                </Magnetic>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: CinematicPFP — the main character ──────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-full lg:w-auto"
            style={{ maxWidth: 420 }}
          >
            <CinematicPFP glowSpiked={pfpGlowSpiked} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── EASTER EGG: Straw hat silhouette ─────────────────────────── */}
      <motion.div
        className="absolute bottom-8 right-8 opacity-[0.07] hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20 group/pirate hidden md:block"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <svg width="58" height="58" viewBox="0 0 100 100" className="fill-current stroke-current" style={{ color: 'var(--neon-accent)' }}>
          <ellipse cx="50" cy="40" rx="35" ry="8" fill="transparent" strokeWidth="4" />
          <path d="M 30 40 Q 50 10 70 40 Z" fill="none" strokeWidth="4" />
          <path d="M 32 38 Q 50 45 68 38" fill="none" strokeWidth="3" stroke="#ef4444" />
          <path d="M 40 45 L 30 90 L 45 95 L 50 65 L 55 95 L 70 90 L 60 45 Z" fillOpacity="0.8" />
          <path d="M 35 50 Q 15 65 10 35" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 65 50 Q 85 65 90 35" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/pirate:opacity-100 transition-opacity duration-200 font-orbitron text-[8px] text-white tracking-[0.2em] uppercase whitespace-nowrap bg-black/90 px-2 py-1 border pointer-events-none"
          style={{ borderColor: 'var(--neon-accent)' }}>
          NO LOGS. NO TRACES.
        </div>
      </motion.div>

      {/* ── Resume Modals */}
      <InteractiveResume
        isOpen={interactiveOpen}
        onClose={() => setInteractiveOpen(false)}
        onSwitchToPdf={() => { setInteractiveOpen(false); setTimeout(() => setResumeOpen(true), 200); }}
      />
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </motion.section>
  );
}

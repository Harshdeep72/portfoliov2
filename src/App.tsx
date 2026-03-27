import { useEffect, useState, lazy, Suspense } from 'react';
import CustomCursor from './components/layout/CustomCursor';
import SoundToggle from './components/layout/SoundToggle';
import SystemStatus from './components/layout/SystemStatus';
import CursorGlow from './components/layout/CursorGlow';
import HeroSection from './components/sections/HeroSection';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection'));
const SkillsSection = lazy(() => import('./components/sections/SkillsSection'));
const ExperienceSection = lazy(() => import('./components/sections/ExperienceSection'));
const EducationSection = lazy(() => import('./components/sections/EducationSection'));
const AchievementsSection = lazy(() => import('./components/sections/AchievementsSection'));
const ContactSection = lazy(() => import('./components/sections/ContactSection'));
const AboutSection = lazy(() => import('./components/sections/AboutSection'));

// 70/30 calm/burst: Boot is fast and clean (< 1.5s)
function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0); // 0 = first line, 1 = second line, 2 = done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(onComplete, 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col justify-center px-8 md:px-24 font-mono"
    >
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 0 ? 1 : 0 }}
        className="text-[var(--neon-primary)] text-lg md:text-2xl mb-3 tracking-wide"
      >
        <span className="opacity-40 mr-3">&gt;</span>initializing...
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-[var(--neon-primary)] text-lg md:text-2xl tracking-wide"
      >
        <span className="opacity-40 mr-3">&gt;</span>access granted.
      </motion.p>
    </motion.div>
  );
}

function App() {
  const [isBooted, setIsBooted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
    // Ensure we're at top after transition
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  useEffect(() => {
    if (!isBooted) return;
    if (window.innerWidth < 768) return; // No Lenis on mobile
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    let rafId: number;
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [isBooted]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#eaeaea] selection:bg-[var(--neon-primary)] selection:text-black font-sans">
      <AnimatePresence mode="wait">
        {!isBooted && <BootScreen key="boot" onComplete={handleBootComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isBooted ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <CustomCursor />
        <CursorGlow />
        <SoundToggle />
        <SystemStatus />

        {/* ── BACKGROUND: Calm system waiting ─────────────────────── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Subtle static grid — very low opacity, no animation */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage: 'linear-gradient(var(--neon-primary) 1px, transparent 1px), linear-gradient(90deg, var(--neon-primary) 1px, transparent 1px)',
              backgroundSize: '52px 52px',
            }}
          />
          {/* Slow-drift ambient glow — 30s cycle, nearly invisible, pure CSS */}
          <div className="absolute top-[-15%] left-[-5%] w-[50vw] h-[50vw] rounded-full opacity-[0.07] bg-drift"
            style={{ background: 'radial-gradient(circle, var(--neon-secondary), transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full opacity-[0.05] bg-drift-reverse"
            style={{ background: 'radial-gradient(circle, var(--neon-accent), transparent 70%)' }} />
          {/* Grain + scanlines */}
          <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
          <div className="absolute inset-0 scanlines opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_60%,#050505_100%)]" />
        </div>

        {/* Screen flash overlay — triggered via CSS class by components */}
        <div id="screen-flash" className="fixed inset-0 bg-[var(--neon-primary)] z-[9000] pointer-events-none opacity-0" />

        {/* Vignette — dark edges draw eye to center, fixed, no interaction cost */}
        <div className="vignette fixed inset-0 z-[1] pointer-events-none" />

        {/* Scroll progress */}
        <motion.div
          className="fixed bottom-0 left-0 h-[2px] bg-[var(--neon-primary)] z-[500] origin-left"
          style={{ scaleX: scrollYProgress, right: 0 }}
        />

        <main className="relative z-10 w-full">
          <HeroSection />
          <Suspense fallback={null}>
            <AboutSection />
            <ProjectsSection />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <AchievementsSection />
            <ContactSection />
          </Suspense>
        </main>
      </motion.div>
    </div>
  );
}

export default App;

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Terminal, Lightbulb, Bug, List } from 'lucide-react';
import TiltCard from '../ui/TiltCard';

// ─── DATA ─────────────────────────────────────────────────────────────────
const TRACKS = [
  {
    id: '01',
    title: 'SYN Flood Attack Simulation',
    repo: 'https://github.com/Harshdeep72/SYN-Flood-Lab',
    duration: '04:15',
    tags: ['Python', 'Scapy', 'Wireshark', 'hping3', 'Metasploit', 'Networking'],
    caseStudy: {
      overview: 'Simulated a TCP SYN flood attack in a controlled Ubuntu VM sandbox to study real-world denial-of-service behavior and evaluate mitigation strategies.',
      problem: 'How does a server behave under volumetric TCP SYN flooding? What are the actual limits of a TCP backlog queue, and can SYN cookies fully eliminate the exploit vector?',
      execution: [
        'Set up isolated Ubuntu VM pair (attacker + target) with no external network access',
        'Wrote Python/Scapy script to generate thousands of spoofed SYN packets per second',
        'Monitored live traffic in Wireshark to capture half-open connection buildup',
        'Measured server response degradation at 500 / 1000 / 5000 pps thresholds',
        'Applied iptables SYN cookie mitigation and re-ran identical attack payloads',
        'Benchmarked legitimate connection success rate pre- and post-mitigation',
      ],
      tools: ['Python', 'Scapy', 'Wireshark', 'hping3', 'iptables', 'Ubuntu VM', 'TCPdump', 'Metasploit'],
      insight: 'SYN cookies fully eliminated the vulnerability with zero packet loss for legitimate traffic. Unmitigated: server backlog exhausted in <1s at 1000 pps.',
      hasSynViz: true,
    },
  },
  {
    id: '02',
    title: 'Contact Management System',
    repo: 'https://github.com/Harshdeep72/CMS',
    duration: '02:30',
    tags: ['C++', 'DSA', 'File Handling', 'CLI'],
    caseStudy: {
      overview: 'Terminal-based contact manager using a custom Binary Search Tree for O(log n) lookups with persistent file-based storage — no external database.',
      problem: 'Design a CLI contact manager with fast search, persistent storage, and minimal memory footprint without relying on any database engine or third-party library.',
      execution: [
        'Designed a custom BST data structure with insert, delete, and in-order traversal',
        'Implemented binary search for O(log n) contact lookup by name',
        'Built file I/O serialization layer for persistence across sessions',
        'Created a clean CLI menu with CRUD operations (Create, Read, Update, Delete)',
        'Stress-tested with 10,000 contact entries for memory and speed benchmarks',
      ],
      tools: ['C++17', 'GCC', 'Custom BST', 'File I/O', 'CLI', 'Valgrind'],
      insight: 'O(log n) average search vs O(n) naive linked-list. Memory footprint under 2MB for 10,000 contacts. Demonstrated DSA principles in a real-use application.',
      hasSynViz: false,
    },
  },
];

// ─── SYN BURST VISUALIZATION ─────────────────────────────────────────────
function SynBurstViz({ active }: { active: boolean }) {
  const [burst, setBurst] = useState(0);

  // Fires in bursts every 3.5s while active — not continuous
  useState(() => {
    if (!active) return;
    const t = setInterval(() => setBurst(b => b + 1), 3500);
    return () => clearInterval(t);
  });

  const packets = [
    { offset: 0 }, { offset: 0.1 }, { offset: 0.2 }
  ];

  return (
    <div className="mt-5 p-4 border rounded-sm relative overflow-hidden"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.5)', height: 110 }}>
      <p className="font-orbitron text-[8px] tracking-[0.3em] uppercase text-neutral-600 mb-2">
        TCP Handshake Exploitation — Live Burst
      </p>
      {/* Nodes */}
      {[{ label: 'ATTACKER', x: '5%', color: 'var(--neon-primary)' }, { label: 'SERVER', x: '88%', color: 'var(--neon-accent)' }].map(n => (
        <div key={n.label} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-1" style={{ left: n.x }}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: n.color, background: `${n.color}10` }}>
            <span className="font-orbitron text-[7px] font-bold" style={{ color: n.color }}>{n.label === 'SERVER' ? '⚠' : '◈'}</span>
          </div>
          <span className="font-mono text-[7px]" style={{ color: n.color }}>{n.label}</span>
        </div>
      ))}
      {/* Connection line */}
      <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '13%', width: '74%', height: 1, background: 'rgba(255,255,255,0.05)' }} />
      {/* Packets burst */}
      <AnimatePresence>
        {active && packets.map((pkt, i) => (
          <motion.div
            key={`${burst}-${i}`}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: '13%' }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: '74vw', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, delay: pkt.offset, ease: 'linear', opacity: { times: [0, 0.05, 0.85, 1] } }}
            exit={{}}
          >
            <div className="px-1.5 py-0.5 rounded-sm font-mono text-[8px] font-bold" style={{ background: 'var(--neon-primary)', color: '#000' }}>SYN</div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div key={burst} className="absolute bottom-2 right-3 font-mono text-[7px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.3 }}
        style={{ color: 'var(--neon-accent)' }}>
        no ACK · backlog slot consumed
      </motion.div>
    </div>
  );
}

// ─── BURST HELPERS ────────────────────────────────────────────────────────
function triggerScreenFlash() {
  const el = document.getElementById('screen-flash');
  if (!el) return;
  el.classList.remove('screen-flash'); void el.offsetWidth; el.classList.add('screen-flash');
}

// ─── CASE PANEL ──────────────────────────────────────────────────────────
function CasePanel({ icon: Icon, label, content, color, mono = false, children }: {
  icon: React.ElementType; label: string; content?: string; color: string; mono?: boolean; children?: React.ReactNode;
}) {
  return (
    <TiltCard depth={4} className="card-glow h-full">
      <div className="p-4 rounded-sm border h-full flex flex-col gap-2 transition-colors duration-200 relative z-10"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = color + '25')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}>
        <h5 className="flex items-center gap-1.5 font-orbitron text-[9px] uppercase font-bold tracking-widest flex-shrink-0" style={{ color }}>
          <Icon className="w-3 h-3 flex-shrink-0" />{label}
        </h5>
        {content && <p className={`text-neutral-400 text-xs leading-relaxed ${mono ? 'font-mono' : ''}`}>{content}</p>}
        {children}
      </div>
    </TiltCard>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const [activeId, setActiveId] = useState(TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const track = TRACKS.find(t => t.id === activeId)!;

  const handleTrackChange = (id: string) => {
    if (id === activeId) { setIsPlaying(p => !p); return; }
    triggerScreenFlash();
    setActiveId(id);
    setIsPlaying(true);
    if (titleRef.current) {
      titleRef.current.classList.add('rgb-split');
      setTimeout(() => titleRef.current?.classList.remove('rgb-split'), 280);
    }
  };

  return (
    <section id="projects" className="w-full max-w-6xl mx-auto py-24 px-6 relative z-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mb-14 border-l-4 pl-6" style={{ borderColor: 'var(--neon-primary)' }}>
        <p className="text-[10px] font-orbitron tracking-[0.4em] uppercase mb-2 font-bold" style={{ color: 'var(--neon-secondary)' }}>
          Discography / Case Studies
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter uppercase text-white">Project Album</h2>
        <p className="text-neutral-500 font-mono mt-2 text-xs">&gt; Select a track to review the full case study.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Tracklist ── */}
        <div className="w-full lg:w-[34%] flex flex-col gap-2">
          <div className="text-[9px] font-orbitron text-neutral-600 uppercase tracking-widest border-b pb-2 mb-2 flex justify-between px-1"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span>Track</span><span>Length</span>
          </div>
          {TRACKS.map((t, i) => {
            const isActive = activeId === t.id;
            return (
              <motion.button key={t.id} onClick={() => handleTrackChange(t.id)}
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.015, x: 5 }} whileTap={{ scale: 0.98 }}
                className="relative w-full text-left p-4 rounded-sm flex items-center justify-between group card-glow hover-trigger"
                style={{ border: isActive ? '1px solid rgba(0,255,136,0.22)' : '1px solid rgba(255,255,255,0.04)', background: isActive ? 'rgba(0,255,136,0.04)' : 'transparent', transition: 'border-color 0.2s, background 0.2s' }}>
                {isActive && <motion.div layoutId="track-bar" className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: 'var(--neon-primary)' }} />}
                <div className="flex items-center gap-3 pl-2 relative z-10">
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{ borderColor: isActive ? 'var(--neon-primary)' : 'rgba(255,255,255,0.08)', color: isActive ? 'var(--neon-primary)' : '#444' }}>
                    {isActive && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </div>
                  <div>
                    <span className="text-[9px] font-orbitron font-bold block mb-0.5" style={{ color: isActive ? 'var(--neon-primary)' : '#444' }}>{t.id}</span>
                    <span className={`font-semibold text-sm transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>{t.title}</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-neutral-600 relative z-10">{t.duration}</span>
              </motion.button>
            );
          })}
          <p className="font-mono text-[9px] text-neutral-700 mt-4 pt-4 border-t pl-1" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            &gt; {TRACKS.length} tracks · cybersecurity + systems
          </p>
        </div>

        {/* ── Case Study Panel ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:flex-1 rounded-sm overflow-hidden border" style={{ borderColor: 'rgba(111,0,255,0.18)', background: 'rgba(5,5,5,0.75)' }}>

          {/* Player header */}
          <div className="p-5 border-b flex items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.5)' }}>
            <button onClick={() => { setIsPlaying(p => !p); triggerScreenFlash(); }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover-trigger flex-shrink-0 transition-colors duration-200"
              style={{ borderColor: 'var(--neon-primary)', color: 'var(--neon-primary)' }}>
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="flex-1 flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-orbitron tracking-[0.3em] uppercase mb-0.5" style={{ color: 'var(--neon-secondary)' }}>Now Reviewing / Case Study</p>
                <AnimatePresence mode="wait">
                  <motion.h3 key={track.id} ref={titleRef}
                    initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -4, filter: 'blur(6px)' }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base md:text-lg font-black font-orbitron uppercase tracking-tighter text-white">{track.title}
                  </motion.h3>
                </AnimatePresence>
              </div>
              {track.repo && (
                <a href={track.repo} target="_blank" rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border rounded-sm hover-trigger flex-shrink-0"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.3)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--neon-primary)'); (e.currentTarget.style.color = 'var(--neon-primary)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'); (e.currentTarget.style.color = 'rgba(255,255,255,0.5)'); }}>
                  <Terminal className="w-3 h-3" /> View Source
                </a>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <motion.div key={track.id + String(isPlaying)} className="h-full" style={{ background: 'var(--neon-primary)' }}
              animate={{ width: isPlaying ? '100%' : '0%' }}
              transition={isPlaying ? { duration: 60, ease: 'linear' } : { duration: 0 }}
              initial={{ width: '0%' }} />
          </div>

          {/* Body — film cut transition */}
          <AnimatePresence mode="wait">
            <motion.div key={track.id}
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 md:p-6 flex flex-col gap-5">

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {track.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-[9px] font-orbitron tracking-widest uppercase border text-neutral-500" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>{t}</span>
                ))}
              </div>

              {/* Overview — always visible at top */}
              <div className="font-mono text-xs text-neutral-400 leading-relaxed border-l-2 pl-3" style={{ borderColor: 'rgba(0,255,136,0.3)' }}>
                {track.caseStudy.overview}
              </div>

              {/* 2×2 grid: Problem, Execution, Tools, Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CasePanel icon={Bug} label="Problem" content={track.caseStudy.problem} color="var(--neon-accent)" />

                {/* Execution — bulleted */}
                <CasePanel icon={List} label="Execution Steps" color="var(--neon-secondary)">
                  <ul className="flex flex-col gap-1">
                    {track.caseStudy.execution.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-400 text-[11px] leading-snug">
                        <span className="flex-shrink-0 font-orbitron text-[8px] mt-0.5" style={{ color: 'var(--neon-secondary)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CasePanel>

                {/* Tools — tag cloud */}
                <CasePanel icon={Terminal} label="Tools Used" color="var(--neon-primary)">
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {track.caseStudy.tools.map(tool => (
                      <span key={tool} className="px-2 py-0.5 font-mono text-[9px] rounded-sm font-bold" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)', color: 'var(--neon-primary)' }}>{tool}</span>
                    ))}
                  </div>
                </CasePanel>

                <CasePanel icon={Lightbulb} label="Key Insight / Result" content={track.caseStudy.insight} color="#facc15" />
              </div>

              {/* SYN burst viz — only on track 01, burst-only */}
              {track.caseStudy.hasSynViz && <SynBurstViz active={activeId === '01'} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

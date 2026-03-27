import { motion } from 'framer-motion';
import { MapPin, Cpu, Target, BookOpen } from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { key: 'whoami',    value: 'Harshdeep Singh',             color: 'var(--neon-primary)' },
  { key: 'role',      value: 'Cybersecurity Student & Dev', color: '#fff' },
  { key: 'status',    value: 'ACTIVE — seeking opportunities', color: '#22d3ee' },
  { key: 'location',  value: 'Punjab, India (LPU)',          color: '#9ca3af' },
  { key: 'degree',    value: 'B.Tech CSE — CGPA 7.8',         color: '#facc15' },
];

const STATS = [
  { value: '7.8',  label: 'CGPA',           sub: 'LPU B.Tech CSE',        color: '#facc15' },
  { value: '2+',   label: 'Projects',        sub: 'Case-studied & deployed', color: 'var(--neon-primary)' },
  { value: '3',    label: 'Training Logs',   sub: 'APCSIP · Pathshala · Independent', color: '#22d3ee' },
  { value: '5',    label: 'Badges Unlocked', sub: 'Certs + competitions',  color: 'var(--neon-secondary)' },
];

const FOUNDATIONS = [
  'Data Structures & Algorithms (BST, Graphs, DP)',
  'Operating Systems — memory, process, file management',
  'Computer Networks — TCP/IP, OSI model, subnetting',
  'Database Management — SQL, normalization, transactions',
  'Object-Oriented Programming — C++ & Python',
  'Web Technologies — HTTP, REST, client-server model',
  'Cryptography — symmetric, asymmetric, hashing basics',
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function AboutSection() {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="about" className="w-full max-w-5xl mx-auto py-24 px-6 relative z-10">
      {/* Header */}
      <motion.div {...fadeUp()} className="mb-14 border-l-4 pl-6" style={{ borderColor: '#22d3ee' }}>
        <p className="text-[10px] font-orbitron tracking-[0.4em] uppercase mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>
          Identity / Origin
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter uppercase text-white">Origin Story</h2>
        <p className="text-neutral-500 font-mono mt-2 text-xs">&gt; System identity decrypted.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* ── LEFT: Terminal block + mission ────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Terminal whoami */}
          <motion.div {...fadeUp(0.05)}
            className="rounded-sm border p-5 font-mono text-sm"
            style={{ background: 'rgba(0,0,0,0.55)', borderColor: 'rgba(0,255,136,0.14)', backdropFilter: 'blur(6px)' }}>
            {/* Terminal top bar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 text-[10px] text-neutral-600 tracking-widest uppercase">sys-identity.sh</span>
            </div>
            {TERMINAL_LINES.map((line, i) => (
              <motion.div key={line.key}
                initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                className="flex items-baseline gap-3 mb-2">
                <span className="text-neutral-600 select-none flex-shrink-0 text-[11px]">$</span>
                <span className="text-[10px] uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)', minWidth: 72 }}>{line.key}</span>
                <span className="text-[12px] font-semibold" style={{ color: line.color }}>{line.value}</span>
              </motion.div>
            ))}
            {/* Cursor */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-neutral-600 text-[11px]">$</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
                className="inline-block w-2 h-[14px] bg-[var(--neon-primary)]"
              />
            </div>
          </motion.div>

          {/* Mission statement */}
          <motion.div {...fadeUp(0.12)}
            className="rounded-sm border p-5 flex gap-4"
            style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-sm border flex items-center justify-center"
                style={{ borderColor: 'rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.07)', color: 'var(--neon-primary)' }}>
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="font-orbitron text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>
                Mission
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Building a career at the intersection of <span className="text-white font-semibold">offensive security</span> and <span className="text-white font-semibold">systems engineering</span> — finding vulnerabilities before bad actors do, and building defenses that hold.
              </p>
              <p className="font-mono text-[10px] text-neutral-600 mt-3">
                &gt; Open to internships · red-teaming · security research
              </p>
            </div>
          </motion.div>

          {/* Location tag */}
          <motion.div {...fadeUp(0.18)}
            className="flex items-center gap-2 font-mono text-[11px] text-neutral-600 pl-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>Lovely Professional University, Punjab, India</span>
          </motion.div>
        </div>

        {/* ── RIGHT: Stats row + Academic foundations ───────────────── */}
        <div className="flex flex-col gap-6">
          {/* Stats grid */}
          <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 gap-3">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                className="rounded-sm border p-4 flex flex-col gap-1 cursor-default"
                style={{ background: 'rgba(0,0,0,0.5)', borderColor: stat.color + '25' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = stat.color + '55')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = stat.color + '25')}>
                <span className="font-orbitron font-black text-2xl leading-none" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="font-orbitron text-[9px] uppercase tracking-widest text-white font-bold">{stat.label}</span>
                <span className="font-mono text-[9px] text-neutral-600 leading-snug">{stat.sub}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Academic foundations */}
          <motion.div {...fadeUp(0.15)}
            className="rounded-sm border p-5"
            style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-sm border flex items-center justify-center flex-shrink-0"
                style={{ borderColor: 'rgba(111,0,255,0.35)', background: 'rgba(111,0,255,0.08)', color: 'var(--neon-secondary)' }}>
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-orbitron text-[9px] uppercase tracking-widest font-bold" style={{ color: 'var(--neon-secondary)' }}>Core Knowledge</p>
                <p className="font-mono text-[9px] text-neutral-600">Academic & self-taught foundations</p>
              </div>
            </div>
            <ul className="flex flex-col gap-2.5">
              {FOUNDATIONS.map((item, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.05, duration: 0.35 }}
                  className="flex items-start gap-2 text-neutral-400 text-[11px] leading-snug">
                  <span className="flex-shrink-0 font-orbitron text-[8px] mt-0.5" style={{ color: 'var(--neon-secondary)' }}>›</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Processor tag */}
          <motion.div {...fadeUp(0.25)}
            className="flex items-center gap-2 font-mono text-[11px] text-neutral-700 pl-1">
            <Cpu className="w-3 h-3 flex-shrink-0" />
            <span>APCSIP-25 · CSE Pathshala · Self-Directed Research</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

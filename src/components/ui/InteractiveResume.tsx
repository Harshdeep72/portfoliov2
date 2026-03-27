/**
 * InteractiveResume — Full-screen "SYSTEM PROFILE // HARSHDEEP.exe" overlay.
 * Cinematic entry: zoom 1→1.02 + glitch flash + fade-in.
 * All sections use viewport-triggered stagger. No continuous loops.
 * Performance: transform + opacity only.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, FileText, ExternalLink, Mail,
  ChevronDown, Shield, Code2, BookOpen, Award, Briefcase,
} from 'lucide-react';

const PDF_PATH = '/cv_harshdeep (2).pdf';

// ── DATA ──────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'CGPA',       value: '7.8',     sub: 'LPU B.Tech CSE' },
  { label: 'Projects',   value: '2+',      sub: 'Case-studied' },
  { label: 'Training',   value: '3',       sub: 'Programs' },
  { label: 'Hackathon',  value: '🏆 2nd',  sub: 'Trinetra' },
];

const PROJECTS = [
  {
    id: 'syn',
    title: 'SYN Flood Attack Simulation',
    type: 'NETWORK SECURITY',
    color: '#22d3ee',
    problem: 'Demonstrate TCP half-open connection exhaustion to understand DoS attack mechanics.',
    execution: [
      'Configured attacker VM and target server in isolated VirtualBox environment',
      'Used hping3 to generate high-rate SYN packets with spoofed IP addresses',
      'Monitored backlog saturation in real-time with Wireshark and netstat',
      'Implemented SYN cookies as mitigation countermeasure',
    ],
    tools: ['Wireshark', 'hping3', 'VirtualBox', 'Linux', 'netstat'],
    result: 'Successfully demonstrated backlog exhaustion. Documented full attack lifecycle and defense. Validated SYN cookie effectiveness as mitigation.',
  },
  {
    id: 'cms',
    title: 'Contact Management System',
    type: 'SYSTEMS & DSA',
    color: 'var(--neon-primary)',
    problem: 'Build an efficient CLI-based contact manager applying core DSA principles in C.',
    execution: [
      'Designed data model using linked lists for O(1) insert and memory-efficient storage',
      'Implemented binary search tree for O(log n) lookup by name',
      'Built sort module with merge sort for alphabetical ordering',
      'Added file I/O for persistent storage across sessions',
    ],
    tools: ['C', 'GCC', 'Linked Lists', 'BST', 'File I/O'],
    result: 'Functional CLI system supporting full CRUD. Demonstrated applied DSA: O(log n) search vs O(n) brute force, validated through stress testing.',
  },
];

const SKILLS_GROUPS = [
  {
    icon: Shield,
    label: 'Offensive',
    color: '#22d3ee',
    skills: ['Pen Testing', 'Burp Suite', 'Nmap', 'Metasploit', 'Wireshark', 'SQLmap', 'Hydra'],
  },
  {
    icon: Code2,
    label: 'Programming',
    color: 'var(--neon-primary)',
    skills: ['Python', 'C', 'C++', 'Shell Script', 'JavaScript', 'Flask'],
  },
  {
    icon: BookOpen,
    label: 'Knowledge',
    color: 'var(--neon-secondary)',
    skills: ['OWASP Top 10', 'VAPT', 'Network Security', 'Cryptography', 'OSINT', 'DSA'],
  },
];

const TRAINING = [
  {
    org: 'APCSIP-25',
    role: 'Cybersecurity Research Intern',
    period: '2025',
    highlight: 'Selected from 4,000+ applicants',
    detail: 'Network traffic analysis, cyber threat intelligence, OSINT techniques.',
    color: '#22d3ee',
  },
  {
    org: 'CSE Pathshala',
    role: 'DSA Training',
    period: '2024',
    highlight: 'Data Structures & Algorithms',
    detail: 'Intensive structured program — arrays, trees, graphs, dynamic programming.',
    color: 'var(--neon-primary)',
  },
  {
    org: 'Self-Directed Research',
    role: 'Independent Study',
    period: 'Ongoing',
    highlight: 'Ethical hacking & network security',
    detail: 'CTF challenges, VAPT methodology, vulnerability research.',
    color: 'var(--neon-secondary)',
  },
];

const CERTS = [
  { title: 'NPTEL IIT Kharagpur', sub: 'Ethics in Engineering', badge: '★', color: '#facc15' },
  { title: 'Ethical Hacking Course', sub: 'Penetration Testing Methodology', badge: '◈', color: '#22d3ee' },
  { title: 'FreeCodeCamp', sub: 'Responsive Web Design', badge: '✓', color: '#60a5fa' },
];

const ACHIEVEMENTS = [
  { rank: 'Runner-Up', event: 'Trinetra Hackathon', detail: '24h cybersecurity hackathon, 100+ teams.', icon: '🏆', color: 'var(--neon-primary)' },
  { rank: 'Participant', event: 'RCSCTF', detail: 'Rajasthan Cyber Security CTF challenge.', icon: '🛡', color: 'var(--neon-secondary)' },
];

const CONTACT_LINKS = [
  { cmd: 'connect --github', label: 'github.com/harshdeep72', href: 'https://github.com/harshdeep72', icon: ExternalLink },
  { cmd: 'connect --linkedin', label: 'linkedin.com/in/harshdeep00', href: 'https://linkedin.com/in/harshdeep00', icon: ExternalLink },
  { cmd: 'send --email', label: 'contact@harshdeep.com', href: 'mailto:contact@harshdeep.com', icon: Mail },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
});

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: color + '40', background: color + '0d' }}>
      {label}
    </span>
  );
}

function ProjectCard({ p }: { p: typeof PROJECTS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...fadeUp(0.05)}
      className="border rounded-sm overflow-hidden cursor-default"
      style={{ borderColor: open ? p.color + '45' : 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)', transition: 'border-color 0.25s' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover-trigger"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-7 h-7 rounded-sm border flex items-center justify-center flex-shrink-0"
            style={{ borderColor: p.color + '40', background: p.color + '10', color: p.color }}>
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">{p.title}</p>
            <p className="font-orbitron text-[8px] uppercase tracking-widest mt-0.5" style={{ color: p.color }}>{p.type}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </motion.div>
      </button>
      {/* Expanded */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="pt-3">
                <p className="font-orbitron text-[8px] uppercase tracking-widest mb-1" style={{ color: p.color }}>Problem</p>
                <p className="text-neutral-400 text-xs leading-relaxed">{p.problem}</p>
              </div>
              <div>
                <p className="font-orbitron text-[8px] uppercase tracking-widest mb-2" style={{ color: p.color }}>Execution</p>
                <ul className="flex flex-col gap-1">
                  {p.execution.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-400 text-xs leading-relaxed">
                      <span className="text-[9px] font-orbitron mt-0.5" style={{ color: p.color }}>{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-orbitron text-[8px] uppercase tracking-widest mb-2" style={{ color: p.color }}>Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tools.map(t => <Tag key={t} label={t} color={p.color} />)}
                </div>
              </div>
              <div className="border-l-2 pl-3" style={{ borderColor: p.color }}>
                <p className="font-orbitron text-[8px] uppercase tracking-widest mb-1" style={{ color: p.color }}>Result</p>
                <p className="text-neutral-300 text-xs leading-relaxed">{p.result}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPdf: () => void;
}

export default function InteractiveResume({ isOpen, onClose, onSwitchToPdf }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC closes
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Reset scroll on open
  useEffect(() => {
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9150]"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9200] flex items-center justify-center p-0 md:p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full md:max-w-4xl md:h-[92vh] h-full flex flex-col rounded-none md:rounded-sm overflow-hidden"
              style={{
                background: 'rgba(3,3,6,0.98)',
                border: '1px solid rgba(0,255,136,0.2)',
                boxShadow: '0 0 80px rgba(0,255,136,0.1), 0 0 160px rgba(111,0,255,0.07)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── HEADER */}
              <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
                style={{ borderColor: 'rgba(0,255,136,0.12)', background: 'rgba(0,0,0,0.7)' }}>
                <div>
                  <p className="font-orbitron font-black text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--neon-primary)' }}>
                    System Profile
                  </p>
                  <p className="font-orbitron font-black text-white text-xs uppercase tracking-widest">HARSHDEEP.exe</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onSwitchToPdf}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 border rounded-sm hover-trigger"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.3)'; (e.currentTarget as HTMLElement).style.color = 'var(--neon-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}>
                    <FileText className="w-3 h-3" /> PDF View
                  </button>
                  <a href={PDF_PATH} download="Harshdeep_Singh_CV.pdf"
                    className="flex items-center gap-1.5 font-orbitron font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm hover-trigger"
                    style={{ background: 'var(--neon-primary)', color: '#000' }}>
                    <Download className="w-3 h-3" /> Download
                  </a>
                  <button onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center border rounded-sm hover-trigger"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--neon-accent)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,60,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,60,0.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── SCROLLABLE CONTENT */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,136,0.2) transparent' }}>
                <div className="p-5 md:p-8 flex flex-col gap-8">

                  {/* Identity block */}
                  <motion.div {...fadeUp(0)}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white uppercase tracking-tight">
                          Harshdeep Singh
                        </h1>
                        <p className="font-mono text-sm text-neutral-400 mt-1">
                          Cybersecurity Student · Future Security Engineer
                        </p>
                        <p className="font-mono text-xs mt-2" style={{ color: 'var(--neon-primary)' }}>
                          &gt; status: <span className="text-white">Session Active</span>
                          <span className="ml-3 opacity-60">·</span>
                          <span className="ml-3">LPU, Punjab, India</span>
                        </p>
                      </div>
                      <div className="font-mono text-[10px] text-neutral-700 border border-neutral-800 px-3 py-1.5 rounded-sm">
                        <span style={{ color: 'var(--neon-primary)' }}>▸</span> B.Tech CSE · 2022–2026
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats strip */}
                  <motion.div {...fadeUp(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STATS.map(s => (
                      <div key={s.label} className="border rounded-sm p-3 text-center"
                        style={{ borderColor: 'rgba(0,255,136,0.12)', background: 'rgba(0,255,136,0.03)' }}>
                        <p className="font-orbitron font-black text-xl text-white">{s.value}</p>
                        <p className="font-orbitron text-[8px] uppercase tracking-widest text-white/60 mt-0.5">{s.label}</p>
                        <p className="font-mono text-[9px] text-neutral-700 mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </motion.div>

                  {/* Core profile */}
                  <motion.div {...fadeUp(0.08)} className="border-l-2 pl-4"
                    style={{ borderColor: 'rgba(0,255,136,0.3)' }}>
                    <p className="font-orbitron text-[9px] uppercase tracking-widest mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>Core Profile</p>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      Cybersecurity student focused on <span className="text-white font-semibold">network analysis</span>,{' '}
                      <span className="text-white font-semibold">penetration testing</span>, and system-level understanding.
                      Building real-world attack & defense skills through hands-on labs, CTF challenges, and structured internship training.
                    </p>
                  </motion.div>

                  {/* Projects */}
                  <div>
                    <motion.div {...fadeUp(0.1)} className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-4 h-4" style={{ color: '#22d3ee' }} />
                      <p className="font-orbitron font-black text-xs uppercase tracking-widest text-white">Projects <span className="opacity-30">// click to expand</span></p>
                    </motion.div>
                    <div className="flex flex-col gap-3">
                      {PROJECTS.map(p => <ProjectCard key={p.id} p={p} />)}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <motion.div {...fadeUp(0.12)} className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4" style={{ color: 'var(--neon-primary)' }} />
                      <p className="font-orbitron font-black text-xs uppercase tracking-widest text-white">Arsenal</p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {SKILLS_GROUPS.map((g, i) => {
                        const Icon = g.icon;
                        return (
                          <motion.div key={g.label} {...fadeUp(0.13 + i * 0.04)}
                            className="border rounded-sm p-4"
                            style={{ borderColor: g.color + '20', background: 'rgba(0,0,0,0.35)' }}>
                            <div className="flex items-center gap-2 mb-3">
                              <Icon className="w-3.5 h-3.5" style={{ color: g.color }} />
                              <p className="font-orbitron text-[9px] uppercase tracking-widest font-bold" style={{ color: g.color }}>{g.label}</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {g.skills.map(s => <Tag key={s} label={s} color={g.color} />)}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Training */}
                  <div>
                    <motion.div {...fadeUp(0.15)} className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-4 h-4" style={{ color: '#22d3ee' }} />
                      <p className="font-orbitron font-black text-xs uppercase tracking-widest text-white">Training Logs</p>
                    </motion.div>
                    <div className="flex flex-col gap-3">
                      {TRAINING.map((t, i) => (
                        <motion.div key={t.org} {...fadeUp(0.16 + i * 0.04)}
                          className="border rounded-sm p-4 flex gap-3"
                          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.35)' }}>
                          <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: t.color, minHeight: 40 }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-bold text-white text-sm">{t.org}</p>
                                <p className="font-mono text-xs text-neutral-500">{t.role}</p>
                              </div>
                              <span className="font-orbitron text-[8px] uppercase px-1.5 py-0.5 rounded-sm flex-shrink-0"
                                style={{ color: t.color, background: t.color + '12', border: `1px solid ${t.color}30` }}>{t.period}</span>
                            </div>
                            <p className="font-mono text-[10px] mt-1.5 font-bold" style={{ color: t.color }}>★ {t.highlight}</p>
                            <p className="text-neutral-500 text-[11px] mt-1 leading-relaxed">{t.detail}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Certs + Achievements — 2-column on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Certificates */}
                    <div>
                      <motion.div {...fadeUp(0.18)} className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4" style={{ color: '#facc15' }} />
                        <p className="font-orbitron font-black text-xs uppercase tracking-widest text-white">Certificates</p>
                      </motion.div>
                      <div className="flex flex-col gap-2">
                        {CERTS.map((c, i) => (
                          <motion.div key={c.title} {...fadeUp(0.19 + i * 0.04)}
                            className="flex items-center gap-3 border rounded-sm px-3 py-2.5"
                            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                            <span className="text-base flex-shrink-0" style={{ color: c.color }}>{c.badge}</span>
                            <div>
                              <p className="text-white text-xs font-semibold">{c.title}</p>
                              <p className="font-mono text-[10px] text-neutral-600">{c.sub}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <motion.div {...fadeUp(0.18)} className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4" style={{ color: 'var(--neon-primary)' }} />
                        <p className="font-orbitron font-black text-xs uppercase tracking-widest text-white">Achievements</p>
                      </motion.div>
                      <div className="flex flex-col gap-2">
                        {ACHIEVEMENTS.map((a, i) => (
                          <motion.div key={a.event} {...fadeUp(0.19 + i * 0.04)}
                            className="flex items-start gap-3 border rounded-sm px-3 py-2.5"
                            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                            <span className="text-base flex-shrink-0">{a.icon}</span>
                            <div>
                              <p className="text-white text-xs font-semibold">{a.event}</p>
                              <p className="font-orbitron text-[8px] uppercase tracking-widest mt-0.5" style={{ color: a.color }}>{a.rank}</p>
                              <p className="font-mono text-[10px] text-neutral-600 mt-0.5">{a.detail}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact terminal */}
                  <motion.div {...fadeUp(0.22)}
                    className="rounded-sm border overflow-hidden"
                    style={{ borderColor: 'rgba(0,255,136,0.15)', background: 'rgba(0,0,0,0.55)' }}>
                    <div className="px-4 py-2 border-b flex items-center gap-2"
                      style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)' }}>
                      <div className="w-2 h-2 rounded-full bg-red-500/70" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                      <div className="w-2 h-2 rounded-full bg-green-500/70" />
                      <span className="font-mono text-[9px] text-neutral-700 ml-2 uppercase tracking-widest">contact.sh</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      {CONTACT_LINKS.map((c, i) => {
                        const Icon = c.icon;
                        return (
                          <motion.a key={c.cmd}
                            href={c.href}
                            target={c.href.startsWith('mailto') ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.24 + i * 0.06, duration: 0.35 }}
                            className="flex items-center gap-3 group hover-trigger"
                          >
                            <span className="font-mono text-[10px] text-neutral-600 select-none">&gt;</span>
                            <span className="font-mono text-[11px] text-neutral-500 group-hover:text-[var(--neon-primary)] transition-colors duration-200 flex-shrink-0">{c.cmd}</span>
                            <span className="font-mono text-[11px] text-neutral-600 group-hover:text-neutral-300 transition-colors duration-200 flex items-center gap-1.5">
                              <Icon className="w-3 h-3 flex-shrink-0" />
                              {c.label}
                            </span>
                          </motion.a>
                        );
                      })}
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 border-t flex items-center justify-between flex-shrink-0"
                style={{ borderColor: 'rgba(0,255,136,0.1)', background: 'rgba(0,0,0,0.6)' }}>
                <p className="font-mono text-[9px] text-neutral-700">
                  &gt; type <span className="text-neutral-500">exit</span> in terminal to close
                  <span className="mx-2 opacity-30">·</span>
                  press <span className="text-neutral-500">ESC</span>
                </p>
                <p className="font-mono text-[9px]" style={{ color: 'var(--neon-primary)', opacity: 0.4 }}>
                  HARSHDEEP.exe // v2026.1
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

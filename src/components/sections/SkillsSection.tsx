import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Code2, Wrench, Brain, Users } from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'offense',
    icon: Shield,
    title: 'Offensive Security',
    subtitle: 'Attack surface & exploitation',
    accent: '#22d3ee',        // cyan
    border: 'rgba(34,211,238,0.2)',
    tagBg: 'rgba(34,211,238,0.07)',
    tagBorder: 'rgba(34,211,238,0.22)',
    glowColor: 'rgba(34,211,238,0.14)',
    tags: [
      'Penetration Testing',
      'Burp Suite',
      'Nmap',
      'Metasploit',
      'Wireshark',
      'Hydra',
      'Gobuster',
      'SQLmap',
      'Nikto',
      'Hashcat',
      'John the Ripper',
    ],
  },
  {
    id: 'programming',
    icon: Code2,
    title: 'Programming & Scripting',
    subtitle: 'Languages & frameworks',
    accent: 'var(--neon-primary)',   // green
    border: 'rgba(0,255,136,0.2)',
    tagBg: 'rgba(0,255,136,0.06)',
    tagBorder: 'rgba(0,255,136,0.22)',
    glowColor: 'rgba(0,255,136,0.12)',
    tags: [
      'Python ★',
      'C',
      'C++',
      'Shell Scripting',
      'JavaScript',
      'HTML / CSS',
      'Flask',
    ],
  },
  {
    id: 'tools',
    icon: Wrench,
    title: 'Tools & Platforms',
    subtitle: 'Environments & infrastructure',
    accent: '#2dd4bf',        // teal
    border: 'rgba(45,212,191,0.2)',
    tagBg: 'rgba(45,212,191,0.06)',
    tagBorder: 'rgba(45,212,191,0.22)',
    glowColor: 'rgba(45,212,191,0.12)',
    tags: [
      'Linux ★',
      'VirtualBox',
      'VMware',
      'Docker',
      'Git',
      'GitHub',
      'MySQL',
      'AWS',
      'Cisco Packet Tracer',
    ],
  },
  {
    id: 'knowledge',
    icon: Brain,
    title: 'Knowledge Areas',
    subtitle: 'Domains & concepts',
    accent: 'var(--neon-secondary)',  // purple
    border: 'rgba(111,0,255,0.22)',
    tagBg: 'rgba(111,0,255,0.08)',
    tagBorder: 'rgba(111,0,255,0.25)',
    glowColor: 'rgba(111,0,255,0.14)',
    tags: [
      'OWASP Top 10',
      'VAPT',
      'Network Security',
      'Linux Administration',
      'Cryptography',
      'OSINT',
      'DSA',
    ],
  },
  {
    id: 'soft-skills',
    icon: Users,
    title: 'Operational / Soft Skills',
    subtitle: 'Interpersonal & workflow',
    accent: '#facc15',        // yellow
    border: 'rgba(250,204,21,0.22)',
    tagBg: 'rgba(250,204,21,0.08)',
    tagBorder: 'rgba(250,204,21,0.25)',
    glowColor: 'rgba(250,204,21,0.14)',
    tags: [
      'Problem Solving',
      'Analytical Thinking',
      'Adaptability',
      'Team Collaboration',
      'Time Management',
      'Communication',
    ],
  },
];

// ─── TAG TOOLTIP mapping (skills used in projects) ─────────────────────────
const TOOLTIPS: Record<string, string> = {
  'Wireshark': 'Used in SYN Flood project',
  'Metasploit': 'Used in SYN Flood project',
  'Nmap': 'APCSIP internship exposure',
  'OSINT': 'APCSIP internship exposure',
  'Python ★': 'Primary language',
  'Linux ★': 'Daily driver',
  'OWASP Top 10': 'Internship & self-study',
};

// ─── TAG COMPONENT ─────────────────────────────────────────────────────────
function SkillTag({
  label, accent, tagBg, tagBorder,
}: { label: string; accent: string; tagBg: string; tagBorder: string }) {
  const [clicked, setClicked] = useState(false);
  const tooltip = TOOLTIPS[label];
  const isHighlight = label.includes('★');
  const displayLabel = label.replace(' ★', '');

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <div className="relative group/tag">
      <motion.button
        onClick={handleClick}
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        animate={clicked ? { boxShadow: [`0 0 0px ${accent}`, `0 0 12px ${accent}80`, `0 0 0px ${accent}`] } : {}}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="px-2.5 py-1 font-mono text-[10px] rounded-full cursor-pointer flex items-center gap-1"
        style={{
          background: isHighlight ? accent + '18' : tagBg,
          border: `1px solid ${isHighlight ? accent + '55' : tagBorder}`,
          color: isHighlight ? accent : '#9ca3af',
          boxShadow: isHighlight ? `0 0 8px ${accent}22` : 'none',
          fontWeight: isHighlight ? 700 : 400,
          transition: 'color 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = accent;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 10px ${accent}33`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = isHighlight ? accent : '#9ca3af';
          (e.currentTarget as HTMLElement).style.boxShadow = isHighlight ? `0 0 8px ${accent}22` : 'none';
        }}
      >
        {isHighlight && <span className="text-[8px]">★</span>}
        {displayLabel}
      </motion.button>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-sm font-mono text-[9px] text-white whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-150"
          style={{ background: 'rgba(0,0,0,0.92)', border: `1px solid ${accent}33` }}>
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `4px solid ${accent}33` }} />
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY CARD ─────────────────────────────────────────────────────────
function CategoryCard({ cat, delay }: { cat: typeof CATEGORIES[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-sm flex flex-col gap-4 p-5 md:p-6 cursor-default hover-trigger"
      style={{
        background: 'rgba(0,0,0,0.5)',
        border: `1px solid ${hovered ? cat.border.replace('0.2)', '0.45)') : cat.border}`,
        boxShadow: hovered ? `0 0 32px ${cat.glowColor}, inset 0 0 20px rgba(0,0,0,0.4)` : `0 0 0px transparent`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        backdropFilter: 'blur(6px)',
        minHeight: 260,
      }}
    >
      {/* Card spotlight bg */}
      <div className="absolute inset-0 rounded-sm pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 20% 20%, ${cat.accent}09 0%, transparent 65%)`, opacity: hovered ? 1 : 0 }} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ background: cat.accent + '12', border: `1px solid ${cat.accent}35`, color: cat.accent }}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-orbitron font-black text-sm uppercase tracking-wider text-white leading-none">
            {cat.title}
          </h3>
          <p className="font-mono text-[9px] mt-0.5" style={{ color: cat.accent + 'aa' }}>
            {cat.subtitle}
          </p>
        </div>
        {/* Count badge */}
        <div className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded-sm"
          style={{ color: cat.accent, background: cat.accent + '10', border: `1px solid ${cat.accent}25` }}>
          {cat.tags.length}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] relative z-10" style={{ background: `linear-gradient(to right, ${cat.accent}30, transparent)` }} />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {cat.tags.map(tag => (
          <SkillTag
            key={tag}
            label={tag}
            accent={cat.accent}
            tagBg={cat.tagBg}
            tagBorder={cat.tagBorder}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── SECTION ────────────────────────────────────────────────────────────────
export default function SkillsSection() {
  return (
    <section id="skills" className="w-full max-w-6xl mx-auto py-24 px-6 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 border-l-4 pl-6"
        style={{ borderColor: '#22d3ee' }}
      >
        <p className="text-[10px] font-orbitron tracking-[0.4em] uppercase mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>
          Operational Capabilities
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter uppercase text-white">
          Arsenal <span className="opacity-30">//</span> Skill Matrix
        </h2>
        <p className="text-neutral-500 font-mono mt-2 text-xs">&gt; {CATEGORIES.reduce((a, c) => a + c.tags.length, 0)} capabilities indexed across {CATEGORIES.length} domains.</p>
      </motion.div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} delay={i * 0.08} />
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="font-mono text-[9px] text-neutral-700 mt-8 text-center"
      >
        ★ = primary / highlighted tool &nbsp;·&nbsp; hover tags for context
      </motion.p>
    </section>
  );
}

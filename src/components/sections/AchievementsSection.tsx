import { motion } from 'framer-motion';
import { ShieldAlert, Trophy, Award } from 'lucide-react';

const ACHIEVEMENTS = [
  {
    rank: 'RUNNER-UP',
    event: 'Trinetra Hackathon',
    icon: Trophy,
    color: 'var(--neon-primary)',
    badge: '🏆',
    label: 'UNLOCKED',
    description: 'Competed against 100+ teams in a 24-hour cybersecurity hackathon. Secured 2nd place.',
  },
  {
    rank: 'PARTICIPANT',
    event: 'RCSCTF',
    icon: ShieldAlert,
    color: 'var(--neon-secondary)',
    badge: '🛡',
    label: 'LOGGED',
    description: 'Participated in the Rajasthan Cyber Security Capture The Flag challenge.',
  },
  {
    rank: 'CERTIFIED',
    event: 'NPTEL IIT Kharagpur',
    icon: Award,
    color: '#facc15',
    badge: '★',
    label: 'VERIFIED',
    description: 'Completed Ethics in Engineering certified course by IIT Kharagpur via NPTEL.',
  },
  {
    rank: 'CERTIFIED',
    event: 'Ethical Hacking Course',
    icon: ShieldAlert,
    color: 'var(--neon-accent)',
    badge: '◈',
    label: 'COMPLETED',
    description: 'Hands-on ethical hacking, penetration testing methodology, and vulnerability assessment.',
  },
  {
    rank: 'CERTIFIED',
    event: 'FreeCodeCamp',
    icon: Award,
    color: '#60a5fa',
    badge: '✓',
    label: 'VERIFIED',
    description: 'Responsive Web Design certification. HTML, CSS, and accessibility fundamentals.',
  },
];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="w-full max-w-6xl mx-auto py-24 px-6 relative z-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mb-14 border-l-4 pl-6" style={{ borderColor: 'var(--neon-secondary)' }}>
        <p className="text-[10px] font-orbitron tracking-[0.4em] uppercase mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>
          System Exploits / Badges
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter uppercase text-white">Unlocked Badges</h2>
        <p className="text-neutral-500 font-mono mt-2 text-xs">&gt; {ACHIEVEMENTS.length} entries verified in system log.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACHIEVEMENTS.map((ach, i) => {
          const Icon = ach.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
              className="card-glow relative p-5 rounded-sm border flex flex-col gap-3 group hover-trigger cursor-default"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)', transition: 'border-color 0.25s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ach.color + '35')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>

              {/* Status badge — top right */}
              <div className="absolute top-3 right-3 font-orbitron text-[7px] tracking-widest uppercase px-1.5 py-0.5 border"
                style={{ color: ach.color, borderColor: ach.color + '40', background: ach.color + '08' }}>
                {ach.label}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{ borderColor: ach.color + '50', background: ach.color + '10', color: ach.color }}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div>
                <div className="font-orbitron text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: ach.color }}>
                  {ach.rank}
                </div>
                <div className="font-bold text-white text-sm mb-2">{ach.event}</div>
                <p className="font-mono text-neutral-500 text-[11px] leading-relaxed group-hover:text-neutral-400 transition-colors">
                  {ach.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

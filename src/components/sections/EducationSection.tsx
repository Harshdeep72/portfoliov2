import { motion } from 'framer-motion';
import { GraduationCap, School, BookOpen } from 'lucide-react';

const EDUCATION = [
  {
    degree: 'B.Tech — Computer Science & Engineering',
    institution: 'Lovely Professional University (LPU)',
    location: 'Punjab, India',
    period: '2023 — 2027 (Expected)',
    grade: 'CGPA: 7.8',
    status: 'ACTIVE',
    statusColor: 'var(--neon-primary)',
    icon: GraduationCap,
    focus: 'Cybersecurity track · Network Security · Data Structures',
  },
  {
    degree: 'Senior Secondary (XII) — Science',
    institution: 'Army Public School',
    location: 'India',
    period: '2022',
    grade: '86%',
    status: 'COMPLETED',
    statusColor: 'var(--neon-secondary)',
    icon: School,
    focus: 'Physics · Chemistry · Mathematics · Computer Science',
  },
  {
    degree: 'Secondary (X)',
    institution: 'Army Public School',
    location: 'India',
    period: '2020',
    grade: '88.2%',
    status: 'COMPLETED',
    statusColor: 'var(--neon-secondary)',
    icon: BookOpen,
    focus: 'Full science stream with distinction',
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="w-full max-w-5xl mx-auto py-24 px-6 relative z-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mb-14 border-l-4 pl-6" style={{ borderColor: '#facc15' }}>
        <p className="text-[10px] font-orbitron tracking-[0.4em] uppercase mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>
          Identity / Origin
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter uppercase text-white">System Profile</h2>
        <p className="text-neutral-500 font-mono mt-2 text-xs">&gt; Educational records decrypted.</p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {EDUCATION.map((edu, i) => {
          const Icon = edu.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative group card-glow rounded-sm"
              onMouseEnter={e => (e.currentTarget.querySelector<HTMLElement>('.edu-card')!.style.borderColor = edu.statusColor + '28')}
              onMouseLeave={e => (e.currentTarget.querySelector<HTMLElement>('.edu-card')!.style.borderColor = 'rgba(255,255,255,0.06)')}>

              <div className="edu-card p-5 md:p-6 rounded-sm border flex flex-col sm:flex-row gap-5 items-start transition-colors duration-300"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)' }}>

                {/* Icon */}
                <div className="w-11 h-11 rounded-sm border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: edu.statusColor + '40', background: edu.statusColor + '0d', color: edu.statusColor }}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <h3 className="font-black text-white text-sm md:text-base leading-snug">{edu.degree}</h3>
                    <div className="font-orbitron text-[7px] tracking-widest uppercase px-1.5 py-0.5 border flex-shrink-0"
                      style={{ color: edu.statusColor, borderColor: edu.statusColor + '35', background: edu.statusColor + '08' }}>
                      {edu.status}
                    </div>
                  </div>

                  <div className="font-orbitron text-[10px] mb-1" style={{ color: edu.statusColor + 'aa' }}>
                    {edu.institution} · {edu.location}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[9px] text-neutral-600">{edu.period}</span>
                    <span className="font-orbitron text-[9px] font-bold" style={{ color: '#facc15' }}>{edu.grade}</span>
                  </div>

                  <div className="font-mono text-[10px] text-neutral-500 leading-relaxed">
                    {edu.focus}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

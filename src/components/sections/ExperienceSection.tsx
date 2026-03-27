import { motion } from 'framer-motion';
import { Cpu, Shield, Database } from 'lucide-react';

const LOGS = [
  {
    id: 'SYS-LOG-001',
    role: 'Cybersecurity Intern',
    org: 'APCSIP-25 (Amity)',
    period: '2025 — Present',
    status: 'ACTIVE',
    statusColor: 'var(--neon-primary)',
    icon: Shield,
    highlight: 'Selected from 4,000+ applicants nationwide',
    exposure: [
      'OSINT (Open Source Intelligence gathering & tools)',
      'Digital forensics and evidence handling',
      'Indian cyber laws and compliance frameworks',
      'Network threat analysis and incident response',
      'Real-world vulnerability assessment workflows',
    ],
  },
  {
    id: 'SYS-LOG-002',
    role: 'DSA Trainee',
    org: 'CSE Pathshala',
    period: '2024',
    status: 'COMPLETED',
    statusColor: 'var(--neon-secondary)',
    icon: Cpu,
    highlight: 'Completed structured DSA curriculum',
    exposure: [
      'Arrays, Linked Lists, Trees, Graphs, Heaps',
      'Sorting and searching algorithms (O-notation analysis)',
      'Dynamic programming and divide-and-conquer strategies',
      'Applied BST, Hashmaps in real project implementations',
    ],
  },
  {
    id: 'SYS-LOG-003',
    role: 'Self-Directed Research',
    org: 'Independent',
    period: '2023 — Ongoing',
    status: 'ONGOING',
    statusColor: '#facc15',
    icon: Database,
    highlight: 'Network protocols, ethical hacking, CTF challenges',
    exposure: [
      'TCP/IP stack deep-dive (captured with Wireshark)',
      'Metasploit, Burp Suite, Nmap in lab environments',
      'CTF participation (RCSCTF)',
      'Cisco Packet Tracer simulations (CCNA-adjacent topics)',
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="w-full max-w-5xl mx-auto py-24 px-6 relative z-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mb-14 border-l-4 pl-6" style={{ borderColor: 'var(--neon-secondary)' }}>
        <p className="text-[10px] font-orbitron tracking-[0.4em] uppercase mb-2 font-bold" style={{ color: 'var(--neon-primary)' }}>
          Backstory / Modules
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter uppercase text-white">System Logs</h2>
        <p className="text-neutral-500 font-mono mt-2 text-xs">&gt; Training modules loaded. {LOGS.length} records found.</p>
      </motion.div>

      {/* Timeline */}
      <div className="relative pl-6 md:pl-10">
        {/* Timeline line */}
        <div className="absolute left-[3px] md:left-[5px] top-0 bottom-0 w-[2px]" style={{ background: 'rgba(255,255,255,0.05)' }} />
        {/* Active pulse at top */}
        <motion.div className="absolute left-[2px] md:left-[4px] w-[4px] top-0"
          animate={{ height: '100%' }}
          initial={{ height: '0%' }}
          transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(to bottom, var(--neon-primary), transparent)' }} />

        <div className="flex flex-col gap-10">
          {LOGS.map((log, i) => {
            const Icon = log.icon;
            return (
              <motion.div key={log.id}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative group">

                {/* Node dot */}
                <div className="absolute left-[-22px] md:left-[-28px] top-5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: log.statusColor, background: '#050505' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: log.statusColor }} />
                </div>

                {/* Card */}
                <div className="p-5 md:p-6 rounded-sm border flex flex-col gap-4 group-hover:border-opacity-40 transition-colors duration-300 relative overflow-hidden card-glow"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = log.statusColor + '28')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-sm border flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: log.statusColor + '35', background: log.statusColor + '0d', color: log.statusColor }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-neutral-600 mb-0.5">{log.id}</div>
                        <h3 className="font-black text-white text-base md:text-lg leading-none">{log.role}</h3>
                        <div className="font-orbitron text-[10px] mt-0.5" style={{ color: log.statusColor + 'aa' }}>{log.org}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="font-orbitron text-[7px] tracking-widest uppercase px-2 py-0.5 border"
                        style={{ color: log.statusColor, borderColor: log.statusColor + '35', background: log.statusColor + '08' }}>
                        {log.status}
                      </div>
                      <span className="font-mono text-[9px] text-neutral-600">{log.period}</span>
                    </div>
                  </div>

                  {/* Highlight callout */}
                  <div className="flex items-start gap-2 px-3 py-2 rounded-sm border-l-2 text-xs font-mono"
                    style={{ background: log.statusColor + '08', borderColor: log.statusColor }}>
                    <span style={{ color: log.statusColor }}>▶</span>
                    <span className="text-neutral-300">{log.highlight}</span>
                  </div>

                  {/* Exposure list */}
                  <ul className="flex flex-col gap-1.5">
                    {log.exposure.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-neutral-500 text-xs leading-snug group-hover:text-neutral-400 transition-colors">
                        <span className="flex-shrink-0 font-orbitron text-[8px] mt-0.5" style={{ color: log.statusColor + '70' }}>›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * ResumeModal — cinematic CV preview with iframe embed.
 * Opens with fade + scale animation, closes with reverse.
 * Lazy-loads the PDF only when modal is open.
 * Mobile: fullscreen. Desktop: centered constrained panel.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { useEffect } from 'react';

const PDF_PATH = '/cv_harshdeep (2).pdf';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── BACKDROP */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9100] cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* ── MODAL PANEL */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9200] flex items-center justify-center p-0 md:p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full md:max-w-4xl md:h-[90vh] h-full flex flex-col rounded-none md:rounded-sm overflow-hidden"
              style={{
                background: 'rgba(4,4,8,0.97)',
                border: '1px solid rgba(0,255,136,0.25)',
                boxShadow: '0 0 60px rgba(0,255,136,0.12), 0 0 120px rgba(111,0,255,0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0"
                style={{ borderColor: 'rgba(0,255,136,0.14)', background: 'rgba(0,0,0,0.6)' }}>
                {/* Left — title */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: 'rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.08)', color: 'var(--neon-primary)' }}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-orbitron font-black text-white text-xs uppercase tracking-widest leading-none">
                      Resume Preview
                    </p>
                    <p className="font-mono text-[9px] text-neutral-600 mt-0.5">
                      harshdeep_singh_cv.pdf
                    </p>
                  </div>
                </div>

                {/* Right — controls */}
                <div className="flex items-center gap-2">
                  {/* Download */}
                  <a
                    href={PDF_PATH}
                    download="Harshdeep_Singh_CV.pdf"
                    className="flex items-center gap-1.5 font-orbitron font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm hover-trigger transition-all duration-200"
                    style={{ background: 'var(--neon-primary)', color: '#000' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>

                  {/* Open in new tab */}
                  <a
                    href={PDF_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-orbitron font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm border hover-trigger transition-all duration-200 text-white"
                    style={{ borderColor: 'rgba(0,255,136,0.25)', background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,136,0.55)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,136,0.25)')}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-sm border hover-trigger transition-all duration-200 ml-1"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--neon-accent)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,60,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,60,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF Iframe — lazy: only rendered when modal is open */}
              <div className="flex-1 overflow-hidden relative">
                <iframe
                  src={`${PDF_PATH}#view=FitH`}
                  title="Harshdeep Singh — Resume"
                  className="w-full h-full border-0"
                  style={{ background: '#111' }}
                />
                {/* Subtle inner glow top edge */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,136,0.2), transparent)' }} />
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 border-t flex-shrink-0 flex items-center justify-between"
                style={{ borderColor: 'rgba(0,255,136,0.1)', background: 'rgba(0,0,0,0.6)' }}>
                <p className="font-mono text-[9px] text-neutral-700">&gt; press ESC to close</p>
                <p className="font-mono text-[9px]" style={{ color: 'var(--neon-primary)', opacity: 0.5 }}>
                  HARSHDEEP.exe // SYSTEM OVERRIDE
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

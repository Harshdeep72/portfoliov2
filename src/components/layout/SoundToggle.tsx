// V6 Audio System Controller
import { Volume2, VolumeX, Disc } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioVisualizer from './AudioVisualizer';
import { useAudioSystem } from '../../context/AudioContext';

export default function SoundToggle() {
  const { isPlaying, togglePlay } = useAudioSystem();

  return (
    <div className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-4">
      
      {/* Visualizer Status */}
      {isPlaying && (
        <div className="hidden md:flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 border border-[var(--neon-primary)]/30 rounded-full">
           <Disc className="w-4 h-4 text-[var(--neon-primary)] animate-[spin_3s_linear_infinite]" />
           <span className="text-[10px] uppercase font-orbitron tracking-widest text-[var(--neon-primary)] opacity-80">Playing: SYS_BEAT_01</span>
           <div className="w-12 h-4 scale-75 overflow-hidden">
             <AudioVisualizer isPlaying={true} />
           </div>
        </div>
      )}

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[var(--neon-primary)] border border-[var(--neon-primary)]/50 box-glow-primary hover-trigger group relative"
      >
        <div className="absolute inset-0 bg-[var(--neon-primary)]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isPlaying ? <Volume2 className="w-5 h-5 relative z-10" /> : <VolumeX className="w-5 h-5 text-neutral-500 relative z-10" />}
      </motion.button>
    </div>
  );
}

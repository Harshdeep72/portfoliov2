import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  bassLevel: MotionValue<number>;
}

const AudioCtxContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const bassLevel = useMotionValue(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const audio = new Audio('/beat.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      cancelAnimationFrame(rafRef.current);
      webAudioCtxRef.current?.close();
    };
  }, []);

  const initWebAudio = () => {
    if (webAudioCtxRef.current || !audioRef.current) return;
    const ctx = new AudioContext();
    webAudioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64; // Small = performant (32 bins)
    analyserRef.current = analyser;

    const source = ctx.createMediaElementSource(audioRef.current);
    sourceRef.current = source;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      analyser.getByteFrequencyData(data);
      // Average first 4 bins (sub-bass)
      const avg = (data[0] + data[1] + data[2] + data[3]) / 4;
      bassLevel.set(avg / 255);
    };
    tick();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      initWebAudio();
      if (webAudioCtxRef.current?.state === 'suspended') {
        webAudioCtxRef.current.resume();
      }
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }
  };

  return (
    <AudioCtxContext.Provider value={{ isPlaying, togglePlay, bassLevel }}>
      {children}
    </AudioCtxContext.Provider>
  );
}

export function useAudioSystem(): AudioContextType {
  const ctx = useContext(AudioCtxContext);
  if (!ctx) throw new Error('useAudioSystem must be used within AudioProvider');
  return ctx;
}

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Waves, Wind } from 'lucide-react';

interface SoundOption {
  id: string;
  name: string;
  type: string;
  frequency: number;
  description: string;
}

const SOUND_TRACKS: SoundOption[] = [
  { id: 'water', name: 'Cascading Rainfall', type: 'Hydrotherapy', frequency: 180, description: 'Gentle water ripples and rainfall mist' },
  { id: 'wind', name: 'Cedar Forest Breeze', type: 'Forest Air', frequency: 120, description: 'Calming wind through pine needle leaves' },
  { id: 'singing-bowl', name: 'Tibetan Singing Bowl', type: 'Acoustic 432Hz', frequency: 432, description: 'Deep harmonic resonance for mental stillness' },
];

export const AmbianceSoundscape: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTrack, setActiveTrack] = useState<string>('water');
  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const startAudio = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const ctx = audioCtxRef.current;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(isMuted ? 0 : volume * 0.1, ctx.currentTime);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      oscRef.current = osc;

      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      const trk = SOUND_TRACKS.find((t) => t.id === activeTrack) || SOUND_TRACKS[0];
      startAudio(trk.frequency);
    }
  };

  const handleTrackSelect = (track: SoundOption) => {
    setActiveTrack(track.id);
    if (isPlaying) {
      startAudio(track.frequency);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current && !isMuted) {
      gainNodeRef.current.gain.setValueAtTime(newVol * 0.1, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer flex-shrink-0 ${
            isPlaying
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200'
          }`}
          aria-label={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Spa Ambiance Audio
          </span>
          <strong className="text-xs font-semibold text-neutral-900 block">
            {SOUND_TRACKS.find((t) => t.id === activeTrack)?.name}
          </strong>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto justify-start sm:justify-center">
        {SOUND_TRACKS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTrackSelect(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              activeTrack === t.id
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            if (gainNodeRef.current && audioCtxRef.current) {
              gainNodeRef.current.gain.setValueAtTime(
                nextMuted ? 0 : volume * 0.1,
                audioCtxRef.current.currentTime
              );
            }
          }}
          className="text-neutral-500 hover:text-neutral-900 transition p-1 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-20 accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
          aria-label="Volume slider"
        />
      </div>
    </div>
  );
};

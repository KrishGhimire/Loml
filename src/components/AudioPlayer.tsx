import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Play, Square, Volume2, VolumeX, Music4, Sparkles } from "lucide-react";

// Web Audio synthesizer for cute romantic tunes
class SynthManager {
  private ctx: AudioContext | null = null;
  private currentOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isSynthesizing = false;
  private songTimer: number | null = null;
  private tempo = 120; // BPM

  // Notes frequencies
  private noteFreqs: { [key: string]: number } = {
    "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
    "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77,
    "C6": 1046.50
  };

  constructor() {
    // Lazy initialisation
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public stopAll() {
    this.isSynthesizing = false;
    if (this.songTimer) {
      clearTimeout(this.songTimer);
      this.songTimer = null;
    }
    this.currentOscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.currentOscillators = [];
  }

  public playSparkle() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Quick sweet chiming tone
    const notes = ["G5", "B5", "D6"];
    notes.forEach((note, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(this.noteFreqs[note] || 440, now + i * 0.08);
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });
  }

  public playHeartSound() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Low heartbeat thud
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    
    osc.start(now);
    osc.stop(now + 0.18);

    // Second thud
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(80, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(40, now + 0.28);
    
    gain2.gain.setValueAtTime(0.35, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    
    osc2.connect(gain2);
    gain2.connect(this.ctx!.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.32);
  }

  public playNote(note: string, duration: number, delay = 0, volume = 0.06, type: OscillatorType = "triangle") {
    this.initCtx();
    if (!this.ctx) return;

    const dummyOsc = this.ctx.createOscillator();
    const dummyGain = this.ctx.createGain();

    const now = this.ctx.currentTime + delay;
    const freq = this.noteFreqs[note] || 440;

    dummyOsc.type = type;
    dummyOsc.frequency.setValueAtTime(freq, now);

    dummyGain.gain.setValueAtTime(0, now);
    dummyGain.gain.linearRampToValueAtTime(volume, now + 0.03);
    dummyGain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.02);

    dummyOsc.connect(dummyGain);
    dummyGain.connect(this.ctx.destination);

    dummyOsc.start(now);
    dummyOsc.stop(now + duration);

    const pair = { osc: dummyOsc, gain: dummyGain };
    this.currentOscillators.push(pair);

    setTimeout(() => {
      this.currentOscillators = this.currentOscillators.filter(item => item !== pair);
    }, (delay + duration) * 1000 + 100);
  }

  public playMelody(melody: [string, number][], isLoop = true) {
    this.stopAll();
    this.isSynthesizing = true;
    this.initCtx();

    let playIndex = 0;
    const scheduler = () => {
      if (!this.isSynthesizing) return;
      const currentNote = melody[playIndex];
      const noteStr = currentNote[0];
      const beatDur = currentNote[1];

      // Play note if it's not a rest ("Rest")
      if (noteStr !== "Rest") {
        // We use a warm triangle wave for the lead, accompanied by a soft backup sine
        const actualDuration = (beatDur * (60 / this.tempo)) * 0.95;
        this.playNote(noteStr, actualDuration, 0, 0.08, "triangle");
        
        // Soft harmony note occasionally
        if (playIndex % 4 === 0) {
          const root = noteStr.slice(0, 1) + "4";
          if (this.noteFreqs[root]) {
            this.playNote(root, actualDuration * 1.5, 0, 0.03, "sine");
          }
        }
      }

      const stepDelay = (beatDur * (60 / this.tempo)) * 1000;
      playIndex = (playIndex + 1) % melody.length;
      
      if (playIndex === 0 && !isLoop) {
        this.isSynthesizing = false;
        return;
      }

      this.songTimer = setTimeout(scheduler, stepDelay) as any;
    };

    scheduler();
  }
}

// Romantic Melodies
export const TUNE_BIRTHDAY: [string, number][] = [
  ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["F4", 1], ["E4", 2],
  ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["G4", 1], ["F4", 2],
  ["C4", 0.75], ["C4", 0.25], ["C5", 1], ["A4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
  ["A#4", 0.75], ["A#4", 0.25], ["A4", 1], ["F4", 1], ["G4", 1], ["F4", 2],
  ["Rest", 2]
];

export const TUNE_CANT_HELP: [string, number][] = [
  ["C4", 1], ["E4", 1], ["G4", 1], ["A4", 2],
  ["A#4", 1], ["A4", 1], ["G4", 2],
  ["C5", 1], ["D5", 1], ["C5", 1], ["B4", 2],
  ["A4", 1], ["G4", 1], ["F4", 2],
  ["G4", 1], ["A4", 1], ["G4", 1], ["F4", 2],
  ["E4", 1], ["D4", 1], ["C4", 3],
  ["Rest", 2]
];

export const TUNE_SUNSHINE: [string, number][] = [
  ["C4", 1], ["F4", 1], ["G4", 1], ["A4", 2], ["A4", 1],
  ["F4", 1], ["A4", 1], ["A#4", 1], ["C5", 3],
  ["A#4", 1], ["C5", 1], ["A#4", 1], ["A4", 2], ["F4", 1],
  ["F4", 1], ["G4", 1], ["A4", 1], ["F4", 2], ["D4", 1],
  ["C4", 1], ["F4", 1], ["G4", 1], ["A4", 2], ["A#4", 1],
  ["G4", 1], ["E4", 1], ["F4", 3],
  ["Rest", 2]
];

export const TUNE_LAVIE: [string, number][] = [
  ["G4", 1.5], ["A4", 0.5], ["B4", 1], ["C5", 2],
  ["C5", 1], ["B4", 1], ["A4", 1], ["G4", 2],
  ["G4", 1.5], ["A4", 0.5], ["B4", 1], ["D5", 2],
  ["D5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["E4", 2], ["G4", 2], ["C5", 4],
  ["Rest", 2]
];

interface AudioContextType {
  isPlaying: boolean;
  activeTrackId: string;
  volume: boolean; // toggle mute
  playTrack: (trackId: string) => void;
  stopTrack: () => void;
  triggerSparkle: () => void;
  triggerHeartbeat: () => void;
  toggleVolume: () => void;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(undefined);

export const synthManager = new SynthManager();

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState("none");
  const [volume, setVolume] = useState(true);

  const playTrack = (trackId: string) => {
    if (!volume) {
      synthManager.stopAll();
      setActiveTrackId(trackId);
      setIsPlaying(false);
      return;
    }

    try {
      if (trackId === "birthday") {
        synthManager.playMelody(TUNE_BIRTHDAY, true);
      } else if (trackId === "cant_help") {
        synthManager.playMelody(TUNE_CANT_HELP, true);
      } else if (trackId === "sunshine") {
        synthManager.playMelody(TUNE_SUNSHINE, true);
      } else if (trackId === "lavie") {
        synthManager.playMelody(TUNE_LAVIE, true);
      } else {
        synthManager.stopAll();
        setIsPlaying(false);
        setActiveTrackId("none");
        return;
      }
      setIsPlaying(true);
      setActiveTrackId(trackId);
    } catch (e) {
      console.error(e);
    }
  };

  const stopTrack = () => {
    synthManager.stopAll();
    setIsPlaying(false);
    setActiveTrackId("none");
  };

  const triggerSparkle = () => {
    if (volume) {
      synthManager.playSparkle();
    }
  };

  const triggerHeartbeat = () => {
    if (volume) {
      synthManager.playHeartSound();
    }
  };

  const toggleVolume = () => {
    setVolume(prev => {
      const next = !prev;
      if (!next) {
        synthManager.stopAll();
        setIsPlaying(false);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      synthManager.stopAll();
    };
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      isPlaying,
      activeTrackId,
      volume,
      playTrack,
      stopTrack,
      triggerSparkle,
      triggerHeartbeat,
      toggleVolume
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useRomanticAudio = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useRomanticAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioController: React.FC = () => {
  const { isPlaying, activeTrackId, volume, playTrack, stopTrack, toggleVolume, triggerSparkle } = useRomanticAudio();
  const [isOpen, setIsOpen] = useState(false);

  const playlist = [
    { id: "birthday", name: "💞 Our Joyful Chimes" },
    { id: "cant_help", name: "🌹 Retro Love's Embrace" },
    { id: "sunshine", name: "☀️ Sunshine Romantic Plucks" },
    { id: "lavie", name: "✨ La Vie en Rose" }
  ];

  return (
    <div className="fixed top-3 right-3 z-50 flex flex-col items-end gap-1.5 font-sans">
      <div className="flex items-center gap-1.5">
        {/* Playback status indicator */}
        {isPlaying && (
          <div className="bg-rose-500/95 text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-md border border-rose-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-100"></span>
            </span>
            playing cute synth
          </div>
        )}

        <button
          onClick={() => {
            triggerSparkle();
            toggleVolume();
          }}
          className="p-2.5 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full shadow-md border border-pink-200 transition-all flex items-center justify-center"
          title={volume ? "Mute music" : "Unmute music"}
          id="music-mute-btn"
        >
          {volume ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button
          onClick={() => {
            triggerSparkle();
            setIsOpen(!isOpen);
          }}
          className={`p-2.5 rounded-full shadow-md border transition-all flex items-center justify-center ${
            isOpen ? "bg-rose-500 text-white border-rose-400" : "bg-white text-rose-500 border-rose-100"
          }`}
          id="music-playlist-toggle"
        >
          <Music4 size={16} className={isPlaying ? "animate-spin" : ""} style={{ animationDuration: "12s" }} />
        </button>
      </div>

      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-rose-100 w-60 animate-in fade-in slide-in-from-top-3 duration-200 text-left mt-1.5">
          <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mb-2">
            <Sparkles size={12} /> SWEET BACKGROUND HARMONIES
          </p>
          <div className="flex flex-col gap-1">
            {playlist.map((track) => {
              const active = activeTrackId === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    triggerSparkle();
                    if (active) {
                      stopTrack();
                    } else {
                      playTrack(track.id);
                    }
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    active 
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium" 
                      : "hover:bg-rose-50 text-gray-700"
                  }`}
                  id={`track-item-${track.id}`}
                >
                  <span className="truncate">{track.name}</span>
                  {active ? (
                    <Square size={10} className="fill-white" />
                  ) : (
                    <Play size={10} className="fill-current" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Tap a track to play beautiful procedural chimes.
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from "react";
import { Smile, Award, Heart, ShieldAlert, Sparkles } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";

export const ApologyTab: React.FC = () => {
  const { triggerSparkle, triggerHeartbeat } = useRomanticAudio();
  const [forgiveValue, setForgiveValue] = useState(50);
  
  // Virtual Hug States
  const [isHoldingHug, setIsHoldingHug] = useState(false);
  const [hugSeconds, setHugSeconds] = useState(0);
  const hugIntervalRef = useRef<number | null>(null);

  // Hug Press handlers
  const startHug = () => {
    setIsHoldingHug(true);
    triggerHeartbeat();
    
    // Vibrate device if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    hugIntervalRef.current = setInterval(() => {
      setHugSeconds(prev => {
        const next = prev + 1;
        if (next % 3 === 0) {
          triggerHeartbeat();
        }
        return next;
      });
    }, 1000) as any;
  };

  const endHug = () => {
    setIsHoldingHug(false);
    if (hugIntervalRef.current) {
      clearInterval(hugIntervalRef.current);
      hugIntervalRef.current = null;
    }
  };

  const getForgiveFace = () => {
    if (forgiveValue < 30) return "🥺 (Still pouty but cute)";
    if (forgiveValue < 65) return "😏 (Thinking about it)";
    if (forgiveValue < 90) return "🥰 (Almost won over!)";
    return "👩‍❤️‍👨 (Limitless Love!)";
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 text-glass-deep">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-rose-100/65 text-rose-800 rounded-full px-3 py-1 text-xs font-bold tracking-wider border border-white/50">
          <ShieldAlert size={12} /> THE FORGIVENESS & HUG GATE
        </span>
        <h2 className="text-2xl font-serif italic text-glass-deep mt-2">
          Apology & Long Distance Snuggles
        </h2>
        <p className="text-xs text-rose-800/80 max-w-sm mx-auto mt-1 leading-relaxed">
          I am so incredibly sorry that I cannot be right beside you today to blow your 21st candles physically. I miss you. Here is an interactive space where we can connect and feel close!
        </p>
      </div>

      {/* apology statement with Glass Panel */}
      <div className="glass-card rounded-3xl p-5 mb-6 leading-relaxed relative text-glass-deep">
        <div className="absolute top-3 right-3 text-2xl">🥺</div>
        <h4 className="font-serif italic font-bold text-glass-deep text-sm mb-1.5 uppercase tracking-wider">
          My letter of sorry
        </h4>
        <p className="text-xs text-rose-900/90 leading-relaxed mb-2.5">
          "Sometimes miles separate us, and sometimes I make silly mistakes that might irritate my princess or make you feel lonely. Please remember that you are my entire focus. If I've ever made you sad, I promise to spend all my energy making it up to you starting right now. Happy 21st Birthday, my world!"
        </p>
      </div>

      {/* --- HOLD TO HUG ENGINE with soft background pulse --- */}
      <div className="relative overflow-hidden bg-rose-500/20 backdrop-blur-md border border-white/45 rounded-3xl p-5.5 text-glass-deep text-center shadow-xl mb-6">
        {/* Soft background pulse */}
        {isHoldingHug && (
          <div className="absolute inset-0 bg-rose-450/30 animate-pulse"></div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <Heart size={38} className={`text-rose-550 mb-2 ${isHoldingHug ? "animate-pulse fill-rose-300 scale-110 text-rose-600" : ""}`} />
          <h4 className="text-sm font-bold text-[#5D2E46] tracking-widest uppercase">
            Interactive Hug Transceiver
          </h4>
          <p className="text-[10px] text-rose-900/80 mt-1 max-w-xs leading-normal">
            Hold the big pink button down on your screen. It will vibrate your phone and lock our hearts together across standard distance. Let's hug!
          </p>

          <div className="my-5 flex flex-col items-center">
            {/* The hold trigger */}
            <button
              onMouseDown={startHug}
              onMouseUp={endHug}
              onMouseLeave={endHug}
              onTouchStart={(e) => { e.preventDefault(); startHug(); }}
              onTouchEnd={endHug}
              className={`w-28 h-28 rounded-full border-4 border-white/60 flex items-center justify-center font-bold select-none text-xs transition-all tracking-widest ${
                isHoldingHug 
                  ? "bg-rose-500 text-white scale-95 shadow-inner border-rose-300" 
                  : "bg-white/40 hover:bg-white/60 text-glass-deep shadow-xl hover:scale-103"
              }`}
            >
              {isHoldingHug ? "SNUGGLING..." : "PRESS & HOLD"}
            </button>
            <div className="text-xs font-mono font-bold mt-3 text-rose-800">
              {hugSeconds > 0 ? `Cumulative warm snuggle: ${hugSeconds}s 🧸` : "Waiting for contact..."}
            </div>
          </div>
        </div>
      </div>

      {/* --- PLAYFUL FORGIVENESS SLIDER --- */}
      <div className="glass-card rounded-3xl p-5 mb-6 text-glass-deep">
        <h4 className="font-bold text-glass-deep text-xs uppercase tracking-wider mb-1">
          The Grudge-o-Meter
        </h4>
        <p className="text-[10px] text-rose-900/75 mb-4">
          Drag the heart to set your current mood towards me.
        </p>

        <div className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center text-xs font-bold text-glass-deep font-serif mb-1.5">
            <span>Our Status:</span>
            <span className="bg-white/40 border border-white/50 px-3 py-0.5 rounded-full text-[10px]">
              {getForgiveFace()}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={forgiveValue}
            onChange={(e) => {
              const val = Number(e.target.value);
              setForgiveValue(val);
              if (val % 10 === 0) triggerHeartbeat();
            }}
            className="w-full h-2.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-rose-500 border border-white/40"
          />

          <div className="flex justify-between text-[9px] text-rose-800/70 uppercase tracking-widest font-mono mt-1">
            <span>Puffy face 🥺</span>
            <span>Completely fine 🥰</span>
          </div>
        </div>
      </div>
    </div>
  );
};

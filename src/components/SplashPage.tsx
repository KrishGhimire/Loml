import React, { useState, useEffect } from "react";
import { Gift, Heart, Sparkles, Clock } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";

interface SplashPageProps {
  onUnlock: () => void;
  birthdayUrl: string;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onUnlock, birthdayUrl }) => {
  const { triggerSparkle, playTrack, triggerHeartbeat } = useRomanticAudio();
  const [tapCount, setTapCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  // Create floating background hearts
  useEffect(() => {
    const hearts = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 18 + 12
    }));
    setFloatingHearts(hearts);
  }, []);

  const handlePresentTap = () => {
    if (unlocked) return;
    
    // Tap response
    triggerHeartbeat();
    setShaking(true);
    setTimeout(() => setShaking(false), 300);

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount >= 3) {
      setUnlocked(true);
      triggerSparkle();
      // Start happy birthday melody instantly!
      playTrack("birthday");
      
      setTimeout(() => {
        onUnlock();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 mesh-gradient flex flex-col items-center justify-center text-glass-deep p-6 font-sans overflow-hidden">
      
      {/* Floating Hearts Animation */}
      {floatingHearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute text-rose-400/25 animate-bounce cursor-pointer pointer-events-none fill-rose-300/15"
          style={{
            bottom: "-30px",
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animation: `floatUp ${h.delay + 6}s infinite linear`,
            animationDelay: `${h.delay}s`
          }}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes shake {
          0%, 100% { transform: scale(1) rotate(0deg); }
          20%, 60% { transform: scale(1.1) rotate(-8deg); }
          40%, 80% { transform: scale(1.1) rotate(8deg); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}} />

      {/* Hero Card with Glass Styling */}
      <div className="w-full max-w-sm glass-card rounded-3xl p-6 text-center flex flex-col items-center relative z-10 transition-all duration-1000 transform">
        <div className="absolute -top-12 bg-gradient-to-tr from-rose-400 to-pink-500 p-3.5 rounded-full shadow-lg shadow-rose-300/30 border-2 border-white">
          <Heart className="text-white animate-pulse fill-current" size={26} />
        </div>

        <div className="mt-6 mb-2">
          <span className="bg-rose-200/50 text-rose-800 font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-rose-300/40">
            For My Beautiful Girlfriend
          </span>
        </div>

        <h1 className="text-3xl font-serif italic mb-2 tracking-tight text-glass-deep leading-tight">
          Happy 21st Birthday
        </h1>
        <p className="text-rose-700/80 text-xs mt-1.5 font-medium italic">
          "The world became twice as beautiful 21 years ago today."
        </p>

        {/* Hero image created by tool */}
        <div className="my-5 w-44 h-44 rounded-full border-2 border-white/60 overflow-hidden shadow-xl shadow-rose-200/40 relative">
          <img
            src={birthdayUrl}
            alt="My Sweetheart Couple Chibi"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-100/20 to-transparent"></div>
        </div>

        {/* Instructions */}
        <p className="text-xs text-rose-900/90 max-w-xs leading-relaxed px-2">
          {unlocked 
            ? "Opening your special world... ✨🗝️" 
            : `Tap the surprise gift box 3 times to unwrap the love! (${3 - tapCount} left)`}
        </p>

        {/* Present Box */}
        <div className="my-5 relative cursor-pointer" onClick={handlePresentTap} id="giftbox-interactive">
          <div className={`transition-all duration-300 ${shaking ? "animate-shake" : ""} ${unlocked ? "scale-125 opacity-0 duration-700" : "hover:scale-105"}`}>
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-6 rounded-3xl shadow-xl shadow-rose-200/50 border border-white/40 relative">
              {/* Gold Ribbon Lines wrapped */}
              <div className="absolute inset-y-0 left-1/2 w-4 bg-amber-300 -translate-x-1/2"></div>
              <div className="absolute inset-x-0 top-1/2 h-4 bg-amber-300 -translate-y-1/2"></div>
              <Gift className="text-white relative z-10" size={56} />
            </div>
            
            {/* Soft shadow */}
            <div className="w-24 h-3 bg-rose-900/10 rounded-full blur-sm mx-auto mt-2"></div>
          </div>

          {unlocked && (
            <div className="absolute inset-0 flex items-center justify-center text-pink-500 animate-ping">
              <Sparkles size={64} />
            </div>
          )}
        </div>

        {/* Info footer */}
        <div className="text-[10px] text-rose-800/60 mt-1 flex items-center gap-1">
          <Clock size={10} /> Created with endless love & passion
        </div>
      </div>
    </div>
  );
};

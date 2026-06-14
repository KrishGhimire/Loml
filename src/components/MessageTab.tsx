import React, { useState, useEffect } from "react";
import { Mail, Sparkles, Heart, FileText, Gift } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";

export const MessageTab: React.FC = () => {
  const { triggerSparkle, triggerHeartbeat } = useRomanticAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [rubProgress, setRubProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  
  // Daily compliments list
  const compliments = [
    "Because of the adorable little squeak you make when you are surprised 🧸",
    "Because your cozy hand fits absolutely perfectly inside mine, like we were cast from the same mold 👩‍❤️‍👨",
    "Because of how deeply you care for people, you have the biggest heart in the whole universe 🌎💖",
    "Because you look so absolutely cute and gorgeous even when you are just waking up bedraggled 👑",
    "Because you make me want to be the best possible version of myself every single day 🌟",
    "Because the sound of your pure laughter is my ultimate favorite song in this life 🎶"
  ];
  
  const [activeCompliment, setActiveCompliment] = useState(compliments[0]);

  const handleOpenLetter = () => {
    triggerHeartbeat();
    setIsOpen(!isOpen);
  };

  const handleRub = () => {
    if (revealed) return;
    triggerSparkle();
    const nextProgress = rubProgress + 12;
    setRubProgress(nextProgress);
    if (nextProgress >= 100) {
      setRevealed(true);
      triggerHeartbeat();
    }
  };

  const generateCompliment = () => {
    triggerSparkle();
    const currentIndex = compliments.indexOf(activeCompliment);
    let nextIndex = Math.floor(Math.random() * compliments.length);
    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % compliments.length;
    }
    setActiveCompliment(compliments[nextIndex]);
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 text-glass-deep">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-rose-100/65 text-rose-800 rounded-full px-3 py-1 text-xs font-bold tracking-wider border border-white/50">
          <Mail size={12} /> THE SECRET POSTBOX
        </span>
        <h2 className="text-2xl font-serif italic text-glass-deep mt-2">
          My Message To You
        </h2>
        <p className="text-xs text-rose-800/80 max-w-xs mx-auto mt-1 leading-relaxed">
          A physical virtual envelope carrying a deeply romantic message, plus a scratch card and sweet compliments just for you. Tap the heart seal to open it!
        </p>
      </div>

      {/* Interactive Envelope Wrapper */}
      <div className="flex flex-col items-center select-none">
        
        {/* Envelope Widget with Frosted Glass look */}
        <div 
          onClick={handleOpenLetter} 
          className="relative w-full max-w-xs aspect-[1.3/1] bg-white/45 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-103"
          id="envelope-visual-interactive"
        >
          {/* Triangular flap cover */}
          <div 
            className={`absolute top-0 inset-x-0 h-1/2 bg-white/50 border-b border-white/55 rounded-t-2xl origin-top transition-transform duration-500 z-20 ${
              isOpen ? "-rotate-x-180 -translate-y-full" : "rotate-x-0"
            }`}
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          ></div>

          {/* Sealed heart button */}
          {!isOpen ? (
            <div className="absolute bg-rose-500 border-2 border-white rounded-full p-2.5 shadow-lg flex items-center justify-center z-30 transition-transform active:scale-90 hover:scale-110 animate-bounce">
              <Heart size={20} className="text-white fill-current" />
            </div>
          ) : null}

          <div className="text-center p-4">
            <span className="text-[10px] font-bold tracking-widest text-[#5D2E46] uppercase block mb-1">
              To: My Birthday Girl 👑
            </span>
            <p className="text-xs font-serif text-rose-800 font-semibold italic">
              "Tap me to reveal your 21st wish..."
            </p>
          </div>
        </div>

        {/* --- THE LETTER SHEET --- */}
        {isOpen && (
          <div className="w-full glass-card p-5.5 rounded-3xl mt-5 animate-in slide-in-from-top-6 duration-500 text-glass-deep">
            {/* Cute letter header */}
            <div className="flex justify-between items-center border-b border-dashed border-rose-300/60 pb-3 mb-4">
              <span className="text-[10px] font-mono font-semibold text-rose-800/70">Date: Today, June 14</span>
              <FileText size={16} className="text-rose-400" />
            </div>

            {/* Letter Content */}
            <div className="font-serif text-glass-deep text-xs italic space-y-3 leading-relaxed">
              <h4 className="text-sm font-bold text-glass-deep non-italic uppercase tracking-wide">
                My Dearest Sweetheart,
              </h4>
              <p>
                Today marks 21 incredible years since your beautiful soul entered this world. How incredibly lucky I am to be a part of your life right now! I wish I could hold you close and celebrate with you today, but even with the space between us, my soul is right beside yours, singing your praises.
              </p>
              <p>
                You are my comfort, my favorite gossip buddy, my safe warm home, and the girl I dream of spending all my tomorrows with. I admire your sweet strength, your dazzling style, and your beautiful laughter. Happy 21st birthday, my Princess! Let this day be as perfect, kind, and gorgeous as you are.
              </p>
              <p className="font-sans text-right text-[11px] font-bold text-rose-600 mt-4 not-italic uppercase tracking-widest leading-none">
                Forever & Always, Yours ❤️
              </p>
            </div>

            {/* --- RUB SCRATCH TO REVEAL KEY --- */}
            <div className="mt-6 border-t border-dashed border-rose-300/60 pt-4">
              <h5 className="text-[10px] font-bold text-rose-850 uppercase tracking-widest mb-2 flex items-center gap-1 justify-center">
                <Sparkles size={11} className="text-rose-450" /> Swipe/Tap to scratch my secret wish
              </h5>

              <div 
                onClick={handleRub}
                className="relative w-full h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border border-white/40 cursor-pointer text-center"
              >
                {/* Underneath Message */}
                <span className="absolute text-xs font-bold text-[#5D2E46] px-3 z-10 leading-snug font-serif italic">
                  "I promise to give you 21 kisses when we meet! 💋🌹"
                </span>

                {/* Rub Cover */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center p-3 font-sans text-[10px] text-white font-bold tracking-widest transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    opacity: revealed ? 0 : 1,
                    clipPath: `inset(0 ${rubProgress}% 0 0)` // Erase-away visual clip path
                  }}
                >
                  TAP/RUB REVEAL 🎟️
                </div>
              </div>
              <p className="text-[9px] text-center text-rose-800/70 mt-1 font-mono">
                {revealed ? "Secret wish unlocked! 💖" : `Rub status: ${rubProgress}% cleared`}
              </p>
            </div>

            {/* --- COMPLIMENT MACHINE --- */}
            <div className="mt-5 bg-white/20 backdrop-blur-xs border border-white/45 rounded-2xl p-4 text-center">
              <span className="text-[9.5px] uppercase font-bold tracking-widest text-rose-700 block mb-1">
                Quick Compliment Machine
              </span>
              <p className="text-xs text-glass-deep italic font-serif leading-relaxed px-1 my-2">
                "{activeCompliment}"
              </p>
              
              <button
                onClick={generateCompliment}
                className="mt-1 bg-white/40 hover:bg-white/60 border border-white/50 text-rose-800 font-bold text-[10px] px-3.5 py-1.5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all uppercase tracking-wider"
                id="btn-compliment"
              >
                Choose Another Reason 💌
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

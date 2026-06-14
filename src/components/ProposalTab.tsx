import React, { useState } from "react";
import { Heart, Sparkles, Award, ShieldCheck, PenTool } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";

export const ProposalTab: React.FC = () => {
  const { triggerSparkle, triggerHeartbeat, playTrack } = useRomanticAudio();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: "50%", left: "60%" });
  const [signature, setSignature] = useState("");
  const [contractSealed, setContractSealed] = useState(false);

  // Floating hearts array once agreed
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; delay: number }[]>([]);

  // Simple fleeing mechanic for the "No" button
  const handleNoInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    triggerHeartbeat();

    // Randomize position in a safe viewport rectangle (usually 20% to 80% range)
    const randomTop = 15 + Math.random() * 65;
    const randomLeft = 10 + Math.random() * 50;

    setNoPosition({
      top: `${randomTop}%`,
      left: `${randomLeft}%`
    });

    // Quick floating notice
    const tips = ["Nope! Option unavailable. 😉", "Try again! 😜", "Access denied! 🔒", "Error 404: Option Not Found ❌"];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    const tipDiv = document.createElement("div");
    tipDiv.innerText = randomTip;
    tipDiv.className = "fixed bg-black/80 text-white text-[10px] px-2.5 py-1 rounded-full z-50 pointer-events-none shadow font-mono font-bold uppercase tracking-wider";
    
    // Position near the touch/mouse position
    let clientX = 150;
    let clientY = 300;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    tipDiv.style.left = `${clientX}px`;
    tipDiv.style.top = `${clientY - 30}px`;
    document.body.appendChild(tipDiv);
    setTimeout(() => tipDiv.remove(), 1200);
  };

  const handleYes = () => {
    triggerSparkle();
    triggerHeartbeat();
    playTrack("birthday"); // Play cheerful birthday synth chime
    setHasAgreed(true);

    // Create fireworks effects! Generate 30 custom floating hearts
    const heartList = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 15 + Math.random() * 25,
      delay: Math.random() * 4
    }));
    setHearts(heartList);
  };

  const handleSeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) return;
    triggerSparkle();
    setContractSealed(true);
    localStorage.setItem("relationship_proposal_signature", signature);
    localStorage.setItem("relationship_proposal_sealed_date", new Date().toLocaleDateString());
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 relative min-h-[480px] text-glass-deep">
      
      {/* Floating Sparkle/Heart Overlay on Success */}
      {hasAgreed && hearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute text-rose-500 fill-rose-300/80 animate-bounce pointer-events-none z-40"
          style={{
            bottom: "-40px",
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animation: `floatUpFast ${h.delay + 3}s infinite linear`,
            animationDelay: `${h.delay}s`
          }}
        />
      ))}

      {/* Styled custom CSS animation for floating results */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUpFast {
          0% { transform: translateY(0) scale(0.6) rotate(0deg); opacity: 0; }
          12% { opacity: 0.9; }
          85% { opacity: 0.8; }
          100% { transform: translateY(-75vh) scale(1.1) rotate(270deg); opacity: 0; }
        }
      `}} />

      {/* BEFORE VALUE: THE QUESTION SCREEN */}
      {!hasAgreed ? (
        <div className="text-center flex flex-col items-center justify-center min-h-[400px]">
          
          <div className="relative mb-5 flex items-center justify-center">
            {/* Animated pulsing red glowing halo */}
            <div className="absolute w-24 h-24 rounded-full bg-rose-500/10 filter blur-xl animate-ping" style={{ animationDuration: "2s" }}></div>
            <Heart size={48} className="text-rose-600 fill-rose-500 relative z-10 animate-pulse" />
          </div>

          <h1 className="text-2xl font-serif italic text-glass-deep leading-tight font-bold px-4 tracking-tight">
            Will you be with me for the rest of your life & let me be in yours?
          </h1>
          
          <p className="text-xs text-rose-800/80 max-w-sm mt-3.5 px-6 leading-relaxed italic">
            "No space is too wide, no road is too long, and no glitch is too stubborn for what I feel for you. Choose below my love..."
          </p>

          {/* Interactive Buttons Container */}
          <div className="relative w-full overflow-hidden">
            
            {/* YES BUTTON (LARGE, HEART PULSE) */}
            <button
              onClick={handleYes}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-44 py-5 bg-rose-500 text-white font-extrabold rounded-full text-base tracking-widest shadow-xl shadow-rose-250 animate-pulse active:scale-95 transition-transform hover:scale-105 z-10 uppercase inline-flex items-center justify-center gap-1.5"
              id="proposal-yes-btn"
            >
              <Heart size={18} className="fill-current text-white animate-bounce" /> YES! FOREVER
            </button>

            {/* NO BUTTON (TELEPORTS ON TAP/HOVER) */}
            <button
              onMouseEnter={handleNoInteraction}
              onTouchStart={handleNoInteraction}
              onClick={handleNoInteraction}
              className="absolute py-2 px-5 bg-white/40 hover:bg-white/65 text-rose-800/80 font-bold border border-white/50 rounded-full text-xs shadow-sm transition-all duration-150 cursor-pointer select-none pointer-events-auto"
              style={{
                top: noPosition.top,
                left: noPosition.left,
                transform: "translateX(-50%)"
              }}
              id="proposal-no-btn"
            >
              No 🥺
            </button>

          </div>

          <p className="text-[10px] text-rose-850 font-mono mt-2">
            Tip: Choose very carefully! 😜
          </p>
        </div>
      ) : (
        /* AFTER VALUE: THE LIFE COMPANIONS CONTRACT */
        <div className="glass-card rounded-3xl p-5.5 border-4 border-double border-rose-300/60 text-center animate-in zoom-in-95 duration-500 text-glass-deep">
          
          <div className="w-14 h-14 rounded-full bg-emerald-100/60 border-2 border-emerald-300 flex items-center justify-center mx-auto mb-3.5 shadow-md">
            <Award className="text-emerald-600 fill-emerald-100 animate-pulse" size={24} />
          </div>

          <h2 className="text-xl font-serif italic text-glass-deep leading-tight font-bold">
            IT IS ENTIRELY OFFICIAL! 🏆👑
          </h2>
          <p className="text-xs text-rose-700 mt-1 uppercase tracking-widest font-bold">
            Companion of a Lifetime
          </p>

          <div className="bg-white/20 border border-white/40 p-4 rounded-2xl text-left text-glass-deep italic text-xs leading-relaxed my-5 font-serif space-y-2.5">
            <p className="font-bold text-[#5D2E46] not-italic text-center uppercase tracking-wider text-[11px]">
              📜 COMPANY AGREEMENT
            </p>
            <p>
              "By sealing this scroll, you, the Birthday Girl, claim one full lifetime supply of sweet forehead kisses, warm protective hugs, late-night tea gossip, and custom love reminders."
            </p>
            <p>
              "The signatory is hereby exempt from all lonely times and is strictly declared the absolute princess of my present and all my beautiful futures."
            </p>
          </div>

          {/* Signature scroll */}
          {!contractSealed ? (
            <form onSubmit={handleSeal} className="flex flex-col gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-rose-800/80 uppercase text-left mb-1">
                  Type your precious signature name here:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Signature of Princess..."
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep focus:outline-none focus:border-rose-450 italic font-serif"
                  />
                  <PenTool className="absolute left-3 top-3.5 text-rose-800/65" size={13} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-250 active:scale-95 transition-all uppercase tracking-widest"
                id="btn-seal-contract"
              >
                Seal with a Kiss 💋
              </button>
            </form>
          ) : (
            <div className="bg-emerald-100/65 border border-white/40 rounded-2xl p-4 text-emerald-800 font-bold italic text-xs text-center flex flex-col items-center">
              <ShieldCheck size={26} className="text-emerald-555 mb-1" />
              <p className="font-serif">"Contract Signed as '{signature}'"</p>
              <span className="text-[10px] font-mono uppercase font-semibold text-emerald-700 block mt-1 tracking-wider">
                Successfully Registered in My Heart 💖
              </span>
            </div>
          )}

          <div className="mt-5 text-[10px] text-rose-700/80 font-mono tracking-wide">
            "No refunds or cancellations allowed forever!" 😉
          </div>
        </div>
      )}

    </div>
  );
};

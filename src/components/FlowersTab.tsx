import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Droplet, Check, Info } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";
import { Flower } from "../types";

export const FlowersTab: React.FC = () => {
  const { triggerSparkle, triggerHeartbeat } = useRomanticAudio();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [activeFlower, setActiveFlower] = useState<string | null>(null);
  const [isWatering, setIsWatering] = useState<string | null>(null);

  const defaultFlowers: Flower[] = [
    {
      id: "purple_tulip",
      name: "Purple Tulips",
      meaning: "Deep admiration, sweet royalty & absolute adoration",
      language: "Sanu is my ultimate Princess and lifetime love",
      description: "Just like fresh majestic blooming Purple Tulips, my love for you is deep, royal, and full of respect. It reaches out across all miles to wrap around you on your special 21st Birthday.",
      emoji: "🌷",
      color: "bg-purple-600 text-purple-600 ring-purple-300 border-purple-400",
      bloomPercent: 40
    },
    {
      id: "lavender",
      name: "Soothing Lavender",
      meaning: "Grace, peace, and ultimate devotion",
      language: "Your presence is my safe sanctuary",
      description: "Whenever I hear your calming voice, all my anxieties completely dissolve. You are like rare sweet lavender — peaceful, soothing, and incredibly elegant.",
      emoji: "🪻",
      color: "bg-purple-500 text-purple-500 ring-purple-300 border-purple-400",
      bloomPercent: 60
    },
    {
      id: "sunflower",
      name: "Golden Sunflower",
      meaning: "Loyalty, warmth & absolute happiness",
      language: "You are my ultimate direct sunshine",
      description: "You shine so incredibly bright. Your adorable laugh has the unique power to fill any cold room with instant happiness, loyalty, and sunshine.",
      emoji: "🌻",
      color: "bg-amber-400 text-amber-500 ring-amber-200 border-amber-300",
      bloomPercent: 50
    },
    {
      id: "tulip",
      name: "Cozy Pink Tulip",
      meaning: "Deep affection, perfect care & connection",
      language: "Our hearts beat in perfect sync",
      description: "Pink tulips stand for pure, warm care and close attachment. Every little sweet message you send, every cozy call, makes my soul bloom with gentle pink warmth.",
      emoji: "🌷",
      color: "bg-pink-400 text-pink-500 ring-pink-200 border-pink-300",
      bloomPercent: 30
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("girlfriend_flowers_sanu");
    if (saved) {
      try {
        setFlowers(JSON.parse(saved));
      } catch (e) {
        setFlowers(defaultFlowers);
      }
    } else {
      setFlowers(defaultFlowers);
      localStorage.setItem("girlfriend_flowers_sanu", JSON.stringify(defaultFlowers));
    }
    // Set default active
    setActiveFlower("purple_tulip");
  }, []);

  const handleWater = (id: string) => {
    if (isWatering) return;
    
    setIsWatering(id);
    triggerHeartbeat();

    // Custom water splash particles
    const interval = setInterval(() => {
      triggerSparkle();
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsWatering(null);

      const updated = flowers.map(f => {
        if (f.id === id) {
          const nextBloom = Math.min(f.bloomPercent + 15, 100);
          if (nextBloom === 100 && f.bloomPercent < 100) {
            // Celebrate flower completion!
            triggerSparkle();
            setTimeout(() => {
              alert(`🎉 Yay! Your ${f.name} has blossomed in full romantic glory! check below for my special card 💌`);
            }, 300);
          }
          return { ...f, bloomPercent: nextBloom };
        }
        return f;
      });

      setFlowers(updated);
      localStorage.setItem("girlfriend_flowers", JSON.stringify(updated));
    }, 1200);
  };

  const currentFlower = flowers.find(f => f.id === activeFlower);

  const handleResetFlowers = () => {
    triggerSparkle();
    const reset = defaultFlowers.map(f => ({ ...f, bloomPercent: 20 + Math.floor(Math.random() * 20) }));
    setFlowers(reset);
    localStorage.setItem("girlfriend_flowers", JSON.stringify(reset));
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 text-glass-deep">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-rose-100/65 text-rose-800 rounded-full px-3 py-1 text-xs font-bold tracking-wider border border-white/50">
          <Heart size={12} className="fill-current" /> FLORAL BOUTIQUE OF LOVE
        </span>
        <h2 className="text-2xl font-serif italic text-glass-deep mt-2">
          Flowers That Remind Me Of You
        </h2>
        <p className="text-xs text-rose-800/80 max-w-sm mx-auto mt-1 leading-relaxed">
          Every petal reflects a beautiful trait of yours. Pour cute magical droplets of water on these seeds to watch them bloom fully before your eyes!
        </p>
      </div>

      {/* Flower Selector / Pot Grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {flowers.map((f) => {
          const isSelected = activeFlower === f.id;
          const isFullyBloomed = f.bloomPercent >= 100;
          return (
            <button
              key={f.id}
              onClick={() => {
                triggerSparkle();
                setActiveFlower(f.id);
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all outline-none border ${
                isSelected 
                  ? "bg-white/85 border-rose-300 scale-102 ring-2 ring-rose-200 shadow-sm" 
                  : "bg-white/30 border-white/40 hover:bg-white/45"
              }`}
              id={`flower-pot-${f.id}`}
            >
              {/* Dynamic Growing Icon */}
              <div 
                className="w-12 h-12 rounded-full bg-white/40 border border-white/50 flex items-center justify-center relative transition-transform"
                style={{
                  transform: isWatering === f.id ? "translateY(4px)" : "none"
                }}
              >
                {/* Seed pot to plant transitions */}
                {f.bloomPercent < 40 ? (
                  <span className="text-lg opacity-40">🌱</span>
                ) : f.bloomPercent < 75 ? (
                  <span className="text-xl">🌿</span>
                ) : (
                  <span className="text-2xl animate-pulse" style={{ animationDuration: "1.5s" }}>{f.emoji}</span>
                )}

                {isFullyBloomed && (
                  <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white shadow-sm">
                    <Check size={8} strokeWidth={4} />
                  </div>
                )}
              </div>

              {/* Little Progress Dot */}
              <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden border border-white/30">
                <div 
                  className={`h-full bg-rose-450 rounded-full transition-all duration-500`}
                  style={{ width: `${f.bloomPercent}%` }}
                ></div>
              </div>

              <span className="text-[9px] font-bold text-rose-800 tracking-tight text-center truncate w-full">
                {f.name.split(" ")[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Flower Interactive Area with Glass Panel */}
      {currentFlower && (
        <div className="glass-card rounded-3xl p-5 relative overflow-hidden flex flex-col items-center text-center text-glass-deep">
          
          {/* Flower Visual representation */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Soft pulsing halo background */}
            <div 
              className={`absolute inset-4 rounded-full bg-white/40 filter blur-xl transition-all duration-1000 ${
                currentFlower.bloomPercent >= 100 ? "scale-125 opacity-100" : "scale-75 opacity-60"
              }`}
            ></div>

            {/* Dynamic Sized Emoji mimicking bloom scale */}
            <div 
              className="text-8xl relative z-10 select-none transition-all duration-[800ms]"
              style={{
                transform: `scale(${0.35 + (currentFlower.bloomPercent / 100) * 0.65})`,
                filter: currentFlower.bloomPercent < 100 ? "grayscale(40%)" : "none"
              }}
            >
              {currentFlower.emoji}
            </div>

            {/* Watering can & droplets animation */}
            {isWatering === currentFlower.id && (
              <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-start pt-2">
                <Droplet className="text-sky-500 fill-sky-200 animate-bounce" size={28} />
                <div className="text-[10px] font-bold text-sky-650 mt-1 uppercase tracking-widest animate-pulse">
                  SPLASH! 💦
                </div>
              </div>
            )}
          </div>

          <p className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">
            {currentFlower.bloomPercent}% BLOSSOMED
          </p>
          <h3 className="text-xl font-bold font-serif text-glass-deep mt-1">
            {currentFlower.name}
          </h3>
          <p className="text-xs text-rose-900/80 font-medium italic mt-0.5">
            "{currentFlower.meaning}"
          </p>

          {/* Special language box with soft glass layer */}
          <div className="my-3 bg-white/30 border border-white/40 px-4 py-2 rounded-2xl w-full">
            <span className="text-[9px] uppercase tracking-wider text-rose-800 font-bold block mb-0.5">
              Secret language of flowers
            </span>
            <p className="text-xs font-bold text-glass-deep">
              {currentFlower.language}
            </p>
          </div>

          {/* Letter description inside flower in a soft glass box */}
          <div className="w-full text-left mt-1 text-glass-deep/95 bg-white/20 p-4 rounded-2xl text-xs leading-relaxed border border-white/40 flex gap-2">
            <Info size={16} className="text-rose-450 flex-shrink-0 mt-0.5" />
            <p>{currentFlower.description}</p>
          </div>

          {/* Watering clicker button */}
          <button
            onClick={() => handleWater(currentFlower.id)}
            disabled={currentFlower.bloomPercent >= 100 || isWatering !== null}
            className={`w-full mt-4 py-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all ${
              currentFlower.bloomPercent >= 100 
                ? "bg-emerald-100/60 text-emerald-800 border border-white/40 cursor-default" 
                : "bg-rose-500 hover:bg-rose-600 text-white font-black hover:scale-101 hover:shadow-lg active:scale-99"
            }`}
            id="water-button-interactive"
          >
            {currentFlower.bloomPercent >= 100 ? (
              <>
                <Check size={14} /> Fully Grown With Love
              </>
            ) : (
              <>
                <Droplet size={14} className="fill-white" /> Water Flower (+15% grow)
              </>
            )}
          </button>
        </div>
      )}

      {/* Reset Flowers option */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleResetFlowers}
          className="text-[10px] text-rose-700/80 hover:text-rose-800 underline font-mono flex items-center gap-1"
          id="btn-re-water"
        >
          Want to re-water flowers? Reset garden 🌱
        </button>
      </div>
    </div>
  );
};

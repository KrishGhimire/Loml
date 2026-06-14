/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Clock, 
  Disc, 
  Camera, 
  Flower2, 
  Mail, 
  ShieldAlert, 
  HelpCircle,
  Sparkles
} from "lucide-react";

// Context providers
import { AudioProvider, AudioController, useRomanticAudio } from "./components/AudioPlayer";

// Tabs / Sections
import { SplashPage } from "./components/SplashPage";
import { TimeTab } from "./components/TimeTab";
import { SongsTab } from "./components/SongsTab";
import { PhotosTab } from "./components/PhotosTab";
import { FlowersTab } from "./components/FlowersTab";
import { MessageTab } from "./components/MessageTab";
import { ApologyTab } from "./components/ApologyTab";
import { ProposalTab } from "./components/ProposalTab";
import HERO_IMAGE_PATH from "./assets/images/IMG_0203.jpeg";

// Master application layout
function AppContent() {
  const { triggerSparkle, playTrack, isPlaying } = useRomanticAudio();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"time" | "songs" | "photos" | "flowers" | "message" | "apology" | "proposal">("time");
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  // Create subtle romantic floating hearts on the primary application board
  useEffect(() => {
    const heartList = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      size: Math.random() * 12 + 8
    }));
    setFloatingHearts(heartList);
  }, []);

  const handleTabChange = (tabId: typeof activeTab) => {
    triggerSparkle();
    setActiveTab(tabId);
  };

  if (!isUnlocked) {
    return (
      <SplashPage 
        birthdayUrl={HERO_IMAGE_PATH} 
        onUnlock={() => setIsUnlocked(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-0 md:p-6 font-sans relative overflow-x-hidden text-glass-deep">
      <div className="min-h-screen overflow-x-hidden"></div> 
      {/* Absolute background floating love particles */}
      {floatingHearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute text-rose-400/10 pointer-events-none fill-rose-400/5"
          style={{
            bottom: "-20px",
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animation: `floatUpApp ${h.delay + 6}s infinite linear`,
            animationDelay: `${h.delay}s`
          }}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUpApp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateY(-105vh) rotate(360deg); opacity: 0; }
        }
      `}} />

      {/* Controller for synthesised audio playlists */}
      <AudioController />

      {/* Glassmorphic Smartphone Container Frame */}
      <div className="w-full max-w-md h-[100dvh] md:h-[820px] bg-white/40 backdrop-blur-lg shadow-2xl border-0 md:border-8 border-rose-950/25 md:rounded-[42px] flex flex-col justify-between overflow-hidden relative">
       
        {/* Top Notch/Speaker visual bar for simulator look on desktops */}
        <div className="hidden md:flex h-6 bg-rose-100/10 w-full items-center justify-center pointer-events-none relative z-40 border-b border-rose-200/20">
          <div className="w-28 h-4 bg-neutral-900 rounded-b-xl flex items-center justify-center">
            <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
          </div>
        </div>

        {/* --- HEADER BAR --- */}
        <header className="sticky top-0 bg-white/35 border-b border-white/45 backdrop-blur px-5 py-3.5 z-40 flex justify-between items-center shadow-sm text-glass-deep">
          <div className="flex items-center gap-1.5">
            <span className="text-xl animate-bounce" style={{ animationDuration: "2s" }}>👑</span>
            <div>
              <h1 className="text-sm font-serif italic font-bold text-glass-deep uppercase tracking-wider">
                MY LOVE Surprises
              </h1>
              <p className="text-[10px] font-bold text-rose-800 tracking-wider">
                HAPPY 21st BIRTHDAY! 💖
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-white/45 border border-white/50 rounded-full px-2.5 py-0.5 text-[9px] text-rose-800 font-bold">
            <Sparkles size={8} className="animate-spin text-rose-500" style={{ animationDuration: "6s" }} />
            <span>21 YEARS OLD</span>
          </div>
        </header>

        {/* --- SCROLLABLE WORKSPACE / VIEWPORT --- */}
        <main className="flex-1 overflow-y-scroll bg-transparent relative">
          
          {/* Active section selector view */}
          {activeTab === "time" && <TimeTab />}
          {activeTab === "songs" && <SongsTab />}
          {activeTab === "photos" && <PhotosTab />}
          {activeTab === "flowers" && <FlowersTab />}
          {activeTab === "message" && <MessageTab />}
          {activeTab === "apology" && <ApologyTab />}
          {activeTab === "proposal" && <ProposalTab />}
          
        </main>

        {/* --- DOCK-LIKE BOTTOM APP TRANSIT BAR --- */}
        <nav className="bg-white/45 border-t border-white/50 backdrop-blur pb-4 pt-2.5 px-4 z-40 flex items-center justify-between gap-1">
          
          {/* Time timeline page */}
          <button
            onClick={() => handleTabChange("time")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "time" 
                ? "text-rose-800 bg-white/60 font-bold scale-103 shadow-xs border border-white/40" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-time"
          >
            <Clock size={16} className={activeTab === "time" ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] tracking-tight truncate w-full text-center">Clock</span>
          </button>

          {/* Music record page */}
          <button
            onClick={() => handleTabChange("songs")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "songs" 
                ? "text-rose-800 bg-white/60 font-bold scale-103 shadow-xs border border-white/40" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-songs"
          >
            <Disc size={16} className={activeTab === "songs" ? "animate-spin" : ""} style={{ animationDuration: "5s" }} />
            <span className="text-[9px] tracking-tight truncate w-full text-center">Songs</span>
          </button>

          {/* Album polaroids page */}
          <button
            onClick={() => handleTabChange("photos")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "photos" 
                ? "text-rose-800 bg-white/60 font-bold scale-103 shadow-xs border border-white/40" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-photos"
          >
            <Camera size={16} className={activeTab === "photos" ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] tracking-tight truncate w-full text-center">Snaps</span>
          </button>

          {/* Flowers watering page */}
          <button
            onClick={() => handleTabChange("flowers")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "flowers" 
                ? "text-rose-800 bg-white/60 font-bold scale-103 shadow-xs border border-white/40" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-flowers"
          >
            <Flower2 size={16} className={activeTab === "flowers" ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] tracking-tight truncate w-full text-center">Flora</span>
          </button>

          {/* Scratch envelope letter page */}
          <button
            onClick={() => handleTabChange("message")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "message" 
                ? "text-rose-800 bg-white/60 font-bold scale-103 shadow-xs border border-white/40" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-message"
          >
            <Mail size={16} className={activeTab === "message" ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] tracking-tight truncate w-full text-center">Letter</span>
          </button>

          {/* Distance apology holder page */}
          <button
            onClick={() => handleTabChange("apology")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "apology" 
                ? "text-rose-800 bg-white/60 font-bold scale-103 shadow-xs border border-white/40" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-apology"
          >
            <ShieldAlert size={16} className={activeTab === "apology" ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] tracking-tight truncate w-full text-center">Sorry</span>
          </button>

          {/* Big life proposal tab */}
          <button
            onClick={() => handleTabChange("proposal")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-1 rounded-2xl transition-all ${
              activeTab === "proposal" 
                ? "text-rose-800 bg-rose-200/50 scale-105 font-bold border border-white/60 shadow-xs" 
                : "text-rose-900/60 hover:text-rose-950"
            }`}
            id="nav-tab-proposal"
          >
            <Heart size={16} className={`text-rose-500 fill-current ${activeTab === "proposal" ? "animate-pulse" : ""}`} />
            <span className="text-[9px] tracking-tight truncate w-full text-center font-bold">Proposal</span>
          </button>

        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

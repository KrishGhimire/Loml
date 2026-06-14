import React, { useState, useEffect } from "react";
import { Clock, Calendar, Heart, MapPin, Sparkles, Sliders } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";
import { Milestone } from "../types";

export const TimeTab: React.FC = () => {
  const { triggerSparkle, triggerHeartbeat } = useRomanticAudio();
  const [anniversaryDate, setAnniversaryDate] = useState("2025-10-07T02:00:00");
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [metricMode, setMetricMode] = useState<"standard" | "heartbeats">("standard");

  // Calculate elapsed time from anniversary date
  const calculatePassedTime = () => {
    const start = new Date(anniversaryDate).getTime();
    const now = new Date().getTime();
    let diff = Math.max(0, now - start);

    const msInSec = 1000;
    const msInMin = msInSec * 60;
    const msInHour = msInMin * 60;
    const msInDay = msInHour * 24;

    const days = Math.floor(diff / msInDay);
    const rawDiff = now - start;
    diff %= msInDay;

    const hours = Math.floor(diff / msInHour);
    diff %= msInHour;

    const minutes = Math.floor(diff / msInMin);
    diff %= msInMin;

    const seconds = Math.floor(diff / msInSec);

    return { years: 0, months: 0, days, hours, minutes, seconds, rawDiff };
  };

  useEffect(() => {
    const savedDate = localStorage.getItem("relationship_anniversary");
    let initialDate = anniversaryDate;
    if (savedDate) {
      setAnniversaryDate(savedDate);
      initialDate = savedDate;
    } else {
      localStorage.setItem("relationship_anniversary", anniversaryDate);
    }

    const timer = setInterval(() => {
      setTimePassed(calculatePassedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [anniversaryDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const dateTimeStr = `${val}T19:30:00`;
      setAnniversaryDate(dateTimeStr);
      localStorage.setItem("relationship_anniversary", dateTimeStr);
      triggerSparkle();
    }
  };

  const milestones: Milestone[] = [
    {
      id: "mile_1",
      date: "Sep 29, 2025",
      title: "Long Walk to Milan Chowk 🚶‍♀️🚶‍♂️",
      description: "Our first walk to Milan Chowk. It was a long, joyful, and funny walk. I still remember your pony tail wagging like a pendulum when you were walking towards me!",
      emoji: "💗",
      highlightColor: "bg-amber-100 text-amber-600 border-amber-200"
    },
    {
      id: "mile_2",
      date: "Oct 7, 2025",
      title: "Midnight Confession & 150 Pushups 💬💞",
      description: "We chatted till 2-3am in the morning. This was easily the most memorable moment of my life where I confessed my feelings to you. When you accepted, it felt totally unreal and I still remember doing 150 pushups because I was so nervous! LOL",
      emoji: "🌌",
      highlightColor: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      id: "mile_3",
      date: "Oct 13, 2025",
      title: "Our First Photo (7:04 PM) 🤝🌅",
      description: "Our very first photo together after our relationship started. At exactly 7:04 pm, it was our hand holding photo and silouhette photo.",
      emoji: "📸",
      highlightColor: "bg-rose-100 text-rose-600 border-rose-200"
    },
    {
      id: "mile_4",
      date: "Oct 18, 2025",
      title: "The Mindblowing First Date 👑✨",
      description: "Our first date together! I still remember your beautiful blue-greenish outfit, that cute sky blue headband, and that cute little top. When I saw you, I was absolutely mindblown—easily one of the best moments of my life.",
      emoji: "👗",
      highlightColor: "bg-indigo-100 text-indigo-600 border-indigo-200"
    }
  ];

  const totalRawMs = calculatePassedTime().rawDiff;
  const totalDays = Math.floor(totalRawMs / (1000 * 60 * 60 * 24));
  const estimatedHeartbeats = Math.floor(totalDays * 24 * 60 * 75); // 75 bpm
  const estimatedLaughs = Math.floor(totalDays * 15.5);

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 text-glass-deep">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-rose-100/60 text-rose-800 rounded-full px-3 py-1 text-xs font-bold tracking-wider border border-white/50">
          <Clock size={12} /> THE DURATION OF LOVE
        </span>
        <h2 className="text-2xl font-serif italic text-glass-deep mt-2">
          Our Journey Together
        </h2>
        <p className="text-xs text-rose-800/80 max-w-sm mx-auto mt-1 leading-relaxed">
          A live-ticking clock tracking every heartbeat, second, and smile that we've shared since our magical journey began. Below, relive our milestone chapters!
        </p>
      </div>

      {/* --- LIVE CLOCK PANEL --- */}
      <div className="glass-card rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden mb-6">
        
        {/* Toggle metrics bar */}
        <div className="flex gap-1.5 p-1 bg-white/30 rounded-2xl border border-white/40 mb-4 w-full justify-between">
          <button
            onClick={() => { triggerSparkle(); setMetricMode("standard"); }}
            className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-xl transition-all ${
              metricMode === "standard" ? "bg-rose-400 text-white shadow-sm" : "text-rose-800 hover:bg-white/40"
            }`}
          >
            Clock
          </button>
          <button
            onClick={() => { triggerSparkle(); setMetricMode("heartbeats"); }}
            className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded-xl transition-all ${
              metricMode === "heartbeats" ? "bg-rose-400 text-white shadow-sm" : "text-rose-800 hover:bg-white/40"
            }`}
          >
            Beats
          </button>
        </div>

        {/* CLOCK METRIC DISPLAY MODE CASES */}
        {metricMode === "standard" && (
          <div className="w-full">
            <p className="text-[10px] font-bold text-rose-800/80 uppercase tracking-widest mb-3 flex items-center gap-1 justify-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              Ticking Live Counter
            </p>

            {/* Digit layout */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/30 backdrop-blur-sm p-3.5 rounded-2xl border border-white/40 shadow-sm">
                <span className="text-xl font-extrabold font-mono text-glass-deep block">{timePassed.days}</span>
                <span className="text-[9px] uppercase font-bold text-rose-800/70 font-sans">Days</span>
              </div>
              <div className="bg-white/30 backdrop-blur-sm p-3.5 rounded-2xl border border-white/40 shadow-sm">
                <span className="text-xl font-extrabold font-mono text-glass-deep block">{timePassed.hours}</span>
                <span className="text-[9px] uppercase font-bold text-rose-800/70 font-sans">Hours</span>
              </div>
              <div className="bg-white/30 backdrop-blur-sm p-3.5 rounded-2xl border border-white/40 shadow-sm">
                <span className="text-xl font-extrabold font-mono text-glass-deep block">{timePassed.minutes}</span>
                <span className="text-[9px] uppercase font-bold text-rose-800/70 font-sans">Mins</span>
              </div>
            </div>

            <div className="mt-3.5 font-mono text-xs text-rose-800 font-bold bg-white/40 py-1.5 px-4 rounded-full border border-white/50 inline-block animate-pulse">
              ⏱️ AND {timePassed.seconds} SECONDS!
            </div>
          </div>
        )}

        {metricMode === "heartbeats" && (
          <div>
            <Heart size={28} className="text-rose-500 fill-rose-100 mx-auto mb-2 animate-pulse" />
            <h4 className="text-2xl font-extrabold font-mono text-glass-deep tracking-tight">
              {estimatedHeartbeats.toLocaleString()}
            </h4>
            <p className="text-[10px] uppercase font-medium text-rose-800/80 mt-1 max-w-xs leading-normal">
              Estimated mutual heartbeats synchronized since we joined lives. No space can slow this beat.
            </p>
          </div>
        )}

         {/* Customize date footer option inside Clock */}
        <div className="mt-5 border-t border-dashed border-white/50 pt-3.5 w-full">
          <label className="block text-[9px] font-bold text-rose-800/80 uppercase mb-1">
            Edit anniversary date to match your real story
          </label>
          <input
            type="date"
            value={anniversaryDate.split("T")[0]}
            onChange={handleDateChange}
            className="px-3.5 py-1.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep font-semibold focus:outline-none"
          />
        </div>
      </div>

      {/* --- VERTICAL MILESTONE TIMELINE --- */}
      <div>
        <h3 className="font-serif italic text-glass-deep text-lg mb-1 flex items-center gap-1.5">
          <Calendar size={18} className="text-rose-400" /> Our Cozy Milestones
        </h3>
        <p className="text-[10px] text-rose-800/80 mb-6">
          The stars in our shared sky. Click any card to relive that memory!
        </p>

        {/* Timeline Path */}
        <div className="relative pl-6 border-l-2 border-dashed border-rose-300/60 ml-3 space-y-6 text-left">
          {milestones.map((mil, i) => (
            <div
              key={mil.id}
              onClick={() => { triggerSparkle(); triggerHeartbeat(); }}
              className="relative group cursor-pointer"
              id={`milestone-item-${mil.id}`}
            >
              {/* Outer circle bullet on dashed line */}
              <div className="absolute -left-9.5 top-1.5 w-5 h-5 bg-white border-2 border-rose-300 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 duration-200">
                <Heart size={8} className="text-rose-400 fill-rose-100 animate-pulse" />
              </div>

              {/* Milestone card with glass styling */}
              <div className="glass-card hover:bg-white/60 p-4 rounded-2xl transition-all duration-300 text-glass-deep">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-sans font-bold text-rose-600 uppercase">
                    {mil.date}
                  </span>
                  <span className="text-xs">{mil.emoji}</span>
                </div>
                
                <h4 className="font-bold text-glass-deep text-xs uppercase tracking-tight">
                  {mil.title}
                </h4>
                
                <p className="text-[11px] text-rose-900/80 leading-relaxed font-serif italic mt-1">
                  {mil.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

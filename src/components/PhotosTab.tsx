import React, { useState, useEffect, useRef } from "react";
import { Camera, Heart, Plus, Sparkles, Trash2, HelpCircle } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";
import { Photo } from "../types";

export const PhotosTab: React.FC = () => {
  const { triggerSparkle, triggerHeartbeat } = useRomanticAudio();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("💖");
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const defaultPhotos: Photo[] = [];

  useEffect(() => {
    const saved = localStorage.getItem("girlfriend_photos_sanu");
    const savedLikes = localStorage.getItem("girlfriend_photos_likes");
    
    if (saved) {
      try { setPhotos(JSON.parse(saved)); } catch (e) { setPhotos(defaultPhotos); }
    } else {
      setPhotos(defaultPhotos);
      localStorage.setItem("girlfriend_photos_sanu", JSON.stringify(defaultPhotos));
    }

    if (savedLikes) {
      try { setLikes(JSON.parse(savedLikes)); } catch (e) { setLikes({}); }
    }
  }, []);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHeartbeat();
    const currLikes = likes[id] || 0;
    const updated = { ...likes, [id]: currLikes + 1 };
    setLikes(updated);
    localStorage.setItem("girlfriend_photos_likes", JSON.stringify(updated));

    // Custom heart burst effect on document
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.className = "fixed pointer-events-none text-rose-500 animate-ping z-50 text-xl font-bold font-sans";
    heart.style.left = `${rect.left + 5}px`;
    heart.style.top = `${rect.top - 20}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  };

  const handleFlip = (id: string) => {
    triggerSparkle();
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc || !caption) return;

    const newPhoto: Photo = {
      id: "user_photo_" + Date.now(),
      url: imageSrc,
      caption,
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      emoji: emoji || "💖",
      isUserAdded: true
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    localStorage.setItem("girlfriend_photos", JSON.stringify(updated));

    // reset
    setCaption("");
    setDate("");
    setEmoji("💖");
    setImageSrc(null);
    setShowUpload(false);
    triggerSparkle();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem("girlfriend_photos", JSON.stringify(updated));
    triggerSparkle();
  };

  // Rotating index-based styles to look like messy cozy board
  const getScrapbookCardStyle = (index: number) => {
    const angles = [-3, 2, -1, 3, -2, 1];
    const angle = angles[index % angles.length];
    return {
      transform: `rotate(${angle}deg)`,
    };
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 text-glass-deep">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-rose-100/65 text-rose-800 rounded-full px-3 py-1 text-xs font-bold tracking-wider border border-white/50">
          <Camera size={12} /> PRIVATE SCRAPBOOK
        </span>
        <h2 className="text-2xl font-serif italic text-glass-deep mt-2">
          Daily Memories Wall
        </h2>
        <p className="text-xs text-rose-800/80 max-w-sm mx-auto mt-1 leading-relaxed">
          Our cozy digital board is ready for your beautiful memories! Click "Tape A New Photo" at the bottom to add your favorite snaps of us.
        </p>
      </div>

      {/* Album Grid of Polaroids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {photos.map((photo, index) => {
          const isFlipped = flipped[photo.id] || false;
          const photoLikes = likes[photo.id] || 0;

          return (
            <div
              key={photo.id}
              onClick={() => handleFlip(photo.id)}
              className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
              style={getScrapbookCardStyle(index)}
              id={`polaroid-${photo.id}`}
            >
              {/* Card Container holding Front and Back */}
              <div className={`relative w-full h-full duration-700 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}>
                
                {/* --- FRONT OF POLAROID --- */}
                <div className="absolute inset-0 glass-card p-3 rounded-2xl flex flex-col justify-between backface-hidden">
                  {/* Tape decoration on top of the front */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 border border-white/45 shadow-sm backdrop-blur-sm -rotate-2"></div>

                  {/* Photo Frame */}
                  <div className="w-full aspect-square bg-white/30 overflow-hidden border border-white/40 rounded-xl relative">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 bg-[#5D2E46]/70 text-white text-[10px] px-1.5 py-0.5 rounded-lg backdrop-blur-xs font-mono">
                      {photo.emoji}
                    </div>
                  </div>

                  {/* Polaroid Writing area */}
                  <div className="mt-2.5 flex-1 flex flex-col justify-between">
                    <p className="font-serif italic text-glass-deep text-xs font-bold leading-tight line-clamp-2">
                      {photo.caption}
                    </p>
                    
                    <div className="flex justify-between items-center text-[10px] text-rose-800/80 mt-2">
                      <span className="font-mono font-semibold">{photo.date}</span>
                      
                      <div className="flex items-center gap-1.5">
                        {photo.isUserAdded && (
                          <button
                            onClick={(e) => handleDelete(photo.id, e)}
                            className="p-1 hover:bg-rose-100/50 text-rose-400 hover:text-rose-700 rounded transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleLike(photo.id, e)}
                          className="flex items-center gap-0.5 text-rose-600 font-bold bg-white/40 py-0.5 px-2 rounded-full border border-white/50 hover:bg-white/60 transition-colors"
                        >
                          <Heart size={8} className="fill-current animate-pulse" />
                          <span>{photoLikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- BACK OF POLAROID (Secret Note) --- */}
                <div className="absolute inset-0 glass-card p-4 rounded-2xl flex flex-col justify-between backface-hidden rotate-y-180">
                  <div className="absolute top-2 right-3 text-rose-800/60 text-[9px] font-mono">
                    #{index + 1} Inside My Heart
                  </div>

                  <div className="flex-1 mt-4 flex flex-col justify-center items-center text-center px-2">
                    <Heart size={20} className="text-rose-400 fill-rose-100 mb-2 animate-bounce" />
                    <p className="font-serif italic text-glass-deep text-xs leading-relaxed">
                      "I keep looking at this picture of you everyday because your lovely eyes hold my safe place. You look so magical, so happy, so pure. It is my favorite screensaver in my brain."
                    </p>
                  </div>

                  <div className="text-center text-[9px] uppercase tracking-widest text-rose-700 font-bold">
                    Tap to turn back 💖
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Plus button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            triggerSparkle();
            setShowUpload(true);
          }}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all"
          id="btn-add-photos"
        >
          <Camera size={14} /> Tape A New Photo
        </button>
      </div>

      {/* Custom Styles for 3D card flips */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}} />

      {/* Upload Memory Modal with Glass Panel */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-[#5D2E46]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 text-glass-deep">
            <h3 className="text-lg font-serif italic text-glass-deep flex items-center gap-1.5 mb-2">
              <Sparkles className="text-rose-500" size={18} /> Tape A Precious Memory
            </h3>
            <p className="text-xs text-rose-900/80 mb-4 leading-relaxed">
              Upload a picture of you, or both of you, and write your high-quality love description!
            </p>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-rose-800/85 uppercase mb-1">Select Photo File</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-white/50 rounded-2xl flex flex-col items-center justify-center bg-white/30 hover:bg-white/45 transition-colors cursor-pointer p-2 overflow-hidden"
                >
                  {imageSrc ? (
                    <img src={imageSrc} alt="Preview" className="h-full object-contain rounded-lg" />
                  ) : (
                    <>
                      <Camera className="text-rose-400 mb-1.5 animate-pulse" size={24} />
                      <span className="text-[10px] text-rose-700 font-bold">Tap to Pick Photo</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-rose-800/85 uppercase mb-1">Love Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Silly faces in the elevator..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep placeholder-rose-950/40 focus:outline-none focus:border-rose-450"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-rose-800/85 uppercase mb-1">Date</label>
                  <input
                    type="text"
                    placeholder="e.g., June 14, 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep placeholder-rose-950/40 focus:outline-none focus:border-rose-450"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-800/85 uppercase mb-1">Select Emoji</label>
                  <select
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep focus:outline-none focus:border-rose-450"
                  >
                    <option value="💖">💖 Heart</option>
                    <option value="👑">👑 Princess</option>
                    <option value="🌹">🌹 Rose</option>
                    <option value="🧸">🧸 Teddy</option>
                    <option value="👩‍❤️‍👨">👩‍❤️‍👨 Couple</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="flex-1 py-3 bg-white/30 hover:bg-white/55 border border-white/40 text-rose-810 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imageSrc}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 disabled:opacity-40 transition-all"
                >
                  Glue into Book ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

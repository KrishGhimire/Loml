import React, { useState, useEffect } from "react";
import { Music, Plus, Sparkles, Heart, Trash2, Link, Disc } from "lucide-react";
import { useRomanticAudio } from "./AudioPlayer";
import { Song } from "../types";

export const SongsTab: React.FC = () => {
  const { playTrack, activeTrackId, stopTrack, isPlaying, triggerSparkle } = useRomanticAudio();
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Custom inputs
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newSpotify, setNewSpotify] = useState("");

  const defaultSongs: Song[] = [
    {
      id: "two_moons",
      title: "two moons",
      artist: "toe",
      comment: "This song reminds me of your gentle, peaceful soul. The intricate guitars and lovely drums loop in my mind whenever we are together in spirit.",
      synthTheme: "cant_help"
    },
    {
      id: "laijau",
      title: "Laijau",
      artist: "Diwash Gurung",
      comment: "A peaceful and comforting melody of home. Take me away to a serene place where it's just you and me, sweet and timeless, Sanu.",
      synthTheme: "lavie"
    },
    {
      id: "khaseka_tara",
      title: "Khaseka Tara",
      artist: "Albatross",
      comment: "The stars falling down from the evening sky, just like how you fell into mine and made everything magical, Sanu.",
      synthTheme: "sunshine"
    },
    {
      id: "nothings_gonna_hurt",
      title: "Nothing's Gonna Hurt You Baby",
      artist: "Cigarettes After Sex",
      comment: "Nothing's gonna hurt you baby, as long as you're with me. I'll forever hold you safe and warm in my arms.",
      synthTheme: "birthday"
    },
    {
      id: "white_silence",
      title: "white silence(album version)",
      artist: "TK from Ling Tosite Sigure",
      comment: "An ethereal, striking masterpiece. The beautiful and emotional contrast reminds me of your incredible depth and the unmatched aesthetic of our togetherness.",
      synthTheme: "cant_help"
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("girlfriend_songs_sanu");
    if (saved) {
      try {
        setSongs(JSON.parse(saved));
      } catch (e) {
        setSongs(defaultSongs);
      }
    } else {
      setSongs(defaultSongs);
      localStorage.setItem("girlfriend_songs_sanu", JSON.stringify(defaultSongs));
    }
  }, []);

  const handlePlaySong = (songId: string) => {
    triggerSparkle();
    if (activeTrackId === songId && isPlaying) {
      stopTrack();
    } else {
      playTrack(songId);
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;

    const newSong: Song = {
      id: "custom_" + Date.now(),
      title: newTitle,
      artist: newArtist,
      comment: newComment || "A beautiful melody that loops in my mind thinking of your warm smile.",
      spotifyUrl: newSpotify,
      synthTheme: "cant_help" // Fallback synth tune
    };

    const updated = [newSong, ...songs];
    setSongs(updated);
    localStorage.setItem("girlfriend_songs", JSON.stringify(updated));
    
    // reset
    setNewTitle("");
    setNewArtist("");
    setNewComment("");
    setNewSpotify("");
    setShowAddModal(false);
    triggerSparkle();
  };

  const handleDeleteSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSparkle();
    const updated = songs.filter(s => s.id !== id);
    setSongs(updated);
    localStorage.setItem("girlfriend_songs", JSON.stringify(updated));
    if (activeTrackId === id) {
      stopTrack();
    }
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto pb-24 text-glass-deep">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-rose-100/65 text-rose-800 rounded-full px-3 py-1 text-xs font-bold tracking-wider border border-white/50">
          <Heart size={12} className="fill-current animate-pulse text-rose-650" /> MUSIC OF MY SOUL
        </span>
        <h2 className="text-2xl font-serif italic text-glass-deep mt-2">
          Songs That Remind Me Of You
        </h2>
        <p className="text-xs text-rose-800/80 max-w-sm mx-auto mt-1 leading-relaxed">
          Every love ballad, sweet lyric, and cozy tune reminds me of our gorgeous memories. Tap a disc to listen to its custom chime!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {songs.map((song) => {
          const isCurrentPlay = activeTrackId === song.id && isPlaying;
          return (
            <div
              key={song.id}
              onClick={() => handlePlaySong(song.id)}
              className={`p-4 glass-card rounded-3xl transition-all cursor-pointer flex gap-4 items-center ${
                isCurrentPlay 
                  ? "bg-white/80 ring-2 ring-rose-200 border-rose-300 scale-[1.01]" 
                  : "hover:bg-white/45"
              }`}
              id={`song-card-${song.id}`}
            >
              {/* Spinning Vinyl Record Visual */}
              <div className="relative flex-shrink-0">
                <div className={`w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 shadow-lg flex items-center justify-center relative ${
                  isCurrentPlay ? "animate-spin" : ""
                }`} style={{ animationDuration: "5s" }}>
                  {/* Vinyl grooves */}
                  <div className="absolute inset-2 border-2 border-neutral-800/80 rounded-full"></div>
                  <div className="absolute inset-4 border border-dashed border-neutral-700 rounded-full"></div>
                  
                  {/* center album label */}
                  <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center border-2 border-neutral-900 shadow-inner">
                    <Disc size={16} className="text-neutral-900 animate-pulse" />
                  </div>
                </div>
                {/* Arm / needle overlay */}
                <div className={`absolute -right-1 -top-1 w-6 h-6 origin-top-left transition-transform duration-300 pointer-events-none ${
                  isCurrentPlay ? "rotate-25 text-rose-500" : "rotate-0 text-gray-400"
                }`}>
                  <Music size={14} className="fill-current" />
                </div>
              </div>

              {/* Text explanation */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-glass-deep text-sm truncate uppercase tracking-tight">
                    {song.title}
                  </h3>
                  {song.id.startsWith("custom_") && (
                    <button
                      onClick={(e) => handleDeleteSong(song.id, e)}
                      className="p-1 hover:bg-rose-100 text-rose-400 hover:text-rose-700 rounded-lg transition-colors"
                      id={`delete-song-${song.id}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-rose-700 font-semibold truncate mb-2">
                  {song.artist}
                </p>

                {/* Secret Note inside */}
                <div className="bg-white/20 backdrop-blur-xs p-2.5 rounded-2xl border border-white/50 max-h-24 overflow-y-auto">
                  <p className="text-[11px] text-rose-900 leading-relaxed font-serif italic">
                    "{song.comment}"
                  </p>
                </div>

                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold hover:underline"
                  >
                    <Link size={10} /> Listen on Spotify/Socials
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            triggerSparkle();
            setShowAddModal(true);
          }}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all"
          id="btn-add-music"
        >
          <Plus size={14} /> Dedicate A New Song
        </button>
      </div>

      {/* Add Song Modal with Glass Panel */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#5D2E46]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 text-glass-deep">
            <h3 className="text-lg font-serif italic text-glass-deep flex items-center gap-1.5 mb-2">
              <Sparkles className="text-rose-500" size={18} /> Dedicate a Melody
            </h3>
            <p className="text-xs text-rose-900/80 mb-4 leading-relaxed">
              Why does this track make you think of your gorgeous girl? Add it here.
            </p>

            <form onSubmit={handleAddSong} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-rose-800/80 uppercase mb-1">Song Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Perfect, Lover, Yellow..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep placeholder-rose-905-60/50 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-rose-800/80 uppercase mb-1">Artist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Taylor Swift, Coldplay..."
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep placeholder-rose-905-65/50 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-rose-800/80 uppercase mb-1">My Secret Reason</label>
                <textarea
                  placeholder="Why does this list remind you of her?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep placeholder-rose-905-65/50 focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-rose-800/80 uppercase mb-1">Spotify / YouTube Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://open.spotify.com/..."
                  value={newSpotify}
                  onChange={(e) => setNewSpotify(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/40 border border-white/50 rounded-xl text-xs text-glass-deep placeholder-rose-905-65/50 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-white/30 hover:bg-white/55 border border-white/40 text-rose-810 rounded-xl text-xs font-bold transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 tracking-wide transition-all"
                >
                  Dedicate & Save 💖
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

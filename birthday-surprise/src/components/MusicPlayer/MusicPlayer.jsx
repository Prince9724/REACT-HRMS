import { useRef, useState, useEffect } from "react";
import music from "../../assets/music/birthday.mp3";
import config from "../../data/config.js";

export default function MusicPlayer({ autoStart = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (autoStart && audioRef.current && !hasInteracted) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-white/90 backdrop-blur rounded-full px-4 py-2 card-shadow">
      <audio ref={audioRef} src={music} loop />
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-lg"
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <div className="hidden sm:block text-xs text-gray-500 max-w-[120px] truncate">
        <p className="font-semibold text-gray-700">{config.music.trackName}</p>
        <p>{config.music.artist}</p>
      </div>
    </div>
  );
}

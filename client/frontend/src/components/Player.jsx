import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Heart } from 'lucide-react';
import axios from 'axios';

function Player({ currentSong, currentAudioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeout = useRef(null);

  const userId = 'demo_user'; // Replace with actual user ID

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const resetIdleTimer = () => {
      clearTimeout(idleTimeout.current);
      setIsIdle(false);
      idleTimeout.current = setTimeout(() => {
        if (!isPlaying && !isExpanded) {
          setIsIdle(true);
        }
      }, 6000);
    };

    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown'];

    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, [isPlaying, isExpanded]);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && currentAudioUrl) {
        if (audioRef.current.src === currentAudioUrl) return;

        try {
          audioRef.current.src = currentAudioUrl;
          audioRef.current.load();

          audioRef.current.onloadedmetadata = async () => {
            try {
              await audioRef.current.play();
              setIsPlaying(true);
            } catch (err) {
              console.error('Audio play error:', err);
            }
          };
        } catch (err) {
          console.error('Audio setup error:', err);
        }
      }
    };
    playAudio();
  }, [currentAudioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying
        ? audioRef.current.play().catch(err => console.error('Resume play error:', err))
        : audioRef.current.pause();
    }
  }, [isPlaying]);

useEffect(() => {
  const fetchAudioUrl = async () => {
    if (!currentSong?.id) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/audio/${currentSong.id}`,
        { responseType: "blob" } // important: raw binary data
      );

      if (response.data) {
        const audioBlob = new Blob([response.data], { type: "audio/m4a" });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();

          audioRef.current.onloadedmetadata = async () => {
            try {
              await audioRef.current.play();
              setIsPlaying(true);
            } catch (err) {
              console.error("Audio play error:", err);
            }
          };
        }
      }
    } catch (err) {
      console.error("Error fetching audio URL:", err);
    }
  };

  fetchAudioUrl();
}, [currentSong]);



  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (parseInt(e.target.value) / 100) * audio.duration;
    }
  };

  const handleLikeToggle = async () => {
    if (!currentSong || !currentSong.id) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/playlists/liked/${userId}`,
        {
          song: {
            videoId: currentSong.id,
            title: currentSong.title,
            artist: currentSong.artists?.join(', ') || 'Unknown Artist',
            cover: currentSong.thumbnail,
          },
          action: isLiked ? 'remove' : 'add',
        }
      );

      if (response.status === 200) {
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-500 ${
        isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-[#F8F3D9] dark:bg-[#3B362C] border-t border-[#B9B28A] dark:border-[#7A745D] px-4 py-3 h-auto`}
    >
      <button
        className="md:hidden absolute right-4 text-[#504B38] dark:text-[#F8F3D9] z-10 text-xl"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
      >
        {isExpanded ? '▼' : '▲'}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out w-full transform ${
          isExpanded
            ? 'max-h-[500px] opacity-100 scale-100'
            : 'max-h-[64px] opacity-90 scale-[0.98] overflow-hidden'
        } md:max-h-none`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <img
              src={currentSong?.thumbnail || 'https://placehold.co/300x300?text=No+Image'}
              alt={currentSong?.title || 'Cover'}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium text-[#504B38] dark:text-[#F8F3D9] text-sm max-w-xs truncate">
                {currentSong?.title || 'No Song Selected'}
              </h4>
              <p className="text-xs text-[#7A745D] dark:text-[#B9B28A] max-w-xs truncate">
                {currentSong?.artists?.join(', ') || 'Unknown Artist'}
              </p>
              {isExpanded && currentSong?.album && (
                <p className="text-xs text-[#7A745D] dark:text-[#B9B28A]">Album: {currentSong.album}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 md:mx-6 w-full md:w-auto">
            <div className="flex items-center justify-center gap-4 mb-2">
              <button className="min-w-[44px] min-h-[44px] p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
                <SkipBack className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
              </button>
              <button
                className="min-w-[44px] min-h-[44px] p-3 bg-[#7A745D] dark:bg-[#B9B28A] hover:bg-[#9B9477] dark:hover:bg-[#EBE5C2] rounded-full text-white dark:text-[#3B362C]"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="min-w-[44px] min-h-[44px] p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
                <SkipForward className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7A745D] dark:text-[#B9B28A]">
                {formatTime(audioRef.current?.currentTime || 0)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="progress-bar flex-1 h-1 rounded-lg appearance-none cursor-pointer touch-none"
                style={{ '--val': progress / 100 }}
                aria-label="Seek slider"
              />
              <span className="text-xs text-[#7A745D] dark:text-[#B9B28A]">
                {formatTime(audioRef.current?.duration || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full hidden sm:block" aria-label="Open music library">
              <Music2 className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
            </button>
            <button
              className={`p-2 rounded-full ${
                isLiked ? 'bg-[#7A745D] dark:bg-[#B9B28A]' : 'hover:bg-[#EBE5C2] dark:hover:bg-[#504B38]'
              }`}
              onClick={handleLikeToggle}
              aria-pressed={isLiked}
              aria-label={isLiked ? 'Unlike song' : 'Like song'}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? 'text-white dark:text-[#3B362C]' : 'text-[#504B38] dark:text-[#F8F3D9]'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
              <input
                type="range"
                aria-label="Volume"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="volume-slider w-20 rounded-lg appearance-none cursor-pointer touch-none focus:ring-2 focus:ring-[#7A745D]"
                style={{ '--val': volume / 100 }}
              />
            </div>
          </div>

          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            preload="auto"
            controls={false}
          />
        </div>
      </div>
    </div>
  );
}

export { Player };

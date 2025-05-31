import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, Music2, Heart } from 'lucide-react';
import axios from 'axios';

function Player({ currentSong, currentAudioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef(null);

  const userId = 'demo_user'; // Replace with actual user ID

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && currentAudioUrl) {
        console.log('Attempting to play:', currentAudioUrl);
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
    const checkIfLiked = async () => {
      if (!currentSong || !currentSong.id) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/playlists/liked/${userId}`);
        if (response.status === 200 && response.data?.songs) {
          const liked = response.data.songs.some(song => song.videoId === currentSong.id);
          setIsLiked(liked);
        }
      } catch (err) {
        console.error("Error fetching liked songs:", err);
      }
    };

    checkIfLiked();
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
            artist: currentSong.artists?.join(', '),
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F8F3D9] dark:bg-[#3B362C] border-t border-[#B9B28A] dark:border-[#7A745D] p-4 h-24">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <img
            src={currentSong?.cover || 'https://placehold.co/300x300?text=No+Image'}
            alt={currentSong?.title || 'Cover'}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium text-[#504B38] dark:text-[#F8F3D9]">
              {currentSong?.title || 'No Song Selected'}
            </h4>
            <p className="text-sm text-[#7A745D] dark:text-[#B9B28A]">
              {currentSong?.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
              <SkipBack className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
            </button>
            <button
              className="p-3 bg-[#7A745D] dark:bg-[#B9B28A] hover:bg-[#9B9477] dark:hover:bg-[#EBE5C2] rounded-full text-white dark:text-[#3B362C]"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
              <SkipForward className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#7A745D] dark:text-[#B9B28A]">0:00</span>
            <input
              type="range"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 bg-[#EBE5C2] dark:bg-[#7A745D] rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-[#7A745D] dark:text-[#B9B28A]">3:45</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
            <Mic className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
          </button>
          <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
            <Music2 className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
          </button>
          <button
            className={`p-2 rounded-full ${isLiked ? 'bg-[#7A745D] dark:bg-[#B9B28A]' : 'hover:bg-[#EBE5C2] dark:hover:bg-[#504B38]'}`}
            onClick={handleLikeToggle}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-white dark:text-[#3B362C]' : 'text-[#504B38] dark:text-[#F8F3D9]'}`} />
          </button>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
            <input
              type="range"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-20 h-1 bg-[#EBE5C2] dark:bg-[#7A745D] rounded-lg appearance-none cursor-pointer"
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
  );
}

export { Player };

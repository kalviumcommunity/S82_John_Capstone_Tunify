import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

function LikedSongsPage() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 'demo_user'; // Replace with actual logged-in user ID

  const fetchLikedSongs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/playlists/liked/${userId}`);
      const normalizedSongs = (response.data.songs || []).map(song => ({
        ...song,
        videoId: song.videoId || song.id,
      }));
      setLikedSongs(normalizedSongs.reverse()); // newest first
    } catch (err) {
      console.error('Failed to fetch liked songs:', err);
      setError('Failed to load liked songs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (song) => {
    const videoId = song.videoId || song.id;
    if (!videoId) {
      console.error("Missing videoId for song:", song);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/playlists/liked/${userId}`, {
        song: {
          videoId,
          title: song.title,
          artist: song.artist,
          cover: song.cover,
        },
        action: 'remove',
      });

      if (response.status === 200) {
        setLikedSongs(prev => prev.filter(s => (s.videoId || s.id) !== videoId));
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error('Failed to unlike the song:', err);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-[#F8F3D9] dark:bg-[#3B362C] min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#504B38] dark:text-[#F8F3D9]">❤️ Liked Songs</h2>
        <button
          onClick={fetchLikedSongs}
          className="px-4 py-2 bg-[#7A745D] text-white rounded-xl hover:bg-[#6B644F] transition"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center text-lg text-[#504B38] dark:text-[#EBE5C2]">
          Loading liked songs...
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 font-semibold">
          {error}
        </div>
      )}
      {!loading && !error && likedSongs.length === 0 && (
        <div className="text-center text-[#7A745D] dark:text-[#B9B28A] text-lg">
          No liked songs found. Start liking some!
        </div>
      )}

      <div className="grid gap-4">
        {likedSongs.map((song) => (
          <div
            key={song.videoId}
            className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-[#504B38] shadow-md rounded-2xl hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={song.cover || 'https://placehold.co/100x100?text=No+Image'}
                alt={`Cover art for ${song.title}`}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <p className="text-lg font-semibold text-[#504B38] dark:text-[#F8F3D9]">
                  {song.title}
                </p>
                <p className="text-sm text-[#7A745D] dark:text-[#B9B28A]">
                  {song.artist}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleUnlike(song)}
              className="p-3 hover:scale-110 transition rounded-full bg-[#7A745D] dark:bg-[#B9B28A]"
              title="Unlike this song"
            >
              <Heart className="w-5 h-5 text-white dark:text-[#3B362C]" fill="currentColor" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LikedSongsPage;

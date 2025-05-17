import React, { useState } from 'react';
import axios from 'axios';
import { Player } from './Player';
import { Home } from './Home';

function PlayerContainer() {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [errorAudio, setErrorAudio] = useState(null);

  const handleSongClick = async (song) => {
    setLoadingAudio(true);
    setErrorAudio(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/audio/${song.id}?quality=high`);
      console.log('Fetched audio URL:', res.data.audioUrl); // for debugging
      setCurrentAudioUrl(res.data.audioUrl);
      setCurrentSong(song);
    } catch (err) {
      setErrorAudio('Failed to load audio.');
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <>
      <Home onSongClick={handleSongClick} />
      {loadingAudio && (
        <p className="fixed bottom-28 left-0 right-0 text-center text-[#504B38] dark:text-[#F8F3D9]">
          Loading audio...
        </p>
      )}
      {errorAudio && (
        <p className="fixed bottom-28 left-0 right-0 text-center text-red-500">
          {errorAudio}
        </p>
      )}
      {currentSong && (
        <Player
          currentSong={currentSong}
          currentAudioUrl={currentAudioUrl}
        />
      )}
    </>
  );
}

export { PlayerContainer };

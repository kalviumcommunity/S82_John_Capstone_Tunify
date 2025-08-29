import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import TopBar from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import Sidebar from './components/Sidebar';
import { Player } from './components/Player';
import { PlayerContainer } from './components/PlayerContainer';
import LikedSongsPage from './components/LikedSongsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  
const handleSongClick = async (song) => {
  console.log("Selected song object:", song);
  const songId = song.videoId || song.id;

  if (!songId || songId.includes("${")) {
    console.error("Invalid or malformed song ID:", songId);
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/api/audio/${songId}?quality=high`);
    setCurrentAudioUrl(res.data.audioUrl);
    setCurrentSong(song);
  } catch (err) {
    console.error('Failed to load audio', err);
  }
};
 

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <TopBar
            onAuthClick={() => setIsAuthModalOpen(true)}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={<PlayerContainer onSongClick={handleSongClick} />}
              />
              <Route
                path="/likedsongs"
                element={<LikedSongsPage onSongClick={handleSongClick} />}
              />
            </Routes>
          </div>
        </main>
      </div>

      {currentSong && (
        <Player currentSong={currentSong} currentAudioUrl={currentAudioUrl} />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <ToastContainer position="top-right" autoClose={500} />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import Sidebar from './components/Sidebar';
import { PlayerContainer } from './components/PlayerContainer';
import LikedSongsPage from './components/LikedSongsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
              <Route path="/" element={<PlayerContainer />} />
              <Route path="/likedsongs" element={<LikedSongsPage />} />
            </Routes>
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <ToastContainer position="top-right" autoClose={500} />
    </div>
  );
}

export default App;

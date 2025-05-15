# S82_John_Capstone_Tunify
# 🎧 Tunify – Your Personalized Streaming Experience

**Tunify** is a blazing-fast, web-only music streaming app built with a Spotify-inspired UI. It features real-time vocal/instrument isolation, Google Drive integration, and seamless offline/background playback — all without compromising speed or user control.

---

## 🌐 Platform
- **Web-Only Application**
- Optimized for **speed**, **offline support**, and **background playback**

---

## 🔥 Core Features

### 1. 🎵 Spotify-Based Fast Music Streaming
- Lightning-fast streaming experience
- Smooth playback controls and interface

### 2. 🧠 Music & Voice Isolator (Main Innovation)
- **Real-time toggling** of:
  - 🎤 Male vocals
  - 🎤 Female vocals
  - 🥁 Instruments (drums, bass, piano, etc.)
- No reprocessing needed after separation — audio is **cached and stored**
- Clean UI — **no "Karaoke Mode" label**, just simple toggles

### 3. ☁️ Google Drive Integration
- Store processed songs directly to **Google Drive**
- Prevents redundant separations
- Uses **OAuth2** for secure access
- Supports models like **UVR5** or **HTDemucs** for separation

### 4. 🎛️ Playback Controls
- Play, pause, skip, and go back — standard **Spotify-like controls**

### 5. 📶 Manual & Auto Quality Selection
- Choose your quality: MP3 or better
- Auto mode adjusts quality based on **network speed**

### 6. 🎵 Background Playback
- Continues playing even when tab is switched or browser is minimized

### 7. ⬇️ Offline Mode
- Download songs with isolated components
- Supports **free offline caching** for fast, on-the-go access

---

## 💻 Tech Stack

### Frontend
- **React.js** (Web-only)
- **Tailwind CSS** (via CDN)

### Backend

- **Node.js** + **Express.js**
- **MongoDB**
- **Google Drive API** (OAuth2)
- **JWT Authentication**
  - Username/Password login
  - Google OAuth login

---

#Netlify Link:
- https://heartfelt-salmiakki-f6dd84.netlify.app/
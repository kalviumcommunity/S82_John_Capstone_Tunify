import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12 md:px-20">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-indigo-700">About Tunify</h1>

        <p className="text-lg leading-relaxed">
          Tunify is a next-generation music streaming platform built exclusively for the web. It offers an exceptionally fast and intuitive listening experience while introducing innovative features like real-time vocal and instrument isolation, Google Drive integration, and offline playback — all designed to give users more control and flexibility over how they enjoy music.
        </p>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-600">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>High-Speed Streaming:</strong> Tunify delivers seamless playback through a lightweight, responsive interface inspired by modern design principles.
            </li>
            <li>
              <strong>Real-Time Isolation:</strong> Instantly toggle male or female vocals, drums, bass, piano, and more without any delay or need for reprocessing.
            </li>
            <li>
              <strong>Google Drive Integration:</strong> Save and manage processed tracks directly in your Drive account using secure OAuth-based access.
            </li>
            <li>
              <strong>Advanced Playback Controls:</strong> Skip, pause, rewind, or resume with Spotify-like responsiveness and minimal latency.
            </li>
            <li>
              <strong>Offline & Background Support:</strong> Continue enjoying your playlists even when offline or working in a different browser tab.
            </li>
            <li>
              <strong>Quality Optimization:</strong> Manually select or automatically adjust stream quality based on network conditions.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Technology Stack</h2>
          <p>
            Tunify is built using a modern tech stack that ensures performance, security, and scalability.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li><strong>Frontend:</strong> React.js, Tailwind CSS</li>
            <li><strong>Backend:</strong> Node.js, Express.js</li>
            <li><strong>Database:</strong> MongoDB</li>
            <li><strong>Authentication:</strong> JWT, Google OAuth2</li>
            <li><strong>APIs:</strong> Google Drive API, Audio Separation Models (e.g., UVR5, HTDemucs)</li>
          </ul>
        </section>

        <p className="text-md text-gray-600 pt-4">
          Tunify reimagines how users interact with music online — by blending intelligent audio engineering with a refined, user-centric experience.
        </p>
      </div>
    </div>
  );
};

export default About;

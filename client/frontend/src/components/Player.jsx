import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, Music2 } from 'lucide-react';

function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(80);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F8F3D9] dark:bg-[#3B362C] border-t border-[#B9B28A] dark:border-[#7A745D] p-4 h-24">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Song Info */}
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"
            alt="Current song"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium text-[#504B38] dark:text-[#F8F3D9]">Urban Flow</h4>
            <p className="text-sm text-[#7A745D] dark:text-[#B9B28A]">City Beats</p>
          </div>
        </div>

        {/* Controls */}
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
            <span className="text-sm text-[#7A745D] dark:text-[#B9B28A]">1:30</span>
            <input
              type="range"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="flex-1 h-1 bg-[#EBE5C2] dark:bg-[#7A745D] rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-[#7A745D] dark:text-[#B9B28A]">3:45</span>
          </div>
        </div>

        {/* Extra Options */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
            <Mic className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
          </button>
          <button className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full">
            <Music2 className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
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
      </div>
    </div>
  );
}

export { Player };

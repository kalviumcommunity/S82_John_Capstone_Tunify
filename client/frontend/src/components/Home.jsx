import React from 'react';
import { Search, TrendingUp as Trending, Library } from 'lucide-react';

const trendingSongs = [
  { id: 1, title: "Summer Vibes", artist: "Chill Wave", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300" },
  { id: 2, title: "Midnight Dreams", artist: "Luna", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300" },
  { id: 3, title: "Urban Flow", artist: "City Beats", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300" },
];

function Home() {
  return (
    <div className="p-6 space-y-8 bg-[#F8F3D9] dark:bg-[#3B362C] min-h-screen">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#504B38] dark:text-[#EBE5C2]" />
        <input
          type="text"
          placeholder="Search for songs, artists, or albums..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-[#EBE5C2] dark:bg-[#504B38] text-[#504B38] dark:text-[#F8F3D9] focus:ring-2 focus:ring-[#B9B28A] dark:focus:ring-[#9B9477] focus:outline-none"
        />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trending className="text-[#504B38] dark:text-[#F8F3D9]" />
          <h2 className="text-2xl font-bold text-[#504B38] dark:text-[#F8F3D9]">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingSongs.map(song => (
            <div key={song.id} className="bg-[#EBE5C2] dark:bg-[#504B38] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img src={song.cover} alt={song.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-[#504B38] dark:text-[#F8F3D9]">{song.title}</h3>
                <p className="text-[#7A745D] dark:text-[#B9B28A]">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Library className="text-[#504B38] dark:text-[#F8F3D9]" />
          <h2 className="text-2xl font-bold text-[#504B38] dark:text-[#F8F3D9]">Your Library</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#EBE5C2] dark:bg-[#504B38] rounded-lg p-4 text-center">
              <div className="w-full aspect-square bg-[#B9B28A] dark:bg-[#7A745D] rounded-lg mb-2"></div>
              <p className="font-medium text-[#504B38] dark:text-[#F8F3D9]">Playlist {i + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { Home };

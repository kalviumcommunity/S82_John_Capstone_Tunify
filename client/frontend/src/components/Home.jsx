import React, { useState } from 'react';
import axios from 'axios';
import { Search, TrendingUp as Trending } from 'lucide-react';

function Home({ onSongClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHighResThumbnail = (url) => {
    return url?.replace(/(default|hqdefault|mqdefault|sddefault)\.jpg/, 'maxresdefault.jpg');
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5001/api/music/search?q=${query}`);
      setResults(res.data.items || []);
    } catch {
      setError('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#F8F3D9] dark:bg-[#3B362C] min-h-screen">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#504B38] dark:text-[#EBE5C2]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for songs, artists, or albums..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-[#EBE5C2] dark:bg-[#504B38] text-[#504B38] dark:text-[#F8F3D9] focus:ring-2 focus:ring-[#B9B28A] dark:focus:ring-[#9B9477] focus:outline-none"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trending className="text-[#504B38] dark:text-[#F8F3D9]" />
          <h2 className="text-2xl font-bold text-[#504B38] dark:text-[#F8F3D9]">Search Results</h2>
        </div>

        {/* Responsive table for Spotify-like playlist */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800 dark:text-gray-300">
            <tbody>
              {results.map((song, idx) => (
                <tr
                  key={song.id}
                  onClick={() => onSongClick(song)}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-[#EBE5C2] dark:hover:bg-[#6B644F] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-center">{idx + 1}</td>
                  <td className="px-4 py-3 flex items-center space-x-3 max-w-xs">
                    <img
                      src={getHighResThumbnail(song.thumbnail) || 'https://placehold.co/56x56?text=No+Image'}
                      alt={song.title}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold truncate text-[#504B38] dark:text-[#F8F3D9]">
                        {song.title}
                      </span>
                      <span className="text-xs text-[#7A745D] dark:text-[#B9B28A] truncate">
                        {song.artists?.join(', ') || 'Unknown Artist'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs hidden md:table-cell">{song.album}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{song.dateAdded || '—'}</td>
                  <td className="px-4 py-3 text-center">{song.duration || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export { Home };

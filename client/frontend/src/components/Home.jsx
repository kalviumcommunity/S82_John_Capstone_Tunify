import React, { useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Search, TrendingUp as Trending } from 'lucide-react';

function Home({ onSongClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const getHighResThumbnail = (url) => {
    return url?.replace(/(default|hqdefault|mqdefault|sddefault)\.jpg/, 'maxresdefault.jpg');
  };

  // Normalize song object to ensure Player receives consistent data
  const normalizeSong = (song) => ({
    id: song.videoId || song.id || '', // fallback for id
    title: song.title || 'Unknown Title',
    artists: song.artists || (song.artist ? [song.artist] : ['Unknown Artist']),
    album: song.album || 'Unknown Album',
    thumbnail: getHighResThumbnail(song.thumbnail) || song.cover || 'https://placehold.co/300x300?text=No+Image',
    duration: song.duration || '—',
  });

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const res = await axios.get(`http://localhost:5001/api/music/search?q=${query}`);
      setResults(res.data.items || []);
    } catch {
      setError('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = debounce(async (q) => {
    if (!q.trim()) return setSuggestions([]);
    try {
      const res = await axios.get(`http://localhost:5001/api/search/suggest?q=${q}`);
      setSuggestions(res.data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
  }, 100);

  return (
    <div className="p-6 space-y-8 bg-[#F8F3D9] dark:bg-[#3B362C] min-h-screen">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#504B38] dark:text-[#EBE5C2]" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for songs, artists, or albums..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-[#EBE5C2] dark:bg-[#504B38] text-[#504B38] dark:text-[#F8F3D9] focus:ring-2 focus:ring-[#B9B28A] dark:focus:ring-[#9B9477] focus:outline-none"
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-[#EBE5C2] dark:bg-[#504B38] rounded-md shadow mt-2 w-full max-h-60 overflow-y-auto">
            {suggestions.map((sugg, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setQuery(sugg);
                  setSuggestions([]);
                  handleSearch();
                }}
                className="px-4 py-2 cursor-pointer hover:bg-[#D6D0AD] dark:hover:bg-[#6B644F]"
              >
                {sugg}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <section>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800 dark:text-gray-300">
            <tbody>
              {results.map((song, idx) => (
                <tr
                  key={song.videoId || song.id || idx}
                  onClick={() => onSongClick(normalizeSong(song))}
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
                  <td className="px-4 py-3 hidden md:table-cell">{song.album || 'Unknown Album'}</td>
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

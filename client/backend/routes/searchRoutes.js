const express = require('express');
const axios = require('axios');

const router = express.Router();


const parseISO8601Duration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};


const isShorts = (title, description) => {
  const shortsKeywords = /shorts|#shorts|trailer|clip/i; 
  return shortsKeywords.test(title) || shortsKeywords.test(description);
};

router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;

  
    const searchResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: query,
          maxResults: 20, 
          type: 'video',
          key: API_KEY,
        },
      }
    );

    const videoIds = searchResponse.data.items.map((item) => item.id.videoId);

  
    const videoDetailsResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'contentDetails,snippet',
          id: videoIds.join(','),
          key: API_KEY,
        },
      }
    );


    const items = videoDetailsResponse.data.items
      .filter((video) => {
        const duration = parseISO8601Duration(video.contentDetails.duration);
        const title = video.snippet.title;
        const description = video.snippet.description;

        return (
          duration > 60 && 
          duration < 600 &&
          !isShorts(title, description) 
        );
      })
      .map((video) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
      }));

   
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;

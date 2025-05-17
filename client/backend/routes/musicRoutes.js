const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    exec(`yt-dlp -f bestaudio --get-url ${videoUrl}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: `Failed to extract audio URL: ${stderr || error.message}` });
      }
      if (stderr) {
        return res.status(500).json({ error: `stderr: ${stderr}` });
      }

      const audioUrl = stdout.trim(); 
      if (audioUrl) {
        res.json({ audioUrl });
      } else {
        res.status(404).json({ error: 'Audio not found for the provided video.' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: `Error processing video: ${error.message}` });
  }
});






module.exports = router;

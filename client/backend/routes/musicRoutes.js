const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

router.get("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // yt-dlp command:
    //   -f "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio"
    //   → pick best m4a first, then webm, else best available
    const ytdlp = spawn("yt-dlp", [
      "-f",
      "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio",
      "-o",
      "-",
      videoUrl,
    ]);

    let contentTypeSet = false;

    ytdlp.stdout.on("data", (chunk) => {
      if (!contentTypeSet) {
        // Guess content type from first chunk (yt-dlp doesn’t tell us)
        const chunkStr = chunk.toString("hex", 0, 4);
        if (chunkStr.startsWith("1a45dfa3")) {
          res.setHeader("Content-Type", "audio/webm");
        } else {
          res.setHeader("Content-Type", "audio/mp4"); // m4a is basically mp4 container
        }
        contentTypeSet = true;
      }
      res.write(chunk);
    });

    ytdlp.stderr.on("data", (data) => {
      console.error(`yt-dlp error: ${data}`);
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(500)
          .json({ error: "yt-dlp failed to fetch audio stream" });
      }
      res.end();
    });
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

module.exports = router;

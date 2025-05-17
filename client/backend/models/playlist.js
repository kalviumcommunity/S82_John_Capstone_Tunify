const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  artist: String,
  cover: String,
});

const playlistSchema = new mongoose.Schema({
  title: String,
  description: String,
  songs: [songSchema],  // must accept objects
  userId: String,
});


module.exports = mongoose.model('Playlist', playlistSchema);

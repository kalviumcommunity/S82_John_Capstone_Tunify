// liked.test.js
const request = require('supertest');
const express = require('express');

jest.mock('../models/playlist');
jest.mock('../models/user');

const Playlist = require('../models/playlist');
const likedRoutes = require('../routes/playRoutes'); // Adjust this path

const app = express();
app.use(express.json());
app.use('/', likedRoutes);

describe('Liked Songs Routes', () => {
  const userId = 'user123';
  const song = { videoId: 'abc123', title: 'Cool Song' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /liked/:userId', () => {
    it('should add a song to liked songs', async () => {
      const mockPlaylist = { 
        userId, 
        title: 'Liked Songs', 
        songs: [], 
        save: jest.fn().mockResolvedValue(true) 
      };

      Playlist.findOne.mockResolvedValueOnce(null); // no existing playlist
      Playlist.mockImplementation(() => mockPlaylist);

      const res = await request(app).put(`/liked/${userId}`).send({
        song,
        action: 'add',
      });

      expect(res.statusCode).toBe(200);
      expect(mockPlaylist.songs).toContainEqual(song);
      expect(mockPlaylist.save).toHaveBeenCalled();
    });

    it('should remove a song from liked songs', async () => {
      const mockPlaylist = {
        userId,
        title: 'Liked Songs',
        songs: [song],
        save: jest.fn().mockResolvedValue(true),
      };

      Playlist.findOne.mockResolvedValueOnce(mockPlaylist);

      const res = await request(app).put(`/liked/${userId}`).send({
        song,
        action: 'remove',
      });

      expect(res.statusCode).toBe(200);
      expect(mockPlaylist.songs).not.toContainEqual(song);
      expect(mockPlaylist.save).toHaveBeenCalled();
    });

    it('should ignore duplicate song addition', async () => {
      const mockPlaylist = {
        userId,
        title: 'Liked Songs',
        songs: [song],
        save: jest.fn().mockResolvedValue(true),
      };

      Playlist.findOne.mockResolvedValueOnce(mockPlaylist);

      const res = await request(app).put(`/liked/${userId}`).send({
        song,
        action: 'add',
      });

      expect(res.statusCode).toBe(200);
      expect(mockPlaylist.songs.length).toBe(1);
      expect(mockPlaylist.save).toHaveBeenCalled();
    });

    it('should return 400 for invalid song data', async () => {
      const res = await request(app).put(`/liked/${userId}`).send({
        song: {}, // missing videoId
        action: 'add',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid song data');
    });
  });

  describe('GET /liked/:userId', () => {
    it('should return liked songs if playlist exists', async () => {
      const mockPlaylist = {
        userId,
        title: 'Liked Songs',
        songs: [song],
      };

      Playlist.findOne.mockResolvedValueOnce(mockPlaylist);

      const res = await request(app).get(`/liked/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.songs).toEqual([song]);
    });

    it('should return empty array if playlist not found', async () => {
      Playlist.findOne.mockResolvedValueOnce(null);

      const res = await request(app).get(`/liked/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.songs).toEqual([]);
    });

    it('should return 500 on DB error', async () => {
      Playlist.findOne.mockRejectedValueOnce(new Error('DB Error'));

      const res = await request(app).get(`/liked/${userId}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('DB Error');
    });
  });
});

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
// set JWT secret for tests

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');

jest.mock('../models/user');
jest.mock('../firebaseAdmin');
jest.mock('firebase-admin');

const jwt = require('jsonwebtoken');

// Mock jsonwebtoken to avoid real JWT operations during tests
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'testtoken'),
  verify: jest.fn(),
}));

// Mock firebaseAdmin to have auth as a jest.fn()
jest.mock('../firebaseAdmin', () => ({
  auth: jest.fn(),
}));

const User = require('../models/user');
const admin = require('../firebaseAdmin');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/', authRoutes);

describe('Auth Routes', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValueOnce(null); // email check
      User.findOne.mockResolvedValueOnce(null); // username check
      User.mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValueOnce(mockUser),
      }));

      const res = await request(app).post('/register').send({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if email is already used', async () => {
      User.findOne.mockResolvedValueOnce(mockUser);

      const res = await request(app).post('/register').send({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('POST /login', () => {
    it('should login with correct credentials', async () => {
      User.findOne.mockResolvedValueOnce(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      const res = await request(app).post('/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should return 400 if user not found', async () => {
      User.findOne.mockResolvedValueOnce(null);

      const res = await request(app).post('/login').send({
        email: 'notfound@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('GET /protected', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/protected');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /auth', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset all mocks before each test
    });

    it('should sign up Firebase user', async () => {
      admin.auth.mockReturnValue({
        verifyIdToken: jest.fn().mockResolvedValue({
          uid: 'firebase123',
          email: 'firebase@example.com',
          name: 'Firebase User',
        }),
      });

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      }));

      const res = await request(app)
        .post('/auth')
        .send({
          idToken: 'valid-firebase-token',
          isSignUp: true,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject auth if Firebase token is invalid', async () => {
      admin.auth.mockReturnValue({
        verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
      });

      const res = await request(app)
        .post('/auth')
        .send({
          idToken: 'invalid-token',
          isSignUp: true,
        });

      expect(res.statusCode).toBe(500);
    });
  });
});

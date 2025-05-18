// __mocks__/firebase-admin.js
const authMock = {
  verifyIdToken: jest.fn(),
  createUser: jest.fn(),
  // Add any other methods you use on admin.auth()
};

module.exports = {
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(() => ({})),
  },
  auth: jest.fn(() => authMock),  // mock admin.auth()
  app: jest.fn(),
};

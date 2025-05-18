module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Add this to auto-mock firebase-admin:
  automock: false,
  moduleNameMapper: {
    '^firebase-admin$': '<rootDir>/__mocks__/firebase-admin.js',
  },
};

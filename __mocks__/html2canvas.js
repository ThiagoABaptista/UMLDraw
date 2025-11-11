module.exports = {
  __esModule: true,
  default: jest.fn(() => Promise.resolve({
    toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
    width: 800,
    height: 600
  }))
};
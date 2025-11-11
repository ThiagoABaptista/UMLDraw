const jsPDF = jest.fn().mockImplementation(() => ({
  addImage: jest.fn(),
  text: jest.fn(),
  setFontSize: jest.fn(),
  setFont: jest.fn(),
  setTextColor: jest.fn(),
  save: jest.fn(),
  internal: {
    pageSize: {
      getWidth: jest.fn(() => 595.28),
      getHeight: jest.fn(() => 841.89)
    }
  }
}));

module.exports = { jsPDF };
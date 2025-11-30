const pdf = require('pdf-parse');

const parsePDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing error: ${error.message}`);
  }
};

module.exports = { parsePDF };

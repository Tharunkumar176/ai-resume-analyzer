const mammoth = require('mammoth');

const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing error: ${error.message}`);
  }
};

module.exports = { parseDOCX };

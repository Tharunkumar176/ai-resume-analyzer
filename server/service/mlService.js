const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

const analyzeResumeWithML = async (resumeText, jobDescription = '') => {
  try {
    const response = await axios.post(`${ML_API_URL}/analyze`, {
      resume_text: resumeText,
      job_description: jobDescription,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error('ML API Error:', error.message);
    if (error.response) {
      throw new Error(`ML API Error: ${error.response.data.detail || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('ML API is not responding. Please ensure the ML service is running.');
    } else {
      throw new Error(`Error calling ML API: ${error.message}`);
    }
  }
};

module.exports = { analyzeResumeWithML };

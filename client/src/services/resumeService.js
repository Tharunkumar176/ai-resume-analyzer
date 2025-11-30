import api from './api';

export const analyzeResume = async (formData) => {
  const response = await api.post('/resume/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAnalysisHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/resume/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/resume/analysis/${id}`);
  return response.data;
};

export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/resume/analysis/${id}`);
  return response.data;
};

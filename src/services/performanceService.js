import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/performance';

export const getPerformanceColumns = () =>
  axios.get(`${API_BASE_URL}/columns`);

export const getPerformanceChart = (params) =>
  axios.get(`${API_BASE_URL}/chart`, { params });

export const importPerformanceCSV = (formData) =>
  axios.post(`${API_BASE_URL}/import-csv`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getLocomotives = () =>
  axios.get('http://localhost:3001/api/locomotives');  

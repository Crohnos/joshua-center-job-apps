import axios from 'axios';

// Log API URL to help with debugging
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('API URL:', apiUrl);

// Create axios instance with defaults
const api = axios.create({
  // Use absolute URLs for production
  baseURL: apiUrl,
  withCredentials: true, // This is crucial for cookies to be sent
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to include credentials with every request
api.interceptors.request.use(config => {
  config.withCredentials = true;
  return config;
});

// API service functions
export const submitApplication = async (formData, resumeFile) => {
  const data = new FormData();
  data.append('data', JSON.stringify(formData));
  data.append('resume', resumeFile);
  
  return api.post('/api/applicants', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getLocations = async () => {
  const response = await api.get('/api/locations');
  return response.data;
};

export const checkAuth = async () => {
  try {
    console.log('Checking authentication...');
    const response = await api.get('/auth/check-auth');
    console.log('Auth response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Auth check error:', error.response?.data || error.message);
    return { authenticated: false };
  }
};

// Email verification for form access
export const sendVerificationCode = async (email) => {
  const response = await api.post('/api/verify-email', { email });
  return response.data;
};

export const verifyCode = async (email, code) => {
  const response = await api.post('/api/verify-code', { email, code });
  return response.data;
};

export const checkEmailExists = async (email) => {
  const response = await api.get(`/api/check-email/${encodeURIComponent(email)}`);
  return response.data;
};

export const getApplicants = async () => {
  const response = await api.get('/api/applicants');
  return response.data;
};

export const getApplicant = async (id) => {
  const response = await api.get(`/api/applicants/${id}`);
  return response.data;
};

export const updateApplicant = async (id, data) => {
  const response = await api.put(`/api/applicants/${id}`, data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const addUser = async (data) => {
  const response = await api.post('/api/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

export default api;
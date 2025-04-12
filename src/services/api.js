import axios from 'axios';

// Create axios instance with defaults
const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
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
    const response = await api.get('/auth/check-auth');
    return response.data;
  } catch (error) {
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
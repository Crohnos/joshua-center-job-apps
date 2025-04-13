import axios from 'axios';

// Create axios instance with defaults
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second default timeout
});

// Create error handler utility
const handleApiError = (error, defaultReturn = null) => {
  // Structured error logging for debugging
  const errorDetails = {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data
  };
  
  if (import.meta.env.DEV) {
    console.error('API Error:', errorDetails);
  }
  
  // Return default value if provided
  if (defaultReturn !== undefined) {
    return defaultReturn;
  }
  
  // Otherwise throw the error
  throw error;
};

// API service functions
export const submitApplication = async (formData, resumeFile) => {
  try {
    const data = new FormData();
    data.append('data', JSON.stringify(formData));
    if (resumeFile) {
      data.append('resume', resumeFile);
    }
    
    const response = await api.post('/api/applicants', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getLocations = async () => {
  try {
    const response = await api.get('/api/locations');
    return response.data;
  } catch (error) {
    return handleApiError(error, []);
  }
};


// Email verification for form access
export const sendVerificationCode = async (email) => {
  try {
    const response = await api.post('/api/verify-email', { email });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await api.post('/api/verify-code', { email, code });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await api.get(`/api/check-email/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getApplicants = async () => {
  try {
    console.log('Fetching applicants...');
    
    const response = await api.get('/api/applicants');
    
    console.log(`Successfully retrieved ${response.data?.length || 0} applicants`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applicants:', error.message);
    return handleApiError(error, []);
  }
};

export const getApplicant = async (id) => {
  try {
    const response = await api.get(`/api/applicants/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateApplicant = async (id, data) => {
  try {
    const response = await api.put(`/api/applicants/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    return handleApiError(error, []);
  }
};

export const addUser = async (data) => {
  try {
    const response = await api.post('/api/users', data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Location API functions
export const addLocation = async (data) => {
  try {
    const response = await api.post('/api/locations', data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateLocation = async (id, data) => {
  try {
    const response = await api.put(`/api/locations/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteLocation = async (id) => {
  try {
    const response = await api.delete(`/api/locations/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
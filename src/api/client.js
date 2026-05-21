import axios from 'axios';
import { ApiError } from '../utils/apiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new ApiError(message, status, error.response?.data));
  }
);

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

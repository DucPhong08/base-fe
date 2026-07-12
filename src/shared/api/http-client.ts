import axios from 'axios';
import { env } from '../config/env';
import { ApiError } from './api-error';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject access token
let getAccessToken: (() => string | null) | null = null;

export function setTokenGetter(getter: () => string | null): void {
  getAccessToken = getter;
}

// On 401, force logout
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: () => void): void {
  onUnauthorized = handler;
}

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap backend response: { success, data } → data
// Error response: { success: false, message } → ApiError
httpClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Backend wraps with { success: true, data }
    if (body && typeof body === 'object' && 'success' in body && body.success) {
      return body.data;
    }
    // Fallback: return as-is for non-wrapped responses
    return body;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const body = error.response?.data;
      const message =
        body && typeof body === 'object' && 'message' in body
          ? String(body.message)
          : error.message;

      if (status === 401) {
        onUnauthorized?.();
      }

      return Promise.reject(new ApiError(status, message));
    }
    return Promise.reject(error);
  },
);

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

/**
 * apiClient — Shared Axios instance (Axios ^1.9.0)
 *
 * Axios v1.x changes:
 * - Error type is AxiosError, not `any` or `unknown`
 * - InternalAxiosRequestConfig replaces AxiosRequestConfig in request interceptors
 * - config.headers is always an AxiosHeaders instance (never undefined)
 */

let _token: string | null = null;

export function setAuthToken(token: string | null): void {
  _token = token;
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env['API_BASE_URL'] ?? 'https://api.example.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // v1.x: config.headers is always defined (AxiosHeaders instance)
    if (_token) config.headers['Authorization'] = `Bearer ${_token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) setAuthToken(null);
    return Promise.reject(error);
  }
);

export const api = {
  get:    <T>(url: string, config?: AxiosRequestConfig) => instance.get<T>(url, config).then((r) => r.data),
  post:   <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => instance.post<T>(url, data, config).then((r) => r.data),
  patch:  <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => instance.patch<T>(url, data, config).then((r) => r.data),
  put:    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => instance.put<T>(url, data, config).then((r) => r.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) => instance.delete<T>(url, config).then((r) => r.data),
};

export default instance;

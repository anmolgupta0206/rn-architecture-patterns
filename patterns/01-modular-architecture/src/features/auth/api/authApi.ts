import { api } from '../../../shared/api/apiClient';
import type { AuthResponse, LoginCredentials, RegisterInput, User } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  register: (input: RegisterInput) =>
    api.post<AuthResponse>('/auth/register', input),

  logout: () =>
    api.post<void>('/auth/logout'),

  me: () =>
    api.get<User>('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post<{ token: string }>('/auth/refresh', { refreshToken }),
};

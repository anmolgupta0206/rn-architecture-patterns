/**
 * Mobile App — React Native entry point.
 *
 * Demonstrates how all shared packages are consumed
 * from a React Native app in the monorepo.
 */

import { User, Post, ApiResponse } from '@myapp/types';
import { isValidEmail, formatRelativeTime, formatCurrency } from '@myapp/utils';
import { createApiClient } from '@myapp/api-client';

// ── Create API client using the shared package ────────────────────────────────

const apiClient = createApiClient({
  baseUrl: 'https://api.myapp.com',
  // getToken and onUnauthorized would come from Redux store in a real app
  getToken: () => null,
  onUnauthorized: () => console.warn('Unauthorized — redirect to login'),
});

// ── Type-safe API calls using shared types ────────────────────────────────────

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  } catch {
    return null;
  }
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await apiClient.get<ApiResponse<Post[]>>('/posts');
    return response.data;
  } catch {
    return [];
  }
}

// ── Shared utils work identically in mobile and web ───────────────────────────

const examples = {
  emailValidation: isValidEmail('anmol@example.com'),        // true
  relativeTime: formatRelativeTime(new Date().toISOString()), // 'just now'
  currency: formatCurrency(4999, 'USD'),                      // '$49.99'
};

console.log('Mobile app examples:', examples);

export { fetchCurrentUser, fetchPosts };

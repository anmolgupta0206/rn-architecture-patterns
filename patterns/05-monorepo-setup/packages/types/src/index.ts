/**
 * @myapp/types — Shared TypeScript types.
 *
 * Rules:
 * - ONLY types and interfaces — no runtime code whatsoever
 * - Zero dependencies — this package imports nothing
 * - Every app depends on this; this depends on nothing
 */

// ── User ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

// ── Post ──────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// ── API Contracts ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    hasNextPage: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

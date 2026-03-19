const BASE = process.env['API_BASE_URL'] ?? 'https://api.example.com';

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
}

export interface PostsPage {
  data: Post[];
  meta: { page: number; perPage: number; total: number; hasNextPage: boolean };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const postsApi = {
  getPage: (page = 1, perPage = 20) =>
    request<PostsPage>(`/posts?page=${page}&perPage=${perPage}`),

  getById: (id: string) =>
    request<Post>(`/posts/${id}`),

  create: (input: CreatePostInput) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(input) }),

  update: (id: string, input: Partial<CreatePostInput>) =>
    request<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),

  delete: (id: string) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),
};

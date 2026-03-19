/**
 * Web App — Next.js page.
 *
 * Uses the EXACT same shared packages as the mobile app.
 * Types, utils, and API client are all shared — zero duplication.
 */

import { User, Post } from '@myapp/types';
import { formatRelativeTime, truncate } from '@myapp/utils';
import { createApiClient } from '@myapp/api-client';

const apiClient = createApiClient({
  baseUrl: 'https://api.myapp.com',
  getToken: () => {
    // In Next.js, token comes from cookies or session
    return typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;
  },
});

// ── Server-side data fetching ─────────────────────────────────────────────────

async function getPosts(): Promise<Post[]> {
  try {
    const res = await apiClient.get<{ data: Post[] }>('/posts');
    return res.data;
  } catch {
    return [];
  }
}

// ── Page component ────────────────────────────────────────────────────────────

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{truncate(post.content, 120)}</p>
          <time>{formatRelativeTime(post.createdAt)}</time>
        </article>
      ))}
    </main>
  );
}

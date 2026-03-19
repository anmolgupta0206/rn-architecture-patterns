import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { postsApi, type Post, type CreatePostInput, type PostsPage } from '../api/postsApi';

/**
 * usePosts — TanStack Query v5
 *
 * v5 changes applied:
 * - `initialPageParam` required for useInfiniteQuery
 * - Remove `pageParam = 1` default — initialPageParam handles it
 * - Explicit generic args on useInfiniteQuery for full type safety
 * - `InfiniteData<PostsPage>` required for getQueryData/setQueryData on infinite queries
 * - `useErrorBoundary` removed — use `throwOnError` instead (set globally in QueryClient)
 */

export const postKeys = {
  all:    ['posts'] as const,
  lists:  () => [...postKeys.all, 'list'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
};

// ── useInfinitePosts ──────────────────────────────────────────────────────────

export function useInfinitePosts() {
  return useInfiniteQuery<
    PostsPage,
    Error,
    InfiniteData<PostsPage>,
    ReturnType<typeof postKeys.lists>,
    number
  >({
    queryKey:      postKeys.lists(),
    queryFn:       ({ pageParam }) => postsApi.getPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.hasNextPage ? last.meta.page + 1 : undefined,
    staleTime:     1000 * 60 * 2,
  });
}

// ── usePost ───────────────────────────────────────────────────────────────────

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn:  () => postsApi.getById(id),
    enabled:  Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

// ── useCreatePost ─────────────────────────────────────────────────────────────

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => postsApi.create(input),

    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: postKeys.lists() });
      const previous = qc.getQueryData<Post[]>(postKeys.lists());

      qc.setQueryData<Post[]>(postKeys.lists(), (old) => [
        {
          id: `temp-${Date.now()}`,
          ...newPost,
          authorId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...(old ?? []),
      ]);

      return { previous };
    },

    onError: (_err, _input, ctx) => {
      if (ctx?.previous) qc.setQueryData(postKeys.lists(), ctx.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ── useDeletePost ─────────────────────────────────────────────────────────────

export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: postKeys.lists() });
      const previous = qc.getQueryData<Post[]>(postKeys.lists());
      qc.setQueryData<Post[]>(postKeys.lists(), (old) =>
        (old ?? []).filter((p) => p.id !== id)
      );
      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(postKeys.lists(), ctx.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

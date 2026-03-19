import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { api } from '../../../shared/api/apiClient';

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
}

interface FeedPage {
  data: Post[];
  meta: { page: number; hasNextPage: boolean };
}

const feedKeys = {
  list: () => ['feed', 'list'] as const,
};

/**
 * useFeed — TanStack Query v5
 *
 * v5 changes:
 * - `initialPageParam` is required (was optional in v4)
 * - Remove `pageParam = 1` default in queryFn — initialPageParam handles it
 * - `InfiniteData<FeedPage>` is the correct type for getQueryData on infinite queries
 * - `pageParam` type is inferred from `initialPageParam` (number here)
 */
export function useFeed() {
  const query = useInfiniteQuery<
    FeedPage,
    Error,
    InfiniteData<FeedPage>,
    ReturnType<typeof feedKeys.list>,
    number
  >({
    queryKey: feedKeys.list(),
    // v5: pageParam type inferred as number from initialPageParam — no default needed
    queryFn: ({ pageParam }) => api.get<FeedPage>(`/feed?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.hasNextPage ? last.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
  });

  return {
    posts:         query.data?.pages.flatMap((p) => p.data) ?? [],
    isLoading:     query.isLoading,
    isRefetching:  query.isRefetching,
    hasNextPage:   query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch:       query.refetch,
  };
}

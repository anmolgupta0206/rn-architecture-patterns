import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';

/**
 * AppProviders — TanStack Query v5 + React Redux v9
 *
 * TanStack Query v5 changes:
 * - `cacheTime` renamed to `gcTime` ✅ already using gcTime
 * - `networkMode: 'offlineFirst'` — queries run without network (essential for RN)
 * - `throwOnError: false` replaces deprecated `useErrorBoundary: false`
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:    1000 * 60 * 5,
      gcTime:       1000 * 60 * 10,
      retry:        2,
      networkMode:  'offlineFirst',  // v5: run queries even without network
      throwOnError: false,           // v5: replaces useErrorBoundary
    },
    mutations: {
      retry:       1,
      networkMode: 'offlineFirst',
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}

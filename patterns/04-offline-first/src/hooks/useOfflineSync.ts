import { useEffect, useRef, useState, useCallback } from 'react';
import { SyncEngine, SyncStatus, SyncEngineConfig } from '../sync/SyncEngine';
import { Mutation } from '../sync/MutationQueue';

interface UseOfflineSyncReturn {
  /** Current sync status */
  status: SyncStatus;
  /** Number of mutations waiting to be synced */
  pendingCount: number;
  /** Enqueue a mutation and sync if online */
  enqueue: (mutation: Omit<Mutation, 'retries'>) => Promise<void>;
  /** Manually trigger a sync — useful for pull-to-refresh */
  forceSync: () => Promise<void>;
}

/**
 * useOfflineSync — React hook wrapping the SyncEngine.
 *
 * @example
 * const { status, enqueue, pendingCount } = useOfflineSync({
 *   apiBaseUrl: 'https://api.myapp.com',
 * });
 *
 * // When user creates a post while offline:
 * await enqueue({
 *   id: uuid(),
 *   type: 'CREATE',
 *   entity: 'posts',
 *   payload: { title: 'Hello', content: '...' },
 *   localId: localPost.id,
 *   timestamp: Date.now(),
 * });
 */
export function useOfflineSync(config: SyncEngineConfig): UseOfflineSyncReturn {
  const engineRef = useRef<SyncEngine | null>(null);
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const engine = new SyncEngine({
      ...config,
      onStatusChange: async (newStatus) => {
        setStatus(newStatus);
        const count = await engine.getPendingCount();
        setPendingCount(count);
      },
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enqueue = useCallback(
    async (mutation: Omit<Mutation, 'retries'>) => {
      if (!engineRef.current) return;
      await engineRef.current.enqueue(mutation);
      const count = await engineRef.current.getPendingCount();
      setPendingCount(count);
    },
    []
  );

  const forceSync = useCallback(async () => {
    await engineRef.current?.forceSync();
  }, []);

  return { status, pendingCount, enqueue, forceSync };
}

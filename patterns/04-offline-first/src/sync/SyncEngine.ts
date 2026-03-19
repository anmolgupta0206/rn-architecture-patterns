import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { MutationQueue, Mutation } from './MutationQueue';
import { ConflictResolver, ServerRecord } from './ConflictResolver';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export interface SyncEngineConfig {
  apiBaseUrl: string;
  maxRetries?: number;     // default: 3
  retryDelayMs?: number;   // base delay — multiplied per retry (backoff)
  onStatusChange?: (status: SyncStatus) => void;
  onSyncComplete?: (syncedCount: number) => void;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * SyncEngine — Orchestrates offline→online sync.
 *
 * Responsibilities:
 * 1. Listen for connectivity changes via NetInfo
 * 2. When online, drain the MutationQueue (push local changes)
 * 3. Pull latest server state after pushing
 * 4. Handle conflicts via ConflictResolver
 * 5. Retry failed mutations with exponential backoff
 */
export class SyncEngine {
  private status: SyncStatus = 'idle';
  private queue: MutationQueue;
  private resolver: ConflictResolver;
  private cfg: Required<SyncEngineConfig>;
  private unsubscribe?: () => void;
  private isSyncing = false;

  constructor(config: SyncEngineConfig) {
    this.cfg = {
      maxRetries: 3,
      retryDelayMs: 2000,
      onStatusChange: () => undefined,
      onSyncComplete: () => undefined,
      ...config,
    };
    this.queue = new MutationQueue();
    this.resolver = new ConflictResolver();
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  start(): void {
    this.unsubscribe = NetInfo.addEventListener(this.onConnectivityChange);
    // Attempt sync on startup in case we have queued mutations
    void this.syncIfOnline();
  }

  stop(): void {
    this.unsubscribe?.();
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Enqueue a mutation and sync immediately if online.
   * Call this from every user write action.
   */
  async enqueue(mutation: Omit<Mutation, 'retries'>): Promise<void> {
    await this.queue.add(mutation);
    await this.syncIfOnline();
  }

  /** Force a sync — e.g. on pull-to-refresh */
  async forceSync(): Promise<void> {
    await this.sync();
  }

  getStatus(): SyncStatus {
    return this.status;
  }

  async getPendingCount(): Promise<number> {
    return this.queue.size();
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  private onConnectivityChange = async (state: NetInfoState) => {
    if (state.isConnected && state.isInternetReachable !== false) {
      await this.sync();
    } else {
      this.setStatus('offline');
    }
  };

  private async syncIfOnline(): Promise<void> {
    const state = await NetInfo.fetch();
    if (state.isConnected && state.isInternetReachable !== false) {
      await this.sync();
    }
  }

  private async sync(): Promise<void> {
    if (this.isSyncing) return; // prevent concurrent sync runs
    this.isSyncing = true;
    this.setStatus('syncing');

    try {
      const mutations = await this.queue.getAll();
      let synced = 0;

      for (const mutation of mutations) {
        const success = await this.processMutation(mutation);
        if (success) synced++;
      }

      await this.pullServerState();
      this.setStatus('idle');
      this.cfg.onSyncComplete(synced);
    } catch (err) {
      console.error('[SyncEngine] Sync failed:', err);
      this.setStatus('error');
    } finally {
      this.isSyncing = false;
    }
  }

  private async processMutation(mutation: Mutation): Promise<boolean> {
    if (mutation.retries >= this.cfg.maxRetries) {
      console.warn('[SyncEngine] Max retries reached, skipping:', mutation.id);
      return false;
    }

    for (let attempt = 0; attempt <= this.cfg.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.cfg.apiBaseUrl}/sync/mutations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mutation),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const serverRecord = await response.json() as ServerRecord;

        // Resolve any conflict between local and server state
        const resolution = this.resolver.resolve(mutation, serverRecord);
        console.log(`[SyncEngine] Conflict resolution: ${resolution} for ${mutation.id}`);

        await this.queue.remove(mutation.id);
        return true;
      } catch (err) {
        if (attempt < this.cfg.maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          await this.delay(this.cfg.retryDelayMs * Math.pow(2, attempt));
        } else {
          await this.queue.incrementRetries(mutation.id);
        }
      }
    }

    return false;
  }

  private async pullServerState(): Promise<void> {
    const response = await fetch(`${this.cfg.apiBaseUrl}/sync/pull`);
    if (!response.ok) throw new Error(`Pull failed: HTTP ${response.status}`);
    // In a real app: write the response into WatermelonDB
    await response.json();
  }

  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.cfg.onStatusChange(status);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

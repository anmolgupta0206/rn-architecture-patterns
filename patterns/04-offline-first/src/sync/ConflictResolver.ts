import { Mutation } from './MutationQueue';

export interface ServerRecord {
  id: string;
  updatedAt: string; // ISO date string
  [key: string]: unknown;
}

export type ConflictResolution = 'LOCAL_WINS' | 'SERVER_WINS';

/**
 * ConflictResolver — Last-Write-Wins (LWW) strategy.
 *
 * Compares local mutation timestamp vs server record's `updatedAt`.
 * Whichever is more recent wins.
 *
 * Upgrade path: Replace this class with a CRDT implementation
 * (Automerge or Yjs) for collaborative editing use cases.
 */
export class ConflictResolver {
  resolve(mutation: Mutation, serverRecord: ServerRecord): ConflictResolution {
    const serverTime = new Date(serverRecord.updatedAt).getTime();
    const localTime = mutation.timestamp;

    if (localTime >= serverTime) {
      return 'LOCAL_WINS';
    }

    return 'SERVER_WINS';
  }

  /**
   * Apply the winning version to local DB.
   * In a real app this writes to WatermelonDB.
   */
  async applyResolution(
    resolution: ConflictResolution,
    mutation: Mutation,
    serverRecord: ServerRecord,
    applyLocal: (mutation: Mutation) => Promise<void>,
    applyServer: (record: ServerRecord) => Promise<void>
  ): Promise<void> {
    if (resolution === 'LOCAL_WINS') {
      await applyLocal(mutation);
    } else {
      await applyServer(serverRecord);
    }
  }
}

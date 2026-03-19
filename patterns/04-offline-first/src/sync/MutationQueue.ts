import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * MutationQueue — AsyncStorage v2
 *
 * AsyncStorage v2 changes:
 * - Removed deprecated multi-item methods (multiGet, multiSet, multiRemove)
 *   — not used here so no change needed
 * - getItem() now returns `string | null` (not `string | null | undefined`)
 * - setItem/removeItem return `void` promise (not Promise<null>)
 * - Error handling: throws on storage failure — wrap calls in try/catch
 */

const QUEUE_KEY = '@mutation_queue';

export type MutationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface Mutation<T = unknown> {
  id:        string;
  type:      MutationType;
  entity:    string;
  payload:   T;
  localId:   string;
  timestamp: number;
  retries:   number;
}

export class MutationQueue {
  async add(mutation: Omit<Mutation, 'retries'>): Promise<void> {
    const queue = await this.getAll();
    queue.push({ ...mutation, retries: 0 });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  async getAll(): Promise<Mutation[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY);
      // v2: getItem returns string | null (never undefined)
      return raw !== null ? (JSON.parse(raw) as Mutation[]) : [];
    } catch {
      // Storage read failure — return empty queue and let sync retry
      return [];
    }
  }

  async remove(mutationId: string): Promise<void> {
    const queue = await this.getAll();
    await AsyncStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(queue.filter((m) => m.id !== mutationId))
    );
  }

  async incrementRetries(mutationId: string): Promise<void> {
    const queue = await this.getAll();
    await AsyncStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(
        queue.map((m) => m.id === mutationId ? { ...m, retries: m.retries + 1 } : m)
      )
    );
  }

  async size(): Promise<number> {
    return (await this.getAll()).length;
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  }
}

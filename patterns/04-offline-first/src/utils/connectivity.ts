import NetInfo from '@react-native-community/netinfo';

/**
 * isOnline — Check current connectivity.
 * Note: isConnected=true doesn't guarantee server reachability.
 * Use pingServer() before critical operations.
 */
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
}

/**
 * onConnectivityChange — Subscribe to connectivity changes.
 * Returns unsubscribe function — call on cleanup.
 *
 * @example
 * const unsub = onConnectivityChange((online) => {
 *   if (online) syncData();
 * });
 * // later:
 * unsub();
 */
export function onConnectivityChange(
  callback: (isOnline: boolean) => void
): () => void {
  return NetInfo.addEventListener((state) => {
    callback(state.isConnected === true && state.isInternetReachable !== false);
  });
}

/**
 * pingServer — Verify real server reachability.
 * Useful before critical mutations (payments, auth).
 *
 * @example
 * if (await pingServer('https://api.myapp.com/ping')) {
 *   await processPayment();
 * }
 */
export async function pingServer(
  url: string,
  timeoutMs = 5000
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

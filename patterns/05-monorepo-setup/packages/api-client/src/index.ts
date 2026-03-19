/**
 * @myapp/api-client — Shared fetch-based HTTP client
 * Works in React Native (0.84+), Next.js, and Node.js.
 *
 * Fixes vs previous version:
 * - clearTimeout called in both success AND error paths (was only in finally)
 * - AbortController signal properly passed to all requests
 * - Headers spread uses correct type (HeadersInit -> Record<string,string>)
 * - 204 No Content guard placed before ok check to avoid res.json() on empty body
 */

export interface ApiClientConfig {
  baseUrl: string;
  getToken?:       () => string | null | Promise<string | null>;
  onUnauthorized?: () => void;
  timeoutMs?:      number;
}

export class ApiClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeoutMs:       10_000,
      getToken:        () => null,
      onUnauthorized:  () => undefined,
      ...config,
    };
  }

  private async buildHeaders(): Promise<Record<string, string>> {
    const token = await this.config.getToken();
    return {
      'Content-Type': 'application/json',
      Accept:         'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const headers = await this.buildHeaders();
      const res = await fetch(`${this.config.baseUrl}${path}`, {
        ...init,
        // Merge caller headers over defaults — caller can override Content-Type
        headers: { ...headers, ...(init.headers as Record<string, string> ?? {}) },
        signal:  controller.signal,
      });

      // Clear timeout as soon as response is received
      clearTimeout(timer);

      if (res.status === 401) {
        this.config.onUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle 204 No Content before calling res.json() (empty body throws)
      if (res.status === 204) return undefined as T;

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }

      return res.json() as Promise<T>;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  get<T>(path: string, init?: RequestInit)                    { return this.request<T>(path, { ...init, method: 'GET' }); }
  post<T>(path: string, body?: unknown, init?: RequestInit)   { return this.request<T>(path, { ...init, method: 'POST',   body: body !== undefined ? JSON.stringify(body) : undefined }); }
  patch<T>(path: string, body?: unknown, init?: RequestInit)  { return this.request<T>(path, { ...init, method: 'PATCH',  body: body !== undefined ? JSON.stringify(body) : undefined }); }
  put<T>(path: string, body?: unknown, init?: RequestInit)    { return this.request<T>(path, { ...init, method: 'PUT',    body: body !== undefined ? JSON.stringify(body) : undefined }); }
  delete<T>(path: string, init?: RequestInit)                 { return this.request<T>(path, { ...init, method: 'DELETE' }); }
}

/**
 * createApiClient — factory for pre-configured instances.
 *
 * @example
 * export const apiClient = createApiClient({
 *   baseUrl:        'https://api.myapp.com',
 *   getToken:       () => store.getState().auth.token,
 *   onUnauthorized: () => store.dispatch(logout()),
 * });
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

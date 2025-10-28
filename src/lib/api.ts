// Centralized API client
// Configure base URL in Vite env as VITE_API_BASE_URL
// Example: VITE_API_BASE_URL=http://localhost:4000

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "/";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  token?: string;
  signal?: AbortSignal;
}

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  { method = "GET", headers, body, token, signal }: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    signal,
  };

  if (body !== undefined) {
    (init as RequestInit & { body: string }).body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : (undefined as unknown);

  if (!res.ok) {
    const err = data as { error?: string; message?: string; code?: string } | undefined;
    throw new Error(err?.message || err?.error || `Request failed: ${res.status}`);
  }

  return data as TResponse;
}

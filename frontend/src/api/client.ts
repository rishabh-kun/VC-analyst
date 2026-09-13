/**
 * Lightweight native fetch-based API client wrapper.
 * Provides typed responses, HTTP error parsing, and AbortSignal support.
 */

export class ApiClientError extends Error {
  public statusCode: number;
  public detail?: string;

  constructor(message: string, statusCode: number = 500, detail?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

/**
 * Resolves the API base URL.
 * During development with Vite proxy, relative calls to `/api/...` work directly.
 * In production or standalone, defaults to origin or http://127.0.0.1:8000.
 */
export function getApiBaseUrl(): string {
  // Support optional environment variable override for deployed frontend
  const envBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envBaseUrl && typeof envBaseUrl === 'string' && envBaseUrl.trim()) {
    return envBaseUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin.startsWith('http')) {
    // If running on Vite dev server (port 5173), Vite proxies /api to port 8000.
    // If served by FastAPI (port 8000), /api is direct.
    // If served on Vercel with rewrites, relative /api is direct.
    return '';
  }
  return 'http://127.0.0.1:8000';
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      let errorDetail: string | undefined;

      try {
        const errorData = await response.json();
        if (errorData) {
          errorDetail = errorData.detail || errorData.message || errorData.error;
          if (errorDetail) {
            errorMessage = errorDetail;
          }
        }
      } catch {
        // Response body was not JSON; use default status text
      }

      throw new ApiClientError(errorMessage, response.status, errorDetail);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      throw new ApiClientError(
        `Network error: ${error.message}`,
        0,
        error.message
      );
    }
    throw new ApiClientError('An unknown network error occurred.', 0);
  }
}

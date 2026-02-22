export type ApiProvider = "nest" | "fastapi";
export type ApiMode = ApiProvider | "auto";

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
};

const DEFAULT_NEST_BASE = "http://localhost:4001/api";
const DEFAULT_FASTAPI_BASE = "http://localhost:4002/api";

const NEST_BASE = process.env.NEXT_PUBLIC_API_NEST_BASE || DEFAULT_NEST_BASE;
const FASTAPI_BASE = process.env.NEXT_PUBLIC_API_FASTAPI_BASE || DEFAULT_FASTAPI_BASE;

function normalizeApiBase(base: string) {
  if (typeof window === "undefined") {
    return base;
  }

  try {
    const url = new URL(base);
    const isLocalTarget = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const currentHost = window.location.hostname;
    const isLocalClient = currentHost === "localhost" || currentHost === "127.0.0.1";

    if (isLocalTarget && !isLocalClient) {
      url.hostname = currentHost;
      return url.toString().replace(/\/$/, "");
    }
  } catch {
    return base;
  }

  return base;
}

export function getApiBase(provider: ApiProvider) {
  const rawBase = provider === "nest" ? NEST_BASE : FASTAPI_BASE;
  return normalizeApiBase(rawBase);
}

export function getProvidersForMode(mode: ApiMode): ApiProvider[] {
  if (mode === "nest") {
    return ["nest"];
  }
  if (mode === "fastapi") {
    return ["fastapi"];
  }
  return ["nest", "fastapi"];
}

function buildRequestInit(options: ApiRequestOptions): RequestInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
}

export async function apiRequestToProvider<T>(
  provider: ApiProvider,
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const base = getApiBase(provider);
  const url = `${base}${path}`;
  
  try {
    const response = await fetch(url, buildRequestInit(options));

    if (!response.ok) {
      const text = await response.text();
      let errorDetail = text || response.statusText;
      
      // Попробуем парсити JSON ошибку из FastAPI или NestJS
      try {
        const json = JSON.parse(text);
        if (json.detail) {
          errorDetail =
            typeof json.detail === "string"
              ? json.detail
              : JSON.stringify(json.detail);
        } else if (json.message) {
          errorDetail =
            typeof json.message === "string"
              ? json.message
              : JSON.stringify(json.message);
        }
      } catch {
        // Если это не JSON, используем текст как есть  
        if (text.length > 200) {
          errorDetail = `${response.status} Error`;
        }
      }
      
      throw new Error(`${provider.toUpperCase()} ${response.status}: ${errorDetail}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    // Проверяем что response содержит JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Если это не JSON (например изображение 404), возвращаем пустой объект
      console.warn(`Non-JSON response from ${url}:`, contentType);
      return {} as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Re-throw errors, but ensure they're proper Error objects
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      console.error(`JSON parse error from ${url}`, error);
      throw new Error(`${provider.toUpperCase()}: Invalid JSON response`);
    }
    throw error;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
  mode: ApiMode = "auto"
): Promise<{ data: T; provider: ApiProvider }> {
  const providers = getProvidersForMode(mode);
  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const data = await apiRequestToProvider<T>(provider, path, options);
      return { data, provider };
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError || new Error("Request failed");
}

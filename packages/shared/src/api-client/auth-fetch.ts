import {AuthFetchOptions} from "./index";

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error {
  constructor(message: string = 'Server Error') {
    super(message);
    this.name = 'ServerError';
  }
}

// --- Fetch with Timeout ---
function fetchWithTimeout(url: string, config: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, {...config, signal: controller.signal}).finally(() => clearTimeout(id));
}


export async function authFetch(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  data: Record<string, any> = {},
  options: AuthFetchOptions = {},
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const config: RequestInit = {
    method,
    headers,
  };

  let url = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${endpoint}`;
  if (method === 'GET' || method === 'DELETE') {
    const queryString = new URLSearchParams(data).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  } else if (method === 'POST' || method === 'PATCH') {
    config.body = JSON.stringify(data);
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(url, config, options.timeout ?? 10000);
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw new Error(`Network error: ${e.message}`);
  }

  if (!response.ok) {
    let errorMessage = `Failed to fetch data: ${response.status} ${response.statusText}`;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : errorBody.message;
      }
    } else {
      const text = await response.text();
      if (text) {
        errorMessage = text;
      }
    }
    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage);
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 500:
      case 502:
      case 503:
        throw new ServerError(errorMessage);
      default:
        throw new Error(errorMessage);
    }
  }
  // Return JSON if possible
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text(); // fallback for non-JSON success
  }
}

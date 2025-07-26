import { NextRequest } from 'next/server';

// Helper to create mock request
export function createMockRequest(options: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}): NextRequest {
  const { url, method = 'GET', headers = {}, body } = options;
  
  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(url, requestInit);
}

// Helper to parse response
export async function parseResponse(response: Response) {
  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}

// Helper to create authorization header
export function createAuthHeader(token: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${token}`
  };
}

// Helper to wait for async operations
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
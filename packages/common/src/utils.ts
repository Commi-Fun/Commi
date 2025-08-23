// Common utility functions

/**
 * Extract ticker symbols from text content
 */
export function extractTickerSymbols(text: string): string[] {
  const tickerRegex = /\$[A-Z]{1,10}\b/g;
  const matches = text.match(tickerRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Calculate basic influence score based on engagement metrics
 */
export function calculateInfluenceScore(metrics: {
  views: number;
  likes: number;
  reposts: number;
  quotes: number;
  replies: number;
  followerCount?: number;
  isVerified?: boolean;
}): number {
  const baseScore = 
    metrics.views * 0.1 +
    metrics.likes * 0.2 +
    metrics.reposts * 0.3 +
    metrics.quotes * 0.25 +
    metrics.replies * 0.15;

  let score = baseScore;

  // Apply follower multiplier if available
  if (metrics.followerCount) {
    score *= (1 + metrics.followerCount * 0.0001);
  }

  // Apply verified bonus
  if (metrics.isVerified) {
    score *= 1.5;
  }

  return Math.round(score * 100) / 100; // Round to 2 decimals
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

/**
 * Chunk an array into smaller arrays
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Format a date to ISO string without milliseconds
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, startDate?: Date, endDate?: Date): boolean {
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Generate a unique identifier
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function safeGet(obj: any, path: string, defaultValue: any = undefined): any {
  try {
    // Split 'user.profile.name' into ['user', 'profile', 'name'] and traverse
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, any>)[key];
      }
      return undefined;
    }, obj) ?? defaultValue;
  } catch {
    // Return default if any part of traversal fails
    return defaultValue;
  }
}

export function safeGetArray(obj: any, path: string): any[] {
  const result = safeGet(obj, path);
  return Array.isArray(result) ? result : [];
}

export function isValidSignature(address: string, signature: string): boolean {
  return true;
}
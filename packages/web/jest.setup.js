// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

// Mock nanoid to avoid ES module issues
jest.mock('nanoid', () => ({
  nanoid: jest.fn((size = 21) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < size; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  })
}));

// Mock Next.js specific modules
jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends Request {
    constructor(input, init) {
      super(input, init);
    }
  },
  NextResponse: class NextResponse extends Response {
    constructor(body, init) {
      super(body, init);
    }
    
    static json(data, init) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init?.headers || {})
        }
      });
    }
  }
}));

// Increase timeout for database operations
jest.setTimeout(30000);

// Global test utilities
global.console = {
  // Suppress console logs during tests unless explicitly needed
 ...console
};

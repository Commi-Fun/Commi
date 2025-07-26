import { GET } from '@/app/api/whitelist/check/route';
import {
  setupTestDatabase,
  teardownTestDatabase,
  testUsers,
  createValidToken,
  createInvalidToken,
  createExpiredToken,
  prisma
} from './test-setup';
import {
  createMockRequest,
  parseResponse,
  createAuthHeader
} from './test-utils';

describe('GET /api/whitelist/check', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('should return whitelist status for authenticated user with whitelist', async () => {
    const token = createValidToken(testUsers.alice);
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: createAuthHeader(token)
    });

    const response = await GET(request);
    const result = await parseResponse(response);
    expect(result.status).toBe(200);
    expect(result.data.status).toBe('REGISTERED');
  });

  it('should return null status for authenticated user without whitelist', async () => {
    const token = createValidToken(testUsers.dave);
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: createAuthHeader(token)
    });

    const response = await GET(request);
    const result = await parseResponse(response);
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject({});
  });

  it('should return 401 when no authorization header is provided', async () => {
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check'
    });

    const response = await GET(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(401);
    expect(result.data).toBe('Not logged in.');
  });

  it('should return 401 when authorization header has invalid format', async () => {
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: {
        'Authorization': 'InvalidFormat'
      }
    });

    const response = await GET(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(401);
    expect(result.data).toBe('Invalid token.');
  });

  it('should return 401 when token is invalid', async () => {
    const token = createInvalidToken();
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: createAuthHeader(token)
    });

    const response = await GET(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(401);
    expect(result.data).toBe('Invalid token.');
  });

  it('should return 401 when token is expired', async () => {
    const token = createExpiredToken(testUsers.alice);
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: createAuthHeader(token)
    });

    const response = await GET(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(401);
    expect(result.data).toBe('Invalid token.');
  });

  it('should return correct status for user with CAN_CLAIM status', async () => {
    const token = createValidToken(testUsers.bob);
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: createAuthHeader(token)
    });

    const response = await GET(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(200);
    expect(result.data.status).toBe('CAN_CLAIM');
  });

  it('should return correct status for user with CLAIMED status', async () => {
    const token = createValidToken(testUsers.charlie);
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/check',
      headers: createAuthHeader(token)
    });

    const response = await GET(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(200);
    expect(result.data.status).toBe('CLAIMED');
  });
});
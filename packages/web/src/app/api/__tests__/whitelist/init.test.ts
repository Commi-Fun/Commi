import { POST } from '@/app/api/whitelist/init/route';
import {
  setupTestDatabase,
  teardownTestDatabase,
  testUsers,
  createValidToken,
  createInvalidToken,
  prisma
} from './test-setup';
import {
  createMockRequest,
  parseResponse,
  createAuthHeader
} from './test-utils';

describe('POST /api/whitelist/init', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await teardownTestDatabase();
  });

  it('should create whitelist for new user without referral code', async () => {

    const token = createValidToken({ userId: 5, twitterId: 'newuser123' });
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {}
    });

    const response = await POST(request);
    const result = await parseResponse(response);
    expect(result.status).toBe(200);
    expect(result.data.status).toBe('REGISTERED');

    // Verify in database
    const whitelist = await prisma.whitelist.findUnique({
      where: { twitterId: 'newuser123' }
    });
    expect(whitelist).toBeTruthy();
    expect(whitelist?.status).toBe('REGISTERED');
    expect(whitelist?.referralCode).toBeTruthy();
  });

  it('should create whitelist with valid referral code and update referrer', async () => {

    const token = createValidToken({ userId: 6, twitterId: 'referee123' });
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {
        referralCode: 'ABC123' // Alice's referral code
      }
    });

    const response = await POST(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(200);
    expect(result.data.status).toBe('REGISTERED');

    // Verify referee whitelist created
    const refereeWhitelist = await prisma.whitelist.findUnique({
      where: { twitterId: 'referee123' }
    });
    expect(refereeWhitelist).toBeTruthy();
    expect(refereeWhitelist?.status).toBe('REGISTERED');

    // Verify referrer status updated
    const referrerWhitelist = await prisma.whitelist.findUnique({
      where: { twitterId: testUsers.alice.twitterId }
    });
    expect(referrerWhitelist?.status).toBe('CAN_CLAIM');

    // Verify referral relationship created
    const referral = await prisma.referral.findFirst({
      where: {
        referrerId: testUsers.alice.userId,
        refereeId: 6
      }
    });
    expect(referral).toBeTruthy();
  });

  it('should create whitelist even with invalid referral code', async () => {

    const token = createValidToken({ userId: 7, twitterId: 'user7' });
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {
        referralCode: 'INVALID999'
      }
    });

    const response = await POST(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(200);
    expect(result.data.status).toBe('REGISTERED');

    // Verify whitelist created without referral
    const whitelist = await prisma.whitelist.findUnique({
      where: { twitterId: 'user7' }
    });
    expect(whitelist).toBeTruthy();
    expect(whitelist?.status).toBe('REGISTERED');

    // Verify no referral relationship created
    const referral = await prisma.referral.findFirst({
      where: { refereeId: 7 }
    });
    expect(referral).toBeNull();
  });

  it('should fail when user already has a whitelist', async () => {
    const token = createValidToken(testUsers.alice);
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {}
    });

    const response = await POST(request);
    const result = await parseResponse(response);
    expect(result.status).toBe(500);
    expect(result.data).toContain('Failed to create whitelist.');
  });

  it('should return 401 when no authorization header is provided', async () => {
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      body: {}
    });

    const response = await POST(request);
    const result = await parseResponse(response);
    expect(result.status).toBe(401);
    expect(result.data).toBe('Not logged in.');
  });

  it('should return 401 when token is invalid', async () => {
    const token = createInvalidToken();
    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {}
    });

    const response = await POST(request);
    const result = await parseResponse(response);
    expect(result.status).toBe(401);
    expect(result.data).toBe('Invalid token.');
  });

  it('should handle missing userId in token', async () => {
    const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret';
    const jwt = require('jsonwebtoken');
    const invalidToken = jwt.sign(
      { twitterId: 'test123' }, // Missing userId
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const request = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(invalidToken),
      body: {}
    });

    const response = await POST(request);
    const result = await parseResponse(response);

    expect(result.status).toBe(401);
    expect(result.data).toBe('Invalid token.');
  });

  it('should handle concurrent whitelist creation attempts', async () => {

    const token = createValidToken({ userId: 8, twitterId: 'concurrent123' });
    
    // Create two requests simultaneously
    const request1 = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {}
    });

    const request2 = createMockRequest({
      url: 'http://localhost:3000/api/whitelist/init',
      method: 'POST',
      headers: createAuthHeader(token),
      body: {}
    });

    // Execute both requests concurrently
    const [response1, response2] = await Promise.allSettled([
      POST(request1),
      POST(request2)
    ]);

    // One should succeed, one should fail
    const results = await Promise.all([
      response1.status === 'fulfilled' ? parseResponse(response1.value) : null,
      response2.status === 'fulfilled' ? parseResponse(response2.value) : null
    ]);

    const successCount = results.filter(r => r && r.status === 200).length;
    const failureCount = results.filter(r => r && r.status !== 200).length;

    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);

    // Verify only one whitelist was created
    const whitelists = await prisma.whitelist.findMany({
      where: { twitterId: 'concurrent123' }
    });
    expect(whitelists.length).toBe(1);
  });
});
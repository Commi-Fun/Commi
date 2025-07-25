import { POST } from './route';

jest.mock('../../_lib/twitterService', () => ({
  getMe: jest.fn()
}));
jest.mock('../../_lib/userService', () => ({
  createUser: jest.fn()
}));
jest.mock('../../_lib/authService', () => ({
  createToken: jest.fn(() => ({ access_token: 'mocked.jwt.token' }))
}));

const twitterService = require('../../_lib/twitterService');
const userService = require('../../_lib/userService');

const makeReq = (body: any) => ({ json: async () => body });

describe('/api/users/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no accessToken', async () => {
    // @ts-ignore
    const response = await POST(makeReq({}));
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe('No valid token provided');
  });

  it('should return 400 if twitterService.getMe returns null', async () => {
    twitterService.getMe.mockResolvedValue(null);
    // @ts-ignore
    const response = await POST(makeReq({ accessToken: 'bad' }));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Failed to verify Twitter credentials');
  });

  it('should return 200 and jwt if valid', async () => {
    twitterService.getMe.mockResolvedValue({
      id: '123',
      avatar: 'avatar.png',
      name: 'Test User',
      screenName: 'testuser',
    });
    userService.createUser.mockResolvedValue({ id: 1, twitterId: '123' });
    // @ts-ignore
    const response = await POST(makeReq({ accessToken: 'good' }));
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.access_token).toBe('mocked.jwt.token');
  });
}); 
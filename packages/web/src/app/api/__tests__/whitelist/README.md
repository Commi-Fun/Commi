# Whitelist API Tests

This directory contains integration tests for the whitelist API endpoints using a real PostgreSQL database.

## Prerequisites

1. PostgreSQL database running
2. Environment variables set:
   - `DATABASE_URL` or `TEST_DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - JWT secret (defaults to 'test-secret' for tests)

## Project Structure

Tests are now organized under the `/tests` directory:
```
/tests/
├── package.json          # Test dependencies and scripts
├── tsconfig.json         # TypeScript configuration for tests
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Jest environment setup
└── web/api/whitelist/    # Whitelist API tests
    ├── check.test.ts
    ├── init.test.ts
    ├── claim.test.ts
    ├── test-setup.ts
    └── test-utils.ts
```

## Running Tests

From the `/tests` directory:

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run whitelist API tests specifically
pnpm test:whitelist

# Run specific endpoint tests
pnpm test:whitelist:check   # Test /api/whitelist/check
pnpm test:whitelist:init    # Test /api/whitelist/init
pnpm test:whitelist:claim   # Test /api/whitelist/claim
```

## Test Structure

- `check.test.ts` - Tests for GET /api/whitelist/check endpoint
- `init.test.ts` - Tests for POST /api/whitelist/init endpoint
- `claim.test.ts` - Tests for POST /api/whitelist/claim endpoint
- `test-setup.ts` - Database setup/teardown and test data seeding
- `test-utils.ts` - Helper functions for creating requests and parsing responses

## Test Coverage

The tests cover:
- Authentication scenarios (valid/invalid/expired tokens)
- All whitelist status transitions (REGISTERED → CAN_CLAIM → CLAIMED)
- Referral code functionality
- Error handling and edge cases
- Concurrent request handling
- Database transaction integrity

## Database Management

Tests use a real PostgreSQL database with automatic setup and cleanup:
- Before each test: Database is cleaned and seeded with test data
- After each test: Database is cleaned to ensure test isolation

## Test Data

Pre-seeded test users:
- Alice (ID: 1) - Has REGISTERED whitelist
- Bob (ID: 2) - Has CAN_CLAIM whitelist
- Charlie (ID: 3) - Has CLAIMED whitelist
- Dave (ID: 4) - No whitelist

## Known Issues

1. **API Route Parameter Mismatch**: The `/api/whitelist/check` route calls `whitelistService.getWhitelist()` with `twitterId`, but the service function expects `userId`. This should be fixed in the API route to pass `payload.userId` instead of `payload.twitterId`.
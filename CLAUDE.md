# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **commi-dashboard**, a community dashboard system that collects data from registered Twitter users, stores and updates the information using Prisma with PostgreSQL, calculates valid tweets' influence and distributes NFT rewards through Solana. The project uses RapidAPI's Twitter241 service to fetch data and provides TypeScript interfaces for structured data handling.

## Monorepo Architecture

This project is organized as a pnpm monorepo with the following structure:

### Apps (`/apps`)
- **web** (`/apps/web`): Next.js frontend dashboard for community data visualization
- **backend** (`/apps/backend`): Node.js server handling crawlers, schedulers, and API endpoints
  - **Crawler module** (`/src/crawler`): Core data fetching logic
    - `x_users.ts`: Functions to fetch user information and user tweets with filtering by ticker symbols
    - `x_community.ts`: Functions to fetch community details, tweets, replies, reposts, and quotes (temporarily disabled)
  - **Reward module** (`/src/reward`): Handles NFT rewards distribution
    - `nft.ts`: Functions to distribute NFTs based on tweet influence
    - `solana.ts`: Solana blockchain interaction for NFT transactions

### Shared Packages (`/packages`)
- **db** (`@commi-dashboard/db`): Prisma client and database schema with PostgreSQL
- **common** (`@commi-dashboard/common`): Shared TypeScript interfaces and types for Twitter data structures (XCommunity, XTweet, XUser, etc.)
- **ui** (`@commi-dashboard/ui`): Shared React/MUI components for consistent UI across applications
- **mcp** (`@commi-dashboard/mcp`): Model Context Protocol for real-time WebSocket communication

### Smart Contracts (`/contracts`)
- **solana** (`@commi-dashboard/contracts-solana`): Anchor-based Solana smart contracts for NFT distribution
- **evm** (`@commi-dashboard/contracts-evm`): Hardhat-based EVM smart contracts for multi-chain support



### Data Flow
1. User data is collected with `fetchUser()` in `apps/backend/src/crawler/x_users.ts`, filtering tweets by ticker symbols and time ranges in a preset interval
2. Extract latest user tweets from PostgreSQL via Prisma and compare with new data
3. Calculate tweet influence using `calculateInfluence()` in `apps/backend/src/reward/nft.ts`
4. Distribute NFTs based on influence using `distributeNFT()` in `apps/backend/src/reward/nft.ts`
5. Store all data in PostgreSQL using Prisma ORM and structured TypeScript interfaces from `@commi-dashboard/common`

## Development Commands

### Monorepo Setup
```bash
# Install dependencies for all packages
pnpm install

# Development mode (all apps in parallel)
pnpm dev

# Build all packages
pnpm build

# Run specific app
pnpm web        # Start Next.js frontend
pnpm backend    # Start Node.js backend
```

### Database Setup
- PostgreSQL database with Prisma ORM
- Database schema defined in `packages/db/prisma/schema.prisma`
- Run migrations: `pnpm db:migrate`
- Push schema changes: `pnpm db:push`
- Generate Prisma client: `pnpm db:generate`

#### Database Tables:
- `User`: Twitter user profiles with engagement metrics
- `Tweet`: Tweet data with influence scores and ticker symbols  
- `NFTDistribution`: NFT distribution records and transaction status
- `SystemConfig`: Application configuration parameters
- `CrawlerLog`: Logging for crawler operations

## API Integration

The project uses RapidAPI's Twitter241 service with endpoints for:
- Community details and tweets
- User information and tweets
- Tweet replies, reposts, and quotes

**Important**: API key is hardcoded in the source files and should be moved to environment variables for production use.

## Key Data Structures

Defined in `@commi-dashboard/common`:
- `XTweet`: Tweet with engagement metrics and nested replies/reposts/quotes
- `XUser`: User profile with filtered tweet collection
- `XCommunity`: Twitter community information and metadata
- All interfaces support media (photos only), verification status, and engagement metrics

## Prisma Database Schema

Located in `packages/db/prisma/schema.prisma`:
- User, Tweet, and NFTDistribution tables with proper relationships
- Indexed fields for optimal query performance
- Support for time-series data collection and tracking changes over time
- Enum types for distribution status and blockchain networks
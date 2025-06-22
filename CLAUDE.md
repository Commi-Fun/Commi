# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dashboard system that collects data from registered Twitter users, stores and updates the information in MongoDB, calculates valid tweets' influence and distributes NFT rewards through solana. The project uses RapidAPI's Twitter241 service to fetch data and provides TypeScript interfaces for structured data handling.

## Architecture

### Backend Structure (`/backend`)
- **Crawler module** (`/crawler`): Core data fetching logic
  - `x_type.ts`: TypeScript interfaces for all Twitter data structures (XCommunity, XTweet, XUser, etc.)
  - `x_community.ts`: Functions to fetch community details, tweets, replies, reposts, and quotes. It is temporarily disabled.
  - `x_users.ts`: Functions to fetch user information and user tweets with filtering by ticker symbols
- **Reward module** (`/reward`): Handles NFT rewards distribution
  - `nft.ts`: Functions to distribute NFTs based on tweet influence
  - `solana.ts`: Solana blockchain interaction for NFT transactions
- **Database module** (`/db`): MongoDB integration
  - `mongdb.ts`: Database connection and basic CRUD operations
  - `setup.ts`: Database initialization and index creation
- `index.ts`: Main application entry point (currently empty)

### Blockchain Structure (`/blockchain`)
- **solana**: Contains Solana-related code for NFT distribution
  - `nft.ts`: Functions to interact with the Solana blockchain for NFT transactions
  - `solana.ts`: Additional Solana utilities and configurations

### Frontend Structure (`/frontend`)
- Currently not implemented, but intended for a user interface to visualize the collected data and manage user interactions.



### Data Flow
1. User data is collected with `fetchUser()`, filtering tweets by ticker symbols and time ranges in a preset interval
2. Extract latest user tweets from mongoDB and compare with new data
3. Calculate tweet influence using `calculateInfluence()` in `reward/nft.ts`
4. Distribute NFTs based on influence using `distributeNFT()` in `reward/nft.ts`
5. Store all data in MongoDB using structured TypeScript interfaces

## Development Commands

### Build and Run
```bash
cd backend
npm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your configuration

# Initialize database (run MongoDB first)
npm run db:setup

# Build TypeScript
npm run build
```

### Database Setup
- MongoDB must be running on `localhost:27017` (or configure MONGODB_URI)
- Database name: `ai_airdrop` (configurable via DB_NAME)
- Run setup script: `npm run db:setup`
- For production: `npm run db:setup:prod`
- Verify setup: `npm run db:verify`

#### Database Collections:
- `users`: Twitter user profiles with engagement metrics
- `tweets`: Tweet data with influence scores and ticker symbols
- `communities`: Twitter community information
- `nft_distributions`: NFT distribution records and transaction status
- `system_config`: Application configuration parameters

## API Integration

The project uses RapidAPI's Twitter241 service with endpoints for:
- Community details and tweets
- User information and tweets
- Tweet replies, reposts, and quotes

**Important**: API key is hardcoded in the source files and should be moved to environment variables for production use.

## Key Data Structures

- `XTweet`: Tweet with engagement metrics and nested replies/reposts/quotes
- `XUser`: User profile with filtered tweet collection
- All interfaces support media (photos only), verification status, and engagement metrics

## Database Schema

- Community snapshots with unique index on `id` and `timestamp`
- Supports time-series data collection for tracking changes over time
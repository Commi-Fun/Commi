# Commi Dashboard - Internal Analytics Tool

An internal dashboard for monitoring users, whitelist, and referral statistics from the PostgreSQL database.

## Features

- **Overview Dashboard**: Key metrics and statistics
- **User Analytics**: User verification, growth, and engagement metrics  
- **Whitelist Analytics**: Registration/claim status tracking
- **Referral Network**: Top referrers and referral statistics

## Setup

1. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env and add your DATABASE_URL
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Run Development Server**:
   ```bash
   pnpm dev
   # Dashboard available at http://localhost:3002
   ```

## Architecture

- **Next.js 15** with App Router
- **Material-UI (MUI)** for consistent UI components
- **MUI X Charts** for data visualization
- **React Query** for API state management
- **Custom Prisma Client** using dashboard environment DATABASE_URL

## API Routes

- `/api/stats/overview` - Overview statistics
- `/api/stats/users` - User analytics data
- `/api/stats/whitelist` - Whitelist statistics
- `/api/stats/referrals` - Referral network data

## Database Tables Used

- `User` - Twitter user profiles and metrics
- `Whitelist` - Whitelist entries and claim status
- `Referral` - Referral relationships and tracking

## Development Notes

- All pages are client components using React Query for data fetching
- Database queries are isolated to API routes
- Uses modern MUI Grid with `size` prop syntax
- Environment-based database configuration separate from main app
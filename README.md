# AI Airdrop 🚀

An AI-powered airdrop distribution system that analyzes Twitter engagement metrics and distributes NFT/token rewards based on influence scores.

## 📁 Monorepo Structure

This project is organized as a pnpm monorepo with the following structure:

```
ai_airdrop/
├── apps/                     # Applications
│   ├── web/                  # Next.js frontend (User UI, API routes)
│   └── backend/              # Node.js backend (Tasks, crawlers, schedulers)
├── packages/                 # Shared packages
│   ├── db/                   # Prisma schema & client
│   ├── common/               # Shared types, utilities, constants
│   ├── ui/                   # Shared React components
│   └── mcp/                  # Model Context Protocol for UI interactions
├── contracts/                # Smart contracts
│   ├── evm/                  # Solidity contracts (Hardhat)
│   └── solana/               # Rust contracts (Anchor)
├── .github/                  # CI/CD workflows
└── Configuration files       # Root configs, package.json, etc.
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Material-UI, Privy (Web3 auth)
- **Backend**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Solana (Rust/Anchor) + EVM (Solidity/Hardhat)
- **Package Manager**: pnpm workspaces
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), Railway/Heroku (backend)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL
- Rust (for Solana contracts)
- Solana CLI & Anchor (for Solana development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai_airdrop.git
cd ai_airdrop

# Install dependencies for all packages
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (for development)
pnpm db:push

# Or run migrations (for production)
pnpm db:migrate
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Or start individually
pnpm web          # Frontend only
pnpm backend      # Backend only
```

## 📦 Packages

### `@ai-airdrop/db`
Prisma-based database layer with PostgreSQL schemas for:
- Users and tweets data
- NFT distribution tracking  
- System configuration
- Crawler logs

### `@ai-airdrop/common`
Shared utilities and types:
- Twitter/X data type definitions
- Influence calculation utilities
- Common constants and error classes
- API response types

### `@ai-airdrop/ui`
Reusable React components:
- Loading spinners and error boundaries
- Data cards and charts
- Material-UI component exports
- Shared theme configuration

### `@ai-airdrop/mcp`
Model Context Protocol for real-time UI interactions:
- WebSocket-based client/server
- Fast data querying with caching
- Real-time data updates
- UI state synchronization

## 🏗️ Applications

### Web App (`apps/web`)
Next.js frontend providing:
- User dashboard with analytics
- Web3 wallet integration (Privy)
- Real-time data visualization
- NFT/token distribution tracking

### Backend (`apps/backend`)
Node.js server handling:
- Twitter data crawling and analysis
- Influence score calculations
- NFT/token distribution logic
- Scheduled tasks and jobs

## 🔗 Smart Contracts

### Solana (`contracts/solana`)
Anchor-based program for:
- Token-based reward distribution
- Influence score validation
- User reward tracking
- Authority-based configuration

### EVM (`contracts/evm`)
Solidity contracts for:
- ERC20 airdrop tokens
- Multi-chain reward distribution
- Batch processing capabilities
- Upgradeable architecture

## 🔧 Development Commands

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint and format code
pnpm lint
pnpm format

# Clean all build artifacts
pnpm clean

# Database operations
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema changes
pnpm db:migrate     # Run migrations
pnpm db:studio      # Open Prisma Studio

# Contract operations
cd contracts/evm
pnpm build          # Compile Solidity contracts
pnpm test           # Run contract tests
pnpm deploy:localhost # Deploy to local network

cd contracts/solana
anchor build        # Build Solana program
anchor test         # Run Anchor tests
anchor deploy       # Deploy to configured cluster
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_airdrop"

# API Keys
RAPIDAPI_KEY=your_rapidapi_key_here
TWITTER_API_KEY=your_twitter_api_key_here

# Blockchain
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
EVM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key

# Web3 Auth
PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

## 🚢 Deployment

The project uses GitHub Actions for CI/CD:

- **CI**: Runs tests, linting, and builds on every PR
- **Deploy**: Automated deployments to staging/production
- **Contracts**: Automated contract deployments to multiple networks

### Manual Deployment

```bash
# Deploy frontend to Vercel
vercel --prod

# Deploy contracts to testnet
cd contracts/evm
pnpm deploy:goerli

cd contracts/solana
anchor deploy --provider.cluster devnet
```

## 📊 Data Flow

1. **Data Collection**: Backend crawls Twitter using RapidAPI
2. **Processing**: Calculates influence scores from engagement metrics  
3. **Distribution**: Smart contracts distribute rewards to eligible users
4. **Tracking**: Database stores all distribution records
5. **UI Updates**: MCP provides real-time updates to frontend

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific packages
pnpm --filter @ai-airdrop/common test
pnpm --filter @ai-airdrop/backend test

# Contract tests
cd contracts/evm && pnpm test
cd contracts/solana && anchor test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](./docs/)
- [API Reference](./docs/api.md)
- [Smart Contract Documentation](./contracts/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
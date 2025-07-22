// Common constants used across the application

export const APP_NAME = 'AI Airdrop';

// Ticker symbols to track
export const DEFAULT_TICKER_SYMBOLS = [
  '$BTC',
  '$ETH',
  '$SOL',
  '$MATIC',
  '$ARB',
  '$OP',
  '$AVAX',
  '$DOT',
  '$LINK',
  '$UNI'
];

// API Rate limits
export const RATE_LIMITS = {
  TWITTER_API: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 300,
    REQUESTS_PER_DAY: 1000
  }
};

// Influence calculation weights
export const INFLUENCE_WEIGHTS = {
  VIEWS: 0.1,
  LIKES: 0.2,
  REPOSTS: 0.3,
  QUOTES: 0.25,
  REPLIES: 0.15,
  FOLLOWER_MULTIPLIER: 0.0001,
  VERIFIED_BONUS: 1.5
};

// NFT Distribution settings
export const NFT_DISTRIBUTION = {
  MIN_INFLUENCE_SCORE: 100,
  REWARDS_PER_BATCH: 100,
  COOLDOWN_HOURS: 24
};

// Database settings
export const DB_SETTINGS = {
  BATCH_SIZE: 1000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000
};

// Blockchain settings
export const BLOCKCHAIN_SETTINGS = {
  SOLANA: {
    COMMITMENT: 'confirmed' as const,
    DEFAULT_DECIMALS: 9
  },
  EVM: {
    CONFIRMATION_BLOCKS: 3,
    GAS_LIMIT_MULTIPLIER: 1.2
  }
};
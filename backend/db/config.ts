/**
 * Database Configuration and Schema Definitions
 * 
 * This file contains all database-related configuration, schema definitions,
 * and default values for the AI Airdrop application.
 */

import { ReadPreference } from 'mongodb';

/**
 * Database connection configuration
 */
export const DATABASE_CONFIG = {
  // Use environment variables for production, fallback to local for development
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  databaseName: process.env.DB_NAME || 'ai_airdrop',
  
  // Connection options for production
  options: {
    maxPoolSize: 10,           // Maximum number of connections in pool
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000,    // How long a send or receive on a socket can take
    bufferMaxEntries: 0,       // Disable mongoose buffering
    bufferCommands: false,     // Disable mongoose buffering
    retryWrites: true,         // Enable retryable writes
    w: 'majority' as const,    // Write concern
    readPreference: ReadPreference.PRIMARY  // Read preference
  }
};

/**
 * Collection schema interface
 */
export interface CollectionSchema {
  name: string;
  indexes: Array<{
    keys: Record<string, number>;
    options: {
      unique?: boolean;
      sparse?: boolean;
      name: string;
    };
  }>;
  validator: {
    $jsonSchema: {
      bsonType: string;
      required: string[];
      properties: Record<string, any>;
    };
  };
}

/**
 * Database schema definitions for all collections
 */
export const COLLECTION_SCHEMAS: Record<string, CollectionSchema> = {
  users: {
    name: 'users',
    indexes: [
      { keys: { userId: 1 }, options: { unique: true, name: 'userId_unique' } },
      { keys: { username: 1 }, options: { unique: true, sparse: true, name: 'username_unique' } },
      { keys: { createdAt: -1 }, options: { name: 'createdAt_desc' } },
      { keys: { lastUpdated: -1 }, options: { name: 'lastUpdated_desc' } },
      { keys: { verified: 1 }, options: { name: 'verified_asc' } }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'name', 'createdAt', 'lastUpdated'],
        properties: {
          userId: { bsonType: 'string', description: 'Twitter user ID - required' },
          username: { bsonType: 'string', description: 'Twitter username/handle' },
          name: { bsonType: 'string', description: 'Display name - required' },
          verified: { bsonType: 'bool', description: 'Verification status' },
          followers: { bsonType: 'int', minimum: 0, description: 'Follower count' },
          likes: { bsonType: 'int', minimum: 0, description: 'Total likes received' },
          createdAt: { bsonType: 'date', description: 'Record creation timestamp - required' },
          lastUpdated: { bsonType: 'date', description: 'Last update timestamp - required' }
        }
      }
    }
  },

  tweets: {
    name: 'tweets',
    indexes: [
      { keys: { tweetId: 1 }, options: { unique: true, name: 'tweetId_unique' } },
      { keys: { userId: 1, createdAt: -1 }, options: { name: 'userId_createdAt_desc' } },
      { keys: { ticker: 1, createdAt: -1 }, options: { name: 'ticker_createdAt_desc' } },
      { keys: { communityId: 1, createdAt: -1 }, options: { name: 'communityId_createdAt_desc' } },
      { keys: { influence: -1 }, options: { name: 'influence_desc' } },
      { keys: { createdAt: -1 }, options: { name: 'createdAt_desc' } },
      { keys: { 'symbols.text': 1 }, options: { name: 'symbols_text' } }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['tweetId', 'userId', 'content', 'createdAt', 'lastUpdated'],
        properties: {
          tweetId: { bsonType: 'string', description: 'Tweet ID - required' },
          userId: { bsonType: 'string', description: 'Author user ID - required' },
          content: { bsonType: 'string', description: 'Tweet content - required' },
          ticker: { bsonType: 'string', description: 'Associated ticker symbol' },
          communityId: { bsonType: 'string', description: 'Community ID if applicable' },
          inCommunity: { bsonType: 'bool', description: 'Whether tweet is in community' },
          views: { bsonType: 'int', minimum: 0, description: 'View count' },
          likes: { bsonType: 'int', minimum: 0, description: 'Like count' },
          reposts: { bsonType: 'int', minimum: 0, description: 'Repost count' },
          quotes: { bsonType: 'int', minimum: 0, description: 'Quote count' },
          replies: { bsonType: 'int', minimum: 0, description: 'Reply count' },
          influence: { bsonType: 'double', minimum: 0, description: 'Calculated influence score' },
          media: { bsonType: 'array', items: { bsonType: 'string' }, description: 'Media URLs' },
          symbols: { bsonType: 'array', description: 'Ticker symbols mentioned' },
          createdAt: { bsonType: 'date', description: 'Tweet creation timestamp - required' },
          lastUpdated: { bsonType: 'date', description: 'Last update timestamp - required' }
        }
      }
    }
  },

  communities: {
    name: 'communities',
    indexes: [
      { keys: { communityId: 1 }, options: { unique: true, name: 'communityId_unique' } },
      { keys: { name: 1 }, options: { name: 'name_asc' } },
      { keys: { members: -1 }, options: { name: 'members_desc' } },
      { keys: { lastUpdated: -1 }, options: { name: 'lastUpdated_desc' } }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['communityId', 'name', 'createdAt', 'lastUpdated'],
        properties: {
          communityId: { bsonType: 'string', description: 'Community ID - required' },
          name: { bsonType: 'string', description: 'Community name - required' },
          description: { bsonType: 'string', description: 'Community description' },
          members: { bsonType: 'int', minimum: 0, description: 'Member count' },
          createdAt: { bsonType: 'date', description: 'Record creation timestamp - required' },
          lastUpdated: { bsonType: 'date', description: 'Last update timestamp - required' }
        }
      }
    }
  },

  nft_distributions: {
    name: 'nft_distributions',
    indexes: [
      { keys: { distributionId: 1 }, options: { unique: true, name: 'distributionId_unique' } },
      { keys: { userId: 1, createdAt: -1 }, options: { name: 'userId_createdAt_desc' } },
      { keys: { tweetId: 1 }, options: { name: 'tweetId_asc' } },
      { keys: { ticker: 1, createdAt: -1 }, options: { name: 'ticker_createdAt_desc' } },
      { keys: { status: 1 }, options: { name: 'status_asc' } },
      { keys: { createdAt: -1 }, options: { name: 'createdAt_desc' } }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['distributionId', 'userId', 'tweetId', 'ticker', 'influence', 'status', 'createdAt'],
        properties: {
          distributionId: { bsonType: 'string', description: 'Distribution ID - required' },
          userId: { bsonType: 'string', description: 'Recipient user ID - required' },
          tweetId: { bsonType: 'string', description: 'Associated tweet ID - required' },
          ticker: { bsonType: 'string', description: 'Ticker symbol - required' },
          influence: { bsonType: 'double', minimum: 0, description: 'Influence score - required' },
          nftAmount: { bsonType: 'int', minimum: 0, description: 'NFT amount awarded' },
          solanaAddress: { bsonType: 'string', description: 'Recipient Solana address' },
          transactionHash: { bsonType: 'string', description: 'Blockchain transaction hash' },
          status: { 
            bsonType: 'string', 
            enum: ['pending', 'processing', 'completed', 'failed'],
            description: 'Distribution status - required' 
          },
          createdAt: { bsonType: 'date', description: 'Distribution creation timestamp - required' },
          completedAt: { bsonType: 'date', description: 'Distribution completion timestamp' },
          errorMessage: { bsonType: 'string', description: 'Error message if failed' }
        }
      }
    }
  },

  system_config: {
    name: 'system_config',
    indexes: [
      { keys: { key: 1 }, options: { unique: true, name: 'key_unique' } },
      { keys: { category: 1 }, options: { name: 'category_asc' } }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['key', 'value', 'category', 'createdAt', 'lastUpdated'],
        properties: {
          key: { bsonType: 'string', description: 'Configuration key - required' },
          value: { description: 'Configuration value - required' },
          category: { bsonType: 'string', description: 'Configuration category - required' },
          description: { bsonType: 'string', description: 'Configuration description' },
          createdAt: { bsonType: 'date', description: 'Record creation timestamp - required' },
          lastUpdated: { bsonType: 'date', description: 'Last update timestamp - required' }
        }
      }
    }
  }
};

/**
 * Configuration item interface
 */
export interface ConfigItem {
  key: string;
  value: any;
  category: string;
  description: string;
}

/**
 * Default system configuration values
 */
export const DEFAULT_SYSTEM_CONFIG: ConfigItem[] = [
  {
    key: 'influence_threshold_min',
    value: 100,
    category: 'nft_distribution',
    description: 'Minimum influence score required for NFT distribution'
  },
  {
    key: 'influence_threshold_max',
    value: 10000,
    category: 'nft_distribution',
    description: 'Maximum influence score for NFT distribution calculation'
  },
  {
    key: 'nft_base_amount',
    value: 1,
    category: 'nft_distribution',
    description: 'Base NFT amount for distribution'
  },
  {
    key: 'nft_multiplier_factor',
    value: 0.001,
    category: 'nft_distribution',
    description: 'Multiplier factor for calculating NFT amount based on influence'
  },
  {
    key: 'crawler_interval_minutes',
    value: 60,
    category: 'crawler',
    description: 'Interval in minutes between crawler runs'
  },
  {
    key: 'crawler_batch_size',
    value: 20,
    category: 'crawler',
    description: 'Number of tweets to process per batch'
  },
  {
    key: 'api_rate_limit_per_minute',
    value: 300,
    category: 'api',
    description: 'Maximum API requests per minute'
  },
  {
    key: 'api_retry_attempts',
    value: 3,
    category: 'api',
    description: 'Number of retry attempts for failed API calls'
  },
  {
    key: 'tweet_retention_days',
    value: 30,
    category: 'data_retention',
    description: 'Number of days to retain tweet data'
  },
  {
    key: 'user_cache_ttl_hours',
    value: 24,
    category: 'data_retention',
    description: 'TTL for user data cache in hours'
  },
  {
    key: 'solana_network',
    value: 'devnet',
    category: 'blockchain',
    description: 'Solana network to use (mainnet-beta, devnet, testnet)'
  },
  {
    key: 'nft_mint_authority',
    value: '',
    category: 'blockchain',
    description: 'Solana public key for NFT mint authority'
  },
  {
    key: 'gas_fee_limit',
    value: 0.01,
    category: 'blockchain',
    description: 'Maximum gas fee for Solana transactions (in SOL)'
  },
  {
    key: 'log_level',
    value: 'info',
    category: 'system',
    description: 'Application log level (debug, info, warn, error)'
  },
  {
    key: 'maintenance_mode',
    value: false,
    category: 'system',
    description: 'Enable maintenance mode to pause operations'
  }
];

/**
 * NFT Distribution status enumeration
 */
export const NFT_DISTRIBUTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type NFTDistributionStatus = typeof NFT_DISTRIBUTION_STATUS[keyof typeof NFT_DISTRIBUTION_STATUS];

/**
 * Configuration categories
 */
export const CONFIG_CATEGORIES = {
  NFT_DISTRIBUTION: 'nft_distribution',
  CRAWLER: 'crawler',
  API: 'api',
  DATA_RETENTION: 'data_retention',
  BLOCKCHAIN: 'blockchain',
  SYSTEM: 'system'
} as const;

export type ConfigCategory = typeof CONFIG_CATEGORIES[keyof typeof CONFIG_CATEGORIES];

/**
 * Database user roles for production
 */
export const DATABASE_ROLES = {
  APPLICATION: [
    { role: 'readWrite', db: DATABASE_CONFIG.databaseName },
    { role: 'dbAdmin', db: DATABASE_CONFIG.databaseName }
  ],
  READONLY: [
    { role: 'read', db: DATABASE_CONFIG.databaseName }
  ]
} as const;

/**
 * Helper function to get configuration by category
 */
export function getConfigByCategory(category: ConfigCategory): ConfigItem[] {
  return DEFAULT_SYSTEM_CONFIG.filter(config => config.category === category);
}

/**
 * Helper function to get collection names
 */
export function getCollectionNames(): string[] {
  return Object.keys(COLLECTION_SCHEMAS);
}

/**
 * Helper function to validate collection schema
 */
export function validateCollectionSchema(collectionName: string): boolean {
  return collectionName in COLLECTION_SCHEMAS;
}

/**
 * Helper function to get default config value
 */
export function getDefaultConfigValue(key: string): any {
  const config = DEFAULT_SYSTEM_CONFIG.find(item => item.key === key);
  return config?.value;
}
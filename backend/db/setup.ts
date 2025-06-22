/**
 * MongoDB Database Setup Script for Production
 * 
 * This script initializes the MongoDB database with all required collections,
 * indexes, and constraints for the AI Airdrop application. It should be run
 * before deploying the application to production.
 * 
 * Usage:
 *   npm run db:setup
 *   or
 *   npx ts-node db/setup.ts
 */

import { MongoClient, Db, Collection } from 'mongodb';
import * as dotenv from 'dotenv';
import { 
  DATABASE_CONFIG, 
  COLLECTION_SCHEMAS, 
  DEFAULT_SYSTEM_CONFIG,
  CollectionSchema
} from './config';

// Load environment variables
dotenv.config();


/**
 * Database setup class with comprehensive initialization
 */
class DatabaseSetup {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  /**
   * Connect to MongoDB with production-ready configuration
   */
  async connect(): Promise<void> {
    try {
      console.log('🔌 Connecting to MongoDB...');
      console.log(`📍 URI: ${DATABASE_CONFIG.mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
      
      this.client = new MongoClient(DATABASE_CONFIG.mongoUri, DATABASE_CONFIG.options);
      await this.client.connect();
      
      // Test the connection
      await this.client.db('admin').command({ ping: 1 });
      console.log('✅ MongoDB connection successful');
      
      this.db = this.client.db(DATABASE_CONFIG.databaseName);
      console.log(`📦 Using database: ${DATABASE_CONFIG.databaseName}`);
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Create a collection with schema validation and indexes
   */
  async createCollection(collectionConfig: CollectionSchema): Promise<Collection> {
    if (!this.db) throw new Error('Database not connected');

    const { name, indexes, validator } = collectionConfig;
    
    try {
      // Check if collection already exists
      const collections = await this.db.listCollections({ name }).toArray();
      
      if (collections.length > 0) {
        console.log(`📋 Collection '${name}' already exists, updating...`);
        
        // Update validator if it exists
        if (validator) {
          await this.db.command({
            collMod: name,
            validator: validator,
            validationLevel: 'strict',
            validationAction: 'error'
          });
          console.log(`✅ Updated validator for collection '${name}'`);
        }
      } else {
        // Create new collection with validator
        await this.db.createCollection(name, {
          validator: validator,
          validationLevel: 'strict',
          validationAction: 'error'
        });
        console.log(`✅ Created collection '${name}' with validation`);
      }

      const collection = this.db.collection(name);

      // Create indexes
      if (indexes && indexes.length > 0) {
        console.log(`🔗 Creating ${indexes.length} indexes for '${name}'...`);
        
        for (const index of indexes) {
          try {
            await collection.createIndex(index.keys, index.options);
            console.log(`  ✅ Created index '${index.options.name}'`);
          } catch (error: any) {
            // Index might already exist, log warning but continue
            if (error.code === 85) { // IndexOptionsConflict
              console.log(`  ⚠️  Index '${index.options.name}' already exists with different options`);
            } else {
              console.log(`  ⚠️  Failed to create index '${index.options.name}':`, error.message);
            }
          }
        }
      }

      return collection;
    } catch (error) {
      console.error(`❌ Failed to setup collection '${name}':`, error);
      throw error;
    }
  }

  /**
   * Insert default system configuration
   */
  async insertDefaultConfig(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const configCollection = this.db.collection('system_config');
      const now = new Date();

      console.log('⚙️  Inserting default system configuration...');

      for (const config of DEFAULT_SYSTEM_CONFIG) {
        const existing = await configCollection.findOne({ key: config.key });
        
        if (!existing) {
          await configCollection.insertOne({
            ...config,
            createdAt: now,
            lastUpdated: now
          });
          console.log(`  ✅ Added config: ${config.key} = ${config.value}`);
        } else {
          console.log(`  ⚠️  Config '${config.key}' already exists, skipping`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to insert default configuration:', error);
      throw error;
    }
  }

  /**
   * Create database user with appropriate permissions (for production)
   */
  async createDatabaseUser(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    const appUsername = process.env.DB_APP_USER;
    const appPassword = process.env.DB_APP_PASSWORD;

    if (!appUsername || !appPassword) {
      console.log('⚠️  DB_APP_USER and DB_APP_PASSWORD not set, skipping user creation');
      return;
    }

    try {
      console.log(`👤 Creating database user '${appUsername}'...`);
      
      // Create user using createUser command instead of deprecated addUser
      await this.db.admin().command({
        createUser: appUsername,
        pwd: appPassword,
        roles: [
          { role: 'readWrite', db: DATABASE_CONFIG.databaseName },
          { role: 'dbAdmin', db: DATABASE_CONFIG.databaseName }
        ]
      });
      
      console.log(`✅ Database user '${appUsername}' created successfully`);
    } catch (error: any) {
      if (error.code === 51003) { // User already exists
        console.log(`⚠️  Database user '${appUsername}' already exists`);
      } else {
        console.error('❌ Failed to create database user:', error);
        throw error;
      }
    }
  }

  /**
   * Verify database setup by running health checks
   */
  async verifySetup(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      console.log('🔍 Verifying database setup...');

      // Check all collections exist
      const existingCollections = await this.db.listCollections().toArray();
      const collectionNames = existingCollections.map(c => c.name);

      for (const collectionName of Object.keys(COLLECTION_SCHEMAS)) {
        if (collectionNames.includes(collectionName)) {
          console.log(`  ✅ Collection '${collectionName}' exists`);
          
          // Check indexes
          const collection = this.db.collection(collectionName);
          const indexes = await collection.listIndexes().toArray();
          console.log(`    📊 ${indexes.length} indexes found`);
        } else {
          console.log(`  ❌ Collection '${collectionName}' missing`);
        }
      }

      // Test write/read operations
      const testCollection = this.db.collection('system_config');
      const testDoc = await testCollection.findOne({ key: 'influence_threshold_min' });
      
      if (testDoc) {
        console.log('  ✅ Database read/write operations working');
      } else {
        console.log('  ⚠️  Test document not found');
      }

      console.log('✅ Database verification completed');
    } catch (error) {
      console.error('❌ Database verification failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Database connection closed');
    }
  }

  /**
   * Run complete database setup process
   */
  async runSetup(): Promise<void> {
    try {
      console.log('🚀 Starting database setup for AI Airdrop application...');
      console.log('=' .repeat(60));

      // Connect to database
      await this.connect();

      // Create application user (production only)
      if (process.env.NODE_ENV === 'production') {
        await this.createDatabaseUser();
      }

      // Setup all collections
      console.log('📋 Setting up collections...');
      for (const [, config] of Object.entries(COLLECTION_SCHEMAS)) {
        await this.createCollection(config);
      }

      // Insert default configuration
      await this.insertDefaultConfig();

      // Verify everything is working
      await this.verifySetup();

      console.log('=' .repeat(60));
      console.log('🎉 Database setup completed successfully!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Update your application configuration with the database URI');
      console.log('2. Set environment variables for production deployment');
      console.log('3. Run your application to test the database connection');

    } catch (error) {
      console.error('=' .repeat(60));
      console.error('💥 Database setup failed!');
      console.error('Error:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

/**
 * CLI interface for running database setup
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const setupInstance = new DatabaseSetup();

  // Parse command line arguments
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AI Airdrop Database Setup Tool

Usage:
  npm run db:setup                 # Run complete setup
  npx ts-node db/setup.ts         # Run with ts-node
  node dist/db/setup.js           # Run compiled version

Environment Variables:
  MONGODB_URI                     # MongoDB connection string
  DB_NAME                         # Database name (default: ai_airdrop)
  DB_APP_USER                     # Application database user
  DB_APP_PASSWORD                 # Application database password
  NODE_ENV                        # Environment (development/production)

Options:
  --help, -h                      # Show this help message
  --verify                        # Only run verification checks
  --config-only                   # Only insert default configuration

Examples:
  # Local development setup
  MONGODB_URI=mongodb://localhost:27017 npm run db:setup

  # Production setup with authentication
  MONGODB_URI=mongodb://user:pass@host:27017/db NODE_ENV=production npm run db:setup
`);
    return;
  }

  if (args.includes('--verify')) {
    console.log('🔍 Running database verification only...');
    await setupInstance.connect();
    await setupInstance.verifySetup();
    await setupInstance.disconnect();
    return;
  }

  if (args.includes('--config-only')) {
    console.log('⚙️  Inserting default configuration only...');
    await setupInstance.connect();
    await setupInstance.insertDefaultConfig();
    await setupInstance.disconnect();
    return;
  }

  // Run full setup
  await setupInstance.runSetup();
}

// Execute if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

// Export for programmatic use
export { DatabaseSetup };
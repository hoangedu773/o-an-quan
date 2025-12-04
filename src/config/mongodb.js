/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: MongoDB Atlas configuration - USES ENVIRONMENT VARIABLES FOR SECURITY
 */

import { MongoClient, ServerApiVersion } from 'mongodb';

// ✅ SECURE: Use environment variable instead of hardcoded credentials
// Set VITE_MONGODB_URI in .env file (see .env.example)
const MONGO_URI = import.meta.env.VITE_MONGODB_URI || process.env.VITE_MONGODB_URI;
const DB_NAME = 'oanquan_game';

let client = null;
let db = null;

// Validate MongoDB URI
if (!MONGO_URI) {
  console.error('❌ ERROR: VITE_MONGODB_URI environment variable is not set!');
  console.error('📝 Please create a .env file with your MongoDB connection string.');
  console.error('📄 See .env.example for the format.');
}

/**
 * Connect to MongoDB
 */
export async function connectMongoDB() {
  if (!MONGO_URI) {
    throw new Error('MongoDB URI not configured. Please set VITE_MONGODB_URI in .env file.');
  }

  if (!client) {
    try {
      client = new MongoClient(MONGO_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await client.connect();
      db = client.db(DB_NAME);

      console.log('✅ Connected to MongoDB Atlas!');
      console.log('📊 Database:', DB_NAME);

      // Test ping
      await db.command({ ping: 1 });
      console.log('🏓 Pinged deployment. Successfully connected!');

    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  return db;
}

/**
 * Get database instance
 */
export async function getDatabase() {
  if (!db) {
    await connectMongoDB();
  }
  return db;
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}

/**
 * Get Users collection
 */
export async function getUsersCollection() {
  const database = await getDatabase();
  return database.collection('users');
}

/**
 * Get Matches collection
 */
export async function getMatchesCollection() {
  const database = await getDatabase();
  return database.collection('matches');
}

/**
 * Get Leaderboard collection
 */
export async function getLeaderboardCollection() {
  const database = await getDatabase();
  return database.collection('leaderboard');
}

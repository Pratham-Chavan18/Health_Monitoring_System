const { MongoClient } = require('mongodb');

let db;
let client;

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️  MONGO_URI environment variable is not set. Server starting without database.');
      return;
    }

    client = new MongoClient(uri);
    await client.connect();
    db = client.db('hospital');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('⚠️  MongoDB connection failed:', err.message);
    console.warn('⚠️  Server starting without database. API routes requiring DB will fail.');
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

function getClient() {
  return client;
}

module.exports = { connectDB, getDB, getClient };

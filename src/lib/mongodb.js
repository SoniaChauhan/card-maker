/**
 * MongoDB connection singleton — reuses connection across hot reloads in dev.
 * Connection is lazy: only created when getDb() is first called (avoids
 * errors during Next.js build / static page generation).
 */
import { MongoClient } from 'mongodb';

let clientPromise = null;

const MONGO_OPTIONS = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
};

function createConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
  }
  const client = new MongoClient(uri, MONGO_OPTIONS);
  return client.connect();
}

function ensureConnection() {
  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === 'development') {
    // In dev, use a global variable to preserve the connection across hot reloads
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createConnection();
      // Reset on failure so next call retries
      global._mongoClientPromise.catch(() => { global._mongoClientPromise = null; clientPromise = null; });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = createConnection();
    clientPromise.catch(() => { clientPromise = null; });
  }
  return clientPromise;
}

const clientPromiseThenable = { then: (resolve, reject) => ensureConnection().then(resolve, reject) };
export default clientPromiseThenable;

/** Helper — get the card-maker database (dev uses card-maker-dev) */
export async function getDb() {
  const client = await ensureConnection();
  const dbName = process.env.NODE_ENV === 'development' ? 'card-maker-dev' : 'card-maker';
  return client.db(dbName);
}

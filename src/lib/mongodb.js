/**
 * MongoDB connection singleton — reuses connection across hot reloads in dev.
 * Connection is lazy: only created when getDb() is first called (avoids
 * errors during Next.js build / static page generation).
 */
import { MongoClient } from 'mongodb';

let clientPromise = null;

function ensureConnection() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    // In dev, use a global variable to preserve the connection across hot reloads
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default { then: (resolve, reject) => ensureConnection().then(resolve, reject) };

/** Helper — get the card-maker database */
export async function getDb() {
  const client = await ensureConnection();
  return client.db('card-maker');
}

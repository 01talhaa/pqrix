import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGO_URI) {
  throw new Error('Please add your Mongo URI to .env file')
}

const uri: string = process.env.MONGO_URI

// 🚀 Optimized MongoDB connection options
const options = {
  maxPoolSize: 10, // Connection pool size
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip IPv6 lookup
  compressors: ['zlib' as const], // Enable compression
  zlibCompressionLevel: 6 as const, // Balanced compression
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// 🚀 Cached database connection
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise
  
  // Use cached db connection
  if (cachedDb) {
    return { client, db: cachedDb }
  }
  
  const db = client.db('pqrix')
  cachedDb = db
  return { client, db }
}

export default clientPromise

/**
 * Database initialization script
 * Run this to create indexes and optimize the database
 * 
 * Usage: node scripts/init-db.mjs
 */

import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env.local') })
dotenv.config({ path: resolve(__dirname, '../.env') })

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in environment variables')
  console.error('Please create a .env.local or .env file with your MongoDB connection string')
  process.exit(1)
}

async function createDatabaseIndexes() {
  const client = new MongoClient(MONGO_URI)
  
  try {
    console.log('🚀 Connecting to MongoDB...')
    await client.connect()
    const db = client.db('pqrix')
    
    console.log('✅ Connected to database')
    console.log('📊 Creating indexes...\n')

    // Projects indexes
    console.log('Creating projects indexes...')
    await db.collection('projects').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { status: 1 } },
      { key: { year: -1 } },
      { key: { featured: -1, year: -1 } },
      { key: { tags: 1 } },
      { key: { client: 1 } },
    ])
    console.log('✅ Projects indexes created')

    // Services indexes
    console.log('Creating services indexes...')
    await db.collection('services').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { featured: -1 } },
      { key: { order: 1 } },
    ])
    console.log('✅ Services indexes created')

    // Team indexes
    console.log('Creating team indexes...')
    await db.collection('team').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { department: 1 } },
      { key: { role: 1 } },
      { key: { order: 1 } },
    ])
    console.log('✅ Team indexes created')

    // Blogs indexes
    console.log('Creating blogs indexes...')
    await db.collection('blogs').createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { published: -1 } },
      { key: { featured: -1, published: -1 } },
      { key: { author: 1 } },
    ])
    console.log('✅ Blogs indexes created')

    // Bookings indexes
    console.log('Creating bookings indexes...')
    await db.collection('bookings').createIndexes([
      { key: { email: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } },
      { key: { serviceId: 1 } },
    ])
    console.log('✅ Bookings indexes created')

    // Testimonials indexes
    console.log('Creating testimonials indexes...')
    await db.collection('testimonials').createIndexes([
      { key: { featured: -1 } },
      { key: { rating: -1 } },
      { key: { createdAt: -1 } },
    ])
    console.log('✅ Testimonials indexes created')

    // Ads indexes
    console.log('Creating ads indexes...')
    await db.collection('ads').createIndexes([
      { key: { active: 1 } },
      { key: { position: 1 } },
      { key: { expiresAt: 1 } },
    ])
    console.log('✅ Ads indexes created')

    console.log('\n✅ All database indexes created successfully!')
    console.log('🚀 Your database is now optimized for faster queries!')
    
    return true
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    return false
  } finally {
    await client.close()
    console.log('🔌 Database connection closed')
  }
}

// Run the initialization
createDatabaseIndexes()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

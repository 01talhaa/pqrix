// MongoDB Database Indexes for Performance
// Run this script once to create indexes on all collections
// Usage: node scripts/create-indexes.js

require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

async function createIndexes() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not found in environment variables')
    console.error('💡 Make sure you have .env.local file with MONGO_URI')
    process.exit(1)
  }

  const client = new MongoClient(process.env.MONGO_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('pqrix')

    // 🚀 Banners Collection Indexes
    console.log('\n📊 Creating indexes for banners collection...')
    await db.collection('banners').createIndex({ status: 1 })
    await db.collection('banners').createIndex({ order: 1 })
    await db.collection('banners').createIndex({ status: 1, order: 1 })
    await db.collection('banners').createIndex({ createdAt: -1 })
    console.log('✅ Banners indexes created')

    // 🚀 Projects Collection Indexes
    console.log('\n📊 Creating indexes for projects collection...')
    await db.collection('projects').createIndex({ id: 1 }, { unique: true })
    await db.collection('projects').createIndex({ status: 1 })
    await db.collection('projects').createIndex({ featured: 1 })
    await db.collection('projects').createIndex({ order: 1 })
    await db.collection('projects').createIndex({ status: 1, featured: 1 })
    await db.collection('projects').createIndex({ createdAt: -1 })
    console.log('✅ Projects indexes created')

    // 🚀 Services Collection Indexes
    console.log('\n📊 Creating indexes for services collection...')
    await db.collection('services').createIndex({ id: 1 }, { unique: true })
    await db.collection('services').createIndex({ order: 1 })
    await db.collection('services').createIndex({ createdAt: -1 })
    console.log('✅ Services indexes created')

    // 🚀 Team Collection Indexes
    console.log('\n📊 Creating indexes for team collection...')
    await db.collection('team').createIndex({ id: 1 }, { unique: true })
    await db.collection('team').createIndex({ order: 1 })
    await db.collection('team').createIndex({ role: 1 })
    await db.collection('team').createIndex({ createdAt: -1 })
    console.log('✅ Team indexes created')

    // 🚀 Blogs Collection Indexes
    console.log('\n📊 Creating indexes for blogs collection...')
    await db.collection('blogs').createIndex({ slug: 1 }, { unique: true })
    await db.collection('blogs').createIndex({ status: 1 })
    await db.collection('blogs').createIndex({ status: 1, publishedAt: -1 })
    await db.collection('blogs').createIndex({ tags: 1 })
    await db.collection('blogs').createIndex({ createdAt: -1 })
    console.log('✅ Blogs indexes created')

    // 🚀 Testimonials Collection Indexes
    console.log('\n📊 Creating indexes for testimonials collection...')
    await db.collection('testimonials').createIndex({ status: 1 })
    await db.collection('testimonials').createIndex({ rating: -1 })
    await db.collection('testimonials').createIndex({ status: 1, rating: -1 })
    await db.collection('testimonials').createIndex({ createdAt: -1 })
    console.log('✅ Testimonials indexes created')

    // 🚀 Ads Collection Indexes
    console.log('\n📊 Creating indexes for ads collection...')
    await db.collection('ads').createIndex({ status: 1 })
    await db.collection('ads').createIndex({ createdAt: -1 })
    console.log('✅ Ads indexes created')

    // 🚀 Bookings Collection Indexes
    console.log('\n📊 Creating indexes for bookings collection...')
    await db.collection('bookings').createIndex({ email: 1 })
    await db.collection('bookings').createIndex({ status: 1 })
    await db.collection('bookings').createIndex({ createdAt: -1 })
    console.log('✅ Bookings indexes created')

    // 🚀 Clients Collection Indexes
    console.log('\n📊 Creating indexes for clients collection...')
    await db.collection('clients').createIndex({ email: 1 }, { unique: true })
    await db.collection('clients').createIndex({ createdAt: -1 })
    console.log('✅ Clients indexes created')

    // List all indexes
    console.log('\n📋 Listing all indexes...\n')
    const collections = ['banners', 'projects', 'services', 'team', 'blogs', 'testimonials', 'ads', 'bookings', 'clients']
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes()
      console.log(`\n${collectionName}:`)
      indexes.forEach(index => {
        console.log(`  - ${JSON.stringify(index.key)} (${index.unique ? 'unique' : 'non-unique'})`)
      })
    }

    console.log('\n\n✅ All indexes created successfully!')
    console.log('🚀 Database is now optimized for performance!')

  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n✅ Connection closed')
  }
}

createIndexes()

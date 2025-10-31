import { connectToDatabase } from './mongodb'

/**
 * Create database indexes for optimal performance
 * Run this once during deployment or setup
 */
export async function createDatabaseIndexes() {
  try {
    const { db } = await connectToDatabase()

    console.log('🚀 Creating database indexes...')

    // Projects indexes
    await db.collection('projects').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { status: 1 } },
      { key: { year: -1 } },
      { key: { featured: -1, year: -1 } },
      { key: { tags: 1 } },
      { key: { client: 1 } },
    ])

    // Services indexes
    await db.collection('services').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { featured: -1 } },
      { key: { order: 1 } },
    ])

    // Team indexes
    await db.collection('team').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { department: 1 } },
      { key: { role: 1 } },
      { key: { order: 1 } },
    ])

    // Blogs indexes
    await db.collection('blogs').createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { published: -1 } },
      { key: { featured: -1, published: -1 } },
      { key: { author: 1 } },
    ])

    // Bookings indexes
    await db.collection('bookings').createIndexes([
      { key: { email: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } },
      { key: { serviceId: 1 } },
    ])

    // Testimonials indexes
    await db.collection('testimonials').createIndexes([
      { key: { featured: -1 } },
      { key: { rating: -1 } },
      { key: { createdAt: -1 } },
    ])

    // Ads indexes
    await db.collection('ads').createIndexes([
      { key: { active: 1 } },
      { key: { position: 1 } },
      { key: { expiresAt: 1 } },
    ])

    console.log('✅ Database indexes created successfully!')
    return true
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    return false
  }
}

/**
 * Check and create indexes if they don't exist
 */
export async function ensureIndexes() {
  try {
    const { db } = await connectToDatabase()
    
    // Check if indexes exist
    const collections = ['projects', 'services', 'team', 'blogs', 'bookings', 'testimonials', 'ads']
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes()
      
      // If only default _id index exists, create all indexes
      if (indexes.length <= 1) {
        console.log(`📊 Creating indexes for ${collectionName}...`)
        await createDatabaseIndexes()
        break
      }
    }
  } catch (error) {
    console.error('Error ensuring indexes:', error)
  }
}

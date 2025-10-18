// Simple script to check testimonials in MongoDB
const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// Manually read .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        process.env[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    }
  }
}

loadEnv()

async function checkTestimonials() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI not found in environment variables')
    process.exit(1)
  }

  console.log('Connecting to MongoDB...')
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected successfully')

    const db = client.db('pqrix')
    
    // List all collections
    const collections = await db.listCollections().toArray()
    console.log('\nAvailable collections:')
    collections.forEach(col => console.log(`  - ${col.name}`))

    // Check testimonials collection
    console.log('\n--- Checking testimonials collection ---')
    const testimonialsCount = await db.collection('testimonials').countDocuments()
    console.log(`Total testimonials: ${testimonialsCount}`)

    if (testimonialsCount > 0) {
      const testimonials = await db.collection('testimonials').find({}).toArray()
      console.log('\nTestimonials in database:')
      testimonials.forEach((t, idx) => {
        console.log(`\n${idx + 1}. ${t.clientName || 'No name'} (${t.clientEmail || 'No email'})`)
        console.log(`   Review: ${t.review?.substring(0, 50)}...`)
        console.log(`   Rating: ${t.rating}`)
        console.log(`   Approved: ${t.approved}`)
        console.log(`   Images: ${t.images?.length || 0}`)
        console.log(`   Created: ${t.createdAt}`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nConnection closed')
  }
}

checkTestimonials()

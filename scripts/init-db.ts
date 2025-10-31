/**
 * Database initialization script
 * Run this to create indexes and optimize the database
 * 
 * Usage: npm run db:init
 */

import { createDatabaseIndexes } from '../lib/db-indexes'

async function main() {
  console.log('🚀 Starting database initialization...\n')
  
  const success = await createDatabaseIndexes()
  
  if (success) {
    console.log('\n✅ Database initialization completed successfully!')
    console.log('Your database is now optimized for faster queries.')
    process.exit(0)
  } else {
    console.log('\n❌ Database initialization failed!')
    console.log('Please check the errors above and try again.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

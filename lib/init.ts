import { ensureIndexes } from './db-indexes'

// Initialize database on app start
let initialized = false

export async function initializeApp() {
  if (initialized) {
    return
  }

  try {
    console.log('🚀 Initializing application...')
    
    // Create database indexes
    await ensureIndexes()
    
    initialized = true
    console.log('✅ Application initialized successfully!')
  } catch (error) {
    console.error('❌ Failed to initialize application:', error)
  }
}

// Auto-initialize in production
if (process.env.NODE_ENV === 'production') {
  initializeApp()
}

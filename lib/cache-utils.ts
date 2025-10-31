import cache from './cache'

/**
 * Invalidate cache when data changes
 */
export function invalidateCacheOnUpdate(collection: string) {
  console.log(`🔄 Invalidating cache for: ${collection}`)
  
  switch (collection) {
    case 'projects':
      cache.invalidatePattern('projects:')
      break
    case 'services':
      cache.invalidatePattern('services:')
      break
    case 'team':
      cache.invalidatePattern('team:')
      break
    case 'blogs':
      cache.invalidatePattern('blogs:')
      break
    default:
      // Invalidate all if unknown
      cache.clear()
  }
  
  console.log('✅ Cache invalidated')
}

/**
 * Clear all caches (useful for admin operations)
 */
export function clearAllCaches() {
  console.log('🔄 Clearing all caches...')
  cache.clear()
  console.log('✅ All caches cleared')
}

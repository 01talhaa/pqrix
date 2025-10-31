/**
 * In-memory cache for fast data retrieval
 * Uses LRU (Least Recently Used) strategy
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>
  private maxSize: number

  constructor(maxSize: number = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    // Move to end (LRU strategy)
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.data
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Delete item from cache
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Invalidate all keys matching pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys())
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    })
  }
}

// Global cache instance
const cache = new MemoryCache(200)

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30000,      // 30 seconds
  MEDIUM: 60000,     // 1 minute
  LONG: 300000,      // 5 minutes
  VERY_LONG: 600000, // 10 minutes
  HOUR: 3600000,     // 1 hour
}

// Cache key generators
export const cacheKeys = {
  projects: {
    all: () => 'projects:all',
    byId: (id: string) => `projects:${id}`,
    byCategory: (category: string) => `projects:category:${category}`,
    featured: () => 'projects:featured',
  },
  services: {
    all: () => 'services:all',
    byId: (id: string) => `services:${id}`,
    featured: () => 'services:featured',
  },
  team: {
    all: () => 'team:all',
    byId: (id: string) => `team:${id}`,
    byDepartment: (dept: string) => `team:dept:${dept}`,
  },
  blogs: {
    all: () => 'blogs:all',
    bySlug: (slug: string) => `blogs:${slug}`,
    featured: () => 'blogs:featured',
  },
}

export default cache

/**
 * Helper function to get or set cache
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  cache.set(key, data, ttl)
  
  return data
}

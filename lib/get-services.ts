import { connectToDatabase } from '@/lib/mongodb'
import { SERVICES_COLLECTION } from '@/lib/models/Service'
import cache, { getOrSet, cacheKeys, CACHE_TTL } from '@/lib/cache'

export async function getAllServicesForBuild() {
  return getOrSet(
    cacheKeys.services.all(),
    async () => {
      try {
        const { db } = await connectToDatabase()
        const services = await db
          .collection(SERVICES_COLLECTION)
          .find({})
          .sort({ order: 1, createdAt: -1 })
          .toArray()

        // Convert MongoDB documents to plain objects
        return services.map(service => {
          const { _id, ...rest } = service
          return {
            ...rest,
            _id: _id.toString(),
          }
        })
      } catch (error) {
        console.error('Error fetching services from database:', error)
        return []
      }
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}

export async function getServiceByIdForBuild(id: string) {
  return getOrSet(
    cacheKeys.services.byId(id),
    async () => {
      try {
        const { db } = await connectToDatabase()
        const service = await db
          .collection(SERVICES_COLLECTION)
          .findOne({ id })

        if (!service) return null

        const { _id, ...rest } = service
        return {
          ...rest,
          _id: _id.toString(),
        }
      } catch (error) {
        console.error('Error fetching service from database:', error)
        return null
      }
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}

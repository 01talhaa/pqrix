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
          .sort({ priority: 1, createdAt: -1 })
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

// Get only id and title for filters (serialization-safe)
// export async function getServicesForFilter() {
//   return getOrSet(
//     cacheKeys.services.filter(),
//     async () => {
//       try {
//         const { db } = await connectToDatabase()
//         const services = await db
//           .collection(SERVICES_COLLECTION)
//           .find({})
//           .sort({ priority: 1, createdAt: -1 })
//           .project({ id: 1, title: 1, _id: 0 }) // Only get id and title
//           .toArray()

//         return services
//       } catch (error) {
//         console.error('Error fetching services for filter:', error)
//         return []
//       }
//     },
//     CACHE_TTL.LONG // Cache for 5 minutes
//   )
// }

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

// Get only id and title for filters (serialization-safe, no dates)
export async function getServicesForFilter(): Promise<Array<{id: string, title: string}>> {
  return getOrSet(
    cacheKeys.services.filter(),
    async () => {
      try {
        const { db } = await connectToDatabase()
        const services = await db
          .collection(SERVICES_COLLECTION)
          .find({})
          .sort({ priority: 1, createdAt: -1 })
          .project({ id: 1, title: 1, _id: 0 }) // Only get id and title, exclude _id
          .toArray()

        // Ensure proper typing
        return services.map(s => ({
          id: s.id || '',
          title: s.title || ''
        }))
      } catch (error) {
        console.error('Error fetching services for filter:', error)
        return []
      }
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}

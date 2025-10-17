import { connectToDatabase } from '@/lib/mongodb'
import { SERVICES_COLLECTION } from '@/lib/models/Service'

export async function getAllServicesForBuild() {
  try {
    const { db } = await connectToDatabase()
    const services = await db
      .collection(SERVICES_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
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
}

export async function getServiceByIdForBuild(id: string) {
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
}

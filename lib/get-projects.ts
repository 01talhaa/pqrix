import { connectToDatabase } from '@/lib/mongodb'
import { PROJECTS_COLLECTION } from '@/lib/models/Project'
import cache, { getOrSet, cacheKeys, CACHE_TTL } from '@/lib/cache'

export async function getAllProjectsForBuild() {
  return getOrSet(
    cacheKeys.projects.all(),
    async () => {
      try {
        const { db } = await connectToDatabase()
        const projects = await db
          .collection(PROJECTS_COLLECTION)
          .find({})
          .sort({ year: -1, createdAt: -1 })
          .project({ 
            // Only fetch needed fields for listing
            id: 1, 
            title: 1, 
            description: 1, 
            category: 1, 
            client: 1,
            year: 1,
            status: 1,
            image: 1,
            video: 1,
            tags: 1,
            featured: 1,
            images: { $slice: 1 } // Only first image for listing
          })
          .toArray()

        // Convert MongoDB documents to plain objects
        return projects.map(project => {
          const { _id, ...rest } = project
          return {
            ...rest,
            _id: _id.toString(),
          }
        })
      } catch (error) {
        console.error('Error fetching projects from database:', error)
        return []
      }
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}

export async function getProjectByIdForBuild(id: string) {
  return getOrSet(
    cacheKeys.projects.byId(id),
    async () => {
      try {
        const { db } = await connectToDatabase()
        const project = await db
          .collection(PROJECTS_COLLECTION)
          .findOne({ id })

        if (!project) return null

        const { _id, ...rest } = project
        return {
          ...rest,
          _id: _id.toString(),
        }
      } catch (error) {
        console.error('Error fetching project from database:', error)
        return null
      }
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}


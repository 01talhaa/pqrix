import { connectToDatabase } from '@/lib/mongodb'
import { PROJECTS_COLLECTION } from '@/lib/models/Project'

export async function getAllProjectsForBuild() {
  try {
    const { db } = await connectToDatabase()
    const projects = await db
      .collection(PROJECTS_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
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
}

export async function getProjectByIdForBuild(id: string) {
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
}


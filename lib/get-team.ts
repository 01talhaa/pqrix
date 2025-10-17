import { connectToDatabase } from '@/lib/mongodb'
import { TEAM_COLLECTION } from '@/lib/models/TeamMember'

export async function getAllTeamMembersForBuild() {
  try {
    const { db } = await connectToDatabase()
    const teamMembers = await db
      .collection(TEAM_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return teamMembers.map(member => {
      const { _id, ...rest } = member
      return {
        ...rest,
        _id: _id.toString(),
      }
    })
  } catch (error) {
    console.error('Error fetching team members from database:', error)
    return []
  }
}

export async function getTeamMemberByIdForBuild(id: string) {
  try {
    const { db } = await connectToDatabase()
    const teamMember = await db
      .collection(TEAM_COLLECTION)
      .findOne({ id })

    if (!teamMember) return null

    const { _id, ...rest } = teamMember
    return {
      ...rest,
      _id: _id.toString(),
    }
  } catch (error) {
    console.error('Error fetching team member from database:', error)
    return null
  }
}

import { connectToDatabase } from '@/lib/mongodb'
import { TEAM_COLLECTION } from '@/lib/models/TeamMember'
import cache, { getOrSet, cacheKeys, CACHE_TTL } from '@/lib/cache'

export async function getAllTeamMembersForBuild() {
  return getOrSet(
    cacheKeys.team.all(),
    async () => {
      try {
        const { db } = await connectToDatabase()
        const teamMembers = await db
          .collection(TEAM_COLLECTION)
          .find({})
          .sort({ order: 1, createdAt: -1 })
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
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}

export async function getTeamMemberByIdForBuild(id: string) {
  return getOrSet(
    cacheKeys.team.byId(id),
    async () => {
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
    },
    CACHE_TTL.LONG // Cache for 5 minutes
  )
}

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClientDocument, ClientProject } from "@/lib/models/Client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, project } = body as {
      clientId: string
      project: ClientProject
    }

    if (!clientId || !project) {
      return NextResponse.json(
        { success: false, error: "Client ID and project data are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    // Find the client
    const client = await collection.findOne({ id: clientId })
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      )
    }

    // Check if project already exists
    const existingProjectIndex = client.projects?.findIndex(
      (p) => p.projectId === project.projectId
    ) ?? -1

    let result
    if (existingProjectIndex >= 0) {
      // Update existing project
      result = await collection.updateOne(
        { id: clientId },
        {
          $set: {
            [`projects.${existingProjectIndex}`]: project,
            updatedAt: new Date().toISOString(),
          },
        }
      )
    } else {
      // Add new project
      result = await collection.updateOne(
        { id: clientId },
        {
          $push: { projects: project },
          $set: { updatedAt: new Date().toISOString() },
        }
      )
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update project" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Project updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const projectId = searchParams.get("projectId")

    if (!clientId || !projectId) {
      return NextResponse.json(
        { success: false, error: "Client ID and Project ID are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    const result = await collection.updateOne(
      { id: clientId },
      {
        $pull: { projects: { projectId } },
        $set: { updatedAt: new Date().toISOString() },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete project" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Project deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    )
  }
}

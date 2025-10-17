import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { SERVICES_COLLECTION, ServiceDocument } from '@/lib/models/Service'
import { ObjectId } from 'mongodb'

// GET all services
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const services = await db
      .collection(SERVICES_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Convert ObjectId to string
    const servicesWithStringId = services.map(service => ({
      ...service,
      _id: service._id.toString(),
    }))

    return NextResponse.json({ 
      success: true, 
      data: servicesWithStringId 
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST - Create new service
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Create service document
    const serviceDoc: ServiceDocument = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db
      .collection(SERVICES_COLLECTION)
      .insertOne(serviceDoc)

    return NextResponse.json({
      success: true,
      data: {
        ...serviceDoc,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

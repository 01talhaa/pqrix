import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CaseStudyDocument {
  _id?: string
  title: string
  industry: string
  clientType: string
  challenge: string
  solution: string
  result: string
  image?: string
  metrics?: { label: string; value: string }[]
  technologies?: string[]
  isActive: boolean
  order: number
  createdAt?: Date
  updatedAt?: Date
}

// GET - Fetch all case studies or single case study by id
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<CaseStudyDocument>('casestudies')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    if (id) {
      const { ObjectId } = await import('mongodb')
      const caseStudy = await collection.findOne({ _id: new ObjectId(id) })
      
      if (!caseStudy) {
        return NextResponse.json(
          { success: false, message: 'Case study not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: caseStudy })
    }

    const query = activeOnly ? { isActive: true } : {}
    const caseStudies = await collection
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json(
      { success: true, data: caseStudies },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error: any) {
    console.error('Error fetching case studies:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch case studies' },
      { status: 500 }
    )
  }
}

// POST - Create new case study
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<CaseStudyDocument>('casestudies')

    const body = await request.json()
    const {
      title,
      industry,
      clientType,
      challenge,
      solution,
      result,
      image,
      metrics,
      technologies,
      isActive,
      order
    } = body

    // Validation
    if (!title || !industry || !clientType || !challenge || !solution || !result) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    const caseStudy: CaseStudyDocument = {
      title,
      industry,
      clientType,
      challenge,
      solution,
      result,
      image: image || '',
      metrics: metrics || [],
      technologies: technologies || [],
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result2 = await collection.insertOne(caseStudy as any)

    // Revalidate cache
    revalidatePath('/')
    revalidatePath('/admin/case-studies')

    return NextResponse.json(
      { 
        success: true, 
        data: { ...caseStudy, _id: result2.insertedId }, 
        message: 'Case study created successfully' 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating case study:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create case study' },
      { status: 500 }
    )
  }
}

// PUT - Update case study
export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<CaseStudyDocument>('casestudies')

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Case study ID is required' },
        { status: 400 }
      )
    }

    const { ObjectId } = await import('mongodb')
    
    // Add updatedAt timestamp
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date()
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dataToUpdate },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Case study not found' },
        { status: 404 }
      )
    }

    // Revalidate cache
    revalidatePath('/')
    revalidatePath('/admin/case-studies')

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Case study updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating case study:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update case study' },
      { status: 500 }
    )
  }
}

// DELETE - Delete case study
export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<CaseStudyDocument>('casestudies')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Case study ID is required' },
        { status: 400 }
      )
    }

    const { ObjectId } = await import('mongodb')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Case study not found' },
        { status: 404 }
      )
    }

    // Revalidate cache
    revalidatePath('/')
    revalidatePath('/admin/case-studies')

    return NextResponse.json({
      success: true,
      message: 'Case study deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting case study:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete case study' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import CaseStudy from '@/lib/models/CaseStudy'
import { revalidatePath } from 'next/cache'

// Mongoose connection
const MONGO_URI = process.env.MONGO_URI || ''

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

// GET - Fetch all case studies or single case study by id
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    if (id) {
      const caseStudy = await CaseStudy.findById(id)
      if (!caseStudy) {
        return NextResponse.json(
          { success: false, message: 'Case study not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: caseStudy })
    }

    const query = activeOnly ? { isActive: true } : {}
    const caseStudies = await CaseStudy.find(query).sort({ order: 1, createdAt: -1 })

    return NextResponse.json(
      { success: true, data: caseStudies },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
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
    await connectDB()

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

    const caseStudy = await CaseStudy.create({
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
      order: order || 0
    })

    // Revalidate cache
    revalidatePath('/')
    revalidatePath('/admin/case-studies')

    return NextResponse.json(
      { success: true, data: caseStudy, message: 'Case study created successfully' },
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
    await connectDB()

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Case study ID is required' },
        { status: 400 }
      )
    }

    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!caseStudy) {
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
      data: caseStudy,
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
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Case study ID is required' },
        { status: 400 }
      )
    }

    const caseStudy = await CaseStudy.findByIdAndDelete(id)

    if (!caseStudy) {
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

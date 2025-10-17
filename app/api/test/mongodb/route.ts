import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const startTime = Date.now()
    const { db, client } = await connectToDatabase()
    
    // Test the connection by running a simple command
    await db.command({ ping: 1 })
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
      duration: `${duration}ms`,
    })
  } catch (error) {
    console.error('MongoDB test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'MongoDB connection failed',
      },
      { status: 500 }
    )
  }
}

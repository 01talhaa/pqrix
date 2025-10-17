import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Verify config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not configured')
    }
    
    // Test the connection by getting cloud info
    const result = await cloudinary.api.ping()
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      status: result.status,
      duration: `${duration}ms`,
    })
  } catch (error) {
    console.error('Cloudinary test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Cloudinary connection failed',
      },
      { status: 500 }
    )
  }
}

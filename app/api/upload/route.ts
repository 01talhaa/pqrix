import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

// POST /api/upload - Upload images to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    console.log(`Uploading ${files.length} files...`)

    const uploadPromises = files.map(async (file) => {
      try {
        console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`)
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const url = await uploadToCloudinary(buffer, 'pqrix-projects')
        console.log(`Successfully uploaded: ${file.name}`)
        return url
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err)
        throw err
      }
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      data: uploadedUrls,
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload files'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

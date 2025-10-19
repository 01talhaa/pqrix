import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

/**
 * GET /api/chat/test-gemini
 * Tests if Gemini API is working and which models are available
 */
export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not set",
      })
    }

    console.log("🧪 Testing Gemini API...")
    console.log("🔑 API Key length:", apiKey.length)

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try different models
    const modelsToTry = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash",
    ]

    const results = []

    for (const modelName of modelsToTry) {
      try {
        console.log(`🧪 Testing model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent("Say hello in one word")
        const response = await result.response
        const text = response.text()
        
        results.push({
          model: modelName,
          success: true,
          response: text,
        })
        console.log(`✅ ${modelName} works! Response: ${text}`)
      } catch (error: any) {
        results.push({
          model: modelName,
          success: false,
          error: error.message,
        })
        console.log(`❌ ${modelName} failed: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      apiKeyLength: apiKey.length,
      results,
      workingModels: results.filter(r => r.success).map(r => r.model),
      failedModels: results.filter(r => !r.success).map(r => r.model),
    })

  } catch (error: any) {
    console.error("❌ Test failed:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}

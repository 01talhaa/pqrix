/**
 * Test script to verify AI chatbot is using real-time database data
 * Run: node scripts/test-ai.mjs
 */

const testQueries = [
  "What services do you offer?",
  "Tell me about your projects",
  "Who is on your team?",
  "What are your prices?",
  "Show me your testimonials"
]

async function testChatbot() {
  console.log('🧪 Testing AI Chatbot with Real-Time Data\n')
  
  for (const query of testQueries) {
    console.log(`\n📤 Question: "${query}"`)
    console.log('⏳ Waiting for response...\n')
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          conversationHistory: []
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Response received:')
        console.log('─'.repeat(80))
        console.log(data.message)
        console.log('─'.repeat(80))
        
        if (data.fallback) {
          console.log('⚠️  WARNING: Using fallback response (not real-time data)')
        } else {
          console.log('✅ Using real-time database data')
        }
      } else {
        console.log('❌ Error:', data.error || data.message)
      }
      
      // Wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error('❌ Request failed:', error.message)
    }
  }
  
  console.log('\n✅ Test complete!')
}

testChatbot()

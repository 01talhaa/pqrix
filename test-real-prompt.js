const https = require('https');

const API_KEY = 'AIzaSyD1RLEaU2ltCKG6iOjXhzFLUg72rlyLNZ0';
const MODEL = 'gemini-2.5-flash';

function testRealPrompt() {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    const testContext = `SERVICES WE OFFER:
- Web Development: Custom web applications (Pricing: $5000+)
- Mobile Apps: iOS and Android apps (Pricing: $8000+)
- 3D Web: Interactive 3D experiences (Pricing: $6000+)

OUR PROJECTS:
- E-commerce Platform (Retail): Built for ABC Company
- Mobile Banking App (Fintech): Built for XYZ Bank

TEAM MEMBERS:
- John Doe (CEO): 10 years experience in software
- Jane Smith (CTO): Expert in AI and ML`;

    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: `You are Pqrix AI Assistant. Use this data to answer:\n\n${testContext}\n\nUser Question: What services do you offer?\n\nAnswer professionally:`
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 500,
      }
    });

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 15000
    }, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });
      
      res.on('end', () => {
        console.log(`🔍 Testing model: ${MODEL}`);
        console.log(`📊 Status: ${res.statusCode}\n`);
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.candidates && response.candidates[0]) {
            const text = response.candidates[0].content.parts[0].text;
            console.log(`✅ SUCCESS! AI Response:\n`);
            console.log(`${'='.repeat(60)}`);
            console.log(text);
            console.log(`${'='.repeat(60)}\n`);
            console.log(`🎯 This model works! Use "${MODEL}" in your code.\n`);
            resolve(text);
          } else {
            console.log(`❌ FAILED:`);
            console.log(JSON.stringify(response, null, 2));
            resolve(null);
          }
        } catch (error) {
          console.log(`❌ Parse Error: ${error.message}`);
          console.log(`Raw Response: ${responseData.substring(0, 500)}`);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Network Error: ${error.message}`);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`❌ Timeout`);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

console.log('🚀 Testing Gemini API with real prompt...\n');
testRealPrompt();

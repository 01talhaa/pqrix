const https = require('https');

const API_KEY = 'AIzaSyD1RLEaU2ltCKG6iOjXhzFLUg72rlyLNZ0';

// Test different model names
const models = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest'
];

async function testModel(modelName) {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    
    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: "Say 'Hello from Pqrix!' if you can read this."
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 100,
      }
    });

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 10000
    }, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });
      
      res.on('end', () => {
        console.log(`\n🔍 Testing model: ${modelName}`);
        console.log(`   Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(responseData);
          
          if (res.statusCode === 200 && response.candidates && response.candidates[0]) {
            const text = response.candidates[0].content.parts[0].text;
            console.log(`   ✅ SUCCESS! Response: ${text.substring(0, 100)}`);
            resolve({ model: modelName, success: true, response: text });
          } else {
            console.log(`   ❌ FAILED: ${JSON.stringify(response).substring(0, 200)}`);
            resolve({ model: modelName, success: false, error: response });
          }
        } catch (error) {
          console.log(`   ❌ Parse Error: ${error.message}`);
          console.log(`   Raw Response: ${responseData.substring(0, 300)}`);
          resolve({ model: modelName, success: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`\n🔍 Testing model: ${modelName}`);
      console.log(`   ❌ Network Error: ${error.message}`);
      resolve({ model: modelName, success: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`\n🔍 Testing model: ${modelName}`);
      console.log(`   ❌ Timeout`);
      resolve({ model: modelName, success: false, error: 'Timeout' });
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing Gemini API with different models...\n');
  
  const results = [];
  for (const model of models) {
    const result = await testModel(model);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n\n📊 SUMMARY:\n');
  const workingModels = results.filter(r => r.success);
  
  if (workingModels.length > 0) {
    console.log('✅ Working models:');
    workingModels.forEach(r => {
      console.log(`   - ${r.model}`);
    });
    console.log(`\n🎯 Use this model in your code: "${workingModels[0].model}"`);
  } else {
    console.log('❌ No models working! Check your API key.');
    console.log('\nFailed models:');
    results.forEach(r => {
      console.log(`   - ${r.model}: ${JSON.stringify(r.error).substring(0, 100)}`);
    });
  }
}

runTests();

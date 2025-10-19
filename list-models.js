const https = require('https');

const API_KEY = 'AIzaSyD1RLEaU2ltCKG6iOjXhzFLUg72rlyLNZ0';

function listModels() {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
    https.get(url, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log('📋 Available Gemini Models:\n');
          
          if (response.models) {
            response.models.forEach(model => {
              const name = model.name.replace('models/', '');
              const supportedMethods = model.supportedGenerationMethods || [];
              const supportsGenerate = supportedMethods.includes('generateContent');
              
              console.log(`${supportsGenerate ? '✅' : '❌'} ${name}`);
              if (model.displayName) {
                console.log(`   Display: ${model.displayName}`);
              }
              if (supportsGenerate) {
                console.log(`   Methods: ${supportedMethods.join(', ')}`);
              }
              console.log('');
            });
            
            // Find working models
            const workingModels = response.models
              .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
              .map(m => m.name.replace('models/', ''));
            
            if (workingModels.length > 0) {
              console.log('\n🎯 RECOMMENDED MODEL TO USE:');
              console.log(`   "${workingModels[0]}"\n`);
              resolve(workingModels[0]);
            } else {
              console.log('\n❌ No models support generateContent');
              resolve(null);
            }
          } else if (response.error) {
            console.log(`❌ API Error: ${response.error.message}`);
            resolve(null);
          }
        } catch (error) {
          console.log(`❌ Parse Error: ${error.message}`);
          console.log(`Raw Response: ${responseData.substring(0, 500)}`);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.log(`❌ Network Error: ${error.message}`);
      resolve(null);
    });
  });
}

listModels();

// Test simple para verificar conexión
const http = require('http');

const testHealthCheck = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Backend response:', JSON.parse(data));
      testContactEndpoint();
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error connecting to backend:', err.message);
  });

  req.end();
};

const testContactEndpoint = () => {
  const postData = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Este es un mensaje de prueba más largo para verificar que el backend funciona correctamente'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📧 Contact endpoint status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📧 Contact response:', JSON.parse(data));
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error with contact endpoint:', err.message);
  });

  req.write(postData);
  req.end();
};

console.log('🔍 Testing backend connectivity...');
testHealthCheck();

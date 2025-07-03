// Test específico para el endpoint de contacto
const http = require('http');

const testContactEndpointDetailed = () => {
  const postData = JSON.stringify({
    name: 'Test User Detailed',
    email: 'test@example.com',
    message: 'Este es un mensaje de prueba más largo para verificar que el backend funciona correctamente con más de 10 caracteres'
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

  console.log('📧 Enviando request detallado...');
  console.log('📧 Data:', JSON.parse(postData));

  const req = http.request(options, (res) => {
    console.log(`📧 Status: ${res.statusCode}`);
    console.log(`📧 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📧 Parsed Response:', response);
      } catch (e) {
        console.log('📧 Raw Response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Request Error:', err.message);
  });

  req.write(postData);
  req.end();
};

// Primero probar health check
const testHealth = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Health Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Health Response:', JSON.parse(data));
      console.log('\n--- Ahora probando endpoint de contacto ---\n');
      testContactEndpointDetailed();
    });
  });

  req.on('error', (err) => {
    console.error('❌ Health Check Error:', err.message);
  });

  req.end();
};

console.log('🔍 Iniciando test detallado...');
testHealth();

import https from 'https';
import http from 'http';

// Función para hacer peticiones HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0',
        ...options.headers
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testBackendProduction() {
  console.log('🧪 Iniciando pruebas del backend en producción...');
  
  const backendUrl = 'https://planix-backend-node-production.up.railway.app';
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Probando health check...');
    const healthResponse = await makeRequest(`${backendUrl}/health`);
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response:`, healthResponse.data);
    
    if (healthResponse.status === 200) {
      console.log('   ✅ Health check exitoso');
    } else {
      console.log('   ❌ Health check falló');
    }
    
    // Test 2: API Health check
    console.log('\n2️⃣ Probando API health check...');
    const apiHealthResponse = await makeRequest(`${backendUrl}/api/health`);
    console.log(`   Status: ${apiHealthResponse.status}`);
    console.log(`   Response:`, apiHealthResponse.data);
    
    if (apiHealthResponse.status === 200) {
      console.log('   ✅ API health check exitoso');
    } else {
      console.log('   ❌ API health check falló');
    }
    
    // Test 3: Chat endpoint
    console.log('\n3️⃣ Probando endpoint de chat...');
    const chatResponse = await makeRequest(`${backendUrl}/api/chat`, {
      method: 'POST',
      body: {
        message: 'Hola, esto es una prueba del deployment'
      }
    });
    console.log(`   Status: ${chatResponse.status}`);
    console.log(`   Response:`, chatResponse.data);
    
    if (chatResponse.status === 200) {
      console.log('   ✅ Chat endpoint funcionando');
    } else {
      console.log('   ❌ Chat endpoint falló');
    }
    
    // Test 4: Contact endpoint
    console.log('\n4️⃣ Probando endpoint de contacto...');
    const contactResponse = await makeRequest(`${backendUrl}/api/contact`, {
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Mensaje de prueba del deployment'
      }
    });
    console.log(`   Status: ${contactResponse.status}`);
    console.log(`   Response:`, contactResponse.data);
    
    if (contactResponse.status === 200) {
      console.log('   ✅ Contact endpoint funcionando');
    } else {
      console.log('   ❌ Contact endpoint falló');
    }
    
    console.log('\n🎯 Resumen de pruebas completado');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testBackendProduction();
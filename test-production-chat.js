// Test script para verificar el chat en producción
const https = require('https');
const http = require('http');

const FRONTEND_URL = 'https://planix-frontend-production.up.railway.app';
const BACKEND_URL = 'https://planix-backend-node-production.up.railway.app';

console.log('🚀 Iniciando pruebas de producción...');
console.log('Frontend URL:', FRONTEND_URL);
console.log('Backend URL:', BACKEND_URL);

// Función para hacer peticiones HTTP
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

// Test 1: Verificar que el frontend esté disponible
async function testFrontend() {
    console.log('\n📱 Probando Frontend...');
    try {
        const response = await makeRequest(FRONTEND_URL);
        console.log('✅ Frontend Status:', response.statusCode);
        console.log('✅ Frontend disponible');
        return true;
    } catch (error) {
        console.log('❌ Error en Frontend:', error.message);
        return false;
    }
}

// Test 2: Verificar que el backend esté disponible
async function testBackend() {
    console.log('\n🔧 Probando Backend...');
    try {
        const response = await makeRequest(BACKEND_URL + '/health');
        console.log('✅ Backend Status:', response.statusCode);
        console.log('✅ Backend disponible');
        return true;
    } catch (error) {
        console.log('❌ Error en Backend:', error.message);
        return false;
    }
}

// Test 3: Probar el endpoint de chat
async function testChatEndpoint() {
    console.log('\n💬 Probando Chat API...');
    try {
        const testMessage = {
            message: 'Hola, esto es una prueba del chat en producción',
            sessionId: 'test-session-' + Date.now()
        };
        
        const response = await makeRequest(BACKEND_URL + '/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': FRONTEND_URL
            },
            body: JSON.stringify(testMessage)
        });
        
        console.log('✅ Chat API Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            const responseData = JSON.parse(response.data);
            console.log('✅ Chat Response:', responseData.message ? 'Recibida' : 'Sin mensaje');
            console.log('📝 Respuesta del bot:', responseData.message?.substring(0, 100) + '...');
            return true;
        } else {
            console.log('❌ Chat API falló con status:', response.statusCode);
            console.log('📝 Response:', response.data);
            return false;
        }
    } catch (error) {
        console.log('❌ Error en Chat API:', error.message);
        return false;
    }
}

// Ejecutar todas las pruebas
async function runAllTests() {
    console.log('🧪 Ejecutando suite de pruebas de producción\n');
    
    const frontendOk = await testFrontend();
    const backendOk = await testBackend();
    const chatOk = await testChatEndpoint();
    
    console.log('\n📊 Resumen de pruebas:');
    console.log('Frontend:', frontendOk ? '✅ OK' : '❌ FAIL');
    console.log('Backend:', backendOk ? '✅ OK' : '❌ FAIL');
    console.log('Chat API:', chatOk ? '✅ OK' : '❌ FAIL');
    
    const allPassed = frontendOk && backendOk && chatOk;
    console.log('\n🎯 Resultado general:', allPassed ? '✅ TODAS LAS PRUEBAS PASARON' : '❌ ALGUNAS PRUEBAS FALLARON');
    
    if (allPassed) {
        console.log('\n🚀 El deployment está funcionando correctamente!');
        console.log('🌐 Puedes acceder a la aplicación en:', FRONTEND_URL);
    }
}

// Ejecutar las pruebas
runAllTests().catch(console.error);
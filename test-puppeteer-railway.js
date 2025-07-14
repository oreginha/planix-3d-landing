const puppeteer = require('puppeteer');
const axios = require('axios');

// URLs de los servicios en Railway
const FRONTEND_URL = 'https://planix-frontend-production.up.railway.app';
const BACKEND_URL = 'https://planix-backend-node-production.up.railway.app';

async function testRailwayServices() {
    console.log('🚀 Iniciando pruebas de servicios Railway...');
    
    // Test 1: Verificar que el backend esté respondiendo
    console.log('\n📡 Testeando Backend...');
    try {
        const backendResponse = await axios.get(`${BACKEND_URL}/health`, {
            timeout: 10000
        });
        console.log('✅ Backend respondiendo:', backendResponse.status);
        console.log('📊 Respuesta del backend:', backendResponse.data);
    } catch (error) {
        console.log('❌ Error en backend:', error.message);
        if (error.response) {
            console.log('📊 Status:', error.response.status);
            console.log('📊 Data:', error.response.data);
        }
    }
    
    // Test 2: Abrir el frontend con Puppeteer
    console.log('\n🌐 Abriendo Frontend con Puppeteer...');
    
    const browser = await puppeteer.launch({
        headless: false, // Mostrar el navegador
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar timeouts
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);
        
        console.log('🔄 Navegando a:', FRONTEND_URL);
        
        // Navegar al frontend
        await page.goto(FRONTEND_URL, {
            waitUntil: 'networkidle2'
        });
        
        console.log('✅ Página cargada exitosamente');
        
        // Esperar a que el título se cargue
        await page.waitForSelector('title', { timeout: 10000 });
        const title = await page.title();
        console.log('📄 Título de la página:', title);
        
        // Verificar que el logo de Planix esté presente
        try {
            await page.waitForSelector('[data-testid="planix-logo"], .planix-logo, h1', { timeout: 5000 });
            console.log('✅ Logo/Header de Planix encontrado');
        } catch (error) {
            console.log('⚠️  Logo específico no encontrado, verificando contenido general...');
        }
        
        // Verificar que hay contenido en la página
        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.length > 100) {
            console.log('✅ Contenido de la página cargado correctamente');
            console.log('📝 Primeros 200 caracteres:', bodyText.substring(0, 200) + '...');
        } else {
            console.log('⚠️  Contenido limitado en la página');
        }
        
        // Test 3: Probar el chatbot si está disponible
        console.log('\n🤖 Testeando funcionalidad del chatbot...');
        try {
            // Buscar botón del chat
            const chatButton = await page.$('[data-testid="chat-button"], .chat-button, button[aria-label*="chat"], button[title*="chat"]');
            if (chatButton) {
                console.log('✅ Botón de chat encontrado');
                await chatButton.click();
                await page.waitForTimeout(2000);
                
                // Verificar si se abrió el modal del chat
                const chatModal = await page.$('[data-testid="chat-modal"], .chat-modal, .chat-container');
                if (chatModal) {
                    console.log('✅ Modal de chat abierto correctamente');
                } else {
                    console.log('⚠️  Modal de chat no detectado');
                }
            } else {
                console.log('⚠️  Botón de chat no encontrado');
            }
        } catch (error) {
            console.log('⚠️  Error al testear chatbot:', error.message);
        }
        
        // Test 4: Verificar comunicación con backend desde frontend
        console.log('\n🔗 Testeando comunicación Frontend-Backend...');
        try {
            // Interceptar requests de red
            const responses = [];
            page.on('response', response => {
                if (response.url().includes('planix-backend-node-production.up.railway.app')) {
                    responses.push({
                        url: response.url(),
                        status: response.status()
                    });
                }
            });
            
            // Esperar un poco para capturar requests
            await page.waitForTimeout(3000);
            
            if (responses.length > 0) {
                console.log('✅ Comunicación con backend detectada:');
                responses.forEach(resp => {
                    console.log(`   📡 ${resp.url} - Status: ${resp.status}`);
                });
            } else {
                console.log('⚠️  No se detectaron requests al backend');
            }
        } catch (error) {
            console.log('⚠️  Error al monitorear comunicación:', error.message);
        }
        
        // Mantener el navegador abierto por un momento para inspección manual
        console.log('\n⏳ Manteniendo navegador abierto por 10 segundos para inspección manual...');
        await page.waitForTimeout(10000);
        
        console.log('\n✅ Pruebas completadas exitosamente!');
        console.log('🌐 Frontend URL:', FRONTEND_URL);
        console.log('📡 Backend URL:', BACKEND_URL);
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
        
        // Tomar screenshot en caso de error
        try {
            await page.screenshot({ 
                path: 'error-screenshot.png', 
                fullPage: true 
            });
            console.log('📸 Screenshot guardado como error-screenshot.png');
        } catch (screenshotError) {
            console.log('⚠️  No se pudo tomar screenshot:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
}

// Ejecutar las pruebas
testRailwayServices().catch(console.error);

module.exports = { testRailwayServices };
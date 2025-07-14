const puppeteer = require('puppeteer');
const axios = require('axios');

// URLs de los servicios en Railway
const FRONTEND_URL = 'https://planix-frontend-production.up.railway.app';
const BACKEND_URL = 'https://planix-backend-node-production.up.railway.app';

async function testRailwayWithMCP() {
    console.log('🚀 Iniciando pruebas completas de Railway con MCP...');
    
    // Test 1: Verificar Backend Health
    console.log('\n📡 Verificando salud del Backend...');
    try {
        const healthResponse = await axios.get(`${BACKEND_URL}/health`, {
            timeout: 15000
        });
        console.log('✅ Backend Health Check:', healthResponse.status);
        console.log('📊 Datos del backend:', JSON.stringify(healthResponse.data, null, 2));
    } catch (error) {
        console.log('❌ Error en backend health:', error.message);
        return false;
    }
    
    // Test 2: Verificar endpoints adicionales del backend
    console.log('\n🔍 Verificando endpoints del backend...');
    const endpoints = ['/api/chat/health', '/api/contact/health'];
    
    for (const endpoint of endpoints) {
        try {
            const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
                timeout: 10000
            });
            console.log(`✅ ${endpoint}: ${response.status}`);
        } catch (error) {
            console.log(`⚠️  ${endpoint}: ${error.response?.status || 'Error'} - ${error.message}`);
        }
    }
    
    // Test 3: Pruebas completas con Puppeteer
    console.log('\n🌐 Iniciando pruebas de Frontend con Puppeteer...');
    
    const browser = await puppeteer.launch({
        headless: false, // Mostrar navegador para inspección
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ]
    });
    
    let testResults = {
        frontendLoaded: false,
        titleCorrect: false,
        contentLoaded: false,
        chatbotFound: false,
        backendCommunication: false
    };
    
    try {
        const page = await browser.newPage();
        
        // Configurar timeouts y eventos
        await page.setDefaultTimeout(30000);
        await page.setDefaultNavigationTimeout(30000);
        
        // Interceptar requests para monitorear comunicación con backend
        const backendRequests = [];
        page.on('response', response => {
            if (response.url().includes('planix-backend-node-production.up.railway.app')) {
                backendRequests.push({
                    url: response.url(),
                    status: response.status(),
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Interceptar errores de consola
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('🔴 Error de consola:', msg.text());
            }
        });
        
        console.log('🔄 Navegando al frontend...');
        await page.goto(FRONTEND_URL, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        testResults.frontendLoaded = true;
        console.log('✅ Frontend cargado exitosamente');
        
        // Verificar título
        await page.waitForSelector('title');
        const title = await page.title();
        console.log('📄 Título:', title);
        testResults.titleCorrect = title.includes('Planix');
        
        // Esperar a que el contenido se cargue completamente
        await page.waitForTimeout(3000);
        
        // Verificar contenido principal
        const bodyText = await page.evaluate(() => {
            return document.body.innerText || document.body.textContent || '';
        });
        
        if (bodyText.length > 200) {
            testResults.contentLoaded = true;
            console.log('✅ Contenido principal cargado');
            console.log('📝 Muestra del contenido:', bodyText.substring(0, 300) + '...');
        }
        
        // Buscar elementos específicos de Planix
        const planixElements = await page.evaluate(() => {
            const elements = [];
            
            // Buscar logo o header
            const headers = document.querySelectorAll('h1, h2, .logo, [class*="logo"], [data-testid*="logo"]');
            headers.forEach(el => {
                if (el.textContent.toLowerCase().includes('planix')) {
                    elements.push('Header/Logo encontrado');
                }
            });
            
            // Buscar botones de chat
            const chatButtons = document.querySelectorAll('button, [role="button"], .chat, [class*="chat"]');
            chatButtons.forEach(el => {
                const text = el.textContent.toLowerCase();
                const classes = el.className.toLowerCase();
                if (text.includes('chat') || classes.includes('chat')) {
                    elements.push('Botón de chat encontrado');
                }
            });
            
            // Buscar secciones principales
            const sections = document.querySelectorAll('section, .section, [class*="section"]');
            if (sections.length > 0) {
                elements.push(`${sections.length} secciones encontradas`);
            }
            
            return elements;
        });
        
        console.log('🔍 Elementos encontrados:', planixElements);
        testResults.chatbotFound = planixElements.some(el => el.includes('chat'));
        
        // Intentar interactuar con el chatbot
        console.log('\n🤖 Intentando interactuar con el chatbot...');
        try {
            const chatButton = await page.$('button[class*="chat"], .chat-button, [data-testid*="chat"]');
            if (chatButton) {
                await chatButton.click();
                console.log('✅ Click en botón de chat realizado');
                await page.waitForTimeout(2000);
                
                // Verificar si se abrió modal
                const modal = await page.$('.modal, [role="dialog"], .chat-modal');
                if (modal) {
                    console.log('✅ Modal de chat abierto');
                }
            }
        } catch (error) {
            console.log('⚠️  No se pudo interactuar con el chatbot:', error.message);
        }
        
        // Verificar comunicación con backend
        await page.waitForTimeout(2000);
        if (backendRequests.length > 0) {
            testResults.backendCommunication = true;
            console.log('\n✅ Comunicación con backend detectada:');
            backendRequests.forEach(req => {
                console.log(`   📡 ${req.url} - Status: ${req.status} - ${req.timestamp}`);
            });
        } else {
            console.log('\n⚠️  No se detectó comunicación directa con backend');
        }
        
        // Tomar screenshot final
        await page.screenshot({ 
            path: 'railway-test-screenshot.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot guardado como railway-test-screenshot.png');
        
        // Mantener navegador abierto para inspección
        console.log('\n⏳ Manteniendo navegador abierto por 15 segundos para inspección...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Error durante las pruebas de frontend:', error.message);
    } finally {
        await browser.close();
    }
    
    // Resumen final
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('='.repeat(50));
    console.log(`Frontend cargado: ${testResults.frontendLoaded ? '✅' : '❌'}`);
    console.log(`Título correcto: ${testResults.titleCorrect ? '✅' : '❌'}`);
    console.log(`Contenido cargado: ${testResults.contentLoaded ? '✅' : '❌'}`);
    console.log(`Chatbot encontrado: ${testResults.chatbotFound ? '✅' : '❌'}`);
    console.log(`Comunicación backend: ${testResults.backendCommunication ? '✅' : '❌'}`);
    console.log('='.repeat(50));
    
    const successCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    
    console.log(`\n🎯 Resultado: ${successCount}/${totalTests} pruebas exitosas`);
    console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
    console.log(`📡 Backend URL: ${BACKEND_URL}`);
    
    return successCount >= 3; // Considerar exitoso si al menos 3/5 pruebas pasan
}

// Ejecutar las pruebas
if (require.main === module) {
    testRailwayWithMCP()
        .then(success => {
            console.log(`\n${success ? '🎉 PRUEBAS EXITOSAS' : '⚠️  ALGUNAS PRUEBAS FALLARON'}`);
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Error fatal:', error);
            process.exit(1);
        });
}

module.exports = { testRailwayWithMCP };
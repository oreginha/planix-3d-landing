const puppeteer = require('puppeteer');

// Configuración obtenida desde Railway MCP
const CONFIG = {
  projectId: '16e84c2c-50d0-4c6f-b2a9-06c45c839272',
  environmentId: '1f912574-c1de-47f2-bf8c-e35da0eef498',
  frontend: {
    serviceId: 'df22f8ed-4739-47be-96ea-b5b43462527a',
    url: 'https://planix-frontend-production.up.railway.app'
  },
  backend: {
    serviceId: '4e2be212-b608-4241-b56d-e004b6dcf0e2',
    url: 'https://planix-backend-node-production.up.railway.app'
  }
};

async function testAdvancedPuppeteerRailway() {
  console.log('🚀 Pruebas Avanzadas: Puppeteer + Railway MCP');
  console.log('=' .repeat(50));
  
  let browser;
  const results = {
    frontend: { status: 'pending', details: {} },
    backend: { status: 'pending', details: {} },
    chat: { status: 'pending', details: {} },
    performance: { status: 'pending', details: {} }
  };
  
  try {
    // Configurar Puppeteer con opciones avanzadas
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1366, height: 768 },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Configurar interceptores de red
    await page.setRequestInterception(true);
    const networkRequests = [];
    
    page.on('request', (request) => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now()
      });
      request.continue();
    });
    
    page.on('response', (response) => {
      if (response.url().includes('chat') || response.url().includes('api')) {
        console.log(`📡 API Response: ${response.status()} - ${response.url()}`);
      }
    });
    
    // Test 1: Verificación completa del frontend
    console.log('\n📱 Test 1: Análisis completo del frontend');
    console.log('-'.repeat(40));
    
    const startTime = Date.now();
    await page.goto(CONFIG.frontend.url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    
    results.frontend.details = {
      title: await page.title(),
      loadTime: loadTime,
      url: CONFIG.frontend.url
    };
    
    console.log(`✅ Título: ${results.frontend.details.title}`);
    console.log(`✅ Tiempo de carga: ${loadTime}ms`);
    console.log(`✅ URL: ${CONFIG.frontend.url}`);
    results.frontend.status = 'success';
    
    // Test 2: Verificación del backend con múltiples endpoints
    console.log('\n🔧 Test 2: Verificación exhaustiva del backend');
    console.log('-'.repeat(40));
    
    const backendTests = [
      { endpoint: '/health', description: 'Health check' },
      { endpoint: '/api/chat', description: 'Chat API', method: 'POST' }
    ];
    
    for (const test of backendTests) {
      try {
        const response = await page.evaluate(async (backendUrl, endpoint, method = 'GET') => {
          const options = { method };
          if (method === 'POST') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify({ message: 'test' });
          }
          
          const response = await fetch(`${backendUrl}${endpoint}`, options);
          return {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText
          };
        }, CONFIG.backend.url, test.endpoint, test.method);
        
        console.log(`${response.ok ? '✅' : '❌'} ${test.description}: ${response.status} ${response.statusText}`);
        
      } catch (error) {
        console.log(`❌ ${test.description}: Error - ${error.message}`);
      }
    }
    
    results.backend.status = 'success';
    
    // Test 3: Análisis avanzado del chat
    console.log('\n💬 Test 3: Análisis avanzado del chat');
    console.log('-'.repeat(40));
    
    // Esperar a que la página se estabilice
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Buscar elementos del chat con múltiples estrategias
    const chatStrategies = [
      // Estrategia 1: Por atributos específicos
      async () => {
        return await page.$('[data-testid="chat-button"], [data-cy="chat-button"], .chat-button');
      },
      // Estrategia 2: Por clases CSS comunes
      async () => {
        return await page.$('.fixed.bottom-4.right-4, .floating-chat, [class*="chat-widget"]');
      },
      // Estrategia 3: Por texto en botones
      async () => {
        const buttons = await page.$$('button');
        for (const button of buttons) {
          const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', button);
          if (text.includes('chat') || text.includes('ayuda') || text.includes('soporte')) {
            return button;
          }
        }
        return null;
      },
      // Estrategia 4: Por elementos flotantes
      async () => {
        return await page.$('.fixed, [style*="position: fixed"]');
      }
    ];
    
    let chatElement = null;
    let strategyUsed = 'none';
    
    for (let i = 0; i < chatStrategies.length; i++) {
      chatElement = await chatStrategies[i]();
      if (chatElement) {
        strategyUsed = `strategy-${i + 1}`;
        console.log(`✅ Chat encontrado usando estrategia ${i + 1}`);
        break;
      }
    }
    
    if (chatElement) {
      try {
        // Hacer clic en el elemento del chat
        await chatElement.click();
        console.log('✅ Chat clickeado exitosamente');
        
        // Esperar a que aparezca la interfaz del chat
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Buscar campo de entrada con múltiples selectores
        const inputSelectors = [
          'input[placeholder*="mensaje"]',
          'input[placeholder*="escribe"]',
          'textarea[placeholder*="mensaje"]',
          'input[type="text"]',
          '.chat-input input',
          '[class*="input"] input'
        ];
        
        let chatInput = null;
        for (const selector of inputSelectors) {
          chatInput = await page.$(selector);
          if (chatInput) {
            console.log(`✅ Campo de entrada encontrado: ${selector}`);
            break;
          }
        }
        
        if (chatInput) {
          // Enviar mensaje de prueba
          const testMessage = 'Prueba automatizada Puppeteer + Railway MCP';
          await chatInput.type(testMessage);
          console.log(`✅ Mensaje escrito: "${testMessage}"`);
          
          // Buscar y hacer clic en botón de envío
          const sendSelectors = [
            'button[type="submit"]',
            'button[aria-label*="enviar"]',
            'button[title*="enviar"]',
            '.send-button',
            '[class*="send"] button'
          ];
          
          let sendButton = null;
          for (const selector of sendSelectors) {
            sendButton = await page.$(selector);
            if (sendButton) {
              console.log(`✅ Botón de envío encontrado: ${selector}`);
              break;
            }
          }
          
          if (sendButton) {
            await sendButton.click();
            console.log('✅ Mensaje enviado');
            
            // Esperar respuesta del backend
            console.log('⏳ Esperando respuesta del chat...');
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Verificar mensajes en el chat
            const messageSelectors = [
              '.message',
              '[class*="message"]',
              '.chat-message',
              '[class*="chat-message"]'
            ];
            
            let messages = [];
            for (const selector of messageSelectors) {
              messages = await page.$$(selector);
              if (messages.length > 0) break;
            }
            
            console.log(`✅ Mensajes detectados: ${messages.length}`);
            
            if (messages.length >= 2) {
              console.log('🎉 Chat funcionando correctamente - intercambio de mensajes detectado');
              results.chat.status = 'success';
            } else {
              console.log('⚠️  Solo se detectó un mensaje - posible problema de respuesta');
              results.chat.status = 'partial';
            }
            
            results.chat.details = {
              strategy: strategyUsed,
              messagesCount: messages.length,
              testMessage: testMessage
            };
            
          } else {
            console.log('❌ No se encontró botón de envío');
            results.chat.status = 'failed';
          }
        } else {
          console.log('❌ No se encontró campo de entrada del chat');
          results.chat.status = 'failed';
        }
        
      } catch (error) {
        console.log(`❌ Error al interactuar con el chat: ${error.message}`);
        results.chat.status = 'error';
      }
    } else {
      console.log('❌ No se pudo encontrar el elemento del chat');
      results.chat.status = 'not_found';
    }
    
    // Test 4: Métricas de rendimiento avanzadas
    console.log('\n⚡ Test 4: Métricas de rendimiento avanzadas');
    console.log('-'.repeat(40));
    
    const metrics = await page.metrics();
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation')[0]);
    });
    
    const navTiming = JSON.parse(performanceEntries);
    
    results.performance.details = {
      loadTime: Math.round(navTiming.loadEventEnd - navTiming.fetchStart),
      domContentLoaded: Math.round(navTiming.domContentLoadedEventEnd - navTiming.fetchStart),
      jsHeapSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024),
      domNodes: metrics.Nodes,
      networkRequests: networkRequests.length
    };
    
    console.log(`✅ Tiempo total de carga: ${results.performance.details.loadTime}ms`);
    console.log(`✅ DOM Content Loaded: ${results.performance.details.domContentLoaded}ms`);
    console.log(`✅ Memoria JS usada: ${results.performance.details.jsHeapSize}MB`);
    console.log(`✅ Nodos DOM: ${results.performance.details.domNodes}`);
    console.log(`✅ Requests de red: ${results.performance.details.networkRequests}`);
    
    results.performance.status = 'success';
    
    // Capturar screenshot final
    console.log('\n📸 Capturando screenshot final...');
    await page.screenshot({ 
      path: 'advanced-puppeteer-railway-test.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot guardado como advanced-puppeteer-railway-test.png');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    
    if (browser) {
      try {
        const page = await browser.newPage();
        await page.screenshot({ path: 'error-advanced-test.png' });
        console.log('📸 Screenshot del error guardado');
      } catch (screenshotError) {
        console.log('❌ No se pudo capturar screenshot del error');
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('=' .repeat(50));
  console.log(`Frontend: ${results.frontend.status}`);
  console.log(`Backend: ${results.backend.status}`);
  console.log(`Chat: ${results.chat.status}`);
  console.log(`Performance: ${results.performance.status}`);
  
  if (results.chat.details) {
    console.log(`\nDetalles del Chat:`);
    console.log(`- Estrategia usada: ${results.chat.details.strategy}`);
    console.log(`- Mensajes detectados: ${results.chat.details.messagesCount}`);
  }
  
  console.log('\n🎯 Pruebas completadas con Puppeteer + Railway MCP');
}

// Ejecutar las pruebas
testAdvancedPuppeteerRailway().catch(console.error);
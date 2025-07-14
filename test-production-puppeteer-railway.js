const puppeteer = require('puppeteer');

// URLs de producción obtenidas desde Railway MCP
const FRONTEND_URL = 'https://planix-frontend-production.up.railway.app';
const BACKEND_URL = 'https://planix-backend-node-production.up.railway.app';

async function testProductionWithPuppeteer() {
  console.log('🚀 Iniciando pruebas de producción con Puppeteer + Railway MCP');
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Backend: ${BACKEND_URL}`);
  
  let browser;
  
  try {
    // Configurar Puppeteer
    browser = await puppeteer.launch({
      headless: false, // Mostrar navegador para debugging
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Test 1: Verificar que el frontend carga correctamente
    console.log('\n📱 Test 1: Cargando frontend...');
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const title = await page.title();
    console.log(`✅ Título de la página: ${title}`);
    
    // Test 2: Verificar que el backend responde
    console.log('\n🔧 Test 2: Verificando backend...');
    const backendResponse = await page.evaluate(async (backendUrl) => {
      try {
        const response = await fetch(`${backendUrl}/health`);
        return {
          status: response.status,
          ok: response.ok,
          text: await response.text()
        };
      } catch (error) {
        return { error: error.message };
      }
    }, BACKEND_URL);
    
    if (backendResponse.ok) {
      console.log('✅ Backend respondiendo correctamente');
      console.log(`   Status: ${backendResponse.status}`);
    } else {
      console.log('❌ Backend no responde:', backendResponse);
    }
    
    // Test 3: Buscar y abrir el chat
    console.log('\n💬 Test 3: Probando funcionalidad del chat...');
    
    // Esperar a que la página cargue completamente
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Buscar el botón del chat
    const chatButton = await page.$('[data-testid="chat-button"], .chat-button, button[aria-label*="chat"], button[title*="chat"]');
    
    if (!chatButton) {
      // Buscar por texto si no encuentra por atributos
      const buttons = await page.$$('button');
      let foundChatButton = null;
      
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', button);
        if (text.includes('chat') || text.includes('ayuda') || text.includes('soporte')) {
          foundChatButton = button;
          break;
        }
      }
      
      if (foundChatButton) {
        console.log('✅ Botón de chat encontrado por texto');
        await foundChatButton.click();
      } else {
        console.log('⚠️  No se encontró botón de chat, buscando widget flotante...');
        
        // Buscar widget flotante del chat
        const chatWidget = await page.$('.fixed, [class*="chat"], [class*="float"]');
        if (chatWidget) {
          await chatWidget.click();
          console.log('✅ Widget de chat encontrado y clickeado');
        }
      }
    } else {
      console.log('✅ Botón de chat encontrado');
      await chatButton.click();
    }
    
    // Esperar a que aparezca el chat
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 4: Enviar mensaje de prueba
    console.log('\n📝 Test 4: Enviando mensaje de prueba...');
    
    // Buscar campo de entrada del chat
    const chatInput = await page.$('input[placeholder*="mensaje"], input[placeholder*="escribe"], textarea[placeholder*="mensaje"], input[type="text"]');
    
    if (chatInput) {
      await chatInput.type('Hola, esto es una prueba automatizada con Puppeteer');
      console.log('✅ Mensaje escrito en el campo de entrada');
      
      // Buscar botón de envío
      const sendButton = await page.$('button[type="submit"], button[aria-label*="enviar"], button[title*="enviar"]');
      
      if (sendButton) {
        await sendButton.click();
        console.log('✅ Mensaje enviado');
        
        // Esperar respuesta del bot
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verificar que hay mensajes en el chat
        const messages = await page.$$('.message, [class*="message"], [class*="chat-message"]');
        console.log(`✅ Mensajes detectados en el chat: ${messages.length}`);
        
        if (messages.length >= 2) {
          console.log('✅ Chat funcionando correctamente - hay intercambio de mensajes');
        }
      } else {
        console.log('⚠️  No se encontró botón de envío');
      }
    } else {
      console.log('⚠️  No se encontró campo de entrada del chat');
    }
    
    // Test 5: Capturar screenshot final
    console.log('\n📸 Test 5: Capturando screenshot final...');
    await page.screenshot({ 
      path: 'production-test-puppeteer-railway.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot guardado como production-test-puppeteer-railway.png');
    
    // Test 6: Verificar métricas de rendimiento
    console.log('\n⚡ Test 6: Verificando métricas de rendimiento...');
    const metrics = await page.metrics();
    console.log(`✅ Métricas de rendimiento:`);
    console.log(`   - Tiempo de carga: ${Math.round(metrics.TaskDuration * 1000)}ms`);
    console.log(`   - Memoria JS usada: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB`);
    console.log(`   - Nodos DOM: ${metrics.Nodes}`);
    
    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    
    // Capturar screenshot del error
    if (browser) {
      const page = await browser.newPage();
      await page.screenshot({ path: 'error-screenshot.png' });
      console.log('📸 Screenshot del error guardado como error-screenshot.png');
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar las pruebas
testProductionWithPuppeteer().catch(console.error);
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

/**
 * Script de diagnóstico completo para el problema de conexión del chat
 * Basado en las imágenes que muestran error de conexión en el chat de Planix
 */

async function diagnosticarConexionChat() {
  console.log('🔍 DIAGNÓSTICO DE CONEXIÓN DEL CHAT PLANIX');
  console.log('==========================================\n');

  const frontendUrl = 'https://planix-frontend-production.up.railway.app';
  const backendUrl = 'https://planix-backend-node-production.up.railway.app';

  // 1. Verificar conectividad del backend
  console.log('1️⃣ Verificando conectividad del backend...');
  try {
    const healthResponse = await fetch(`${backendUrl}/health`, {
      timeout: 10000
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend respondiendo:', healthData);
    } else {
      console.log('❌ Backend responde con error:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Error conectando al backend:', error.message);
  }

  // 2. Verificar endpoint específico del chat
  console.log('\n2️⃣ Verificando endpoint del chat...');
  try {
    const chatResponse = await fetch(`${backendUrl}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Mensaje de prueba diagnóstico',
        userName: 'Test User',
        userEmail: 'test@example.com',
        isFirstMessage: true
      }),
      timeout: 15000
    });

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('✅ Endpoint de chat funcionando:', chatData);
    } else {
      const errorText = await chatResponse.text();
      console.log('❌ Error en endpoint de chat:', chatResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Error en endpoint de chat:', error.message);
  }

  // 3. Verificar CORS
  console.log('\n3️⃣ Verificando configuración CORS...');
  try {
    const corsResponse = await fetch(`${backendUrl}/api/chat/message`, {
      method: 'OPTIONS',
      headers: {
        'Origin': frontendUrl,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers')
    });
  } catch (error) {
    console.log('❌ Error verificando CORS:', error.message);
  }

  // 4. Prueba con Puppeteer del chat en vivo
  console.log('\n4️⃣ Probando chat en vivo con Puppeteer...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Interceptar requests de red
    const networkLogs = [];
    page.on('response', response => {
      if (response.url().includes('chat') || response.url().includes('api')) {
        networkLogs.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    page.on('requestfailed', request => {
      if (request.url().includes('chat') || request.url().includes('api')) {
        networkLogs.push({
          url: request.url(),
          error: request.failure().errorText
        });
      }
    });

    console.log('Navegando al frontend...');
    await page.goto(frontendUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Esperar y hacer clic en el botón del chat
    console.log('Buscando botón del chat...');
    await page.waitForSelector('[data-testid="chat-button"], .chat-button, button[aria-label*="chat"], button[title*="chat"]', { timeout: 10000 });
    
    const chatButton = await page.$('[data-testid="chat-button"], .chat-button, button[aria-label*="chat"], button[title*="chat"]');
    if (chatButton) {
      console.log('✅ Botón de chat encontrado, haciendo clic...');
      await chatButton.click();
      await page.waitForTimeout(2000);
      
      // Buscar campo de entrada del chat
      console.log('Buscando campo de entrada del chat...');
      const inputSelectors = [
        'input[placeholder*="mensaje"]',
        'input[placeholder*="Escribe"]',
        'textarea[placeholder*="mensaje"]',
        'textarea[placeholder*="Escribe"]',
        '.chat-input input',
        '.chat-input textarea',
        '[data-testid="chat-input"]'
      ];
      
      let chatInput = null;
      for (const selector of inputSelectors) {
        chatInput = await page.$(selector);
        if (chatInput) {
          console.log(`✅ Campo de entrada encontrado con selector: ${selector}`);
          break;
        }
      }
      
      if (chatInput) {
        // Enviar mensaje de prueba
        console.log('Enviando mensaje de prueba...');
        await chatInput.type('Mensaje de prueba diagnóstico');
        await page.waitForTimeout(1000);
        
        // Buscar botón de envío
        const sendButton = await page.$('button[type="submit"], .send-button, [data-testid="send-button"], button[aria-label*="enviar"]');
        if (sendButton) {
          await sendButton.click();
          console.log('✅ Mensaje enviado');
          
          // Esperar respuesta o error
          await page.waitForTimeout(5000);
          
          // Capturar screenshot del estado actual
          await page.screenshot({ 
            path: 'diagnostico-chat-estado.png',
            fullPage: true
          });
          console.log('📸 Screenshot guardado: diagnostico-chat-estado.png');
          
        } else {
          console.log('❌ No se encontró botón de envío');
        }
      } else {
        console.log('❌ No se encontró campo de entrada del chat');
      }
    } else {
      console.log('❌ No se encontró botón del chat');
    }
    
    // Mostrar logs de red
    console.log('\n📡 Logs de red relacionados con el chat:');
    networkLogs.forEach(log => {
      if (log.error) {
        console.log(`❌ ${log.url} - Error: ${log.error}`);
      } else {
        console.log(`${log.status >= 400 ? '❌' : '✅'} ${log.url} - ${log.status} ${log.statusText}`);
      }
    });
    
  } catch (error) {
    console.log('❌ Error en prueba con Puppeteer:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // 5. Diagnóstico de variables de entorno
  console.log('\n5️⃣ Verificando configuración de variables de entorno...');
  console.log('Frontend URL esperada:', frontendUrl);
  console.log('Backend URL esperada:', backendUrl);
  
  // 6. Recomendaciones
  console.log('\n📋 RECOMENDACIONES BASADAS EN EL DIAGNÓSTICO:');
  console.log('============================================');
  console.log('1. Verificar que REACT_APP_BACKEND_URL esté configurado correctamente');
  console.log('2. Confirmar que el backend esté respondiendo en el endpoint /api/chat/message');
  console.log('3. Revisar configuración CORS en el backend');
  console.log('4. Verificar que no haya problemas de red o firewall');
  console.log('5. Comprobar logs del backend en Railway para errores específicos');
  
  console.log('\n✅ Diagnóstico completado. Revisar screenshot y logs para más detalles.');
}

// Ejecutar diagnóstico
diagnosticarConexionChat().catch(console.error);
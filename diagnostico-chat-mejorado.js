const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Script de diagnóstico mejorado para el chat de Planix
 * Basado en las imágenes que muestran error de conexión
 * Usa el selector correcto del botón "Escribinos"
 */

// Función helper para hacer requests HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 10000
    };

    const req = lib.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ ok: res.statusCode < 400, status: res.statusCode, json: () => jsonData });
        } catch (e) {
          resolve({ ok: res.statusCode < 400, status: res.statusCode, text: () => data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function diagnosticarChatPlanix() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL CHAT PLANIX');
  console.log('======================================\n');

  const frontendUrl = 'https://planix-frontend-production.up.railway.app';
  const backendUrl = 'https://planix-backend-node-production.up.railway.app';

  // 1. Verificar backend
  console.log('1️⃣ Verificando backend...');
  try {
    const healthResponse = await makeRequest(`${backendUrl}/health`);
    if (healthResponse.ok) {
      const data = healthResponse.json();
      console.log('✅ Backend funcionando:', data);
    } else {
      console.log('❌ Backend error:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Error backend:', error.message);
  }

  // 2. Verificar endpoint de chat
  console.log('\n2️⃣ Verificando endpoint de chat...');
  try {
    const chatResponse = await makeRequest(`${backendUrl}/api/chat/message`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: 'Test diagnóstico',
        userName: 'Test User',
        userEmail: 'test@test.com',
        isFirstMessage: true
      }),
      timeout: 15000
    });

    if (chatResponse.ok) {
      const data = chatResponse.json();
      console.log('✅ Chat endpoint funcionando:', data.success ? 'OK' : 'Error');
    } else {
      console.log('❌ Chat endpoint error:', chatResponse.status);
    }
  } catch (error) {
    console.log('❌ Error chat endpoint:', error.message);
  }

  // 3. Prueba con Puppeteer
  console.log('\n3️⃣ Probando chat con Puppeteer...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Interceptar errores de red
    const networkErrors = [];
    const networkSuccess = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('chat') || url.includes('api')) {
        if (response.status() >= 400) {
          networkErrors.push({ url, status: response.status(), statusText: response.statusText() });
        } else {
          networkSuccess.push({ url, status: response.status() });
        }
      }
    });

    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('chat') || url.includes('api')) {
        networkErrors.push({ url, error: request.failure().errorText });
      }
    });

    console.log('Navegando al frontend...');
    await page.goto(frontendUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Buscar botón "Escribinos"
    console.log('Buscando botón "Escribinos"...');
    
    // Esperar a que la página cargue completamente
    await page.waitForTimeout ? await page.waitForTimeout(3000) : await new Promise(r => setTimeout(r, 3000));
    
    // Buscar por texto "Escribinos"
    let chatButton = null;
    try {
      await page.waitForFunction(
        () => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements.find(el => el.textContent && el.textContent.includes('Escribinos'));
        },
        { timeout: 10000 }
      );
      
      chatButton = await page.evaluateHandle(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const textElement = elements.find(el => el.textContent && el.textContent.includes('Escribinos'));
        // Buscar el botón padre
        let current = textElement;
        while (current && current.tagName !== 'BUTTON') {
          current = current.parentElement;
          if (!current || current === document.body) break;
        }
        return current || textElement;
      });
      
      if (chatButton) {
        console.log('✅ Botón "Escribinos" encontrado');
      }
    } catch (e) {
      console.log('❌ No se encontró botón "Escribinos":', e.message);
    }
    
    if (chatButton) {
      console.log('Haciendo clic en el botón del chat...');
      await chatButton.click();
      
      // Esperar a que se abra el chat
      await (page.waitForTimeout ? page.waitForTimeout(3000) : new Promise(r => setTimeout(r, 3000)));
      
      // Buscar campo de entrada
      console.log('Buscando campo de entrada...');
      const inputSelectors = [
        'textarea[placeholder*="Escribe"]',
        'textarea[placeholder*="mensaje"]',
        'input[placeholder*="Escribe"]',
        'input[placeholder*="mensaje"]',
        'textarea',
        'input[type="text"]'
      ];
      
      let chatInput = null;
      for (const selector of inputSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          chatInput = await page.$(selector);
          if (chatInput) {
            console.log(`✅ Campo de entrada encontrado: ${selector}`);
            break;
          }
        } catch (e) {
          // Continuar
        }
      }
      
      if (chatInput) {
        console.log('Enviando mensaje de prueba...');
        await chatInput.type('Mensaje de prueba para diagnóstico');
        await (page.waitForTimeout ? page.waitForTimeout(1000) : new Promise(r => setTimeout(r, 1000)));
        
        // Buscar botón de envío
        const sendSelectors = [
          'button[type="submit"]',
          'button:has(svg)',
          'button:last-child',
          '.send-button',
          'button[aria-label*="enviar"]'
        ];
        
        let sendButton = null;
        for (const selector of sendSelectors) {
          try {
            sendButton = await page.$(selector);
            if (sendButton) {
              console.log(`✅ Botón de envío encontrado: ${selector}`);
              break;
            }
          } catch (e) {
            // Continuar
          }
        }
        
        if (sendButton) {
          await sendButton.click();
          console.log('✅ Mensaje enviado');
          
          // Esperar respuesta o error
          console.log('Esperando respuesta...');
          await (page.waitForTimeout ? page.waitForTimeout(8000) : new Promise(r => setTimeout(r, 8000)));
          
          // Capturar screenshot
          await page.screenshot({ 
            path: 'diagnostico-chat-resultado.png',
            fullPage: true
          });
          console.log('📸 Screenshot guardado: diagnostico-chat-resultado.png');
          
          // Verificar si hay mensajes de error
          const errorMessages = await page.evaluate(() => {
            const errorTexts = [
              'error de conexión',
              'problema de conexión',
              'no se pudo enviar',
              'intenta nuevamente',
              'connection error',
              'network error',
              'lo siento, hubo un problema'
            ];
            
            const allText = document.body.innerText.toLowerCase();
            return errorTexts.filter(error => allText.includes(error));
          });
          
          if (errorMessages.length > 0) {
            console.log('❌ Errores detectados en el chat:', errorMessages);
          } else {
            console.log('✅ No se detectaron errores visibles');
          }
          
        } else {
          console.log('❌ No se encontró botón de envío');
        }
      } else {
        console.log('❌ No se encontró campo de entrada');
      }
    } else {
      console.log('❌ No se encontró el botón del chat');
    }
    
    // Mostrar resultados de red
    console.log('\n📡 Resultados de red:');
    if (networkSuccess.length > 0) {
      console.log('✅ Requests exitosos:');
      networkSuccess.forEach(req => console.log(`  ${req.url} - ${req.status}`));
    }
    
    if (networkErrors.length > 0) {
      console.log('❌ Errores de red:');
      networkErrors.forEach(err => {
        if (err.error) {
          console.log(`  ${err.url} - ${err.error}`);
        } else {
          console.log(`  ${err.url} - ${err.status} ${err.statusText}`);
        }
      });
    }
    
  } catch (error) {
    console.log('❌ Error en Puppeteer:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // 4. Recomendaciones específicas
  console.log('\n🔧 RECOMENDACIONES ESPECÍFICAS:');
  console.log('===============================');
  console.log('1. Verificar variable REACT_APP_BACKEND_URL en Railway');
  console.log('2. Revisar logs del backend en Railway Dashboard');
  console.log('3. Confirmar que el endpoint /api/chat/message esté funcionando');
  console.log('4. Verificar configuración CORS para el dominio del frontend');
  console.log('5. Comprobar que no haya problemas de timeout en Railway');
  
  console.log('\n✅ Diagnóstico completado.');
  console.log('📸 Revisar screenshot: diagnostico-chat-resultado.png');
}

// Ejecutar diagnóstico
diagnosticarChatPlanix().catch(console.error);
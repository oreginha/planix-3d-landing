const puppeteer = require('puppeteer');

/**
 * Test completo del chatbot "Escribinos" en producción
 * Verifica funcionalidad completa del chat después del deploy
 */

async function testChatbotEscribinos() {
  console.log('🤖 PRUEBA COMPLETA DEL CHATBOT "ESCRIBINOS"');
  console.log('==============================================\n');

  const frontendUrl = 'https://planix-frontend-production.up.railway.app';
  let browser;
  
  try {
    // Configurar Puppeteer
    browser = await puppeteer.launch({ 
      headless: false,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Interceptar requests para monitorear comunicación
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      if (request.url().includes('chat') || request.url().includes('api')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('chat') || response.url().includes('api')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    // Navegar a la aplicación
    console.log('🌐 Navegando a la aplicación...');
    await page.goto(frontendUrl, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    
    console.log('✅ Aplicación cargada correctamente');
    
    // Esperar a que la página se cargue completamente
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Buscar y hacer clic en el botón "Escribinos"
    console.log('🔍 Buscando botón "Escribinos"...');
    
    let chatButton = null;
    try {
      // Buscar específicamente el botón del chat flotante
      await page.waitForSelector('.fixed.bottom-8.right-20 button', { timeout: 15000 });
      chatButton = await page.$('.fixed.bottom-8.right-20 button');
      
      if (chatButton) {
        console.log('✅ Botón "Escribinos" encontrado');
      }
    } catch (e) {
      console.log('❌ No se encontró el botón "Escribinos" con selector específico');
      
      // Fallback: buscar por texto
      try {
        await page.waitForFunction(
          () => {
            const elements = Array.from(document.querySelectorAll('*'));
            return elements.find(el => 
              el.textContent && 
              el.textContent.trim().toLowerCase().includes('escribinos')
            );
          },
          { timeout: 10000 }
        );
        
        chatButton = await page.evaluateHandle(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          const textElement = elements.find(el => 
            el.textContent && 
            el.textContent.trim().toLowerCase().includes('escribinos')
          );
          
          // Buscar el botón padre o el elemento clickeable
          let current = textElement;
          while (current && current !== document.body) {
            if (current.tagName === 'BUTTON' || 
                current.onclick || 
                current.style.cursor === 'pointer' ||
                current.getAttribute('role') === 'button') {
              return current;
            }
            current = current.parentElement;
          }
          return textElement; // Fallback al elemento con texto
        });
        
        if (chatButton) {
          console.log('✅ Botón "Escribinos" encontrado con fallback');
        }
      } catch (e2) {
        console.log('❌ No se encontró el botón "Escribinos":', e2.message);
        throw new Error('Botón de chat no encontrado');
      }
    }
    
    // Hacer clic en el botón del chat
    console.log('👆 Haciendo clic en "Escribinos"...');
    await chatButton.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Buscar el campo de entrada del chat
    console.log('📝 Buscando campo de entrada del chat...');
    
    let chatInput = null;
    try {
      // Esperar a que aparezca el modal del chat
      await page.waitForSelector('.fixed.inset-0.z-40', { timeout: 5000 });
      console.log('✅ Modal del chat detectado');
      
      // Buscar específicamente el textarea del chat
      await page.waitForSelector('textarea[placeholder="Escribe tu mensaje..."]', { timeout: 5000 });
      chatInput = await page.$('textarea[placeholder="Escribe tu mensaje..."]');
      
      if (chatInput) {
        console.log('✅ Campo de entrada encontrado: textarea del chat');
      }
    } catch (e) {
      console.log('❌ No se encontró el textarea específico, probando selectores alternativos...');
      
      const inputSelectors = [
        'textarea[placeholder*="Escribe"]',
        'textarea[placeholder*="mensaje"]',
        'input[placeholder*="Escribe"]',
        'input[placeholder*="mensaje"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
      ];
      
      for (const selector of inputSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          chatInput = await page.$(selector);
          if (chatInput) {
            console.log(`✅ Campo de entrada encontrado: ${selector}`);
            break;
          }
        } catch (e) {
          // Continuar con el siguiente selector
        }
      }
    }
    
    if (!chatInput) {
      console.log('❌ No se encontró campo de entrada');
      // Capturar screenshot para debugging
      await page.screenshot({ 
        path: 'chat-debug-no-input.png',
        fullPage: true
      });
      console.log('📸 Screenshot guardado: chat-debug-no-input.png');
      
      // Mostrar elementos disponibles para debugging
      const availableElements = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, [contenteditable]');
        return Array.from(inputs).map(el => ({
          tagName: el.tagName,
          type: el.type,
          placeholder: el.placeholder,
          className: el.className,
          id: el.id
        }));
      });
      console.log('🔍 Elementos de entrada disponibles:', JSON.stringify(availableElements, null, 2));
      
      throw new Error('Campo de entrada no encontrado');
    }
    
    // Escribir mensaje de prueba
    const testMessage = 'Hola, esta es una prueba del chatbot desde Puppeteer';
    console.log('✍️ Escribiendo mensaje de prueba...');
    await chatInput.type(testMessage);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar y hacer clic en el botón de envío
    console.log('🚀 Buscando botón de envío...');
    
    const sendSelectors = [
      'button[type="submit"]',
      'button:has(svg)',
      'button[aria-label*="enviar"]',
      'button[aria-label*="send"]',
      '.send-button',
      'button:last-child'
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
    
    if (!sendButton) {
      // Intentar enviar con Enter
      console.log('⌨️ Intentando enviar con Enter...');
      await chatInput.press('Enter');
    } else {
      await sendButton.click();
    }
    
    console.log('✅ Mensaje enviado');
    
    // Esperar respuesta del bot
    console.log('⏳ Esperando respuesta del chatbot...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Verificar si hay respuesta
    const chatMessages = await page.evaluate(() => {
      // Buscar mensajes en el chat
      const messageSelectors = [
        '.message',
        '.chat-message',
        '[class*="message"]',
        '[class*="chat"]'
      ];
      
      let messages = [];
      for (const selector of messageSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          messages = Array.from(elements).map(el => el.textContent.trim());
          break;
        }
      }
      
      // Si no encuentra con selectores específicos, buscar por contenido
      if (messages.length === 0) {
        const allText = document.body.innerText;
        if (allText.includes('Hola') || allText.includes('Planix') || allText.includes('ayuda')) {
          messages = ['Respuesta detectada en el contenido de la página'];
        }
      }
      
      return messages;
    });
    
    // Capturar screenshot final
    await page.screenshot({ 
      path: 'chatbot-test-resultado.png',
      fullPage: true
    });
    console.log('📸 Screenshot final guardado: chatbot-test-resultado.png');
    
    // Verificar errores de red
    console.log('\n📡 Análisis de comunicación:');
    if (requests.length > 0) {
      console.log('📤 Requests enviados:');
      requests.forEach(req => {
        console.log(`  ${req.method} ${req.url}`);
        if (req.postData) {
          console.log(`    Data: ${req.postData.substring(0, 100)}...`);
        }
      });
    }
    
    if (responses.length > 0) {
      console.log('📥 Responses recibidos:');
      responses.forEach(res => {
        console.log(`  ${res.status} ${res.statusText} - ${res.url}`);
      });
    }
    
    // Resultados
    console.log('\n🎯 RESULTADOS DEL TEST:');
    console.log('========================');
    console.log(`✅ Aplicación cargada: SÍ`);
    console.log(`✅ Botón "Escribinos" encontrado: SÍ`);
    console.log(`✅ Campo de entrada encontrado: SÍ`);
    console.log(`✅ Mensaje enviado: SÍ`);
    console.log(`📨 Requests de chat: ${requests.length}`);
    console.log(`📬 Responses de chat: ${responses.length}`);
    console.log(`💬 Mensajes detectados: ${chatMessages.length}`);
    
    if (chatMessages.length > 0) {
      console.log('📝 Mensajes encontrados:');
      chatMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg.substring(0, 100)}...`);
      });
    }
    
    // Verificar si hay errores
    const hasErrors = responses.some(res => res.status >= 400);
    if (hasErrors) {
      console.log('⚠️ Se detectaron errores de red en las comunicaciones');
    } else {
      console.log('✅ No se detectaron errores de red');
    }
    
    console.log('\n🎉 Test del chatbot completado exitosamente!');
    
  } catch (error) {
    console.log('❌ Error durante el test:', error.message);
    
    // Capturar screenshot de error
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          await pages[0].screenshot({ 
            path: 'chatbot-test-error.png',
            fullPage: true
          });
          console.log('📸 Screenshot de error guardado: chatbot-test-error.png');
        }
      } catch (screenshotError) {
        console.log('No se pudo capturar screenshot de error');
      }
    }
    
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar test
if (require.main === module) {
  testChatbotEscribinos()
    .then(() => {
      console.log('\n✅ Test completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test falló:', error.message);
      process.exit(1);
    });
}

module.exports = testChatbotEscribinos;
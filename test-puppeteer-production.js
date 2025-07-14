const puppeteer = require('puppeteer');

// URLs de producción
const FRONTEND_URL = 'https://planix-frontend-production.up.railway.app';

async function testChatWithPuppeteer() {
    console.log('🚀 Iniciando pruebas con Puppeteer...');
    console.log('🌐 URL:', FRONTEND_URL);
    
    const browser = await puppeteer.launch({
        headless: false, // Mostrar el navegador
        defaultViewport: { width: 1280, height: 720 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar timeouts
        page.setDefaultTimeout(30000);
        
        console.log('📱 Navegando a la aplicación...');
        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
        
        // Esperar a que la página cargue completamente
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Página cargada exitosamente');
        
        // Buscar el botón del chat
        console.log('🔍 Buscando botón del chat...');
        const chatButton = await page.waitForSelector('[data-testid="chat-button"], .chat-button, button[aria-label*="chat"], button[title*="chat"]', {
            timeout: 10000
        }).catch(() => null);
        
        if (!chatButton) {
            console.log('⚠️ No se encontró botón del chat, buscando chat flotante...');
            // Buscar chat flotante que podría estar siempre visible
            const chatContainer = await page.$('.chat-container, .floating-chat, [class*="chat"]');
            if (chatContainer) {
                console.log('✅ Contenedor de chat encontrado');
            } else {
                console.log('❌ No se encontró interfaz de chat');
                // Intentar hacer clic en cualquier botón que contenga texto relacionado con chat
                const allButtons = await page.$$('button');
                let chatFound = false;
                for (const button of allButtons) {
                    const text = await button.evaluate(el => el.textContent?.toLowerCase() || '');
                    if (text.includes('chat') || text.includes('ayuda') || text.includes('contacto')) {
                        console.log('✅ Botón del chat encontrado por contenido de texto');
                        await button.click();
                        chatFound = true;
                        break;
                    }
                }
                if (!chatFound) {
                    console.log('❌ No se pudo encontrar botón de chat');
                    return;
                }
            }
        } else {
            console.log('✅ Botón del chat encontrado');
            await chatButton.click();
        }
        
        // Esperar a que aparezca el chat
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Buscar el input del chat
        console.log('🔍 Buscando input del chat...');
        const chatInput = await page.waitForSelector('input[type="text"], textarea, [placeholder*="mensaje"], [placeholder*="escribe"], .chat-input', {
            timeout: 10000
        }).catch(() => null);
        
        if (!chatInput) {
            console.log('❌ No se encontró input del chat');
            return;
        }
        
        console.log('✅ Input del chat encontrado');
        
        // Escribir mensaje de prueba
        const testMessage = 'Hola, esta es una prueba automatizada del chat en producción';
        console.log('✍️ Escribiendo mensaje de prueba...');
        await chatInput.type(testMessage);
        
        // Buscar y hacer clic en el botón de enviar
        console.log('🔍 Buscando botón de enviar...');
        const sendButton = await page.$('button[type="submit"], .send-button, [aria-label*="enviar"], [title*="enviar"]');
        
        if (sendButton) {
            await sendButton.click();
        } else {
            // Intentar enviar con Enter
            await chatInput.press('Enter');
        }
        
        console.log('📤 Mensaje enviado');
        
        // Esperar respuesta del bot
        console.log('⏳ Esperando respuesta del bot...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verificar si hay respuesta
        const messages = await page.$$('.message, .chat-message, [class*="message"]');
        console.log(`💬 Mensajes encontrados: ${messages.length}`);
        
        if (messages.length >= 2) {
            console.log('✅ Chat funcionando - Se detectaron múltiples mensajes');
            
            // Intentar obtener el texto de los mensajes
            for (let i = 0; i < Math.min(messages.length, 3); i++) {
                try {
                    const messageText = await messages[i].textContent();
                    console.log(`📝 Mensaje ${i + 1}: ${messageText?.substring(0, 100)}...`);
                } catch (e) {
                    console.log(`📝 Mensaje ${i + 1}: [No se pudo obtener texto]`);
                }
            }
        } else {
            console.log('⚠️ Solo se detectó un mensaje - verificar funcionamiento del chat');
        }
        
        // Tomar screenshot
        console.log('📸 Tomando screenshot...');
        await page.screenshot({ 
            path: 'chat-test-screenshot.png',
            fullPage: true
        });
        
        console.log('✅ Screenshot guardado como chat-test-screenshot.png');
        
        // Mantener el navegador abierto por unos segundos para inspección visual
        console.log('👀 Manteniendo navegador abierto por 10 segundos para inspección...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    } finally {
        await browser.close();
        console.log('🏁 Pruebas completadas');
    }
}

// Ejecutar las pruebas
testChatWithPuppeteer().catch(console.error);
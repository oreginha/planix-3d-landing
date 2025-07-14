const puppeteer = require('puppeteer');

// URLs de producción
const FRONTEND_URL = 'https://planix-frontend-production.up.railway.app';

async function testChatSimple() {
    console.log('🚀 Iniciando prueba simple del chat...');
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
        
        // Esperar a que la página cargue
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('✅ Página cargada');
        
        // Tomar screenshot inicial
        await page.screenshot({ 
            path: 'app-loaded.png',
            fullPage: true
        });
        console.log('📸 Screenshot inicial guardado como app-loaded.png');
        
        // Buscar cualquier elemento relacionado con chat
        console.log('🔍 Buscando elementos de chat...');
        
        // Intentar múltiples selectores
        const chatSelectors = [
            'button[class*="chat"]',
            'div[class*="chat"]',
            '[data-testid*="chat"]',
            'button[aria-label*="chat"]',
            'button[title*="chat"]',
            '.floating-chat',
            '.chat-button',
            '.chat-widget',
            'button:has-text("Chat")',
            'button:has-text("Ayuda")',
            'button:has-text("Contacto")'
        ];
        
        let chatElement = null;
        for (const selector of chatSelectors) {
            try {
                chatElement = await page.$(selector);
                if (chatElement) {
                    console.log(`✅ Elemento de chat encontrado con selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continuar con el siguiente selector
            }
        }
        
        if (!chatElement) {
            console.log('⚠️ No se encontró elemento de chat específico, buscando todos los botones...');
            const allButtons = await page.$$('button');
            console.log(`🔍 Encontrados ${allButtons.length} botones en la página`);
            
            for (let i = 0; i < allButtons.length; i++) {
                try {
                    const text = await allButtons[i].evaluate(el => el.textContent?.toLowerCase() || '');
                    const className = await allButtons[i].evaluate(el => el.className || '');
                    console.log(`Botón ${i + 1}: "${text}" (class: ${className})`);
                    
                    if (text.includes('chat') || text.includes('ayuda') || text.includes('contacto') || 
                        className.includes('chat') || className.includes('floating')) {
                        console.log(`✅ Botón de chat encontrado: "${text}"`);
                        chatElement = allButtons[i];
                        break;
                    }
                } catch (e) {
                    console.log(`Error evaluando botón ${i + 1}:`, e.message);
                }
            }
        }
        
        if (chatElement) {
            console.log('🖱️ Haciendo clic en el elemento de chat...');
            await chatElement.click();
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Tomar screenshot después del clic
            await page.screenshot({ 
                path: 'chat-opened.png',
                fullPage: true
            });
            console.log('📸 Screenshot después de abrir chat guardado como chat-opened.png');
        }
        
        // Buscar input de texto
        console.log('🔍 Buscando input de texto...');
        const inputSelectors = [
            'input[type="text"]',
            'textarea',
            'input[placeholder*="mensaje"]',
            'input[placeholder*="escribe"]',
            'input[placeholder*="pregunta"]',
            '.chat-input',
            '[contenteditable="true"]'
        ];
        
        let inputElement = null;
        for (const selector of inputSelectors) {
            try {
                inputElement = await page.$(selector);
                if (inputElement) {
                    console.log(`✅ Input encontrado con selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continuar
            }
        }
        
        if (inputElement) {
            console.log('✍️ Escribiendo mensaje de prueba...');
            const testMessage = 'Hola, esta es una prueba automatizada';
            await inputElement.type(testMessage);
            
            // Buscar botón de enviar
            const sendSelectors = [
                'button[type="submit"]',
                'button[aria-label*="enviar"]',
                'button[title*="enviar"]',
                '.send-button',
                'button:has-text("Enviar")',
                'button:has-text("Send")'
            ];
            
            let sendButton = null;
            for (const selector of sendSelectors) {
                try {
                    sendButton = await page.$(selector);
                    if (sendButton) {
                        console.log(`✅ Botón de enviar encontrado: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continuar
                }
            }
            
            if (sendButton) {
                await sendButton.click();
                console.log('📤 Mensaje enviado con botón');
            } else {
                console.log('📤 Intentando enviar con Enter...');
                await inputElement.press('Enter');
            }
            
            // Esperar respuesta
            console.log('⏳ Esperando respuesta...');
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Tomar screenshot final
            await page.screenshot({ 
                path: 'chat-final.png',
                fullPage: true
            });
            console.log('📸 Screenshot final guardado como chat-final.png');
            
        } else {
            console.log('❌ No se encontró input de texto');
        }
        
        // Mantener abierto para inspección
        console.log('👀 Manteniendo navegador abierto por 15 segundos...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
        console.log('🏁 Prueba completada');
    }
}

// Ejecutar
testChatSimple().catch(console.error);
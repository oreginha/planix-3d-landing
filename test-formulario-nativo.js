// Test del formulario usando fetch nativo de Node.js (v18+)
async function testFormulario() {
  console.log('🧪 PROBANDO FORMULARIO DE CONTACTO');
  console.log('=====================================');
  
  const testData = {
    name: 'Juan Pérez',
    email: 'juan@test.com',
    company: 'Mi Empresa',
    message: 'Este es un mensaje de prueba para verificar que el formulario funciona correctamente después de los cambios.'
  };

  console.log('Datos a enviar:', testData);
  console.log('');

  try {
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', response.status);
    
    const data = await response.json();
    console.log('Respuesta del servidor:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('');
      console.log('✅ ¡FORMULARIO FUNCIONANDO CORRECTAMENTE!');
    } else {
      console.log('');
      console.log('❌ Error en formulario:', data.message);
      if (data.data && data.data.errors) {
        console.log('Errores de validación:');
        data.data.errors.forEach(error => {
          console.log(`  - ${error.field}: ${error.message}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Verificar si fetch está disponible
if (typeof fetch === 'undefined') {
  console.log('❌ Esta versión de Node.js no tiene fetch nativo.');
  console.log('Soluciones:');
  console.log('1. Actualizar a Node.js v18+ (recomendado)');
  console.log('2. Ejecutar: npm install node-fetch');
  console.log('3. Usar: .\\test-sin-dependencias.bat');
} else {
  testFormulario();
}

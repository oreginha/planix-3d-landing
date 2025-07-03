// Test del formulario de contacto corregido
const fetch = require('node-fetch');

const testData = {
  name: 'Juan Pérez',
  email: 'juan@test.com',
  company: 'Mi Empresa',
  message: 'Este es un mensaje de prueba para verificar que el formulario funciona correctamente después de los cambios.'
};

console.log('🧪 PROBANDO FORMULARIO DE CONTACTO CORREGIDO');
console.log('=====================================');
console.log('Datos a enviar:', testData);
console.log('');

fetch('http://localhost:3001/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Respuesta del servidor:');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.success) {
    console.log('');
    console.log('✅ ¡FORMULARIO FUNCIONANDO CORRECTAMENTE!');
  } else {
    console.log('');
    console.log('❌ Error en formulario:', data.message);
  }
})
.catch(error => {
  console.error('❌ Error en la prueba:', error.message);
});

// Test con múltiples escenarios del formulario
const fetch = require('node-fetch');

console.log('🧪 PRUEBAS EXHAUSTIVAS DEL FORMULARIO');
console.log('=====================================');

// Función helper para hacer requests
async function testFormulario(testName, data, expectedStatus = 200) {
  console.log(`\n📋 ${testName}`);
  console.log('Datos:', JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    console.log(`Status: ${response.status} (esperado: ${expectedStatus})`);
    console.log('Respuesta:', JSON.stringify(result, null, 2));
    
    if (response.status === expectedStatus) {
      console.log('✅ RESULTADO: CORRECTO');
    } else {
      console.log('❌ RESULTADO: STATUS INESPERADO');
    }
    
    return { success: response.status === expectedStatus, response, result };
    
  } catch (error) {
    console.log('❌ ERROR EN REQUEST:', error.message);
    return { success: false, error: error.message };
  }
}

// Ejecutar pruebas
async function ejecutarPruebas() {
  const resultados = [];
  
  // TEST 1: Datos válidos completos
  resultados.push(await testFormulario(
    'TEST 1: Datos válidos completos',
    {
      name: 'Juan Pérez',
      email: 'juan@test.com',
      company: 'Mi Empresa Test',
      message: 'Este es un mensaje de prueba con suficiente longitud para pasar la validación del backend. Incluye información sobre un proyecto ficticio.'
    },
    200
  ));
  
  // TEST 2: Datos válidos mínimos (sin empresa)
  resultados.push(await testFormulario(
    'TEST 2: Datos válidos mínimos',
    {
      name: 'Ana García',
      email: 'ana@ejemplo.com',
      message: 'Mensaje mínimo pero válido para las validaciones del formulario.'
    },
    200
  ));
  
  // TEST 3: Email inválido
  resultados.push(await testFormulario(
    'TEST 3: Email inválido',
    {
      name: 'Carlos López',
      email: 'email-invalido',
      message: 'Mensaje de prueba con email inválido.'
    },
    400
  ));
  
  // TEST 4: Nombre muy corto
  resultados.push(await testFormulario(
    'TEST 4: Nombre muy corto',
    {
      name: 'A',
      email: 'test@email.com',
      message: 'Mensaje de prueba con nombre demasiado corto.'
    },
    400
  ));
  
  // TEST 5: Mensaje muy corto
  resultados.push(await testFormulario(
    'TEST 5: Mensaje muy corto',
    {
      name: 'Pedro Martínez',
      email: 'pedro@test.com',
      message: 'Corto'
    },
    400
  ));
  
  // TEST 6: Campos faltantes
  resultados.push(await testFormulario(
    'TEST 6: Campos faltantes',
    {
      name: 'María González'
      // email y message faltantes
    },
    400
  ));
  
  // RESUMEN
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE PRUEBAS');
  console.log('='.repeat(50));
  
  let exitosos = 0;
  let fallidos = 0;
  
  resultados.forEach((resultado, index) => {
    const testNum = index + 1;
    if (resultado.success) {
      console.log(`✅ TEST ${testNum}: PASADO`);
      exitosos++;
    } else {
      console.log(`❌ TEST ${testNum}: FALLIDO`);
      fallidos++;
    }
  });
  
  console.log(`\n📈 ESTADÍSTICAS:`);
  console.log(`   Exitosos: ${exitosos}/${resultados.length}`);
  console.log(`   Fallidos: ${fallidos}/${resultados.length}`);
  console.log(`   Tasa de éxito: ${Math.round((exitosos/resultados.length)*100)}%`);
  
  if (fallidos === 0) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El formulario funciona correctamente.');
  } else {
    console.log(`\n⚠️  ${fallidos} pruebas fallaron. Revisar implementación.`);
  }
}

// Ejecutar
ejecutarPruebas().catch(console.error);

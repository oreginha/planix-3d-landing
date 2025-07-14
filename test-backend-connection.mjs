async function testBackendConnection() {
  try {
    console.log('Probando conexión con el backend...');
    
    const response = await fetch('https://planix-backend-node-production.up.railway.app/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hola, esto es una prueba de conexión',
        userName: 'Test User',
        userEmail: 'test@example.com'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.ok) {
      console.log('✅ Backend está funcionando correctamente');
    } else {
      console.log('❌ Backend respondió con error');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testBackendConnection();
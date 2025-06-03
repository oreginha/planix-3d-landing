const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4173;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Planix 3D Landing Page running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist')}`);
  console.log(`🏥 Health check available at: http://0.0.0.0:${PORT}/health`);
});

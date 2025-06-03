import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

console.log('🚀 Starting Planix 3D Landing Page server...');
console.log('🔧 Environment PORT:', process.env.PORT);
console.log('🔧 Using PORT:', PORT);
console.log('📁 Dist directory:', DIST_DIR);
console.log('🌐 Server will listen on port:', PORT);

// Check if dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Error: dist directory not found at', DIST_DIR);
  console.log('📂 Current directory contents:');
  fs.readdirSync(__dirname).forEach(file => {
    console.log(' -', file);
  });
  process.exit(1);
}

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Add security headers for Railway
app.use((req, res, next) => {
  res.header('X-Powered-By', 'Planix');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Root health check for Railway
app.get('/', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ Serving index.html from root');
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found at root');
    res.status(404).json({ 
      error: 'index.html not found',
      path: indexPath,
      exists: false
    });
  }
});

// Serve static files with proper headers
app.use(express.static(DIST_DIR, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    dist: DIST_DIR,
    files: fs.readdirSync(DIST_DIR)
  });
});

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
  console.log(`📍 SPA route requested: ${req.path}`);
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ Serving index.html for SPA route');
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found for SPA route');
    res.status(404).json({ 
      error: 'index.html not found',
      path: indexPath,
      exists: false,
      route: req.path
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running successfully!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🌐 Container URL: http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📁 Serving from: ${DIST_DIR}`);
  console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`🔧 Railway PORT: ${process.env.PORT}`);
  
  // List files in dist
  try {
    const files = fs.readdirSync(DIST_DIR);
    console.log(`📂 Files in dist (${files.length}):`);
    files.forEach(file => {
      const stat = fs.statSync(path.join(DIST_DIR, file));
      console.log(`  ${stat.isDirectory() ? '📁' : '📄'} ${file}`);
    });
  } catch (err) {
    console.error('❌ Error reading dist directory:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

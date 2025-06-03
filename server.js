import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;
const DIST_DIR = path.join(__dirname, 'dist');

console.log('🚀 Starting Planix 3D Landing Page server...');
console.log('📁 Dist directory:', DIST_DIR);
console.log('🌐 Port:', PORT);

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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files with proper headers
app.use(express.static(DIST_DIR, {
  maxAge: '1d',
  etag: true,
  lastModified: true
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

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'index.html not found',
      path: indexPath,
      exists: false
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running successfully!`);
  console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📁 Serving from: ${DIST_DIR}`);
  
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

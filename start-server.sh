#!/bin/bash

# Railway startup script for Planix 3D Landing Page

echo "🚀 Starting Planix 3D Landing Page..."
echo "📁 Checking dist directory..."

if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found!"
    echo "📦 Running build..."
    npm run build
fi

echo "📂 Files in dist:"
ls -la dist/

echo "🌐 Starting server on port ${PORT:-4173}..."
echo "🔗 Application will be available at: http://localhost:${PORT:-4173}"

# Start the server
exec serve -s dist -l ${PORT:-4173} --cors

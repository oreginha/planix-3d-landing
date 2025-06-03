#!/bin/bash

# Start script for Railway deployment
echo "Starting Planix 3D Landing Page..."
echo "Port: ${PORT:-4173}"
echo "Environment: production"

# Use vite preview with Railway's PORT
exec npm run preview

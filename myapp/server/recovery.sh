#!/bin/bash
# Render Deployment Recovery Script
# This ensures all dependencies are properly installed

echo "🔧 DEPLOYMENT RECOVERY STARTING..."

# Check Node version
echo "✓ Node version: $(node -v)"
echo "✓ NPM version: $(npm -v)"

# Go to server directory
cd myapp/server || exit 1

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Remove lock file (can cause issues)
echo "🗑️  Removing old lock file..."
rm -f package-lock.json

# Fresh install - production only
echo "📦 Installing production dependencies..."
npm install --production --no-save

# Verify critical packages
echo "✓ Verifying packages..."
npm list express pg cors jsonwebtoken bcryptjs

# Check if all files exist
echo "✓ Checking source files..."
ls -la src/index.js
ls -la src/routes/auth.js
ls -la src/routes/catalog.js

echo "✅ RECOVERY COMPLETE"
echo "Ready to start: npm start"

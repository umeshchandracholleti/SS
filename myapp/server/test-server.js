// Minimal test server - diagnose deployment issues
require('dotenv').config();

console.log('=== STARTING DIAGNOSTIC SERVER ===\n');

// 1. Check environment
console.log('📋 Environment Check:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  PORT: ${process.env.PORT || 4000}`);
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);

// 2. Setup Express
console.log('\n📦 Loading Dependencies:');
const express = require('express');
console.log('  ✓ Express loaded');
const cors = require('cors');
console.log('  ✓ CORS loaded');

// 3. Create app
const app = express();
const port = process.env.PORT || 4000;

console.log('\n⚙️  Configuring App:');
app.use(cors());
console.log('  ✓ CORS configured');
app.use(express.json());
console.log('  ✓ JSON parser configured');

// 4. Simple health endpoint (no DB dependency)
app.get('/api/health', (req, res) => {
  console.log('  📍 Health endpoint called');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// 5. Database health endpoint (with DB dependency)
app.get('/api/health/db', async (req, res) => {
  console.log('  📍 DB Health endpoint called');
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      status: 'ERROR',
      error: 'DATABASE_URL not configured'
    });
  }

  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const result = await pool.query('SELECT NOW()');
    await pool.end();

    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: result.rows[0].now,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('  ❌ Database error:', error.message);
    res.status(503).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// 6. Debugging endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    node_version: process.version,
    platform: process.platform,
    memory_usage: process.memoryUsage(),
    uptime: process.uptime(),
    environment_vars: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'not set'
    }
  });
});

// 7. 404 handler
app.use((req, res) => {
  console.log(`  ⚠️  404: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
    available_endpoints: [
      'GET /api/health',
      'GET /api/health/db',
      'GET /api/debug'
    ]
  });
});

// 8. Error handler
app.use((err, req, res, next) => {
  console.error('  ❌ Error:', err.message);
  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 9. Start server
console.log('\n🚀 Starting Server...');
const server = app.listen(port, () => {
  console.log(`\n✅ Server running on port ${port}`);
  console.log(`📍 Test endpoints:`);
  console.log(`   http://localhost:${port}/api/health`);
  console.log(`   http://localhost:${port}/api/health/db`);
  console.log(`   http://localhost:${port}/api/debug`);
  console.log('\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⛔ SIGTERM received, shutting down...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⛔ SIGINT received, shutting down...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

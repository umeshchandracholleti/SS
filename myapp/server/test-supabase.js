// Quick health check for Supabase connection
require('dotenv').config();

console.log('📋 Environment check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET');
console.log();

const { query, healthCheck, closePool } = require('./src/db');

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Health check
    const health = await healthCheck();
    console.log('✅ Health check:', health);
    
    // Count tables
    const result = await query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    console.log(`✅ Database has ${result.rows[0].table_count} tables`);
    
    // Test a simple query on app_user table
    const userCount = await query('SELECT COUNT(*) as count FROM app_user');
    console.log(`✅ app_user table has ${userCount.rows[0].count} users`);
    
    console.log('\n🎉 Supabase connection successful!\n');
    
    await closePool();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();

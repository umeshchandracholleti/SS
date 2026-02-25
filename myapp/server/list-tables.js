const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: '010101',
  host: 'localhost',
  port: 5432,
  database: 'myapp'
});

async function listTables() {
  try {
    await client.connect();
    console.log('\n✅ Connected to PostgreSQL\n');

    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    console.log(`Found ${result.rows.length} tables:\n`);
    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.tablename}`);
    });

    // Now check some critical tables
    console.log('\n===============================================');
    console.log('Checking critical tables...\n');

    const tables = result.rows.map(r => r.tablename);
    
    if (tables.includes('customer_user')) console.log('✅ customer_user');
    if (tables.includes('customer_product')) console.log('✅ customer_product');
    else if (tables.includes('product')) console.log('✅ product (renamed from customer_product)');
    
    if (tables.includes('customer_order')) console.log('✅ customer_order');
    else if (tables.includes('orders')) console.log('✅ orders (renamed)');
    
    if (tables.includes('payment_logs')) console.log('✅ payment_logs');
    
    if (tables.includes('notifications')) console.log('✅ notifications');
    
    if (tables.includes('notification_preferences')) console.log('✅ notification_preferences');

    await client.end();
  } catch (err) {
    console.error('❌ ERROR:', err.message);
  }
}

listTables();

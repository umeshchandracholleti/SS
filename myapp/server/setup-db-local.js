// Database Setup Script - Using Unix Socket (Local Connection)

const { Pool } = require('pg');

// Connect using local Unix socket (no password needed for 'postgres' on Windows local)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // Local socket
  port: 5432,
  database: 'postgres',
  // No password - use local connection
});

async function setupDatabase() {
  let client;
  
  try {
    client = await pool.connect();
    console.log('✓ Connected to PostgreSQL (local socket)');

    // Step 1: Create database
    try {
      await client.query('CREATE DATABASE myapp;');
      console.log('✓ Database "myapp" created');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('✓ Database "myapp" already exists');
      } else {
        throw err;
      }
    }

    client.release();

    // Step 2: Connect to myapp database
    const appPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'myapp'
    });

    const appClient = await appPool.connect();
    console.log('✓ Connected to myapp database');

    // Step 3: Create tables
    const setupSQL = `
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(6),
        gst_number VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE,
        customer_id INTEGER REFERENCES customers(id),
        subtotal DECIMAL(10, 2),
        gst_amount DECIMAL(10, 2),
        shipping_cost DECIMAL(10, 2),
        total_amount DECIMAL(10, 2),
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        status VARCHAR(50) DEFAULT 'confirmed',
        delivery_address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(6),
        customer_name VARCHAR(255),
        customer_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        product_name VARCHAR(255),
        product_sku VARCHAR(100),
        quantity INTEGER,
        unit_price DECIMAL(10, 2),
        total_price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        razorpay_payment_id VARCHAR(100),
        razorpay_order_id VARCHAR(100),
        razorpay_signature VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        amount INTEGER,
        currency VARCHAR(3) DEFAULT 'INR',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        invoice_number VARCHAR(50),
        invoice_date TIMESTAMP,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await appClient.query(setupSQL);
    console.log('✓ All tables created');

    // Step 4: Delete existing test data
    await appClient.query("DELETE FROM customers WHERE email = 'umeshcholleti25@gmail.com'");
    await appClient.query("DELETE FROM products WHERE name LIKE '%Test Product%'");
    await appClient.query("DELETE FROM system_settings WHERE key LIKE 'COMPANY%'");

    // Step 5: Insert test product
    const productRes = await appClient.query(`
      INSERT INTO products (name, description, category, price, stock_quantity, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      'Test Product - 1 Rupee',
      'This is a test product for verifying checkout, payment, and invoice functionality',
      'Testing',
      1.00,
      1000,
      'https://via.placeholder.com/300x300?text=Test+Product+1+Rupee'
    ]);
    console.log('✓ Test product inserted (ID:', productRes.rows[0].id + ')');

    // Step 6: Insert test customer
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('Umesh@12345', 10);
    
    const customerRes = await appClient.query(`
      INSERT INTO customers (email, password_hash, name, phone, address, city, state, pincode, gst_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, [
      'umeshcholleti25@gmail.com',
      passwordHash,
      'Umesh Cholleti',
      '9876543210',
      '123 Test Street',
      'Bangalore',
      'Karnataka',
      '560001',
      'GST12345TESTUSER'
    ]);
    
    if (customerRes.rows.length > 0) {
      console.log('✓ Test customer inserted (ID:', customerRes.rows[0].id + ')');
    } else {
      console.log('✓ Test customer already exists');
    }

    // Step 7: Insert company settings
    const settings = [
      ['COMPANY_NAME', 'Sai Scientifics'],
      ['COMPANY_ADDRESS', 'Plot No. 123, Test Industrial Area, Bangalore - 560001, Karnataka'],
      ['COMPANY_PHONE', '+91-9876543210'],
      ['COMPANY_EMAIL', 'contactus@saiscientifics.com'],
      ['COMPANY_GST_NUMBER', '27AAACR5055K1Z0'],
      ['COMPANY_PAN', 'AAACR5055K'],
      ['CURRENCY_SYMBOL', '₹']
    ];

    for (const [key, value] of settings) {
      await appClient.query(
        `INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, value]
      );
    }
    console.log('✓ Company settings inserted');

    // Step 8: Verify data
    const productCount = await appClient.query("SELECT COUNT(*) FROM products WHERE name LIKE '%Test%'");
    const customerCount = await appClient.query("SELECT COUNT(*) FROM customers WHERE email = 'umeshcholleti25@gmail.com'");
    const settingsCount = await appClient.query("SELECT COUNT(*) FROM system_settings WHERE key LIKE 'COMPANY%'");

    console.log('\n════════════════════════════════════════');
    console.log('✓✓✓ DATABASE SETUP COMPLETE! ✓✓✓');
    console.log('════════════════════════════════════════');
    console.log(`✓ Test Products: ${productCount.rows[0].count}`);
    console.log(`✓ Test Customers: ${customerCount.rows[0].count}`);
    console.log(`✓ Company Settings: ${settingsCount.rows[0].count}`);
    
    console.log('\n🎯 YOU CAN NOW LOGIN AND PURCHASE!');
    console.log('────────────────────────────────────────');
    console.log('📧 Email: umeshcholleti25@gmail.com');
    console.log('🔑 Password: Umesh@12345');
    console.log('💰 Product: Test Product - 1 Rupee');
    console.log('────────────────────────────────────────');

    appClient.release();
    await appPool.end();
    await pool.end();
    process.exit(0);

  } catch (err) {
    console.error('\n✗ Error:', err.message);
    console.error('\nTroubleshooting:');
    console.error('- Make sure PostgreSQL is running: Services > postgresql-x64-18');
    console.error('- Try: pg_ctl -D "C:\\Program Files\\PostgreSQL\\18\\data" start');
    console.error('- Check pg_hba.conf for authentication settings');
    
    if (client) client.release();
    if (pool) await pool.end();
    process.exit(1);
  }
}

setupDatabase();

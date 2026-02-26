require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const seed = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crystal_failsafe',
    });

    console.log('🌱 Seeding database...');
    const hashedPassword = await bcrypt.hash('Admin@1234', 12);

    await connection.query(`
      INSERT IGNORE INTO users 
        (first_name, last_name, email, employee_id, department, password, role, status)
      VALUES 
        ('IT', 'Admin', 'admin@crystalbridges.org', 'CB-00001', 'IT', ?, 'admin', 'approved')
    `, [hashedPassword]);

    console.log('  ✅ Default admin user created');
    console.log('\n📋 Admin credentials:');
    console.log('   Email:    admin@crystalbridges.org');
    console.log('   Password: Admin@1234');
    console.log('\n⚠️  Please change the admin password after first login!\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

seed();

require('dotenv').config();
const mysql = require('mysql2/promise');

const runMigrations = async () => {
  let connection;

  try {
    // Connect without database first to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'crystal_failsafe'}\``);
    await connection.query(`USE \`${process.env.DB_NAME || 'crystal_failsafe'}\``);

    console.log('📦 Running migrations...');

    // ─── USERS TABLE ───────────────────────────────────────────────────────────
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        department ENUM('IT', 'Operations', 'Facilities', 'Administration') NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('staff', 'admin') DEFAULT 'staff',
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        reset_token VARCHAR(255),
        reset_token_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ users table');

    // ─── TICKETS TABLE ──────────────────────────────────────────────────────────
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_number VARCHAR(20) UNIQUE NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category ENUM('hardware', 'software', 'account', 'network', 'other') NOT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('new', 'in_progress', 'on_hold', 'resolved', 'closed') DEFAULT 'new',
        sender_name VARCHAR(200) NOT NULL,
        sender_email VARCHAR(255) NOT NULL,
        sender_department VARCHAR(100),
        assigned_to INT,
        resolution_notes TEXT,
        resolved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('  ✅ tickets table');

    // ─── TICKET COMMENTS TABLE ──────────────────────────────────────────────────
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ticket_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('  ✅ ticket_comments table');

    // ─── TICKET ACTIVITY LOG ────────────────────────────────────────────────────
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ticket_activity (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        old_value VARCHAR(255),
        new_value VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('  ✅ ticket_activity table');

    console.log('\n🎉 All migrations completed successfully!');
    console.log('👉 Run "npm run seed" to add an admin user.');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

runMigrations();

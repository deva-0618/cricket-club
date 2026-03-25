const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false // ✅ Required for TiDB Cloud
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ TiDB connected successfully!');
    conn.release();
  } catch (err) {
    console.error('❌ TiDB connection failed:', err.message);
  }
})();

module.exports = pool;
const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool(config.db);

pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión a MySQL establecida');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
  });

module.exports = pool;
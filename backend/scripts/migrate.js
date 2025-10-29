
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('init.sql no encontrado en backend/database');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' });

  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('Conectado a MySQL, ejecutando init.sql...');
    const [results] = await connection.query(sql);
    console.log('Ejecución finalizada. Resultado:', results);
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Error ejecutando init.sql:', err.message || err);
    if (connection && connection.end) await connection.end().catch(()=>{});
    process.exit(1);
  }
}

run();

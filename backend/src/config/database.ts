import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ganado_bovino',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
});

// Test de conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a MySQL establecida');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
    process.exit(1);
  });

// Auto-migrate (opcional): ejecutar backend/database/init.sql al iniciar el servidor
// Para activarlo, establece la variable de entorno AUTO_MIGRATE=true (recomendado solo en development)
async function runAutoMigrationsIfNeeded() {
  try {
    const auto = (process.env.AUTO_MIGRATE || 'false').toLowerCase();
    if (auto !== 'true') return;

    const sqlPath = path.join(__dirname, '..', '..', 'database', 'init.sql');
    if (!fs.existsSync(sqlPath)) {
      console.warn(`⚠️ init.sql no encontrado en ${sqlPath}. Saltando migraciones automáticas.`);
      return;
    }

    const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' });

    // Crear una conexión temporal con multipleStatements habilitado
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('🔁 AUTO_MIGRATE=true — ejecutando backend/database/init.sql ...');
    await conn.query(sql);
    await conn.end();
    console.log('✅ Migraciones automáticas completadas');
  } catch (err: any) {
    console.error('❌ Error en migraciones automáticas:', err?.message || err);
  }
}

// Ejecutar migraciones automáticas en background (no bloqueante)
void runAutoMigrationsIfNeeded();

export default pool;

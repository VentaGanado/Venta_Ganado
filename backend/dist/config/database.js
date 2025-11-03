"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'ganado_bovino',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
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
        if (auto !== 'true')
            return;
        const sqlPath = path_1.default.join(__dirname, '..', '..', 'database', 'init.sql');
        if (!fs_1.default.existsSync(sqlPath)) {
            console.warn(`⚠️ init.sql no encontrado en ${sqlPath}. Saltando migraciones automáticas.`);
            return;
        }
        const sql = fs_1.default.readFileSync(sqlPath, { encoding: 'utf8' });
        // Crear una conexión temporal con multipleStatements habilitado
        const conn = await promise_1.default.createConnection({
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
    }
    catch (err) {
        console.error('❌ Error en migraciones automáticas:', err?.message || err);
    }
}
// Ejecutar migraciones automáticas en background (no bloqueante)
void runAutoMigrationsIfNeeded();
exports.default = pool;

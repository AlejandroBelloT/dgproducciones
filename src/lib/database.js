import mysql from 'mysql2/promise';

// Configuración de conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    charset: 'utf8mb4'
};

// Pool de conexiones para mejor rendimiento
let pool;

export async function getConnection() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

// Función helper para ejecutar consultas
export async function executeQuery(query, params = []) {
    try {
        const connection = await getConnection();
        const [results] = await connection.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Database operation failed: ${error.message}`);
    }
}

// Función helper para transacciones
export async function executeTransaction(queries) {
    const connection = await getConnection();
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const results = [];
        for (const { query, params } of queries) {
            const [result] = await conn.execute(query, params || []);
            results.push(result);
        }

        await conn.commit();
        return results;
    } catch (error) {
        await conn.rollback();
        console.error('Transaction Error:', error);
        throw new Error(`Transaction failed: ${error.message}`);
    } finally {
        conn.release();
    }
}

// Función para verificar la conexión
export async function testConnection() {
    try {
        // Debug: verificar configuración
        console.log('🔍 Database config:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database,
            port: dbConfig.port,
            hasPassword: !!dbConfig.password
        });

        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Cerrar pool de conexiones (útil para testing)
export async function closeConnection() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

// Export default object
const database = { getConnection, executeQuery, executeTransaction, testConnection, closeConnection };
export default database;
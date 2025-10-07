#!/usr/bin/env node

// Script para probar la conexión a la base de datos
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    charset: 'utf8mb4'
};

async function testConnection() {
    console.log('🔍 Probando conexión a la base de datos...');
    console.log('📋 Configuración:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Usuario: ${dbConfig.user}`);
    console.log(`   Base de datos: ${dbConfig.database}`);
    console.log(`   Puerto: ${dbConfig.port}`);
    console.log(`   Contraseña: ${dbConfig.password ? '***configurada***' : '⚠️  NO CONFIGURADA'}`);
    console.log('');

    try {
        // Intentar conectar
        console.log('🔄 Conectando...');
        const connection = await mysql.createConnection(dbConfig);

        // Probar consulta simple
        console.log('✅ Conexión establecida! Probando consulta...');
        const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time, DATABASE() as database_name');

        console.log('📊 Resultado de la consulta:');
        console.log(rows[0]);

        // Listar tablas disponibles
        console.log('\n📋 Listando tablas disponibles...');
        const [tables] = await connection.execute('SHOW TABLES');

        if (tables.length > 0) {
            console.log('✅ Tablas encontradas:');
            tables.forEach((table, index) => {
                const tableName = Object.values(table)[0];
                console.log(`   ${index + 1}. ${tableName}`);
            });
        } else {
            console.log('⚠️  No se encontraron tablas en la base de datos');
        }

        // Cerrar conexión
        await connection.end();
        console.log('\n🎉 ¡Conexión exitosa! La base de datos está configurada correctamente.');

    } catch (error) {
        console.error('\n❌ Error de conexión:');
        console.error(`   Código: ${error.code || 'N/A'}`);
        console.error(`   Mensaje: ${error.message}`);
        console.error(`   SQL State: ${error.sqlState || 'N/A'}`);

        // Sugerencias según el tipo de error
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Sugerencias:');
            console.log('   - Verifica que el servidor MariaDB esté ejecutándose');
            console.log('   - Confirma la dirección del host y puerto');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Sugerencias:');
            console.log('   - Verifica el usuario y contraseña');
            console.log('   - Confirma que el usuario tenga permisos en la base de datos');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n💡 Sugerencias:');
            console.log('   - Verifica que la base de datos exista');
            console.log('   - Confirma el nombre de la base de datos');
        }

        process.exit(1);
    }
}

// Ejecutar prueba
testConnection();
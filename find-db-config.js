#!/usr/bin/env node

// Script para probar múltiples configuraciones de conexión
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: '.env.local' });

const baseConfig = {
    host: 'localhost',
    port: 3306,
    charset: 'utf8mb4'
};

// Posibles combinaciones de usuario y base de datos
const configurations = [
    // Configuración 1: Usuario simple
    {
        user: 'dgproducciones',
        database: 'dgproducciones_815',
        description: 'Usuario simple + DB con sufijo'
    },
    // Configuración 2: Usuario con prefijo dgproducc_
    {
        user: 'dgproducc_dgproducciones',
        database: 'dgproducciones_815',
        description: 'Usuario con prefijo dgproducc_'
    },
    // Configuración 3: Usuario con prefijo dgproducc_ y DB con prefijo
    {
        user: 'dgproducc_dgproducciones',
        database: 'dgproducc_dgproducciones_815',
        description: 'Usuario y DB con prefijo dgproducc_'
    },
    // Configuración 4: Usuario simple con DB con prefijo
    {
        user: 'dgproducciones',
        database: 'dgproducc_dgproducciones_815',
        description: 'Usuario simple + DB con prefijo completo'
    },
    // Configuración 5: Solo números/sufijos
    {
        user: 'dgproducc_815',
        database: 'dgproducc_815',
        description: 'Usuario y DB solo con números'
    }
];

const password = 'dgproducciones2025';

async function testConfiguration(config, index) {
    console.log(`\n🔄 Probando configuración ${index + 1}: ${config.description}`);
    console.log(`   Usuario: ${config.user}`);
    console.log(`   Base de datos: ${config.database}`);

    const testConfig = {
        ...baseConfig,
        user: config.user,
        database: config.database,
        password: password
    };

    try {
        const connection = await mysql.createConnection(testConfig);

        // Probar consulta
        const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db_name');

        console.log(`   ✅ ¡ÉXITO! Conectado a: ${rows[0].db_name}`);

        // Listar algunas tablas
        const [tables] = await connection.execute('SHOW TABLES LIMIT 5');
        if (tables.length > 0) {
            console.log(`   📋 Tablas encontradas (${tables.length}):`);
            tables.forEach(table => {
                const tableName = Object.values(table)[0];
                console.log(`      - ${tableName}`);
            });
        } else {
            console.log(`   📋 Base de datos vacía (sin tablas)`);
        }

        await connection.end();

        console.log(`\n🎉 ¡CONFIGURACIÓN EXITOSA ENCONTRADA!`);
        console.log(`\n📝 Usa esta configuración:`);
        console.log(`DB_HOST=localhost`);
        console.log(`DB_USER=${config.user}`);
        console.log(`DB_PASSWORD=${password}`);
        console.log(`DB_NAME=${config.database}`);
        console.log(`DB_PORT=3306`);

        return true;

    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return false;
    }
}

async function findWorkingConfiguration() {
    console.log('🔍 Buscando configuración correcta de base de datos...\n');

    for (let i = 0; i < configurations.length; i++) {
        const success = await testConfiguration(configurations[i], i);
        if (success) {
            return; // Salir si encontramos una configuración que funciona
        }
    }

    console.log('\n❌ No se encontró ninguna configuración que funcione.');
    console.log('\n💡 Sugerencias:');
    console.log('1. Verifica en cPanel → MySQL Databases:');
    console.log('   - El nombre exacto del usuario de base de datos');
    console.log('   - El nombre exacto de la base de datos');
    console.log('   - Que el usuario esté asociado a la base de datos');
    console.log('2. Confirma que la contraseña sea correcta');
    console.log('3. Asegúrate de que el usuario tenga todos los privilegios');
}

findWorkingConfiguration();
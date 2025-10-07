#!/usr/bin/env node

// Script para probar la configuración actual con variaciones
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: '.env.local' });

const baseConfig = {
    host: 'localhost',
    port: 3306,
    charset: 'utf8mb4'
};

// Basado en la configuración que proporcionaste
const testConfigurations = [
    // Configuración exacta que proporcionaste
    {
        user: 'dgproducciones_dgproducciones',
        password: 'dgproducciones_2025',
        database: 'dgproducciones_dgproducciones',
        description: 'Configuración exacta proporcionada'
    },
    // Variaciones del usuario (cPanel a veces usa prefijos)
    {
        user: 'dgproducc_dgproducciones',
        password: 'dgproducciones_2025',
        database: 'dgproducciones_dgproducciones',
        description: 'Usuario con prefijo dgproducc_'
    },
    // Probando con la otra base de datos que vimos en las imágenes
    {
        user: 'dgproducciones_dgproducciones',
        password: 'dgproducciones_2025',
        database: 'dgproducciones_815',
        description: 'Usuario actual + DB 815'
    },
    {
        user: 'dgproducciones_815',
        password: 'dgproducciones_2025',
        database: 'dgproducciones_815',
        description: 'Usuario 815 + DB 815'
    },
    // Variaciones de contraseña
    {
        user: 'dgproducciones_dgproducciones',
        password: 'dgproducciones2025',
        database: 'dgproducciones_dgproducciones',
        description: 'Sin guión bajo en contraseña'
    },
    {
        user: 'dgproducciones_dgproducciones',
        password: 'DGproducciones_2025',
        database: 'dgproducciones_dgproducciones',
        description: 'Contraseña con mayúsculas'
    }
];

async function testConfiguration(config, index) {
    console.log(`\n${index + 1}. 🔄 Probando: ${config.description}`);
    console.log(`   Usuario: ${config.user}`);
    console.log(`   Contraseña: ${config.password}`);
    console.log(`   Base de datos: ${config.database}`);

    const testConfig = {
        ...baseConfig,
        user: config.user,
        password: config.password,
        database: config.database
    };

    try {
        const connection = await mysql.createConnection(testConfig);

        // Probar consulta básica
        const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db_name, USER() as current_user, NOW() as current_time');

        console.log(`   ✅ ¡CONEXIÓN EXITOSA!`);
        console.log(`   📊 Base de datos: ${rows[0].db_name}`);
        console.log(`   👤 Usuario conectado: ${rows[0].current_user}`);
        console.log(`   ⏰ Tiempo del servidor: ${rows[0].current_time}`);

        // Verificar si hay tablas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`   📋 Tablas encontradas: ${tables.length}`);

        if (tables.length > 0) {
            console.log(`   📑 Primeras 5 tablas:`);
            tables.slice(0, 5).forEach((table, idx) => {
                const tableName = Object.values(table)[0];
                console.log(`      ${idx + 1}. ${tableName}`);
            });
            if (tables.length > 5) {
                console.log(`      ... y ${tables.length - 5} más`);
            }
        } else {
            console.log(`   📑 Base de datos vacía`);
        }

        // Verificar permisos con una consulta simple
        try {
            const [users] = await connection.execute('SELECT COUNT(*) as user_count FROM information_schema.users WHERE user = ?', [config.user.split('_').pop()]);
            console.log(`   🔐 Información de usuario disponible`);
        } catch (permError) {
            console.log(`   ⚠️  Permisos limitados para consultas del sistema`);
        }

        await connection.end();

        console.log(`\n🎉 ¡CONFIGURACIÓN EXITOSA ENCONTRADA!`);
        console.log(`\n📝 Actualiza tu .env.local con:`);
        console.log(`DB_HOST=localhost`);
        console.log(`DB_USER=${config.user}`);
        console.log(`DB_PASSWORD=${config.password}`);
        console.log(`DB_NAME=${config.database}`);
        console.log(`DB_PORT=3306`);

        console.log(`\n📋 También actualiza .env.production:`);
        console.log(`DB_HOST=localhost`);
        console.log(`DB_USER=${config.user}`);
        console.log(`DB_PASSWORD=${config.password}`);
        console.log(`DB_NAME=${config.database}`);
        console.log(`DB_PORT=3306`);

        return true;

    } catch (error) {
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log(`   ❌ Acceso denegado - Usuario/contraseña incorrectos`);
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log(`   ❌ Base de datos no existe`);
        } else if (error.code === 'ECONNREFUSED') {
            console.log(`   ❌ Conexión rechazada - Servidor no disponible`);
        } else {
            console.log(`   ❌ Error: ${error.message} (Código: ${error.code || 'N/A'})`);
        }
        return false;
    }
}

async function testCurrentConfiguration() {
    console.log('🔍 Probando configuración actualizada con variaciones...\n');
    console.log('💡 Nota: Usando localhost como host (recomendado para cPanel)\n');

    for (let i = 0; i < testConfigurations.length; i++) {
        const success = await testConfiguration(testConfigurations[i], i);
        if (success) {
            return; // Salir si encontramos una configuración que funciona
        }

        // Pequeña pausa entre intentos
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n❌ Ninguna configuración funcionó.');
    console.log('\n🔧 Verificaciones requeridas en cPanel:');
    console.log('1. Ve a "Bases de datos MySQL" → "Usuarios actuales"');
    console.log('2. Confirma el nombre EXACTO del usuario');
    console.log('3. Ve a "Bases de datos actuales"');
    console.log('4. En la columna "Usuarios con privilegios", verifica que tu usuario aparezca');
    console.log('5. Si no aparece, asocia el usuario a la base de datos con TODOS los privilegios');
    console.log('\n💡 También puedes intentar:');
    console.log('- Cambiar la contraseña del usuario en cPanel');
    console.log('- Recrear el usuario si es necesario');
    console.log('- Verificar que no haya restricciones de IP');
}

testCurrentConfiguration();
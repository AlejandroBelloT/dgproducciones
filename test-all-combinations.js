#!/usr/bin/env node

// Script para probar todas las combinaciones posibles
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: '.env.local' });

const baseConfig = {
    host: 'localhost',
    port: 3306,
    charset: 'utf8mb4'
};

// Todas las combinaciones posibles basadas en la información de cPanel
const configurations = [
    // Basado en la primera imagen (dgproducciones@localhost)
    {
        user: 'dgproducciones',
        database: 'dgproducciones_815',
        description: 'Usuario simple (como aparece en primera imagen)'
    },
    // Basado en la segunda imagen (usuarios con privilegios)
    {
        user: 'dgproducciones_815',
        database: 'dgproducciones_815',
        description: 'Usuario igual al nombre de DB'
    },
    // Variaciones con prefijos típicos de cPanel
    {
        user: 'dgproducc_dgproducciones',
        database: 'dgproducciones_815',
        description: 'Usuario con prefijo de cuenta cPanel'
    },
    {
        user: 'dgproducc_815',
        database: 'dgproducciones_815',
        description: 'Usuario con prefijo y sufijo numérico'
    },
    // Probar con la base de datos más grande (dgproducciones_dgproducciones)
    {
        user: 'dgproducciones_dgproducciones',
        database: 'dgproducciones_dgproducciones',
        description: 'Usuario y DB con nombres repetidos'
    },
    {
        user: 'dgproducciones',
        database: 'dgproducciones_dgproducciones',
        description: 'Usuario simple + DB con nombre repetido'
    }
];

const passwords = [
    'dgproducciones2025',
    'dgproducciones2025!',
    'DGproducciones2025',
    'DGPRODUCCIONES2025'
];

async function testConfiguration(config, password, configIndex, passIndex) {
    const description = `${config.description} | Password ${passIndex + 1}`;
    console.log(`\n🔄 Prueba ${configIndex + 1}.${passIndex + 1}: ${description}`);
    console.log(`   Usuario: ${config.user}`);
    console.log(`   Base de datos: ${config.database}`);
    console.log(`   Contraseña: ${password}`);

    const testConfig = {
        ...baseConfig,
        user: config.user,
        database: config.database,
        password: password
    };

    try {
        const connection = await mysql.createConnection(testConfig);

        // Probar consulta
        const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db_name, USER() as current_user');

        console.log(`   ✅ ¡ÉXITO!`);
        console.log(`   📊 Usuario conectado: ${rows[0].current_user}`);
        console.log(`   📊 Base de datos: ${rows[0].db_name}`);

        // Verificar permisos listando tablas
        try {
            const [tables] = await connection.execute('SHOW TABLES');
            console.log(`   📋 Tablas encontradas: ${tables.length}`);
            if (tables.length > 0) {
                console.log(`   📋 Primeras tablas:`);
                tables.slice(0, 5).forEach(table => {
                    const tableName = Object.values(table)[0];
                    console.log(`      - ${tableName}`);
                });
                if (tables.length > 5) {
                    console.log(`      ... y ${tables.length - 5} más`);
                }
            }
        } catch (err) {
            console.log(`   ⚠️  Error listando tablas: ${err.message}`);
        }

        await connection.end();

        console.log(`\n🎉 ¡CONFIGURACIÓN EXITOSA ENCONTRADA!`);
        console.log(`\n📝 Configuración correcta:`);
        console.log(`DB_HOST=localhost`);
        console.log(`DB_USER=${config.user}`);
        console.log(`DB_PASSWORD=${password}`);
        console.log(`DB_NAME=${config.database}`);
        console.log(`DB_PORT=3306`);

        return true;

    } catch (error) {
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log(`   ❌ Acceso denegado`);
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log(`   ❌ Base de datos no existe`);
        } else {
            console.log(`   ❌ Error: ${error.message}`);
        }
        return false;
    }
}

async function findWorkingConfiguration() {
    console.log('🔍 Probando TODAS las combinaciones posibles...\n');

    for (let i = 0; i < configurations.length; i++) {
        for (let j = 0; j < passwords.length; j++) {
            const success = await testConfiguration(configurations[i], passwords[j], i, j);
            if (success) {
                return; // Salir si encontramos una configuración que funciona
            }
        }
    }

    console.log('\n❌ No se encontró ninguna configuración que funcione.');
    console.log('\n💡 Acciones requeridas en cPanel:');
    console.log('1. Ve a "Bases de datos MySQL" → "Usuarios actuales"');
    console.log('2. Verifica que existe un usuario para acceder a dgproducciones_815');
    console.log('3. Si no existe, créalo:');
    console.log('   - Ir a "Usuarios de MySQL"');
    console.log('   - Crear usuario: dgproducciones');
    console.log('   - Contraseña: dgproducciones2025');
    console.log('4. Asociar el usuario a la base de datos:');
    console.log('   - "Agregar usuario a base de datos"');
    console.log('   - Seleccionar usuario y base de datos');
    console.log('   - Dar TODOS LOS PRIVILEGIOS');
}

findWorkingConfiguration();
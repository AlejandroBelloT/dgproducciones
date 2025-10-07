import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

console.log('🔍 PROBANDO DIFERENTES PUERTOS MYSQL PARA CPANEL\n');
console.log('==================================================');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

// Puertos comunes usados por cPanel/hosting compartido
const ports = [3306, 3307, 3308, 33306, 33060, 21, 22, 80, 443, 2083, 2087];

console.log(`📋 Configuración base:`);
console.log(`   Host: ${host}`);
console.log(`   Usuario: ${user}`);
console.log(`   Base de datos: ${database}\n`);

async function testPort(port) {
    try {
        console.log(`🔄 Probando puerto ${port}...`);

        const connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            port: port,
            connectTimeout: 5000,
            acquireTimeout: 5000,
            timeout: 5000
        });

        await connection.execute('SELECT 1 as test');
        await connection.end();

        console.log(`✅ Puerto ${port}: CONEXIÓN EXITOSA! 🎉\n`);
        return true;

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log(`❌ Puerto ${port}: Conexión rechazada`);
        } else if (error.code === 'ETIMEDOUT') {
            console.log(`⏱️  Puerto ${port}: Timeout`);
        } else if (error.code === 'ENOTFOUND') {
            console.log(`🔍 Puerto ${port}: Host no encontrado`);
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log(`🔐 Puerto ${port}: Error de autenticación (pero el puerto está abierto!)`);
        } else {
            console.log(`⚠️  Puerto ${port}: ${error.code || error.message}`);
        }
        return false;
    }
}

async function main() {
    let foundWorkingPort = false;

    for (const port of ports) {
        const success = await testPort(port);
        if (success) {
            foundWorkingPort = true;
            console.log(`🎯 PUERTO FUNCIONAL ENCONTRADO: ${port}`);
            console.log(`💡 Actualiza tu .env.local con: DB_PORT=${port}`);
            break;
        }

        // Pequeña pausa entre intentos
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!foundWorkingPort) {
        console.log(`\n❌ Ningún puerto MySQL funcional encontrado`);
        console.log(`\n🛠️  OPCIONES ALTERNATIVAS:`);
        console.log(`1. Contactar al proveedor de hosting para habilitar MySQL remoto`);
        console.log(`2. Usar phpMyAdmin para gestionar datos`);
        console.log(`3. Crear API REST en PHP para acceso a datos`);
        console.log(`4. Desarrollo local con sincronización manual`);
    }

    console.log('\n==================================================');
    console.log('🏁 Prueba de puertos completada');
}

main().catch(console.error);
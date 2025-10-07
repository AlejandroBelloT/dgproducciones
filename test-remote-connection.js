#!/usr/bin/env node

// Script para diagnosticar conexión remota a cPanel
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config({ path: '.env.local' });
const execAsync = promisify(exec);

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    charset: 'utf8mb4'
};

async function checkNetworkConnectivity() {
    console.log('🌐 Verificando conectividad de red...\n');

    try {
        console.log(`📍 Probando ping a ${config.host}...`);
        const { stdout: pingResult } = await execAsync(`ping -c 3 ${config.host}`);
        console.log('✅ Ping exitoso - El servidor es alcanzable');

        console.log(`\n🔌 Probando conexión al puerto ${config.port}...`);
        try {
            const { stdout: portResult } = await execAsync(`timeout 10 bash -c "echo >/dev/tcp/${config.host}/${config.port}" 2>/dev/null && echo "Puerto abierto" || echo "Puerto cerrado"`);
            console.log(`📊 Estado del puerto: ${portResult.trim()}`);
        } catch (error) {
            console.log('❌ Puerto 3306 no accesible desde esta conexión');
        }

    } catch (error) {
        console.log(`❌ Error de conectividad: ${error.message}`);
    }
}

async function getPublicIP() {
    try {
        const { stdout } = await execAsync('curl -s https://ifconfig.me');
        return stdout.trim();
    } catch (error) {
        return 'No se pudo obtener';
    }
}

async function testDatabaseConnection() {
    console.log('\n🔗 Probando conexión a la base de datos...\n');
    console.log('📋 Configuración actual:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Puerto: ${config.port}`);
    console.log(`   Usuario: ${config.user}`);
    console.log(`   Base de datos: ${config.database}`);
    console.log(`   Contraseña: ${config.password ? '***configurada***' : '❌ NO CONFIGURADA'}`);

    const publicIP = await getPublicIP();
    console.log(`   Tu IP pública: ${publicIP}`);

    try {
        console.log('\n🔄 Intentando conectar...');
        const connection = await mysql.createConnection(config);

        const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db_name, USER() as current_user, @@hostname as server_host');

        console.log('\n🎉 ¡CONEXIÓN EXITOSA!');
        console.log(`📊 Servidor: ${rows[0].server_host}`);
        console.log(`📊 Base de datos: ${rows[0].db_name}`);
        console.log(`👤 Usuario conectado: ${rows[0].current_user}`);

        // Listar tablas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`📋 Tablas encontradas: ${tables.length}`);

        if (tables.length > 0) {
            console.log('\n📑 Tablas disponibles:');
            tables.forEach((table, index) => {
                const tableName = Object.values(table)[0];
                console.log(`   ${index + 1}. ${tableName}`);
            });
        }

        await connection.end();

        console.log('\n✅ La configuración de base de datos es correcta!');
        return true;

    } catch (error) {
        console.log('\n❌ Error de conexión:');
        console.log(`   Código: ${error.code}`);
        console.log(`   Mensaje: ${error.message}`);

        // Diagnóstico específico según el error
        switch (error.code) {
            case 'ECONNREFUSED':
                console.log('\n💡 Diagnóstico: CONEXIÓN RECHAZADA');
                console.log('   🔍 Posibles causas:');
                console.log('   • El puerto 3306 está bloqueado en el servidor');
                console.log('   • El servidor MySQL no acepta conexiones remotas');
                console.log('   • Firewall del hosting bloqueando conexiones externas');
                console.log('\n   🛠️  Soluciones:');
                console.log('   1. Habilitar "Hosts de acceso remoto" en cPanel');
                console.log('   2. Contactar al proveedor para habilitar acceso remoto');
                console.log('   3. Usar túnel SSH si está disponible');
                break;

            case 'ENOTFOUND':
                console.log('\n💡 Diagnóstico: SERVIDOR NO ENCONTRADO');
                console.log('   🔍 El hostname/IP no se puede resolver');
                console.log('   🛠️  Verifica la dirección del servidor');
                break;

            case 'ER_ACCESS_DENIED_ERROR':
                console.log('\n💡 Diagnóstico: ACCESO DENEGADO');
                console.log('   🔍 Usuario/contraseña incorrectos o sin permisos');
                console.log('   🛠️  Verifica credenciales en cPanel');
                break;

            case 'ETIMEDOUT':
                console.log('\n💡 Diagnóstico: TIMEOUT DE CONEXIÓN');
                console.log('   🔍 El servidor no responde en el tiempo esperado');
                console.log('   🛠️  Posible problema de red o servidor sobrecargado');
                break;

            default:
                console.log('\n💡 Error no identificado - revisar configuración');
        }

        return false;
    }
}

async function showAlternatives() {
    console.log('\n🔄 ALTERNATIVAS SI EL ACCESO REMOTO NO FUNCIONA:\n');

    console.log('1. 🌐 USAR PHPMYADMIN (Inmediato):');
    console.log('   • Accede desde cPanel → phpMyAdmin');
    console.log('   • Puedes exportar/importar datos');
    console.log('   • Ideal para desarrollo inicial');

    console.log('\n2. 🔧 HABILITAR ACCESO REMOTO:');
    console.log('   • cPanel → "Remote MySQL" o "Hosts de acceso remoto"');
    console.log(`   • Agregar tu IP: ${await getPublicIP()}`);
    console.log('   • O agregar % para permitir todas las IPs');

    console.log('\n3. 🚇 TÚNEL SSH (Avanzado):');
    console.log('   • ssh -L 3307:localhost:3306 usuario@servidor');
    console.log('   • Conectar a localhost:3307 en lugar de IP remota');

    console.log('\n4. 💻 DESARROLLO LOCAL:');
    console.log('   • Instalar MySQL/MariaDB localmente');
    console.log('   • Importar esquema desde phpMyAdmin');
    console.log('   • Sincronizar periódicamente');

    console.log('\n5. 📱 API REST (Recomendado para producción):');
    console.log('   • Crear endpoints PHP en el servidor');
    console.log('   • La app se conecta vía HTTP/HTTPS');
    console.log('   • Más seguro y escalable');
}

async function main() {
    console.log('🔍 DIAGNÓSTICO DE CONEXIÓN REMOTA A CPANEL\n');
    console.log('='.repeat(50));

    await checkNetworkConnectivity();
    const success = await testDatabaseConnection();

    if (!success) {
        await showAlternatives();
    }

    console.log('\n' + '='.repeat(50));
    console.log('🏁 Diagnóstico completado');
}

main().catch(console.error);
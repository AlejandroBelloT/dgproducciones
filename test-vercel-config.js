// test-vercel-config.js - Script para probar configuración Vercel + cPanel
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

console.log('🧪 PROBANDO CONFIGURACIÓN VERCEL + CPANEL\n');
console.log('==================================================');

async function testConfiguration() {
    console.log('📋 Variables de Entorno:');
    console.log(`   API_BASE: ${process.env.NEXT_PUBLIC_API_BASE}`);
    console.log(`   API_KEY: ${process.env.NEXT_PUBLIC_API_KEY}`);
    console.log(`   APP_URL: ${process.env.NEXT_PUBLIC_APP_URL}\n`);

    // Determinar entorno
    const isDevelopment = process.env.NEXT_PUBLIC_API_BASE?.includes('localhost');
    const isProduction = process.env.NEXT_PUBLIC_API_BASE?.includes('dgproducciones.cl');
    const isLocalAPI = process.env.NEXT_PUBLIC_API_BASE?.includes('/api') && !process.env.NEXT_PUBLIC_API_BASE?.includes('/proxy');
    const isProxy = process.env.NEXT_PUBLIC_API_BASE?.includes('/proxy');

    console.log('🌍 Entorno detectado:');
    if (isLocalAPI) {
        console.log('   ✅ DESARROLLO LOCAL (usando endpoints locales)');
        console.log('   - La app usa endpoints Next.js locales');
        console.log('   - URL: http://localhost:3000/api/*');
    } else if (isProxy) {
        console.log('   ✅ DESARROLLO VIA PROXY (conectando a cPanel)');
        console.log('   - La app se conecta vía proxy a cPanel');
        console.log('   - URL: http://localhost:3000/api/proxy/*');
    } else if (isProduction) {
        console.log('   ✅ PRODUCCIÓN (conexión directa a cPanel)');
        console.log('   - La app se conecta directamente a cPanel');
        console.log('   - URL: https://dgproducciones.cl/api/*');
    } else {
        console.log('   ⚠️  CONFIGURACIÓN NO RECONOCIDA');
    }    // Test de conectividad
    console.log('\n🔄 Probando conectividad...');

    try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        const response = await fetch(`${apiBase}/?endpoint=status`, {
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Conexión exitosa!');
            console.log(`   - Status: ${data.message}`);
            console.log(`   - DB Status: ${data.data?.database_status}`);
            console.log(`   - Server Time: ${data.data?.server_time}`);
        } else {
            console.log(`❌ Error HTTP: ${response.status}`);
        }

    } catch (error) {
        console.log('❌ Error de conexión:', error.message);

        if (isDevelopment) {
            console.log('\n💡 Para desarrollo local:');
            console.log('   1. Asegúrate de que npm run dev esté ejecutándose');
            console.log('   2. La API de cPanel debe estar funcionando');
            console.log('   3. Verifica que el proxy esté configurado correctamente');
        } else {
            console.log('\n💡 Para producción:');
            console.log('   1. Verifica que los archivos estén subidos a cPanel');
            console.log('   2. Prueba directamente: https://dgproducciones.cl/api/');
            console.log('   3. Revisa las variables de entorno en Vercel');
        }
    }

    console.log('\n==================================================');
    console.log('🚀 Instrucciones siguientes:');

    if (isDevelopment) {
        console.log('DESARROLLO:');
        console.log('1. Ejecuta: npm run dev');
        console.log('2. Visita: http://localhost:3000');
        console.log('3. Los datos vendrán de cPanel vía proxy');
    } else {
        console.log('PRODUCCIÓN:');
        console.log('1. Sube archivos api-server/ a cPanel');
        console.log('2. Configura variables en Vercel');
        console.log('3. Despliega: vercel --prod');
    }
}

// Ejecutar pruebas
testConfiguration();
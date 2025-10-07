// test-api-rest.js - Script para probar la API REST
import apiClient from './src/lib/api-client.js';

console.log('🧪 PROBANDO API REST DE DG PRODUCCIONES\n');
console.log('==================================================');

async function testAPI() {
    try {
        console.log('🔄 Probando conexión...');

        // Test 1: Probar estado de la API
        console.log('\n1. 📊 Estado de la API:');
        try {
            const status = await apiClient.getStatus();
            console.log('✅ API Status:', status.message);
            console.log('   - Versión:', status.data.api_version);
            console.log('   - Base de datos:', status.data.database_status);
            console.log('   - Hora del servidor:', status.data.server_time);
        } catch (error) {
            console.log('❌ Error al obtener estado:', error.message);
        }

        // Test 2: Probar conexión a base de datos
        console.log('\n2. 🔗 Prueba de conexión:');
        try {
            const connection = await apiClient.testConnection();
            console.log('✅ Conexión exitosa:', connection.message);
            console.log('   - Estado DB:', connection.data.database_connection);
        } catch (error) {
            console.log('❌ Error de conexión:', error.message);
        }

        // Test 3: Probar endpoints de contactos
        console.log('\n3. 👥 Probando contactos:');
        try {
            const contacts = await apiClient.getContacts();
            console.log(`✅ Contactos obtenidos: ${contacts.data?.length || 0} registros`);
        } catch (error) {
            console.log('❌ Error en contactos:', error.message);
        }

        // Test 4: Probar endpoints de proyectos
        console.log('\n4. 📁 Probando proyectos:');
        try {
            const projects = await apiClient.getProjects();
            console.log(`✅ Proyectos obtenidos: ${projects.data?.length || 0} registros`);
        } catch (error) {
            console.log('❌ Error en proyectos:', error.message);
        }

        // Test 5: Probar endpoints de equipo
        console.log('\n5. 👨‍💼 Probando equipo:');
        try {
            const team = await apiClient.getTeam();
            console.log(`✅ Equipo obtenido: ${team.data?.length || 0} miembros`);
        } catch (error) {
            console.log('❌ Error en equipo:', error.message);
        }

    } catch (error) {
        console.error('💥 Error general:', error);
    }

    console.log('\n==================================================');
    console.log('🏁 Pruebas completadas');
    console.log('\n💡 Instrucciones siguientes:');
    console.log('1. Sube los archivos api-server/ a tu cPanel en public_html/api/');
    console.log('2. Visita https://dgproducciones.cl/api/ para ver la documentación');
    console.log('3. Ejecuta: npm run dev para probar la aplicación con la API REST');
}

// Ejecutar pruebas
testAPI();
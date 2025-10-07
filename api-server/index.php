<?php
// api/index.php - Endpoint principal y documentación de la API
require_once 'database.php';

// Manejar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && !isset($_GET['endpoint'])) {
    // Mostrar documentación de la API
    showApiDocumentation();
} else {
    // Router básico
    $endpoint = $_GET['endpoint'] ?? '';
    
    switch ($endpoint) {
        case 'test':
            testConnection();
            break;
        case 'status':
            showApiStatus();
            break;
        default:
            jsonResponse(null, 404, 'Endpoint no encontrado. Usa ?endpoint=status para ver el estado de la API.');
    }
}

function testConnection() {
    try {
        $database = new DatabaseConfig();
        $db = $database->getConnection();
        
        if ($db) {
            // Probar consulta simple
            $stmt = $db->prepare("SELECT 1 as test");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            jsonResponse([
                'database_connection' => 'OK',
                'test_query' => $result,
                'timestamp' => date('Y-m-d H:i:s')
            ], 200, 'Conexión a base de datos exitosa');
        } else {
            jsonResponse(null, 500, 'Error al conectar con la base de datos');
        }
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error de conexión: ' . $e->getMessage());
    }
}

function showApiStatus() {
    $database = new DatabaseConfig();
    $db = $database->getConnection();
    
    $status = [
        'api_version' => '1.0.0',
        'server_time' => date('Y-m-d H:i:s'),
        'database_status' => $db ? 'connected' : 'disconnected',
        'endpoints' => [
            'contacts' => '/api/contacts.php',
            'projects' => '/api/projects.php',
            'team' => '/api/team.php'
        ],
        'methods_supported' => ['GET', 'POST', 'PUT', 'DELETE'],
        'authentication' => 'API Key required (X-API-Key header)'
    ];
    
    jsonResponse($status, 200, 'API funcionando correctamente');
}

function showApiDocumentation() {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DG Producciones API</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 3px solid #007cba; padding-bottom: 10px; }
            h2 { color: #007cba; margin-top: 30px; }
            .endpoint { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #007cba; }
            .method { display: inline-block; padding: 3px 8px; border-radius: 3px; color: white; font-size: 12px; font-weight: bold; margin-right: 10px; }
            .get { background: #28a745; }
            .post { background: #007bff; }
            .put { background: #ffc107; color: #333; }
            .delete { background: #dc3545; }
            code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
            .status { padding: 10px; border-radius: 5px; margin: 20px 0; }
            .status.success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 DG Producciones API</h1>
            
            <div class="status success">
                ✅ API REST funcionando correctamente - Versión 1.0.0
            </div>
            
            <h2>🔐 Autenticación</h2>
            <p>Todas las solicitudes requieren una API Key enviada en el header:</p>
            <code>X-API-Key: dgproducciones_api_key_2025</code>
            
            <h2>📋 Endpoints Disponibles</h2>
            
            <div class="endpoint">
                <h3>Contactos (/api/contacts.php)</h3>
                <p><span class="method get">GET</span> <code>/api/contacts.php</code> - Obtener todos los contactos</p>
                <p><span class="method get">GET</span> <code>/api/contacts.php?id=1</code> - Obtener contacto específico</p>
                <p><span class="method post">POST</span> <code>/api/contacts.php</code> - Crear nuevo contacto</p>
                <p><span class="method put">PUT</span> <code>/api/contacts.php?id=1</code> - Actualizar contacto</p>
                <p><span class="method delete">DELETE</span> <code>/api/contacts.php?id=1</code> - Eliminar contacto</p>
            </div>
            
            <div class="endpoint">
                <h3>Proyectos (/api/projects.php)</h3>
                <p><span class="method get">GET</span> <code>/api/projects.php</code> - Obtener todos los proyectos</p>
                <p><span class="method get">GET</span> <code>/api/projects.php?id=1</code> - Obtener proyecto específico</p>
                <p><span class="method post">POST</span> <code>/api/projects.php</code> - Crear nuevo proyecto</p>
                <p><span class="method put">PUT</span> <code>/api/projects.php?id=1</code> - Actualizar proyecto</p>
                <p><span class="method delete">DELETE</span> <code>/api/projects.php?id=1</code> - Eliminar proyecto</p>
            </div>
            
            <div class="endpoint">
                <h3>Equipo (/api/team.php)</h3>
                <p><span class="method get">GET</span> <code>/api/team.php</code> - Obtener todo el equipo</p>
                <p><span class="method get">GET</span> <code>/api/team.php?id=1</code> - Obtener miembro específico</p>
                <p><span class="method post">POST</span> <code>/api/team.php</code> - Crear nuevo miembro</p>
                <p><span class="method put">PUT</span> <code>/api/team.php?id=1</code> - Actualizar miembro</p>
                <p><span class="method delete">DELETE</span> <code>/api/team.php?id=1</code> - Eliminar miembro</p>
            </div>
            
            <h2>🧪 Testing</h2>
            <p><a href="?endpoint=test">🔗 Probar conexión a base de datos</a></p>
            <p><a href="?endpoint=status">📊 Ver estado de la API</a></p>
            
            <h2>📝 Ejemplo de uso</h2>
            <pre><code>// JavaScript
fetch('/api/contacts.php', {
    method: 'GET',
    headers: {
        'X-API-Key': 'dgproducciones_api_key_2025'
    }
})
.then(response => response.json())
.then(data => console.log(data));</code></pre>
            
            <h2>📞 Contacto</h2>
            <p>Para soporte técnico: <strong>daniel@dgproducciones.cl</strong></p>
        </div>
    </body>
    </html>
    <?php
}
?>
<?php
// api/database.php - Configuración de base de datos para API REST
class DatabaseConfig {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        // Configuración para cPanel (producción)
        $this->host = 'localhost'; // En cPanel siempre es localhost
        $this->db_name = 'dgproducciones_dgproducciones';
        $this->username = 'dgproducciones_dgproducciones';
        $this->password = 'dgproducciones_2025';
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Error de conexión: " . $e->getMessage();
        }

        return $this->conn;
    }
}

// Función para validar API key (seguridad básica)
function validateApiKey($key) {
    $valid_keys = [
        'dgproducciones_api_key_2025',
        'dev_key_local'
    ];
    return in_array($key, $valid_keys);
}

// Función para respuesta JSON
function jsonResponse($data, $status = 200, $message = 'success') {
    http_response_code($status);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
    
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}
?>
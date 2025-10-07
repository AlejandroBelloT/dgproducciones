<?php
// api/contacts.php - Endpoint para gestión de contactos
require_once 'database.php';

$database = new DatabaseConfig();
$db = $database->getConnection();

// Validar API Key
$headers = getallheaders();
$api_key = $headers['X-API-Key'] ?? $_GET['api_key'] ?? null;

if (!validateApiKey($api_key)) {
    jsonResponse(null, 401, 'API Key inválida');
}

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_segments = explode('/', trim($request_uri, '/'));

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener contacto específico
            getContact($db, $_GET['id']);
        } else {
            // Obtener todos los contactos
            getAllContacts($db);
        }
        break;
        
    case 'POST':
        // Crear nuevo contacto
        createContact($db);
        break;
        
    case 'PUT':
        // Actualizar contacto
        if (isset($_GET['id'])) {
            updateContact($db, $_GET['id']);
        } else {
            jsonResponse(null, 400, 'ID requerido para actualizar');
        }
        break;
        
    case 'DELETE':
        // Eliminar contacto
        if (isset($_GET['id'])) {
            deleteContact($db, $_GET['id']);
        } else {
            jsonResponse(null, 400, 'ID requerido para eliminar');
        }
        break;
        
    default:
        jsonResponse(null, 405, 'Método no permitido');
}

function getAllContacts($db) {
    try {
        $query = "SELECT * FROM contacts ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($contacts, 200, 'Contactos obtenidos exitosamente');
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al obtener contactos: ' . $e->getMessage());
    }
}

function getContact($db, $id) {
    try {
        $query = "SELECT * FROM contacts WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $contact = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($contact) {
            jsonResponse($contact, 200, 'Contacto encontrado');
        } else {
            jsonResponse(null, 404, 'Contacto no encontrado');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al obtener contacto: ' . $e->getMessage());
    }
}

function createContact($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar campos requeridos
        $required_fields = ['name', 'email'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                jsonResponse(null, 400, "Campo requerido: $field");
            }
        }
        
        $query = "INSERT INTO contacts (name, email, phone, company, message, status, created_at) 
                  VALUES (:name, :email, :phone, :company, :message, :status, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $input['name']);
        $stmt->bindParam(':email', $input['email']);
        $stmt->bindParam(':phone', $input['phone'] ?? null);
        $stmt->bindParam(':company', $input['company'] ?? null);
        $stmt->bindParam(':message', $input['message'] ?? null);
        $stmt->bindParam(':status', $input['status'] ?? 'pending');
        
        if ($stmt->execute()) {
            $contact_id = $db->lastInsertId();
            jsonResponse(['id' => $contact_id], 201, 'Contacto creado exitosamente');
        } else {
            jsonResponse(null, 500, 'Error al crear contacto');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al crear contacto: ' . $e->getMessage());
    }
}

function updateContact($db, $id) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Construir query dinámicamente
        $fields = [];
        $params = [':id' => $id];
        
        $allowed_fields = ['name', 'email', 'phone', 'company', 'message', 'status'];
        
        foreach ($allowed_fields as $field) {
            if (isset($input[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        
        if (empty($fields)) {
            jsonResponse(null, 400, 'No hay campos para actualizar');
        }
        
        $fields[] = "updated_at = NOW()";
        $query = "UPDATE contacts SET " . implode(', ', $fields) . " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        if ($stmt->execute($params)) {
            if ($stmt->rowCount() > 0) {
                jsonResponse(['updated' => true], 200, 'Contacto actualizado exitosamente');
            } else {
                jsonResponse(null, 404, 'Contacto no encontrado');
            }
        } else {
            jsonResponse(null, 500, 'Error al actualizar contacto');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al actualizar contacto: ' . $e->getMessage());
    }
}

function deleteContact($db, $id) {
    try {
        $query = "DELETE FROM contacts WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                jsonResponse(['deleted' => true], 200, 'Contacto eliminado exitosamente');
            } else {
                jsonResponse(null, 404, 'Contacto no encontrado');
            }
        } else {
            jsonResponse(null, 500, 'Error al eliminar contacto');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al eliminar contacto: ' . $e->getMessage());
    }
}
?>
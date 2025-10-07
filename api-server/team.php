<?php
// api/team.php - Endpoint para gestión de equipo
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

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getTeamMember($db, $_GET['id']);
        } else {
            getAllTeamMembers($db);
        }
        break;
        
    case 'POST':
        createTeamMember($db);
        break;
        
    case 'PUT':
        if (isset($_GET['id'])) {
            updateTeamMember($db, $_GET['id']);
        } else {
            jsonResponse(null, 400, 'ID requerido para actualizar');
        }
        break;
        
    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteTeamMember($db, $_GET['id']);
        } else {
            jsonResponse(null, 400, 'ID requerido para eliminar');
        }
        break;
        
    default:
        jsonResponse(null, 405, 'Método no permitido');
}

function getAllTeamMembers($db) {
    try {
        $query = "SELECT * FROM team ORDER BY position ASC, created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $team = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($team, 200, 'Equipo obtenido exitosamente');
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al obtener equipo: ' . $e->getMessage());
    }
}

function getTeamMember($db, $id) {
    try {
        $query = "SELECT * FROM team WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $member = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($member) {
            jsonResponse($member, 200, 'Miembro encontrado');
        } else {
            jsonResponse(null, 404, 'Miembro no encontrado');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al obtener miembro: ' . $e->getMessage());
    }
}

function createTeamMember($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar campos requeridos
        $required_fields = ['name', 'position'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                jsonResponse(null, 400, "Campo requerido: $field");
            }
        }
        
        $query = "INSERT INTO team (name, position, description, image, email, linkedin, phone, status, created_at) 
                  VALUES (:name, :position, :description, :image, :email, :linkedin, :phone, :status, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $input['name']);
        $stmt->bindParam(':position', $input['position']);
        $stmt->bindParam(':description', $input['description'] ?? null);
        $stmt->bindParam(':image', $input['image'] ?? null);
        $stmt->bindParam(':email', $input['email'] ?? null);
        $stmt->bindParam(':linkedin', $input['linkedin'] ?? null);
        $stmt->bindParam(':phone', $input['phone'] ?? null);
        $stmt->bindParam(':status', $input['status'] ?? 'active');
        
        if ($stmt->execute()) {
            $member_id = $db->lastInsertId();
            jsonResponse(['id' => $member_id], 201, 'Miembro creado exitosamente');
        } else {
            jsonResponse(null, 500, 'Error al crear miembro');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al crear miembro: ' . $e->getMessage());
    }
}

function updateTeamMember($db, $id) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $fields = [];
        $params = [':id' => $id];
        
        $allowed_fields = ['name', 'position', 'description', 'image', 'email', 'linkedin', 'phone', 'status'];
        
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
        $query = "UPDATE team SET " . implode(', ', $fields) . " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        if ($stmt->execute($params)) {
            if ($stmt->rowCount() > 0) {
                jsonResponse(['updated' => true], 200, 'Miembro actualizado exitosamente');
            } else {
                jsonResponse(null, 404, 'Miembro no encontrado');
            }
        } else {
            jsonResponse(null, 500, 'Error al actualizar miembro');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al actualizar miembro: ' . $e->getMessage());
    }
}

function deleteTeamMember($db, $id) {
    try {
        $query = "DELETE FROM team WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                jsonResponse(['deleted' => true], 200, 'Miembro eliminado exitosamente');
            } else {
                jsonResponse(null, 404, 'Miembro no encontrado');
            }
        } else {
            jsonResponse(null, 500, 'Error al eliminar miembro');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al eliminar miembro: ' . $e->getMessage());
    }
}
?>
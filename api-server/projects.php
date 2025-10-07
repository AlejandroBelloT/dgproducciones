<?php
// api/projects.php - Endpoint para gestión de proyectos
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
            getProject($db, $_GET['id']);
        } else {
            getAllProjects($db);
        }
        break;
        
    case 'POST':
        createProject($db);
        break;
        
    case 'PUT':
        if (isset($_GET['id'])) {
            updateProject($db, $_GET['id']);
        } else {
            jsonResponse(null, 400, 'ID requerido para actualizar');
        }
        break;
        
    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteProject($db, $_GET['id']);
        } else {
            jsonResponse(null, 400, 'ID requerido para eliminar');
        }
        break;
        
    default:
        jsonResponse(null, 405, 'Método no permitido');
}

function getAllProjects($db) {
    try {
        $query = "SELECT * FROM projects ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($projects, 200, 'Proyectos obtenidos exitosamente');
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al obtener proyectos: ' . $e->getMessage());
    }
}

function getProject($db, $id) {
    try {
        $query = "SELECT * FROM projects WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($project) {
            jsonResponse($project, 200, 'Proyecto encontrado');
        } else {
            jsonResponse(null, 404, 'Proyecto no encontrado');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al obtener proyecto: ' . $e->getMessage());
    }
}

function createProject($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar campos requeridos
        $required_fields = ['title', 'description', 'category'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                jsonResponse(null, 400, "Campo requerido: $field");
            }
        }
        
        $query = "INSERT INTO projects (title, description, category, images, status, client, tags, created_at) 
                  VALUES (:title, :description, :category, :images, :status, :client, :tags, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $input['title']);
        $stmt->bindParam(':description', $input['description']);
        $stmt->bindParam(':category', $input['category']);
        $stmt->bindParam(':images', isset($input['images']) ? json_encode($input['images']) : null);
        $stmt->bindParam(':status', $input['status'] ?? 'active');
        $stmt->bindParam(':client', $input['client'] ?? null);
        $stmt->bindParam(':tags', isset($input['tags']) ? json_encode($input['tags']) : null);
        
        if ($stmt->execute()) {
            $project_id = $db->lastInsertId();
            jsonResponse(['id' => $project_id], 201, 'Proyecto creado exitosamente');
        } else {
            jsonResponse(null, 500, 'Error al crear proyecto');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al crear proyecto: ' . $e->getMessage());
    }
}

function updateProject($db, $id) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $fields = [];
        $params = [':id' => $id];
        
        $allowed_fields = ['title', 'description', 'category', 'images', 'status', 'client', 'tags'];
        
        foreach ($allowed_fields as $field) {
            if (isset($input[$field])) {
                if (in_array($field, ['images', 'tags']) && is_array($input[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = json_encode($input[$field]);
                } else {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }
        }
        
        if (empty($fields)) {
            jsonResponse(null, 400, 'No hay campos para actualizar');
        }
        
        $fields[] = "updated_at = NOW()";
        $query = "UPDATE projects SET " . implode(', ', $fields) . " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        if ($stmt->execute($params)) {
            if ($stmt->rowCount() > 0) {
                jsonResponse(['updated' => true], 200, 'Proyecto actualizado exitosamente');
            } else {
                jsonResponse(null, 404, 'Proyecto no encontrado');
            }
        } else {
            jsonResponse(null, 500, 'Error al actualizar proyecto');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al actualizar proyecto: ' . $e->getMessage());
    }
}

function deleteProject($db, $id) {
    try {
        $query = "DELETE FROM projects WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                jsonResponse(['deleted' => true], 200, 'Proyecto eliminado exitosamente');
            } else {
                jsonResponse(null, 404, 'Proyecto no encontrado');
            }
        } else {
            jsonResponse(null, 500, 'Error al eliminar proyecto');
        }
        
    } catch (Exception $e) {
        jsonResponse(null, 500, 'Error al eliminar proyecto: ' . $e->getMessage());
    }
}
?>
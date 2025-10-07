-- Crear tabla de usuarios para el sistema de administración
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'editor',
    password_hash VARCHAR(64) NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    disabled BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hash SHA256)
INSERT INTO
    users (
        name,
        email,
        role,
        password_hash,
        created_at,
        updated_at
    )
VALUES (
        'Administrador',
        'admin@dgproducciones.com',
        'admin',
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    updated_at = NOW();

-- Comentario sobre la contraseña del admin por defecto
-- IMPORTANTE: Cambiar la contraseña del administrador después de la primera instalación
-- La contraseña por defecto es: admin123
-- Base de datos completa para DG Producciones
-- Creado: 15 de enero 2025

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS dgproducciones;

USE dgproducciones;

-- Tabla de Proyectos
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM(
        'eventos',
        'stands',
        'activaciones',
        'material'
    ) NOT NULL DEFAULT 'eventos',
    main_image VARCHAR(255) NOT NULL,
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- Tabla de Contactos
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    message TEXT,
    status ENUM(
        'nuevo',
        'contactado',
        'seguimiento',
        'cerrado'
    ) DEFAULT 'nuevo',
    priority ENUM('baja', 'media', 'alta') DEFAULT 'media',
    source VARCHAR(50),
    budget_estimated DECIMAL(10, 2),
    event_date DATE,
    service_type VARCHAR(100),
    notes TEXT,
    assigned_to VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
);

-- Tabla de Equipo/Colaboradores
CREATE TABLE IF NOT EXISTS team (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    bio TEXT,
    image VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    social_media JSON,
    department VARCHAR(50),
    start_date DATE,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Configuración inicial
INSERT INTO
    projects (
        title,
        description,
        category,
        main_image,
        images
    )
VALUES (
        'Proyecto Demo',
        'Este es un proyecto de demostración para mostrar la funcionalidad del sistema.',
        'eventos',
        '/uploads/demo.jpg',
        '[]'
    )
ON DUPLICATE KEY UPDATE
    title = title;

-- Mostrar resumen
SELECT 'Schema creado exitosamente' AS status;

SELECT 'Tablas creadas:' AS info, COUNT(*) AS total
FROM information_schema.tables
WHERE
    table_schema = 'dgproducciones';
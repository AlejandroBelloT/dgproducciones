-- Script SQL para crear solo la tabla projects que necesita el formulario
-- Ejecuta este script en MySQL Workbench paso a paso

-- 1. CREAR LA BASE DE DATOS (si no existe)
CREATE DATABASE IF NOT EXISTS dgproducciones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. USAR LA BASE DE DATOS
USE dgproducciones;

-- 3. CREAR TABLA PROJECTS (solo campos del formulario)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    category ENUM(
        'eventos',
        'stands',
        'activaciones',
        'material'
    ) NOT NULL DEFAULT 'eventos',
    main_image VARCHAR(255) NOT NULL,
    images TEXT NULL, -- Cambié JSON por TEXT para compatibilidad
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_created (created_at)
);

-- 4. INSERTAR ALGUNOS DATOS DE PRUEBA
INSERT INTO
    projects (
        title,
        description,
        category,
        main_image,
        images
    )
VALUES (
        'Evento de Prueba 1',
        'Descripción del evento de prueba',
        'eventos',
        '/uploads/test1.jpg',
        '["\/uploads\/test1.jpg", "\/uploads\/test2.jpg"]'
    ),
    (
        'Stand de Prueba',
        'Descripción del stand de prueba',
        'stands',
        '/uploads/test3.jpg',
        '["\/uploads\/test3.jpg"]'
    ),
    (
        'Activación de Prueba',
        'Descripción de activación de prueba',
        'activaciones',
        '/uploads/test4.jpg',
        '["\/uploads\/test4.jpg", "\/uploads\/test5.jpg"]'
    );

-- 5. VERIFICAR QUE SE CREÓ CORRECTAMENTE
SELECT * FROM projects;

DESCRIBE projects;
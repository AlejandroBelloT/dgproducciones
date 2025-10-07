-- Script para agregar trazabilidad a contactos
-- Compatible con todas las versiones de MySQL/MariaDB

-- Primero, verificar si la tabla contact_actions ya existe y eliminarla si es necesario
DROP TABLE IF EXISTS contact_actions;

-- Crear tabla para trazabilidad de acciones en contactos
CREATE TABLE contact_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM(
        'created',
        'contacted',
        'status_changed',
        'updated',
        'note_added',
        'deleted'
    ) NOT NULL,
    previous_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NULL,
    notes TEXT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    INDEX idx_contact_id (contact_id),
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_action_date (action_date),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Agregar columnas de auditoría a la tabla contacts (con manejo de errores)
-- Verificar y agregar created_by
SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND COLUMN_NAME = 'created_by'
                ) = 0, 'ALTER TABLE contacts ADD COLUMN created_by INT NULL', 'SELECT "Column created_by already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Verificar y agregar created_by_name
SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND COLUMN_NAME = 'created_by_name'
                ) = 0, 'ALTER TABLE contacts ADD COLUMN created_by_name VARCHAR(100) NULL', 'SELECT "Column created_by_name already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Verificar y agregar last_modified_by
SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND COLUMN_NAME = 'last_modified_by'
                ) = 0, 'ALTER TABLE contacts ADD COLUMN last_modified_by INT NULL', 'SELECT "Column last_modified_by already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Verificar y agregar last_modified_by_name
SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND COLUMN_NAME = 'last_modified_by_name'
                ) = 0, 'ALTER TABLE contacts ADD COLUMN last_modified_by_name VARCHAR(100) NULL', 'SELECT "Column last_modified_by_name already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Verificar y agregar last_modified_at
SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND COLUMN_NAME = 'last_modified_at'
                ) = 0, 'ALTER TABLE contacts ADD COLUMN last_modified_at TIMESTAMP NULL', 'SELECT "Column last_modified_at already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Crear índices para optimizar consultas de auditoría (con manejo de errores)
SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.STATISTICS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND INDEX_NAME = 'idx_contacts_created_by'
                ) = 0, 'CREATE INDEX idx_contacts_created_by ON contacts (created_by)', 'SELECT "Index idx_contacts_created_by already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.STATISTICS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND INDEX_NAME = 'idx_contacts_last_modified_by'
                ) = 0, 'CREATE INDEX idx_contacts_last_modified_by ON contacts (last_modified_by)', 'SELECT "Index idx_contacts_last_modified_by already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET
    @sql = (
        SELECT IF(
                (
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.STATISTICS
                    WHERE
                        TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = 'contacts'
                        AND INDEX_NAME = 'idx_contacts_last_modified_at'
                ) = 0, 'CREATE INDEX idx_contacts_last_modified_at ON contacts (last_modified_at)', 'SELECT "Index idx_contacts_last_modified_at already exists" AS message'
            )
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Mostrar estructura final de la tabla contacts
SELECT 'Estructura actualizada de la tabla contacts:' AS status;

DESCRIBE contacts;
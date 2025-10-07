-- Tabla para trazabilidad de acciones en contactos
CREATE TABLE IF NOT EXISTS contact_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    user_id VARCHAR(36) NOT NULL,
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

-- Modificar tabla contacts para agregar campos de auditoría
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS created_by VARCHAR(36) NULL,
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS last_modified_by VARCHAR(36) NULL,
ADD COLUMN IF NOT EXISTS last_modified_by_name VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMP NULL;

-- Índices para optimizar consultas de auditoría
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON contacts (created_by);

CREATE INDEX IF NOT EXISTS idx_contacts_last_modified_by ON contacts (last_modified_by);

CREATE INDEX IF NOT EXISTS idx_contacts_last_modified_at ON contacts (last_modified_at);
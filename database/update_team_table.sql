-- Actualizar tabla team para que coincida con el formulario
-- Primero vamos a modificar la estructura existente

ALTER TABLE team ADD COLUMN role VARCHAR(100) AFTER name;

-- Copiar datos de position a role si existen
UPDATE team SET role = position WHERE role IS NULL OR role = '';

-- Ahora podemos eliminar la columna position
ALTER TABLE team DROP COLUMN position;

-- Verificar que tenemos todos los campos necesarios
-- Los campos del formulario son: name, role, phone, email, photo, department
-- La tabla ya tiene: name, email, phone, department
-- Necesitamos asegurar que photo esté como image

-- Renombrar image a photo para coincidir con el formulario
ALTER TABLE team CHANGE COLUMN image photo VARCHAR(255);

-- Hacer que los campos obligatorios del formulario sean NOT NULL
ALTER TABLE team MODIFY COLUMN name VARCHAR(100) NOT NULL;

ALTER TABLE team MODIFY COLUMN role VARCHAR(100) NOT NULL;

ALTER TABLE team MODIFY COLUMN phone VARCHAR(20) NOT NULL;

ALTER TABLE team MODIFY COLUMN email VARCHAR(100) NOT NULL;

-- Establecer un valor por defecto para department
ALTER TABLE team
MODIFY COLUMN department VARCHAR(50) DEFAULT 'produccion';

-- Describir la estructura final para verificar
DESCRIBE team;
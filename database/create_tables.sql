-- Script SQL para crear tablas de DG Producciones
-- Ejecuta este script en tu MySQL/MariaDB para crear las tablas necesarias

-- Crear la base de datos (opcional si ya existe)
CREATE DATABASE IF NOT EXISTS dgproducciones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dgproducciones;

-- ===============================
-- 1. TABLA CONTACTOS (para formulario)
-- ===============================
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nombre completo',
    email VARCHAR(255) NOT NULL COMMENT 'Email de contacto',
    phone VARCHAR(50) NULL COMMENT 'Teléfono de contacto',
    company VARCHAR(255) NULL COMMENT 'Empresa o marca',
    message TEXT NOT NULL COMMENT 'Mensaje del proyecto',
    status ENUM(
        'nuevo',
        'contactado',
        'cotizado',
        'cerrado'
    ) DEFAULT 'nuevo' COMMENT 'Estado del contacto',
    priority ENUM(
        'baja',
        'media',
        'alta',
        'urgente'
    ) DEFAULT 'media' COMMENT 'Prioridad',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) COMMENT 'Contactos del formulario web';

-- ===============================
-- 2. TABLA CONTENIDO (para gestión del sitio)
-- ===============================
CREATE TABLE content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM(
        'service',
        'testimonial',
        'project',
        'faq',
        'team_member'
    ) NOT NULL COMMENT 'Tipo de contenido',
    title VARCHAR(500) NOT NULL COMMENT 'Título',
    description TEXT NULL COMMENT 'Descripción completa',
    short_description VARCHAR(500) NULL COMMENT 'Descripción corta',
    image_url VARCHAR(500) NULL COMMENT 'URL de imagen principal',
    status ENUM(
        'draft',
        'published',
        'archived'
    ) DEFAULT 'published' COMMENT 'Estado',
    order_position INT DEFAULT 0 COMMENT 'Orden de visualización',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Contenido destacado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured)
) COMMENT 'Contenido dinámico del sitio';

-- ===============================
-- 3. TABLA CONFIGURACIONES (para admin)
-- ===============================
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clave de configuración',
    setting_value TEXT NOT NULL COMMENT 'Valor',
    category VARCHAR(50) DEFAULT 'general' COMMENT 'Categoría',
    description TEXT NULL COMMENT 'Descripción',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) COMMENT 'Configuraciones del sitio';

-- ===============================
-- INSERTAR DATOS INICIALES
-- ===============================

-- Configuraciones básicas
INSERT INTO
    site_settings (
        setting_key,
        setting_value,
        category,
        description
    )
VALUES (
        'company_name',
        'DG Producciones',
        'company',
        'Nombre de la empresa'
    ),
    (
        'company_email',
        'daniel@dgproducciones.cl',
        'contact',
        'Email principal'
    ),
    (
        'company_phone',
        '+56995777796',
        'contact',
        'Teléfono WhatsApp'
    ),
    (
        'site_title',
        'DG Producciones - Eventos BTL, RRHH y Transporte',
        'seo',
        'Título del sitio'
    ),
    (
        'whatsapp_message',
        '¡Hola! Me interesa conocer más sobre sus servicios de producción BTL.',
        'contact',
        'Mensaje WhatsApp por defecto'
    );

-- Servicios principales
INSERT INTO
    content (
        type,
        title,
        short_description,
        description,
        order_position,
        is_featured,
        status
    )
VALUES (
        'service',
        'Eventos BTL y Marketing Experiencial',
        'Creamos experiencias memorables que conectan tu marca con el público objetivo',
        'Diseñamos y ejecutamos eventos BTL (Below The Line) que generan conexiones emocionales auténticas. Desde activaciones de marca hasta lanzamientos de productos, cada evento es una oportunidad única para crear recuerdos duraderos y generar engagement real con tu audiencia.',
        1,
        true,
        'published'
    ),
    (
        'service',
        'Gestión de Recursos Humanos',
        'Soluciones integrales en RRHH para el crecimiento de tu organización',
        'Ofrecemos servicios especializados en gestión de recursos humanos, desde reclutamiento hasta desarrollo organizacional. Nuestro enfoque se centra en crear equipos de alto rendimiento que impulsen el crecimiento sostenible de tu empresa.',
        2,
        true,
        'published'
    ),
    (
        'service',
        'Transporte Ejecutivo y Logística',
        'Servicios de transporte especializado para eventos y empresas',
        'Proporcionamos soluciones de transporte ejecutivo y logística especializada. Desde traslados VIP hasta coordinación logística compleja para eventos corporativos, garantizamos puntualidad, comodidad y profesionalismo en cada servicio.',
        3,
        true,
        'published'
    );

-- FAQs básicas
INSERT INTO
    content (
        type,
        title,
        description,
        order_position,
        status
    )
VALUES (
        'faq',
        '¿Qué tipo de eventos BTL pueden organizar?',
        'Organizamos activaciones de marca, lanzamientos de productos, eventos corporativos, experiencias inmersivas, promociones en punto de venta, y campañas de marketing experiencial. Nuestro equipo tiene experiencia desde eventos íntimos de 50 personas hasta grandes activaciones de 5000+ participantes.',
        1,
        'published'
    ),
    (
        'faq',
        '¿Cuánto tiempo necesitan para organizar un evento?',
        'El tiempo de organización depende de la complejidad del evento. Para eventos simples necesitamos mínimo 2 semanas, para eventos complejos recomendamos 1-3 meses de anticipación. También ofrecemos servicio express para situaciones urgentes.',
        2,
        'published'
    ),
    (
        'faq',
        '¿Trabajan con empresas de todo Chile?',
        'Sí, trabajamos a nivel nacional. Tenemos experiencia coordinando eventos en Santiago, regiones y ubicaciones remotas, manejando toda la logística necesaria. Contamos con una red de proveedores confiables en las principales ciudades.',
        3,
        'published'
    ),
    (
        'faq',
        '¿Qué incluye el servicio de RRHH?',
        'Nuestros servicios incluyen: reclutamiento y selección de personal, capacitación empresarial, evaluación de desempeño, desarrollo organizacional, y consultoría en clima laboral. Adaptamos nuestros servicios desde startups hasta grandes corporaciones.',
        4,
        'published'
    );

-- ===============================
-- VERIFICAR TABLAS CREADAS
-- ===============================
SHOW TABLES;

-- Ver estructura de tabla contacts
DESCRIBE contacts;

-- Consultar datos iniciales
SELECT * FROM site_settings;

SELECT type, title, status
FROM content
ORDER BY type, order_position;
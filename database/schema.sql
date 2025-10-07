-- DG Producciones Database Schema
-- Compatible con MySQL 8.0+ y MariaDB 10.5+
-- Fecha de creación: 15 de septiembre de 2025

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS dgproducciones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dgproducciones;

-- Tabla para contactos del formulario
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nombre completo del contacto',
    email VARCHAR(255) NOT NULL COMMENT 'Email de contacto',
    phone VARCHAR(50) NULL COMMENT 'Teléfono de contacto',
    company VARCHAR(255) NULL COMMENT 'Empresa o marca',
    message TEXT NOT NULL COMMENT 'Mensaje del proyecto',
    status ENUM(
        'nuevo',
        'contactado',
        'cotizado',
        'cerrado',
        'cancelado'
    ) DEFAULT 'nuevo' COMMENT 'Estado del lead',
    priority ENUM(
        'baja',
        'media',
        'alta',
        'urgente'
    ) DEFAULT 'media' COMMENT 'Prioridad del contacto',
    source VARCHAR(100) DEFAULT 'formulario_web' COMMENT 'Origen del contacto',
    budget_estimated DECIMAL(12, 2) NULL COMMENT 'Presupuesto estimado',
    event_date DATE NULL COMMENT 'Fecha estimada del evento',
    service_type ENUM(
        'eventos_btl',
        'recursos_humanos',
        'transporte',
        'multiple',
        'otro'
    ) NULL COMMENT 'Tipo de servicio requerido',
    notes TEXT NULL COMMENT 'Notas internas del equipo',
    assigned_to VARCHAR(255) NULL COMMENT 'Responsable asignado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email),
    INDEX idx_priority (priority),
    INDEX idx_service_type (service_type)
) COMMENT 'Tabla para almacenar contactos del formulario web';

-- Tabla para contenido dinámico (servicios, testimonios, etc.)
CREATE TABLE content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM(
        'service',
        'testimonial',
        'project',
        'faq',
        'team_member',
        'hero_content'
    ) NOT NULL COMMENT 'Tipo de contenido',
    title VARCHAR(500) NOT NULL COMMENT 'Título del contenido',
    description TEXT NULL COMMENT 'Descripción detallada',
    short_description VARCHAR(500) NULL COMMENT 'Descripción corta para cards',
    content JSON NULL COMMENT 'Contenido adicional en formato JSON',
    image_url VARCHAR(500) NULL COMMENT 'URL de la imagen principal',
    gallery JSON NULL COMMENT 'Galería de imágenes en formato JSON',
    metadata JSON NULL COMMENT 'Metadatos SEO y configuración',
    status ENUM(
        'draft',
        'published',
        'archived'
    ) DEFAULT 'draft' COMMENT 'Estado del contenido',
    order_position INT DEFAULT 0 COMMENT 'Orden de visualización',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Contenido destacado',
    tags JSON NULL COMMENT 'Etiquetas para categorización',
    seo_title VARCHAR(255) NULL COMMENT 'Título SEO',
    seo_description VARCHAR(500) NULL COMMENT 'Descripción SEO',
    slug VARCHAR(255) NULL COMMENT 'URL amigable',
    created_by VARCHAR(255) NULL COMMENT 'Usuario creador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_slug (slug),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_slug (slug)
) COMMENT 'Tabla para gestión dinámica de contenido';

-- Tabla para miembros del equipo
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nombre completo',
    position VARCHAR(255) NOT NULL COMMENT 'Cargo en la empresa',
    bio TEXT NULL COMMENT 'Biografía profesional',
    image_url VARCHAR(500) NULL COMMENT 'URL de la foto',
    email VARCHAR(255) NULL COMMENT 'Email profesional',
    linkedin_url VARCHAR(500) NULL COMMENT 'Perfil de LinkedIn',
    specialties JSON NULL COMMENT 'Especialidades y habilidades',
    experience_years INT NULL COMMENT 'Años de experiencia',
    department ENUM(
        'direccion',
        'produccion',
        'creativo',
        'logistica',
        'rrhh',
        'comercial'
    ) NULL COMMENT 'Departamento',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Miembro activo',
    display_order INT DEFAULT 0 COMMENT 'Orden de visualización',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) COMMENT 'Información del equipo de trabajo';

-- Tabla para configuraciones del sitio
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clave de configuración',
    setting_value TEXT NOT NULL COMMENT 'Valor de la configuración',
    setting_type ENUM(
        'text',
        'number',
        'boolean',
        'json',
        'url',
        'email',
        'phone'
    ) DEFAULT 'text' COMMENT 'Tipo de dato',
    category VARCHAR(100) DEFAULT 'general' COMMENT 'Categoría de configuración',
    description TEXT NULL COMMENT 'Descripción de la configuración',
    is_public BOOLEAN DEFAULT FALSE COMMENT 'Visible en frontend',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
) COMMENT 'Configuraciones generales del sitio';

-- Tabla para análisis y métricas básicas
CREATE TABLE site_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type ENUM(
        'page_view',
        'form_submission',
        'contact_whatsapp',
        'email_click',
        'phone_click',
        'download'
    ) NOT NULL COMMENT 'Tipo de evento',
    page_url VARCHAR(500) NULL COMMENT 'URL de la página',
    user_agent TEXT NULL COMMENT 'User agent del navegador',
    ip_address VARCHAR(45) NULL COMMENT 'Dirección IP (anonimizada)',
    referrer VARCHAR(500) NULL COMMENT 'Página de referencia',
    session_id VARCHAR(255) NULL COMMENT 'ID de sesión',
    event_data JSON NULL COMMENT 'Datos adicionales del evento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at),
    INDEX idx_session_id (session_id)
) COMMENT 'Análisis básico de interacciones del sitio';

-- Insertar datos iniciales
INSERT INTO
    site_settings (
        setting_key,
        setting_value,
        setting_type,
        category,
        description,
        is_public
    )
VALUES (
        'company_name',
        'DG Producciones',
        'text',
        'company',
        'Nombre de la empresa',
        true
    ),
    (
        'company_email',
        'daniel@dgproducciones.cl',
        'email',
        'contact',
        'Email principal de contacto',
        true
    ),
    (
        'company_phone',
        '+56995777796',
        'phone',
        'contact',
        'Teléfono principal WhatsApp',
        true
    ),
    (
        'company_address',
        'Chile',
        'text',
        'contact',
        'Dirección de la empresa',
        true
    ),
    (
        'site_title',
        'DG Producciones - Eventos BTL, RRHH y Transporte Especializado',
        'text',
        'seo',
        'Título principal del sitio',
        true
    ),
    (
        'site_description',
        'Especialistas en producción BTL, gestión de recursos humanos y transporte ejecutivo. Creamos experiencias inolvidables que conectan marcas con audiencias.',
        'text',
        'seo',
        'Descripción del sitio para SEO',
        true
    ),
    (
        'whatsapp_default_message',
        '¡Hola! Me interesa conocer más sobre sus servicios de producción BTL.',
        'text',
        'contact',
        'Mensaje predeterminado de WhatsApp',
        false
    ),
    (
        'analytics_enabled',
        'true',
        'boolean',
        'system',
        'Análisis de métricas habilitado',
        false
    );

-- Insertar contenido inicial de servicios
INSERT INTO
    content (
        type,
        title,
        short_description,
        description,
        metadata,
        status,
        order_position,
        is_featured,
        seo_title,
        seo_description
    )
VALUES (
        'service',
        'Eventos BTL y Marketing Experiencial',
        'Creamos experiencias memorables que conectan tu marca con el público objetivo',
        'Diseñamos y ejecutamos eventos BTL (Below The Line) que generan conexiones emocionales auténticas. Desde activaciones de marca hasta lanzamientos de productos, cada evento es una oportunidad única para crear recuerdos duraderos.',
        '{"icon": "🎯", "color": "blue", "features": ["Activaciones de marca", "Lanzamientos de productos", "Eventos corporativos", "Experiencias inmersivas"]}',
        'published',
        1,
        true,
        'Eventos BTL y Marketing Experiencial - DG Producciones',
        'Especialistas en eventos BTL y marketing experiencial. Creamos activaciones de marca memorables que conectan con tu audiencia.'
    ),
    (
        'service',
        'Gestión de Recursos Humanos',
        'Soluciones integrales en RRHH para el crecimiento de tu organización',
        'Ofrecemos servicios especializados en gestión de recursos humanos, desde reclutamiento hasta desarrollo organizacional. Nuestro enfoque se centra en crear equipos de alto rendimiento.',
        '{"icon": "👥", "color": "green", "features": ["Reclutamiento y selección", "Capacitación empresarial", "Evaluación de desempeño", "Desarrollo organizacional"]}',
        'published',
        2,
        true,
        'Gestión de Recursos Humanos Especializada - DG Producciones',
        'Servicios integrales de RRHH: reclutamiento, capacitación y desarrollo organizacional para empresas en crecimiento.'
    ),
    (
        'service',
        'Transporte Ejecutivo y Logística',
        'Servicios de transporte especializado para eventos y empresas',
        'Proporcionamos soluciones de transporte ejecutivo y logística especializada. Desde traslados VIP hasta coordinación logística compleja para eventos corporativos.',
        '{"icon": "🚗", "color": "orange", "features": ["Transporte ejecutivo", "Logística de eventos", "Coordinación de traslados", "Servicios VIP"]}',
        'published',
        3,
        true,
        'Transporte Ejecutivo y Logística - DG Producciones',
        'Transporte ejecutivo y logística especializada para eventos corporativos. Servicios VIP y coordinación profesional.'
    );

-- Insertar FAQs iniciales
INSERT INTO
    content (
        type,
        title,
        description,
        content,
        status,
        order_position,
        is_featured
    )
VALUES (
        'faq',
        '¿Qué tipo de eventos BTL pueden organizar?',
        'Organizamos todo tipo de eventos BTL: activaciones de marca, lanzamientos de productos, eventos corporativos, experiencias inmersivas, promociones en punto de venta, y campañas de marketing experiencial.',
        '{"answer_extended": "Nuestro equipo tiene experiencia en eventos desde 50 hasta 5000+ personas, adaptándonos a cualquier presupuesto y objetivo."}',
        'published',
        1,
        true
    ),
    (
        'faq',
        '¿Cuánto tiempo necesitan para organizar un evento?',
        'El tiempo de organización depende de la complejidad del evento. Para eventos simples necesitamos mínimo 2 semanas, para eventos complejos recomendamos 1-3 meses de anticipación.',
        '{"answer_extended": "Ofrecemos servicio de organización express para situaciones urgentes con recargo del 20%."}',
        'published',
        2,
        true
    ),
    (
        'faq',
        '¿Trabajan con empresas de todo Chile?',
        'Sí, trabajamos a nivel nacional. Tenemos experiencia coordinando eventos en Santiago, regiones y ubicaciones remotas, manejando toda la logística necesaria.',
        '{"answer_extended": "Contamos con red de proveedores en las principales ciudades de Chile para garantizar la calidad en cualquier ubicación."}',
        'published',
        3,
        true
    ),
    (
        'faq',
        '¿Qué incluye el servicio de RRHH?',
        'Nuestros servicios de RRHH incluyen: reclutamiento y selección, capacitación empresarial, evaluación de desempeño, desarrollo organizacional, y consultoría en clima laboral.',
        '{"answer_extended": "Adaptamos nuestros servicios a las necesidades específicas de cada empresa, desde startups hasta corporaciones."}',
        'published',
        4,
        true
    );

-- Crear usuario administrador por defecto (contraseña debe ser hasheada en la aplicación)
-- Esta tabla se puede agregar más adelante si se requiere autenticación
-- CREATE TABLE admin_users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(100) NOT NULL UNIQUE,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password_hash VARCHAR(255) NOT NULL,
--     role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
--     is_active BOOLEAN DEFAULT TRUE,
--     last_login TIMESTAMP NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );
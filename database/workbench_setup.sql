-- Script para crear la base de datos DG Producciones
-- Ejecuta este script en tu MySQL Workbench paso a paso

-- 1. CREAR LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS dgproducciones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. USAR LA BASE DE DATOS
USE dgproducciones;

-- 3. CREAR TABLA CONTACTS (para formulario de contacto)
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Nombre completo del contacto',
    email VARCHAR(100) NOT NULL COMMENT 'Email de contacto',
    phone VARCHAR(20) NULL COMMENT 'Teléfono de contacto',
    company VARCHAR(100) NULL COMMENT 'Empresa o marca',
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
    ) DEFAULT 'media' COMMENT 'Prioridad del contacto',
    source VARCHAR(50) DEFAULT 'website' COMMENT 'Origen del contacto',
    budget_estimated DECIMAL(10, 2) NULL COMMENT 'Presupuesto estimado',
    event_date DATE NULL COMMENT 'Fecha estimada del evento',
    service_type VARCHAR(50) NULL COMMENT 'Tipo de servicio requerido',
    notes TEXT NULL COMMENT 'Notas internas del equipo',
    assigned_to VARCHAR(100) NULL COMMENT 'Responsable asignado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) COMMENT 'Contactos del formulario web';

-- 4. CREAR TABLA CONTENT (para gestión de contenido dinámico)
CREATE TABLE content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM(
        'service',
        'testimonial',
        'project',
        'faq',
        'team_member'
    ) NOT NULL COMMENT 'Tipo de contenido',
    title VARCHAR(200) NOT NULL COMMENT 'Título del contenido',
    description TEXT NULL COMMENT 'Descripción completa',
    short_description VARCHAR(500) NULL COMMENT 'Descripción corta',
    image_url VARCHAR(500) NULL COMMENT 'URL de la imagen principal',
    status ENUM(
        'draft',
        'published',
        'archived'
    ) DEFAULT 'published' COMMENT 'Estado del contenido',
    order_position INT DEFAULT 0 COMMENT 'Orden de visualización',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Contenido destacado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured)
) COMMENT 'Contenido dinámico del sitio';

-- 5. CREAR TABLA SITE_SETTINGS (para configuraciones del sitio)
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clave de configuración',
    setting_value TEXT NOT NULL COMMENT 'Valor de la configuración',
    category VARCHAR(50) DEFAULT 'general' COMMENT 'Categoría',
    description TEXT NULL COMMENT 'Descripción de la configuración',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Configuraciones del sitio';

-- 6. CREAR TABLA PROJECTS (para galería de proyectos)
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT 'Título del proyecto',
    description TEXT NULL COMMENT 'Descripción del proyecto',
    client VARCHAR(100) NULL COMMENT 'Cliente del proyecto',
    category ENUM(
        'eventos',
        'rrhh',
        'transporte',
        'btl',
        'activaciones',
        'stands',
        'todos'
    ) NOT NULL DEFAULT 'eventos' COMMENT 'Categoría del proyecto',
    main_image VARCHAR(500) NULL COMMENT 'Imagen principal',
    image_url VARCHAR(500) NULL COMMENT 'URL de la imagen (compatibilidad)',
    project_date DATE NULL COMMENT 'Fecha del proyecto',
    location VARCHAR(200) NULL COMMENT 'Ubicación del evento',
    status ENUM(
        'completed',
        'in_progress',
        'planned'
    ) DEFAULT 'completed' COMMENT 'Estado del proyecto',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Proyecto destacado',
    order_position INT DEFAULT 0 COMMENT 'Orden de visualización',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_project_date (project_date)
) COMMENT 'Proyectos y galería de trabajos realizados';

-- 7. INSERTAR DATOS INICIALES

-- Configuraciones básicas del sitio
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
        'Email principal de contacto'
    ),
    (
        'company_phone',
        '+56995777796',
        'contact',
        'Teléfono principal WhatsApp'
    ),
    (
        'site_title',
        'DG Producciones - Eventos BTL, RRHH y Transporte',
        'seo',
        'Título principal del sitio'
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
        'Diseñamos y ejecutamos eventos BTL (Below The Line) que generan conexiones emocionales auténticas. Desde activaciones de marca hasta lanzamientos de productos, cada evento es una oportunidad única para crear recuerdos duraderos y generar engagement real con tu audiencia objetivo.',
        1,
        true,
        'published'
    ),
    (
        'service',
        'Gestión de Recursos Humanos',
        'Soluciones integrales en RRHH para el crecimiento de tu organización',
        'Ofrecemos servicios especializados en gestión de recursos humanos, desde reclutamiento hasta desarrollo organizacional. Nuestro enfoque se centra en crear equipos de alto rendimiento que impulsen el crecimiento sostenible de tu empresa con estrategias personalizadas.',
        2,
        true,
        'published'
    ),
    (
        'service',
        'Transporte Ejecutivo y Logística',
        'Servicios de transporte especializado para eventos y empresas',
        'Proporcionamos soluciones de transporte ejecutivo y logística especializada. Desde traslados VIP hasta coordinación logística compleja para eventos corporativos, garantizamos puntualidad, comodidad y profesionalismo en cada servicio que prestamos.',
        3,
        true,
        'published'
    );

-- FAQs principales
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
        'Organizamos activaciones de marca, lanzamientos de productos, eventos corporativos, experiencias inmersivas, promociones en punto de venta y campañas de marketing experiencial. Nuestro equipo tiene experiencia desde eventos íntimos de 50 personas hasta grandes activaciones de 5000+ participantes.',
        1,
        'published'
    ),
    (
        'faq',
        '¿Cuánto tiempo necesitan para organizar un evento?',
        'El tiempo de organización depende de la complejidad del evento. Para eventos simples necesitamos mínimo 2 semanas, para eventos complejos recomendamos 1-3 meses de anticipación. También ofrecemos servicio express para situaciones urgentes con disponibilidad de 48 horas.',
        2,
        'published'
    ),
    (
        'faq',
        '¿Trabajan con empresas de todo Chile?',
        'Sí, trabajamos a nivel nacional. Tenemos experiencia coordinando eventos en Santiago, regiones y ubicaciones remotas, manejando toda la logística necesaria. Contamos con una red de proveedores confiables en las principales ciudades del país.',
        3,
        'published'
    ),
    (
        'faq',
        '¿Qué incluye el servicio de RRHH?',
        'Nuestros servicios incluyen: reclutamiento y selección de personal, capacitación empresarial, evaluación de desempeño, desarrollo organizacional y consultoría en clima laboral. Adaptamos nuestros servicios desde startups hasta grandes corporaciones.',
        4,
        'published'
    );

-- Proyectos de ejemplo para la galería
INSERT INTO
    projects (
        title,
        description,
        client,
        category,
        main_image,
        image_url,
        project_date,
        location,
        is_featured,
        order_position,
        status
    )
VALUES (
        'Activación de Marca - Coca Cola',
        'Gran activación de marca en centro comercial con experiencias interactivas y degustaciones',
        'Coca Cola Chile',
        'activaciones',
        '/images/imagesDePrueba/1.png',
        '/images/imagesDePrueba/1.png',
        '2024-08-15',
        'Mall Plaza Vespucio, Santiago',
        true,
        1,
        'completed'
    ),
    (
        'Stand Corporativo - Banco Estado',
        'Diseño y montaje de stand institucional para feria financiera',
        'Banco Estado',
        'stands',
        '/images/imagesDePrueba/2.png',
        '/images/imagesDePrueba/2.png',
        '2024-07-22',
        'Centro de Eventos Casapiedra',
        true,
        2,
        'completed'
    ),
    (
        'Evento BTL - Samsung Galaxy',
        'Lanzamiento de nuevo smartphone con experiencias de realidad virtual',
        'Samsung Chile',
        'btl',
        '/images/imagesDePrueba/3.png',
        '/images/imagesDePrueba/3.png',
        '2024-09-10',
        'Hotel W Santiago',
        true,
        3,
        'completed'
    ),
    (
        'Capacitación Empresarial - Entel',
        'Programa de desarrollo de liderazgo para ejecutivos',
        'Entel Chile',
        'rrhh',
        '/images/imagesDePrueba/4.png',
        '/images/imagesDePrueba/4.png',
        '2024-06-18',
        'Centro de Convenciones Espacio Riesco',
        false,
        4,
        'completed'
    ),
    (
        'Transporte VIP - Festival de Viña',
        'Coordinación de transporte ejecutivo para artistas internacionales',
        'Festival Internacional de la Canción',
        'transporte',
        '/images/imagesDePrueba/5.png',
        '/images/imagesDePrueba/5.png',
        '2024-02-25',
        'Viña del Mar',
        false,
        5,
        'completed'
    ),
    (
        'Activación Punto de Venta - Nestlé',
        'Activación en supermercados con degustaciones y promociones',
        'Nestlé Chile',
        'activaciones',
        '/images/imagesDePrueba/6.png',
        '/images/imagesDePrueba/6.png',
        '2024-05-14',
        'Supermercados Jumbo',
        false,
        6,
        'completed'
    ),
    (
        'Stand Ferial - Falabella',
        'Stand interactivo para feria de retail y comercio',
        'Falabella Retail',
        'stands',
        '/images/imagesDePrueba/7.png',
        '/images/imagesDePrueba/7.png',
        '2024-04-08',
        'Feria Expo Retail',
        false,
        7,
        'completed'
    ),
    (
        'Evento Corporativo - Codelco',
        'Ceremonia de reconocimiento anual para colaboradores',
        'Codelco Chile',
        'eventos',
        '/images/imagesDePrueba/8.png',
        '/images/imagesDePrueba/8.png',
        '2024-11-20',
        'Hotel Sheraton Santiago',
        false,
        8,
        'completed'
    ),
    (
        'Workshop RRHH - Ripley',
        'Taller de gestión del cambio organizacional',
        'Ripley Chile',
        'rrhh',
        '/images/imagesDePrueba/9.png',
        '/images/imagesDePrueba/9.png',
        '2024-03-12',
        'Oficinas Corporativas Ripley',
        false,
        9,
        'completed'
    ),
    (
        'Activación Digital - Movistar',
        'Experiencia omnicanal con tecnología AR/VR',
        'Movistar Chile',
        'btl',
        '/images/imagesDePrueba/10.png',
        '/images/imagesDePrueba/10.png',
        '2024-10-05',
        'Mall Costanera Center',
        false,
        10,
        'completed'
    ),
    (
        'Logística Evento - Red Bull',
        'Coordinación logística completa para competencia deportiva',
        'Red Bull Chile',
        'transporte',
        '/images/imagesDePrueba/11.png',
        '/images/imagesDePrueba/11.png',
        '2024-01-30',
        'Valle Nevado',
        false,
        11,
        'completed'
    ),
    (
        'Stand Premium - LG Electronics',
        'Stand premium con tecnología de última generación',
        'LG Electronics',
        'stands',
        '/images/imagesDePrueba/12.png',
        '/images/imagesDePrueba/12.png',
        '2024-09-28',
        'Feria FIDAE',
        false,
        12,
        'completed'
    );

-- 7. VERIFICAR QUE TODO ESTÉ CREADO CORRECTAMENTE
SHOW TABLES;

-- Ver estructura de la tabla contacts
DESCRIBE contacts;

-- Ver datos iniciales
SELECT 'CONFIGURACIONES:' as tabla;

SELECT setting_key, setting_value FROM site_settings;

SELECT 'SERVICIOS:' as tabla;

SELECT type, title, status FROM content WHERE type = 'service';

SELECT 'FAQS:' as tabla;

SELECT type, title, status FROM content WHERE type = 'faq';

SELECT 'PROYECTOS:' as tabla;

SELECT
    title,
    category,
    client,
    project_date
FROM projects
ORDER BY order_position;

-- Mensaje de confirmación
SELECT '✅ Base de datos dgproducciones creada exitosamente!' as status;

-- Mensaje de confirmación
SELECT '✅ Base de datos dgproducciones creada exitosamente!' as status;
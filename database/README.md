# Configuración de Base de Datos para DG Producciones

## Pasos para configurar la base de datos

### 1. Ejecutar el script SQL

```bash
# Conectarse a MySQL/MariaDB
mysql -u root -p

# O si tienes un usuario específico
mysql -u tu_usuario -p

# Ejecutar el script
source /ruta/completa/a/tu/proyecto/database/create_tables.sql

# O copiando y pegando el contenido del archivo create_tables.sql
```

### 2. Crear archivo de variables de entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con:

```env
# Configuración de base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=dgproducciones
DB_PORT=3306

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Verificar la conexión

Una vez configurado, puedes probar la conexión ejecutando:

```bash
npm run dev
```

### 4. Estructura de tablas creadas

#### `contacts` - Para el formulario de contacto

- `id`: ID único
- `name`: Nombre completo
- `email`: Email de contacto
- `phone`: Teléfono (opcional)
- `company`: Empresa (opcional)
- `message`: Mensaje del proyecto
- `status`: Estado (nuevo, contactado, cotizado, cerrado)
- `priority`: Prioridad (baja, media, alta, urgente)
- `created_at`, `updated_at`: Fechas

#### `content` - Para gestión de contenido

- `id`: ID único
- `type`: Tipo (service, testimonial, project, faq, team_member)
- `title`: Título
- `description`: Descripción completa
- `short_description`: Descripción corta
- `image_url`: URL de imagen
- `status`: Estado (draft, published, archived)
- `order_position`: Orden de visualización
- `is_featured`: Si está destacado

#### `site_settings` - Para configuraciones

- `setting_key`: Clave única
- `setting_value`: Valor
- `category`: Categoría
- `description`: Descripción

### 5. Datos iniciales incluidos

El script ya incluye:

- ✅ Configuraciones básicas de la empresa
- ✅ 3 servicios principales (BTL, RRHH, Transporte)
- ✅ 4 FAQs predefinidas
- ✅ Configuraciones SEO básicas

### 6. Próximos pasos

Una vez ejecutado el script:

1. Configurar las variables de entorno
2. Verificar que la aplicación se conecte correctamente
3. Probar el formulario de contacto
4. Acceder al panel de administración

## Comandos útiles para MySQL/MariaDB

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Usar la base de datos
USE dgproducciones;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE contacts;

-- Ver datos de una tabla
SELECT * FROM contacts;

-- Limpiar datos de prueba (si es necesario)
DELETE FROM contacts WHERE message LIKE '%prueba%';
```

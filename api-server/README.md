# API REST para DG Producciones

## 📋 Instrucciones de Instalación

### 1. Subir archivos al servidor cPanel

1. Accede a tu cPanel → Administrador de archivos
2. Navega a la carpeta `public_html/` de tu dominio
3. Crea una carpeta llamada `api/`
4. Sube todos los archivos de la carpeta `api-server/` a `public_html/api/`

### 2. Estructura en el servidor

```
public_html/
├── api/
│   ├── .htaccess
│   ├── index.php
│   ├── database.php
│   ├── contacts.php
│   ├── projects.php
│   └── team.php
```

### 3. Configurar base de datos

1. Abre `database.php` y verifica que las credenciales sean correctas:
   - Host: `localhost` (siempre en cPanel)
   - Base de datos: `dgproducciones_dgproducciones`
   - Usuario: `dgproducciones_dgproducciones`
   - Contraseña: `dgproducciones_2025`

### 4. Probar la API

1. Visita: `https://dgproducciones.cl/api/`
2. Verifica que aparezca la documentación
3. Prueba: `https://dgproducciones.cl/api/?endpoint=test`

## 🔑 API Keys

- Producción: `dgproducciones_api_key_2025`
- Desarrollo: `dev_key_local`

## 🚀 Endpoints

### Contactos

- `GET /api/contacts` - Listar contactos
- `GET /api/contacts?id=1` - Obtener contacto
- `POST /api/contacts` - Crear contacto
- `PUT /api/contacts?id=1` - Actualizar contacto
- `DELETE /api/contacts?id=1` - Eliminar contacto

### Proyectos

- `GET /api/projects` - Listar proyectos
- `GET /api/projects?id=1` - Obtener proyecto
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects?id=1` - Actualizar proyecto
- `DELETE /api/projects?id=1` - Eliminar proyecto

### Equipo

- `GET /api/team` - Listar equipo
- `GET /api/team?id=1` - Obtener miembro
- `POST /api/team` - Crear miembro
- `PUT /api/team?id=1` - Actualizar miembro
- `DELETE /api/team?id=1` - Eliminar miembro

## 📝 Ejemplo de uso en Next.js

```javascript
// lib/api.js
const API_BASE = "https://dgproducciones.cl/api";
const API_KEY = "dgproducciones_api_key_2025";

export async function fetchContacts() {
  const response = await fetch(`${API_BASE}/contacts`, {
    headers: {
      "X-API-Key": API_KEY,
    },
  });
  return response.json();
}

export async function createContact(data) {
  const response = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## 🔧 Configuración en Next.js

Actualiza tu `.env.local`:

```env
# API REST Configuration
NEXT_PUBLIC_API_BASE=https://dgproducciones.cl/api
NEXT_PUBLIC_API_KEY=dgproducciones_api_key_2025

# Para desarrollo local:
# NEXT_PUBLIC_API_BASE=http://localhost:3000/api/proxy
# NEXT_PUBLIC_API_KEY=dev_key_local
```

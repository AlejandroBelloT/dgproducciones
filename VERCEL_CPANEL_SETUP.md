# 🚀 CONFIGURACIÓN VERCEL + CPANEL - DG PRODUCCIONES

## 📋 Pasos para Desplegar en Producción

### 1. 📁 Subir API a cPanel

1. Accede a tu cPanel → **Administrador de archivos**
2. Navega a `public_html/`
3. Crea la carpeta `api/`
4. Sube todos los archivos de `api-server/` a `public_html/api/`

### 2. 🔧 Variables de Entorno en Vercel

En tu dashboard de Vercel → Settings → Environment Variables:

```bash
# Variables de Producción
NEXT_PUBLIC_API_BASE=https://dgproducciones.cl/api
NEXT_PUBLIC_API_KEY=dgproducciones_api_key_2025
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app

# Variables de Email (Opcional)
SMTP_HOST=webmail.dgproducciones.cl
SMTP_PORT=587
SMTP_USER=daniel@dgproducciones.cl
SMTP_PASS=Xdaniel6196
```

### 3. 🧪 Probar la API

Después de subir los archivos, visita:

- https://dgproducciones.cl/api/ (Documentación)
- https://dgproducciones.cl/api/?endpoint=test (Test conexión)

### 4. 🚀 Desplegar en Vercel

```bash
# Conectar repo con Vercel
vercel --prod

# O via Git (recomendado)
git add .
git commit -m "Add API REST integration"
git push origin main
```

## 🏗️ Arquitectura de Producción

```
Internet
    ↓
Vercel (Next.js App)
    ↓ HTTPS API calls
cPanel (PHP API)
    ↓ localhost MySQL
Base de Datos MySQL
```

## 📱 URLs Finales

### Desarrollo:

- App: http://localhost:3000
- API: http://localhost:3000/api/proxy/_ → https://dgproducciones.cl/api/_

### Producción:

- App: https://tu-app.vercel.app
- API: https://dgproducciones.cl/api/*

## 🔑 Configuraciones por Entorno

### `.env.local` (Desarrollo):

```bash
NEXT_PUBLIC_API_BASE=http://localhost:3000/api/proxy
NEXT_PUBLIC_API_KEY=dev_key_local
```

### Vercel Environment Variables (Producción):

```bash
NEXT_PUBLIC_API_BASE=https://dgproducciones.cl/api
NEXT_PUBLIC_API_KEY=dgproducciones_api_key_2025
```

## ✅ Ventajas de esta Arquitectura

1. **🔒 Seguridad**: Las credenciales de DB nunca salen de cPanel
2. **⚡ Performance**: API PHP nativa en el mismo servidor que la DB
3. **💰 Económico**: No necesitas base de datos externa
4. **🛠️ Mantenimiento**: Fácil gestión desde cPanel y Vercel
5. **📈 Escalable**: Puedes agregar más endpoints fácilmente

## 🚨 Checklist Pre-Deploy

- [ ] Archivos API subidos a cPanel
- [ ] Variables de entorno configuradas en Vercel
- [ ] API funcionando en https://dgproducciones.cl/api/
- [ ] Tests de conexión pasando
- [ ] Dominio configurado correctamente

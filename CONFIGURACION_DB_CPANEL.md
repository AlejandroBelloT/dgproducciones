## 📋 GUÍA PARA CONFIGURAR BASE DE DATOS EN cPanel

### 🔍 INFORMACIÓN QUE NECESITAS OBTENER DE cPanel:

1. **Ve a cPanel → Bases de datos MySQL**

2. **En la sección "Bases de datos actuales":**

   - Busca tu base de datos (debería ser algo como `dgproducc_dgproducciones_815`)
   - **ANOTA EL NOMBRE EXACTO:** ************\_\_\_************

3. **En la sección "Usuarios actuales":**

   - Busca tu usuario (debería ser algo como `dgproducc_dgproducciones`)
   - **ANOTA EL NOMBRE EXACTO:** ************\_\_\_************

4. **Verificar asociación:**
   - En "Bases de datos actuales", verifica que tu usuario aparezca en la columna "Usuarios privilegiados"
   - Si NO aparece, ve a "Agregar usuario a base de datos" y asocia el usuario

### 🔧 PASOS SI EL USUARIO NO EXISTE:

1. **Crear usuario:**

   - Ve a "Usuarios de MySQL"
   - Nombre de usuario: `dgproducciones`
   - Contraseña: `dgproducciones2025`
   - Crear usuario

2. **Asociar a la base de datos:**
   - Selecciona el usuario recién creado
   - Selecciona la base de datos `dgproducciones_815`
   - Marca "TODOS LOS PRIVILEGIOS"
   - Realizar cambios

### 📝 INFORMACIÓN PARA ACTUALIZAR .env.local:

Una vez que tengas los nombres exactos, actualizaremos:

```bash
DB_HOST=localhost
DB_USER=[NOMBRE_EXACTO_DEL_USUARIO]
DB_PASSWORD=dgproducciones2025
DB_NAME=[NOMBRE_EXACTO_DE_LA_BASE_DE_DATOS]
DB_PORT=3306
```

### 🎯 COMANDOS ALTERNATIVOS PARA PROBAR:

Si tienes acceso SSH al servidor, puedes probar directamente:

```bash
mysql -u [USUARIO] -p[CONTRASEÑA] -h localhost [BASE_DE_DATOS]
```

¿Has verificado estos puntos en cPanel? ¿Cuáles son los nombres exactos que ves?

# Actualización de la Base de Datos para Funcionalidad de Posts V 1.0.0.3

## Cambios Requeridos

Para implementar la funcionalidad de editar y deshabilitar posts, necesitas ejecutar el siguiente script SQL en tu base de datos PostgreSQL.

### 1. Ejecutar el Script SQL

Ejecuta el archivo `add_active_field.sql` en tu base de datos:

```bash
# Si usas psql directamente:
psql -d tu_base_de_datos -f add_active_field.sql

# O copia y pega el contenido del archivo en tu cliente SQL
```

### 2. Verificar los Cambios

Después de ejecutar el script, verifica que se hayan agregado los campos:

```sql
-- Verificar que el campo active existe
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'active';

-- Verificar que el campo updated_at existe
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'updated_at';
```

### 3. Funcionalidades Implementadas

#### Backend:
- ✅ Campo `active` en la tabla posts (boolean, default true)
- ✅ Campo `updated_at` para tracking de cambios
- ✅ Funciones para obtener, actualizar, habilitar y deshabilitar posts
- ✅ Controladores para manejar las operaciones CRUD
- ✅ Rutas protegidas para todas las operaciones

#### Frontend:
- ✅ Componente EditPost para editar publicaciones
- ✅ Botones de editar y deshabilitar en MyPosts
- ✅ Funciones de API para todas las operaciones
- ✅ Estilos para publicaciones deshabilitadas
- ✅ Navegación entre páginas

### 4. Nuevas Rutas de API

- `GET /api/posts/edit/:postId` - Obtener post para editar
- `PUT /api/posts/update/:postId` - Actualizar post
- `PATCH /api/posts/disable/:postId` - Deshabilitar post
- `PATCH /api/posts/enable/:postId` - Habilitar post

### 5. Nuevas Rutas del Frontend

- `/edit-post/:postId` - Página para editar una publicación

### 6. Características de Seguridad

- Solo el autor puede editar/deshabilitar sus propias publicaciones
- Las publicaciones deshabilitadas no aparecen en el feed público
- Todas las operaciones requieren autenticación
- Validación de permisos en el backend

### 7. Notas Importantes

- Las publicaciones deshabilitadas se mantienen en la base de datos (soft delete)
- Solo se muestran publicaciones activas en el feed público
- En "Mis Publicaciones" se muestran todas las publicaciones del usuario (activas e inactivas)
- El campo `updated_at` se actualiza automáticamente con un trigger 
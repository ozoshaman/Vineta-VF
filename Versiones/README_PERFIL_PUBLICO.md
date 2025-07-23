# Perfil Público de Usuario - Comics Viñeta V 1.0.0.1

Esta funcionalidad permite ver el perfil público de cualquier usuario con sus publicaciones, seguidores, seguidos y estadísticas de likes.

## Características

- **Perfil público**: Muestra información del usuario (username, email, avatar, descripción)
- **Estadísticas**: Número de publicaciones, seguidores, seguidos y likes totales
- **Publicaciones**: Lista de todas las publicaciones del usuario
- **Seguidores**: Lista de usuarios que siguen al usuario
- **Siguiendo**: Lista de usuarios que el usuario sigue
- **Navegación**: Enlaces desde el feed para ver perfiles de otros usuarios

## Configuración

### 1. Base de Datos

Ejecuta el script SQL para crear las tablas necesarias:

```sql
-- Ejecutar en tu base de datos PostgreSQL
\i backend/database_setup.sql
```

O ejecuta manualmente las siguientes consultas:

```sql
-- Tabla para relaciones de seguidores
CREATE TABLE IF NOT EXISTS user_followers (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, followed_id)
);

-- Tabla para likes en posts
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_followed ON user_followers(followed_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);
```

### 2. Backend

Los archivos modificados/creados en el backend:

- `backend/src/models/perfil.js` - Nuevas funciones para obtener datos de perfil público
- `backend/src/controllers/configPerfil.js` - Nuevos controladores
- `backend/src/routes/auth.js` - Nuevas rutas API

### 3. Frontend

Los archivos creados/modificados en el frontend:

- `frontend/comicvineta-frontend/src/pages/UserProfile.jsx` - Nueva página de perfil público
- `frontend/comicvineta-frontend/src/styles/UserProfile.css` - Estilos para la página
- `frontend/comicvineta-frontend/src/api/auth.js` - Nuevas funciones API
- `frontend/comicvineta-frontend/src/App.js` - Nueva ruta
- `frontend/comicvineta-frontend/src/pages/Feed.jsx` - Enlaces a perfiles de usuario

## Uso

### Acceder a un perfil público

1. **Desde el Feed**: Haz clic en el nombre de usuario en cualquier publicación
2. **URL directa**: Navega a `/user/{userId}` donde `{userId}` es el ID del usuario

### Funcionalidades disponibles

- **Pestaña Publicaciones**: Ver todas las publicaciones del usuario
- **Pestaña Seguidores**: Ver usuarios que siguen al usuario
- **Pestaña Siguiendo**: Ver usuarios que el usuario sigue
- **Paginación**: Navegar entre páginas de resultados
- **Estadísticas**: Ver contadores de actividad del usuario

## API Endpoints

### Obtener perfil público
```
GET /api/user/:userId
Authorization: Bearer {token}
```

### Obtener publicaciones del usuario
```
GET /api/user/:userId/posts?page=1&limit=10
Authorization: Bearer {token}
```

### Obtener seguidores del usuario
```
GET /api/user/:userId/followers?page=1&limit=20
Authorization: Bearer {token}
```

### Obtener usuarios que sigue
```
GET /api/user/:userId/following?page=1&limit=20
Authorization: Bearer {token}
```

## Estructura de Datos

### Respuesta del perfil público
```json
{
  "id": 1,
  "username": "usuario_ejemplo",
  "email": "usuario@ejemplo.com",
  "created_at": "2024-01-01T00:00:00Z",
  "avatar_base64": "data:image/jpeg;base64,...",
  "description": "Descripción del usuario",
  "stats": {
    "posts": 5,
    "followers": 10,
    "following": 8,
    "totalLikes": 25
  }
}
```

### Respuesta de publicaciones
```json
[
  {
    "post_id": 1,
    "title": "Título del post",
    "content": "Contenido del post",
    "created_at": "2024-01-01T00:00:00Z",
    "image_base64": "data:image/jpeg;base64,...",
    "username": "usuario_ejemplo",
    "avatar_base64": "data:image/jpeg;base64,...",
    "likes_count": 5
  }
]
```

## Notas Importantes

1. **Autenticación**: Todas las rutas requieren autenticación con token JWT
2. **Paginación**: Los endpoints soportan paginación con parámetros `page` y `limit`
3. **Imágenes**: Las imágenes se manejan como base64
4. **Responsive**: La interfaz es responsive y se adapta a dispositivos móviles
5. **Manejo de errores**: Incluye manejo de errores y estados de carga

## Próximas Mejoras

- Sistema de seguir/dejar de seguir usuarios
- Notificaciones de nuevos seguidores
- Búsqueda de usuarios
- Filtros en publicaciones
- Sistema de comentarios
- Compartir publicaciones 
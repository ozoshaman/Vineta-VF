# Funcionalidad de Likes y Comentarios - Comics Viñeta 1.0.0.4

Esta funcionalidad agrega la capacidad de dar likes y comentar en las publicaciones, con una interfaz interactiva que permite ver y ocultar los likes y comentarios.

## 🚀 Características Implementadas

### ✅ Likes
- **Botón de like** con contador
- **Toggle de like** (dar/quitar like)
- **Lista de usuarios** que dieron like
- **Sección expandible** para ver likes
- **Indicador visual** de like del usuario actual

### ✅ Comentarios
- **Botón de comentarios** con contador
- **Formulario** para agregar comentarios
- **Lista de comentarios** con paginación
- **Edición y eliminación** de comentarios propios
- **Sección expandible** para ver comentarios
- **Avatares y fechas** en comentarios

### ✅ Interfaz
- **Botones interactivos** con animaciones
- **Secciones colapsables** (click para mostrar/ocultar)
- **Diseño responsive** para móviles
- **Estados de carga** y manejo de errores
- **Validación** de formularios

## 📋 Instalación

### 1. Base de Datos
Ejecuta el script SQL para crear las tablas necesarias:

```bash
# Ejecutar en tu base de datos PostgreSQL
psql -d tu_base_de_datos -f backend/database_likes_comments.sql
```

### 2. Backend
Los archivos ya están creados y configurados:
- ✅ `backend/src/models/likes_comments.js` - Modelo de datos
- ✅ `backend/src/controllers/likesCommentsController.js` - Controladores
- ✅ `backend/src/routes/likesComments.js` - Rutas API
- ✅ `backend/src/index.js` - Configuración del servidor

### 3. Frontend
Los archivos ya están creados y configurados:
- ✅ `frontend/comicvineta-frontend/src/components/PostInteractions.jsx` - Componente principal
- ✅ `frontend/comicvineta-frontend/src/styles/PostInteractions.css` - Estilos
- ✅ `frontend/comicvineta-frontend/src/api/auth.js` - Funciones API
- ✅ `frontend/comicvineta-frontend/src/pages/Feed.jsx` - Integración en el feed

## 🔧 Uso

### Interfaz de Usuario

1. **Ver publicaciones** en el feed
2. **Hacer clic en el botón de like** (🤍) para dar like
3. **Hacer clic en el botón de comentarios** (💬) para ver comentarios
4. **Escribir un comentario** en el formulario
5. **Hacer clic nuevamente** para ocultar la sección

### Funcionalidades

#### Likes
- **Dar like**: Click en el botón 🤍 → cambia a ❤️
- **Quitar like**: Click en el botón ❤️ → cambia a 🤍
- **Ver likes**: Click en el botón → muestra lista de usuarios
- **Contador**: Se actualiza automáticamente

#### Comentarios
- **Ver comentarios**: Click en el botón 💬 → muestra sección
- **Agregar comentario**: Escribir en el formulario y enviar
- **Editar comentario**: Click en ✏️ (solo propios)
- **Eliminar comentario**: Click en 🗑️ (solo propios)

## 🌐 API Endpoints

### Likes
```
POST /api/posts/:postId/like          - Dar/quitar like
GET  /api/posts/:postId/likes         - Obtener likes
GET  /api/posts/:postId/like/check    - Verificar like del usuario
```

### Comentarios
```
POST   /api/posts/:postId/comments    - Crear comentario
GET    /api/posts/:postId/comments    - Obtener comentarios
PUT    /api/comments/:commentId       - Editar comentario
DELETE /api/comments/:commentId       - Eliminar comentario
```

## 📊 Estructura de Datos

### Tabla `post_likes`
```sql
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);
```

### Tabla `post_comments`
```sql
CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Componentes

### PostInteractions.jsx
Componente principal que maneja:
- **Estado de likes** y comentarios
- **Interacciones** del usuario
- **Renderizado** de secciones
- **Comunicación** con la API

### Características del Componente
- **Estado local** para likes y comentarios
- **Verificación automática** de likes del usuario
- **Carga bajo demanda** de comentarios
- **Manejo de errores** y estados de carga
- **Interfaz intuitiva** con animaciones

## 🔒 Seguridad

- ✅ **Autenticación requerida** para todas las operaciones
- ✅ **Validación de permisos** para editar/eliminar comentarios
- ✅ **Validación de datos** en entrada y salida
- ✅ **Prevención de SQL injection** con queries parametrizadas
- ✅ **Límites de caracteres** en comentarios (500 max)

## 📱 Responsive Design

- ✅ **Diseño adaptable** para móviles y desktop
- ✅ **Botones táctiles** optimizados para móviles
- ✅ **Scroll interno** para listas largas
- ✅ **Espaciado optimizado** para diferentes pantallas

## 🚀 Próximas Mejoras

- [ ] **Notificaciones** de nuevos likes y comentarios
- [ ] **Paginación infinita** para comentarios
- [ ] **Likes en comentarios** (nested likes)
- [ ] **Respuestas a comentarios** (threading)
- [ ] **Filtros** por fecha en comentarios
- [ ] **Búsqueda** en comentarios
- [ ] **Moderación** de comentarios
- [ ] **Reportes** de comentarios inapropiados

## 🐛 Solución de Problemas

### Error: "Tabla no existe"
```bash
# Ejecutar el script SQL
psql -d tu_base_de_datos -f backend/database_likes_comments.sql
```

### Error: "Token inválido"
- Verificar que el usuario esté autenticado
- Revisar que el token no haya expirado

### Error: "No se pueden cargar likes/comentarios"
- Verificar conexión a la base de datos
- Revisar logs del servidor para errores específicos

## 📝 Notas Técnicas

- **Base de datos**: PostgreSQL con índices optimizados
- **Backend**: Node.js con Express y JWT
- **Frontend**: React con hooks y context API
- **Estilos**: CSS puro con diseño responsive
- **API**: RESTful con autenticación Bearer token

## 🎯 Funcionalidad Completa

La implementación incluye:
- ✅ **Backend completo** con modelos, controladores y rutas
- ✅ **Frontend completo** con componentes y estilos
- ✅ **Base de datos** con tablas e índices
- ✅ **API REST** documentada
- ✅ **Interfaz de usuario** intuitiva
- ✅ **Manejo de errores** robusto
- ✅ **Diseño responsive** para todos los dispositivos 
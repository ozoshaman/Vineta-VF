# CHANGELOG - Comics Viñeta

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0.6] - 08/08/2025 - RELEASE FINAL

### Agregado
- **Página "Mi Perfil" completa** con vista detallada del usuario
- **Panel de Configuración** para editar perfil de usuario
- **Estadísticas en tiempo real**: posts, seguidores, siguiendo, likes totales
- **Editor de foto de perfil** con vista previa
- **Editor de descripción personal** con límite de 200 caracteres
- **Integración completa** con sistema de likes y comentarios en perfil

### Mejorado
- **Diseño responsive** optimizado hasta un punto para móviles, tablets y desktop
- **Estados de carga** mejorados en toda la aplicación
- **Manejo de errores** más robusto y feedback claro
- **Paleta de colores** consistente y profesional
- **Navegación intuitiva** entre perfil y configuración
- **Validaciones robustas** en frontend y backend

### Técnico
- **Optimización de consultas SQL** para estadísticas
- **Cálculo de estadísticas** en tiempo real
- **Mejor manejo de estados** en React
- **Performance mejorado** en carga de datos

## [1.0.0.5] - 04/06/2025

### Cambiado
- **Migración completa** de `username` a `author_id` para identificación
- **Rutas actualizadas** a `/user/:author_id` en frontend
- **Optimización de consultas** usando ID numérico en lugar de string

### Técnico
- **Refactoring de UserProfile.jsx** para usar `author_id`
- **Actualización de Feed.jsx** con URLs optimizadas
- **Consolidación de rutas** en App.js
- **Actualización de endpoints** del backend
- **Optimización de controladores** y modelos

### Rendimiento
- **Consultas de base de datos** más eficientes
- **Navegación más robusta** y confiable
- **Eliminación de duplicación** en rutas

## [1.0.0.4] - 27/05/2025

### Agregado
- **Sistema completo de Likes**
  - Botón toggle like/unlike con animaciones
  - Contador de likes en tiempo real
  - Lista expandible de usuarios que dieron like
  - Verificación automática del estado de like
- **Sistema completo de Comentarios**
  - Formulario para agregar comentarios
  - Lista paginada de comentarios
  - Edición y eliminación de comentarios propios
  - Avatares y timestamps en comentarios
- **Componente PostInteractions**
  - Interfaz unificada para likes y comentarios
  - Secciones colapsables (click para mostrar/ocultar)
  - Animaciones y estados de carga

### Base de Datos
- **Nueva tabla `post_likes`** con índices optimizados
- **Nueva tabla `post_comments`** con relaciones apropiadas
- **Constraints únicos** para prevenir likes duplicados
- **Triggers automáticos** para timestamps

### Seguridad
- **Autenticación requerida** para todas las operaciones
- **Validación de permisos** para edición/eliminación
- **Prevención de SQL injection** con queries parametrizadas
- **Validación de datos** en frontend y backend

## [1.0.0.3] - 19/05/2025

### Agregado
- **Edición de Publicaciones**
  - Página dedicada EditPost.jsx
  - Formulario pre-rellenado con datos existentes
  - Actualización de título, contenido e imagen
- **Sistema de Habilitación/Deshabilitación**
  - Soft delete con campo `active` booleano
  - Publicaciones deshabilitadas ocultas del feed público
  - Opción de rehabilitar publicaciones

### Base de Datos
- **Campo `active`** (boolean, default true) en tabla posts
- **Campo `updated_at`** con trigger automático
- **Índices optimizados** para consultas de posts activos

### API
- `GET /api/posts/edit/:postId` - Obtener post para edición
- `PUT /api/posts/update/:postId` - Actualizar publicación  
- `PATCH /api/posts/disable/:postId` - Deshabilitar publicación
- `PATCH /api/posts/enable/:postId` - Habilitar publicación

### Seguridad
- **Solo el autor** puede editar/deshabilitar sus publicaciones
- **Validación de permisos** en backend
- **Autorización requerida** para operaciones CRUD

## [1.0.0.2] - 09/05/2025

### Técnico
- Actualizaciones menores de configuración
- Optimizaciones de rendimiento
- Correcciones de bugs menores

## [1.0.0.1] - 2024-XX-XX

### Agregado
- **Perfiles Públicos de Usuario**
  - Página UserProfile.jsx para cualquier usuario
  - Información completa: username, email, avatar, descripción
  - Estadísticas: publicaciones, seguidores, siguiendo, likes
- **Sistema de Navegación Social**
  - Pestañas para Publicaciones, Seguidores y Siguiendo
  - Paginación en todas las secciones
  - Enlaces desde el feed para acceder a perfiles

### Base de Datos
- **Tabla `user_followers`** para relaciones sociales
- **Tabla `post_likes`** para sistema de likes
- **Índices optimizados** para rendimiento

### API
- `GET /api/user/:userId` - Perfil público completo
- `GET /api/user/:userId/posts` - Publicaciones del usuario
- `GET /api/user/:userId/followers` - Seguidores del usuario
- `GET /api/user/:userId/following` - Usuarios que sigue

## [1.0.0.0] - 2024-XX-XX

### Agregado - Release Inicial
- **Arquitectura Base**
  - Backend Node.js con arquitectura MVC
  - Frontend React con componentes modulares
  - Base de datos PostgreSQL
- **Sistema de Autenticación**
  - Registro con verificación por email
  - Sistema de códigos de verificación
  - Contraseña temporal con cambio obligatorio
  - Protección de rutas privadas
- **Funcionalidades Base**
  - Sistema de registro y login
  - Gestión básica de perfiles
  - Sistema básico de publicaciones
  - Feed principal de contenido

### Arquitectura
- **Backend**: Controllers, Models, Routes, Middleware
- **Frontend**: Components, Pages, Services, Styles
- **Base de Datos**: Tablas usuarios, posts, configuración inicial

---
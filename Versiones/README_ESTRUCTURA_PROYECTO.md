# Estructura del Proyecto Comics_Vineta V 1.0.0.0

Este documento describe la organización de carpetas y archivos del proyecto, así como una breve descripción de la función de cada parte.

---

## Backend (`/backend`)

### Archivos principales
- `package.json` / `package-lock.json`: Definición de dependencias y scripts del backend.

### src/
Contiene todo el código fuente del backend.

#### config/
- `db.js`: Configuración de la conexión a la base de datos.

#### controllers/
- `authController.js`: Lógica de autenticación de usuarios (login, registro, etc).
- `configPerfil.js`: Controlador para la configuración y actualización de perfiles de usuario.
- `feedController.js`: Controlador para la gestión del feed de publicaciones.
- `likesCommentsController.js`: Controlador para la gestión de likes y comentarios en publicaciones.

#### middlewares/
- `authmiddleware.js`: Middleware para proteger rutas que requieren autenticación.
- `upload.js`: Middleware para la gestión de subida de archivos (imágenes, etc).

#### models/
- `User.js`: Modelo de usuario.
- `perfil.js`: Modelo de perfil de usuario.
- `feed_model.js`: Modelo de publicaciones (posts).
- `likes_comments.js`: Modelo de likes y comentarios.
- `sendEmail.js`: Utilidad para el envío de correos electrónicos.

#### routes/
- `auth.js`: Rutas relacionadas con autenticación (login, registro, etc).
- `posts.js`: Rutas para la gestión de publicaciones.
- `likesComments.js`: Rutas para likes y comentarios.

#### utils/
- `utils.js`: Funciones utilitarias varias usadas en el backend.

#### index.js
Punto de entrada principal del backend. Inicializa el servidor y configura middlewares y rutas.

---

## Frontend (`/frontend/comicvineta-frontend`)

### Archivos principales
- `package.json` / `package-lock.json`: Definición de dependencias y scripts del frontend.
- `public/`: Archivos estáticos públicos (favicon, manifest, imágenes, etc).
- `README.md`: Documentación del frontend.

### src/
Contiene todo el código fuente del frontend.

#### api/
- `auth.js`: Funciones para interactuar con la API de autenticación del backend.

#### components/
- `NavigationTabs.jsx`: Componente de pestañas de navegación.
- `PostInteractions.jsx`: Componente para gestionar likes y comentarios en los posts.
- `Sidebar.jsx`: Barra lateral de navegación.
- `PrivateRoute.js`: Componente para proteger rutas privadas.

#### context/
- `AuthContext.js`: Contexto de autenticación global para React.

#### pages/
- `Feed.jsx`: Página principal del feed de publicaciones.
- `Following.jsx`: Página de publicaciones de usuarios seguidos.
- `UserProfile.jsx`: Página de perfil público de usuario.
- `CreatePost.jsx`: Página para crear una nueva publicación.
- `EditPost.jsx`: Página para editar publicaciones.
- `MyPosts.jsx`: Página para ver las publicaciones propias.
- `Reset-password.jsx`: Página para restablecer la contraseña.
- `Profile.jsx`: Página de perfil del usuario autenticado.
- `ChangePassword.jsx`: Página para cambiar la contraseña.
- `SettingsPanel.jsx`: Panel de configuración de usuario.
- `Login.jsx`: Página de inicio de sesión.
- `DashboardLayout.jsx`: Layout principal del dashboard.
- `Profile_page.jsx`: Página de perfil (posiblemente duplicada o en desarrollo).
- `VerifyCode.jsx`: Página para verificar código de recuperación.
- `Register.jsx`: Página de registro de usuario.

#### styles/
Archivos CSS para los diferentes componentes y páginas del frontend.

#### Otros archivos
- `App.js`: Componente principal de React.
- `index.js`: Punto de entrada de la aplicación React.
- `index.css`, `App.css`: Estilos globales.
- `setupTests.js`, `App.test.js`, `reportWebVitals.js`: Archivos de configuración y pruebas.

---

## Notas
- La carpeta `Versiones/` contiene documentación de cambios y versiones específicas del proyecto.
- Cada carpeta y archivo tiene una función específica para mantener el proyecto organizado y modular. 
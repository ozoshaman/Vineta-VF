Plataforma Social
Una plataforma web social que permite a los usuarios registrarse, crear perfiles personalizados y compartir contenido con la comunidad.

Descripción
Este proyecto es una aplicación web social completa que implementa funcionalidades básicas de una red social, incluyendo registro de usuarios, autenticación por email, personalización de perfiles y sistema de interacciones sociales (likes y comentarios).

Arquitectura
El sistema utiliza una arquitectura híbrida que combina:

Cliente-Servidor: Para la comunicación entre frontend y backend
MVC (Modelo-Vista-Controlador): Para la organización del código del backend

┌─────────────────┐    HTTP/API    ┌─────────────────┐
│     Frontend    │ ◄─────────────► │     Backend     │
│    (React)      │                 │    (Node.js)    │
└─────────────────┘                 └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   Base de Datos │
                                    │  (PostgreSQL)   │
                                    └─────────────────┘

Tecnologías Utilizadas
Frontend

React: Framework de JavaScript para la interfaz de usuario
JavaScript: Lenguaje de programación principal

Backend

Node.js: Entorno de ejecución de JavaScript del lado del servidor
JavaScript: Lenguaje de programación del backend

Base de Datos

PostgreSQL: Sistema de gestión de base de datos relacional

Otros

Nodemailer (presumiblemente): Para el envío de correos electrónicos
Sistema de autenticación: Para manejo de sesiones y tokens

Funcionalidades Principales
Autenticación y Registro

Registro de usuarios: Los nuevos usuarios pueden crear una cuenta
Verificación por email: Se envía un código de verificación al correo del usuario
Contraseña temporal: Se genera una contraseña inicial que debe ser cambiada
Cambio obligatorio de contraseña: Los usuarios deben personalizar su contraseña en el primer acceso
Sistema de login: Autenticación segura para acceder a la plataforma

Gestión de Perfiles

Personalización de perfil: Los usuarios pueden editar y customizar su información personal
Perfil público: Visualización de la información del usuario

Sistema de Publicaciones

Crear publicaciones: Los usuarios pueden compartir contenido
Visualizar feed: Mostrar las publicaciones de todos los usuarios

Interacciones Sociales

Sistema de likes: Los usuarios pueden dar "me gusta" a las publicaciones
Sistema de comentarios: Posibilidad de comentar en las publicaciones de otros usuarios

Instalación y Configuración
Prerrequisitos

Node.js (versión 14 o superior)
PostgreSQL (versión 12 o superior)
npm o yarn

Autor

Carlos Oziel Gómez Cervantes - Desarrollo inicial - ozoshaman
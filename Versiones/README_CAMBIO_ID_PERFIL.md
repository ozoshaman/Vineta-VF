# Cambios funcionales: Uso de author_id (ID) en vez de username para el perfil de usuario 1.0.0.5

## Resumen
Se migró toda la lógica de búsqueda, navegación y consulta de perfil de usuario para que utilice el identificador único `author_id` (id numérico) en vez de `username`. Esto afecta tanto el frontend como el backend.

---

## Cambios en el Frontend

- **UserProfile.jsx**
  - Ahora obtiene el parámetro `author_id` desde la URL usando `useParams()`.
  - Todas las llamadas a la API y lógica de comparación usan `author_id` en vez de `username`.
  - El botón de seguir/deseguir y la carga de publicaciones, seguidores y seguidos usan el id.
  - El nombre de usuario (`username`) solo se usa para mostrar, no para buscar.

- **Feed.jsx**
  - Las URLs de perfil ahora navegan a `/user/:author_id`.
  - Las funciones de seguimiento y comparación usan `post.author_id`.
  - Se eliminó el uso de `post.username` para navegación o lógica de usuario.

- **App.js**
  - Se eliminó la ruta duplicada `/user/:userId`.
  - Solo se mantiene `/user/:author_id` para el perfil público.

---

## Cambios en el Backend

- **Rutas (`routes/auth.js`)**
  - Todas las rutas de usuario ahora usan `:author_id` en vez de `:userKey` o `:username`.

- **Controladores (`controllers/configPerfil.js`)**
  - Se eliminó el helper que buscaba el id por username.
  - Todos los controladores relevantes reciben y usan directamente `author_id` (id numérico).

- **Modelos (`models/perfil.js`, `models/feed_model.js`)**
  - Las funciones de consulta de perfil y publicaciones usan el id directamente.
  - Las consultas SQL aseguran que el campo `author_id` esté presente en los resultados.

---

## Consideraciones
- El frontend y backend deben estar actualizados y reiniciados para que los cambios surtan efecto.
- Todas las navegaciones y consultas de perfil deben usar el id numérico (`author_id`).
- El nombre de usuario (`username`) solo se usa para mostrar, nunca para buscar o identificar usuarios.

---

**Última actualización:** Junio 2024 
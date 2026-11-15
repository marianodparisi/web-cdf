# Pendientes del repo

Lista de lo que falta antes y después de salir a producción. Actualizada el 15 de noviembre de 2026.

## 1. Seguridad: auditoría del 15/11/2026

Origen: `cloudflare/security-audit-skill` en perfil *quick*. Fue una revisión sólo de código: no se ejecutó nada, por eso ningún punto quedó "confirmado". Todos están verificados por un segundo revisor como problemas reales del código.

El informe completo (fuera del repo) está en `C:\Users\Streaming\security-audit-skill\web-cdf\run-1\`, en los archivos `REPORT.md` y `NEEDS-VALIDATION.md`.

### Prioridad alta

- [ ] **Secretos dentro del build.**
  - **Dónde:** `readEnv` en `src/lib/admin-auth.ts:39-40` lee `import.meta.env` con una clave calculada (`metaEnv?.[name]`).
  - **Por qué:** con eso, el build copia `AUTH_SECRET`, `ADMIN_PASSWORD` y `MYSQL_*` dentro de `dist/server/chunks/admin-auth_*.mjs`. Ya pasa en el `dist` local.
  - **Consecuencia:** esa copia gana sobre `process.env`, así que rotar un secreto en Hostinger no tiene efecto hasta recompilar.
  - **Arreglo:** leer los secretos sólo con `process.env[name]`.
  - **Después de deployar el arreglo:** recompilar y verificar que no quede `AUTH_SECRET:` en `dist/server`.
  - **Chequear en Hostinger:** si esas variables están cargadas también para el **build**. Si lo están, **rotar `AUTH_SECRET`, la contraseña de admin y la de MySQL** después del arreglo.
  - `src/lib/site.ts` y `src/lib/youtube.ts` usan el mismo patrón. Hoy no exponen nada secreto, pero conviene unificar.
- [ ] **XSS por el link de video del devocional.**
  - **Dónde:** `getYouTubeEmbedUrl` en `src/pages/devocional/[slug].astro:19-29` y `src/pages/devocional/index.astro:25-35`. Cuando no encuentra un id de YouTube, devuelve la URL tal cual y termina en `<iframe src>`.
  - **Riesgo:** un editor que sólo tiene devocionales puede guardar `javascript:...` (`src/pages/api/admin/devocionales.ts:57`). Si un admin abre la página, el script corre en el mismo origen que `/admin` y puede crear un admin.
  - **Arreglo:**
    - Aceptar sólo un id de YouTube de 11 caracteres (`[A-Za-z0-9_-]{11}`).
    - Armar siempre `https://www.youtube.com/embed/<id>`.
    - Rechazar cualquier otra cosa al guardar y al renderizar.
- [ ] **XSS por el `href` de anuncios y series.**
  - **Dónde:** `src/pages/api/admin/anuncios.ts:26` y `src/pages/api/admin/series.ts:32,96` aceptan cualquier texto. `src/pages/index.astro:208` (flyer) y `:177` (series pasadas) lo usan como `href`.
  - **Arreglo:** al guardar, aceptar sólo rutas que empiecen con `/` o URLs `http(s)://`. Al renderizar, ignorar valores inválidos ya guardados.
  - Revisar los JSON ya cargados en dev y prod por si hay alguno raro.

### Prioridad media

- [ ] **La sesión no se revoca.**
  - **Dónde:** la cookie firma sólo `{username, expiresAt}` (`src/lib/admin-auth.ts:78-87`), y `loadAdminSession` busca por username (`:395`).
  - **Consecuencias:**
    - Cerrar sesión, cambiar la contraseña o que un admin la resetee no corta las otras sesiones abiertas (duran hasta 8 h).
    - Si se borra un usuario y se crea otro con el **mismo nombre**, la cookie vieja vuelve a servir con los permisos del nuevo.
  - **Arreglo:**
    - Agregar al payload el `id` del usuario más una `session_version`, guardada en una columna nueva de `admin_users`.
    - Comparar las dos en `loadAdminSession`.
    - Subir la versión al cerrar sesión, al cambiar o resetear la contraseña, al cambiar el rol y al borrar el usuario.
    - Buscar por `id`.
- [ ] **Sesión no atada al entorno (dev vs. www).**
  - **Problema:** el token no dice de qué sitio es. Si dev y prod comparten `AUTH_SECRET` y usan bases distintas, una cookie de dev sirve en www.
  - **Arreglo:**
    - Agregar al payload un `aud` con el host de `SITE_URL` y verificarlo.
    - **Usar un `AUTH_SECRET` distinto en cada app de Hostinger.** Se puede comparar si son iguales mirando el hash, sin mostrar los valores.
- [ ] **Carrera al reordenar o borrar anuncios.**
  - **Dónde:** `src/pages/api/admin/anuncios.ts:21,57` valida el índice contra una lectura hecha *fuera* de la cola de escritura y lo aplica *dentro* (`:63,:74`).
  - **Riesgo:** con dos pedidos simultáneos (borrar y subir el último) se puede guardar un `null`. Eso rompe el inicio (`index.astro:69`) y **todo el panel** (`AdminLayout.astro:42`) hasta arreglar el JSON a mano.
  - El mismo patrón está en `series.ts:83` ("mover") y en el guardar/borrar posicional de anuncios y series.
  - **Arreglo:** resolver el ítem *dentro* del callback de `update()` (como hace `devocionales.ts` con `findIndex` por slug), o usar ids estables.
  - **Además:** en `store.read()`, descartar los elementos que no sean objetos.

### Endurecimiento (no son vulnerabilidades, pero conviene)

Cabeceras y configuración:
- [ ] Agregar una `Content-Security-Policy` en el middleware. No hay ninguna. Mitiga los dos XSS.
- [ ] Commitear `package-lock.json` (hoy está en `.gitignore`) y deployar con `npm ci`. Hoy cada deploy instala lo último dentro de los rangos `^`.
- [ ] Confirmar que el proxy de Hostinger manda `X-Forwarded-Proto: https`, así la cookie sale con `Secure`. Agregar HSTS.

Login y sesión:
- [ ] Comparar el HMAC con `crypto.timingSafeEqual` (`admin-auth.ts:99`).
- [ ] En el login, correr bcrypt contra un hash de relleno cuando el usuario no existe. Hoy se puede averiguar qué usuarios existen midiendo el tiempo.
- [ ] Limitar los intentos de login por IP y por cuenta.
- [ ] Unificar los errores del login (`env`, `db-auth`, `db-connection`, `server`) en uno genérico para quien no inició sesión.
- [ ] Hacer que `logout` sea sólo POST. Hoy un GET desde otro sitio te desloguea.
- [ ] Usar el prefijo `__Host-` en la cookie de sesión.
- [ ] En el middleware, rechazar `Origin: null`. Evaluar sacar `localhost` y `127.0.0.1` de `KNOWN_HOSTS` en producción.
- [ ] `changeOwnPassword`: buscar al usuario sólo por username, no por "username o email".

Usuarios:
- [ ] Validar las secciones de `usuarios.ts` contra el catálogo.
- [ ] Contemplar la carrera de "último admin" (dos admins degradándose a la vez).

Imágenes:
- [ ] Validar el formato real de la imagen con `sharp(...).metadata()`, no el tipo MIME que manda el cliente. Fijar `limitInputPixels`.
- [ ] En `resolveUploadPath`, agregar `fs.realpath` (el comentario dice que rechaza symlinks y no lo hace).

Código:
- [ ] `ministerios/[slug].astro:166`: usar `instagramHref()` en lugar del `href` crudo.
- [ ] Borrar `src/layouts/BaseLayout.astro`. Parece no usarse y carga GSAP desde un CDN.
- [ ] `novedades.ts`: armar la lista de novedades dentro del callback de `update()`. Hoy, dos ediciones simultáneas del mismo ministerio pisan una.

Revisar a mano:
- [ ] Confirmar que `.env.example` y `.env.hostinger.example` tienen sólo valores de ejemplo, también en el historial de git.

### Sin revisar en esta pasada (quedó para una auditoría `standard`)

- [ ] Páginas públicas hermanas que muestran datos de ministerios: `ministerios/kids.astro`, `ministerios/index.astro`, `anexos/[slug].astro`, `nosotros.astro`, y las tarjetas y el footer de `NocheLayout`.
- [ ] El patrón `readEnv` en `youtube.ts` y `site.ts`. Se miró de pasada y no expone secretos.

## 2. Producción

- [ ] Formularios de Contacto, IETE y Discipulados: hoy tienen `action="#"` y no envían nada. Falta decidir el destino (mail, WhatsApp o una sección "Mensajes" en el panel).
- [ ] Hostinger, app de prod: `SITE_URL=https://www.corazondefuego.com` más MySQL y `YOUTUBE_HANDLE`.
- [ ] Hostinger, app de dev: `SITE_URL=https://dev.corazondefuego.com`.
- [ ] Hostinger: redirección 301 de `corazondefuego.com` a `www.corazondefuego.com`.
- [ ] Pasar `dev` a `main`. Copiar el contenido (JSON) y las fotos subidas del `CDF_DATA_DIR` de dev al de prod.
- [ ] Probar un guardado real en el panel de dev con la protección de origen nueva.

## 3. Contenido que tiene que pasar la iglesia

- [ ] Sedes Palito, Rojas, Santos Vega y Villa Minetti (`src/data/anexos.ts`): todo es de ejemplo. Faltan dirección, horarios, años, historia y fotos. Las direcciones actuales son inventadas: "Calle Principal 1234", "Pasaje Esperanza 87", "Ruta de la Fe 56" y "Av. del Encuentro 245".
- [ ] Ramos Mejía: los horarios dicen "reuniones generales" sin hora, mientras que Contacto dice Vie y Sáb 20 hs, Dom 9:30 y 11 hs. Hay que unificar.
- [ ] Misiones (`src/data/missions.ts`): Mozambique figura como "Próxima" con fecha de octubre de 2025. Hay que actualizarla o pasarla a "Realizada". Las fotos de Mozambique y Salta son de stock.
- [ ] Evangelismo (`src/data/evangelism.ts`): las fotos de Hospitales y Plazas son de stock.
- [ ] Contacto: confirmar que existe `info@corazondefuego.com`.
- [ ] Panel: cargar devocionales reales (los actuales son ejemplos de febrero) y borrar los anuncios vencidos "Campamento ARDE" y "Kids".
- [ ] Series: falta la descripción real de cada serie (`src/data/series.ts` dice "PENDIENTE").
- [ ] Conectar la API de Instagram (hoy hay una maqueta).
- Radio Corazón queda como "Próximamente" a propósito, no es un pendiente.

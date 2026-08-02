# Memoria del proyecto — Web Corazón de Fuego

Última actualización: 25 de julio de 2026.

## Objetivo

Sitio web de Iglesia Corazón de Fuego. La experiencia debe comunicar presencia, adoración, comunidad, misión y servicio mediante una dirección visual contemporánea y sobria.

## Entorno de trabajo

- El repositorio vive en WSL Debian: `/home/cdf/web-cdf`.
- Hay una sola distribución WSL. Ejecutar comandos con `wsl -d Debian -- bash -lc '…'` cuando la consola anfitriona sea PowerShell.
- El servidor de desarrollo normalmente ya corre en `http://localhost:4321`. No iniciarlo ni reiniciarlo salvo pedido explícito.
- nvm está instalado en `/home/cdf/.nvm` pero no siempre se carga automáticamente en shells no interactivos.
- Versión compatible y validada: Node `v24.12.0`.
- Patrón para compilar:

  ```bash
  source ~/.nvm/nvm.sh && nvm use 24.12.0 >/dev/null && npm run build
  ```

- Astro 7 exige Node `>=22.12.0` según su campo `engines`. No funciona con el Node 18 del sistema.
- `dist/` y `.astro/` no se versionan. `dist/` lo genera el build; lo que hubo versionado alguna vez eran HTML de cuando el sitio era estático.
- Al clonar en limpio hay que correr `npm run build` antes de esperar un `dist/`.

## Deploy

- **Hostinger compila en el servidor.** No se sube `dist/` por FTP: el servidor
  hace `npm install` y `npm run build`. Verificado el 25 de julio de 2026.
- Consecuencias comprobadas de eso:
  - `astro build` **limpia `dist/` antes de compilar**. Se probó plantando una
    SPA falsa y un archivo huérfano en `dist/client/`: los borró a los dos. No
    hay que limpiar restos de deploys viejos a mano.
  - `sharp` es dependencia nativa, pero como `npm install` corre en el
    servidor, se baja los binarios de linux que correspondan. No subir un
    `node_modules` armado en Windows.
  - `astro` está en `dependencies`, así que el build funciona con
    `npm install --production`. `@astrojs/check` y `typescript` son
    devDependencies y sólo hacen falta para `npm run check`.
  - **El build no necesita ninguna variable de entorno.** Se compiló con el
    entorno vacío y salió bien, sin tocar MySQL ni crear el directorio de
    datos. Si el build falla, es Node o `npm install`, nunca configuración.
- Las variables tienen que estar en el entorno de **ejecución**, no sólo en el
  del build. Si Hostinger los separa, van en los dos: un build exitoso con un
  login que falla con `db-connection` es exactamente ese error.
- `CDF_DATA_DIR` en producción: `/home/u857415758/cdf-data`. Fuera de `dist/`
  para que el build no se lleve el contenido, y fuera de `public_html` para
  que no sea navegable por web. La carpeta se crea sola.
- El usuario de Hostinger (`u857415758`) se dedujo del nombre de la base
  `u857415758_cdfweb`.

## Stack

- Astro `^7.0.6`.
- Salida SSR/server con `@astrojs/node` en modo standalone.
- Tailwind CSS 3 mediante `@astrojs/tailwind`.
- Panel de administración propio. TinaCMS fue eliminado del repo (ver más abajo).
- MySQL sólo para usuarios y permisos del panel. El contenido no vive ahí.
- `sharp` para comprimir las imágenes que se suben desde el panel.
- GSAP + ScrollTrigger se cargan desde CDN en `src/layouts/BaseLayout.astro`.
- Tipografías: Inter para display y DM Sans para cuerpo.
- El build ejecuta `astro build` y luego copia `hostinger-entry.js` a `dist/index.js`.

## CMS

TinaCMS se sacó por completo el 25 de julio de 2026. Editaba una sola página
demo (`/tinacms-demo`) y para eso arrastraba MongoDB, un PAT de GitHub, un
proxy GraphQL propio y 9.7 MB de bundle versionado en `public/admin/`. Todo el
contenido real estaba hardcodeado. No volver a introducirlo.

En su lugar hay un panel propio sobre la auth que ya existía:

- El contenido son archivos JSON en disco, en `CDF_DATA_DIR` (fuera de `dist/`,
  que se borra en cada deploy). El backup es copiar `content/` por FTP.
- `src/lib/content/store.ts`: escritura atómica (temporal + rename), cache
  validado contra el `mtime` — así una edición hecha directo por FTP se ve sin
  reiniciar — y copia con fecha de cada guardado en `history/`.
- `src/lib/content/collections.ts`: las colecciones y los helpers de slug y
  párrafos. Los archivos de `src/data/` quedan como semilla y respaldo; si un
  JSON se corrompe el sitio los muestra en lugar de caerse. No borrarlos.
- `src/lib/content/sections.ts`: catálogo de permisos. Los ministerios se abren
  uno por uno (`ministerio:kids`) para que cada líder vea sólo lo suyo.
- Roles en MySQL: `admin_users.role` y la tabla `user_sections`. La cookie sólo
  lleva el usuario; rol y secciones se leen de la base en cada request del
  panel, así revocar un acceso tiene efecto al instante.
- Los slugs no se editan nunca: son las URLs públicas.

### El panel

Está construido y verificado contra la base real. Vive en `/admin`, protegido
por `src/middleware.ts`. Son páginas Astro con formularios HTML comunes que
postean a endpoints en `src/pages/api/admin/`. **No usa framework de cliente
ni build propio**, y esa simplicidad es deliberada: el público son voluntarios
que no manejan computadoras.

- `src/layouts/AdminLayout.astro`: cascarón, carteles de éxito y error por
  querystring (`?ok=` / `?error=`), aviso antes de perder lo escrito, vista
  previa de la foto elegida y bloqueo de doble submit.
- `src/components/admin/Field.astro` y `ImageField.astro`.
- `src/lib/admin-guard.ts`: `getSession`, `canEdit`, `denyRedirect`, `backTo`.
- Secciones: devocionales (alta, edición, borrado, orden), anuncios, series,
  ministerios y usuarios. El tablero muestra sólo lo que esa persona puede
  editar.
- `src/pages/admin/mi-cuenta.astro`: cada persona ve qué puede editar y se
  cambia la contraseña sola. Pide la contraseña actual además de la cookie: una
  sesión olvidada abierta en un teléfono ajeno no tiene que poder quedarse con
  la cuenta. Se entra desde el nombre de usuario en el header.
- `admin_users.last_login_at` se escribe en cada login exitoso y la pantalla de
  usuarios muestra "Nunca entró al panel". Sirve para ver qué accesos se
  crearon y quedaron sin estrenar. Si el UPDATE falla, el login sigue igual: es
  un dato de gestión, no parte de la autenticación.
- **Las secciones asignadas se guardan también para los admins**, aunque no las
  usen (`loadAdminSession` les devuelve `[]`). Antes se borraban al promover a
  alguien, y si más adelante volvía a editor reaparecía sin ningún acceso y sin
  registro de lo que tenía. No volver a filtrar por rol en
  `createAdminUser`/`updateAdminUser`.

Criterios de UX que conviene no romper:

- Todo en castellano y sin jerga. Nada de "colección", "slug" ni "publicar".
- Una pantalla por tarea real, no un explorador de contenido.
- Los párrafos se editan como un textarea separado por líneas en blanco. **No
  hace falta editor rich-text**: el contenido ya es `string[]` de párrafos, y
  meter uno sería la mayor fuente de complejidad del panel.
- Cada formulario avisa qué va a pasar ("Ya se ve en el sitio").

### Trampas encontradas, no volver a pisarlas

- Los botones de submit se deshabilitan en el **próximo tick**, no dentro del
  handler. Varios formularios mandan la acción en el `value` del botón y un
  botón deshabilitado se excluye del envío: "Borrar" terminaba guardando.
- Un `<input type="hidden" name="accion">` junto a botones que también mandan
  `accion` hace que `formData.get()` devuelva el del hidden. La acción va en
  los botones.
- El `<textarea>` no lleva saltos de línea alrededor del valor: lo que va
  entre las etiquetas es contenido literal y la indentación del template se le
  mete al texto.
- Nunca renderizar `<img src="">`: el navegador lo resuelve como la URL de la
  página y la vuelve a pedir entera.
- El sitio público tiene que tolerar contenido incompleto o vacío. El inicio
  filtra las series sin portada ni link, y `currentSeries` va detrás de una
  guarda porque borrar todas las series rompía la home.

### Ministerios: la ficha y los datos de cada uno

Separación hecha el 26 de julio de 2026. `Ministry` tiene dos mitades y hay que
mantenerlas separadas:

- **La ficha** (`name`, `area`, `image`, `excerpt`) se ve en el navbar, en el
  inicio y en el listado de `/ministerios`. No es del ministerio solo, así que
  **sólo la edita un admin**. El chequeo vive también en
  `api/admin/ministerios.ts`, no sólo en el formulario: un editor puede mandar
  un POST a mano. Si no es admin, esos campos se toman de lo que ya está
  guardado y el archivo del logo ni se mira.
- **Lo demás** lo edita quien lidera: los textos largos y los datos que cambian
  seguido (`meetingDay`, `meetingHours`, `place`, `mapUrl`, `noticeTitle`,
  `noticeText`, `whatsapp`, `instagram`, `photo`). Son **todos opcionales**: el
  JSON que ya está en disco no los tiene y cada página esconde el bloque entero
  cuando vienen vacíos, en lugar de dejar un hueco.

`src/lib/content/ministry-details.ts` arma los href. Acepta lo que una persona
escribiría de verdad — un número suelto, `@usuario`, un link pegado sin
`https://` — porque quien carga esto no es programador. Un link sin esquema el
navegador lo toma como ruta interna y el botón termina en un 404.

Las diez páginas leen del store. Las cinco que usan `MinistryTemplate` reciben
`ministry={ministry}` y muestran una banda de novedad y otra de datos prácticos
que aparecen sólo si hay algo cargado. Las cuatro con diseño propio (`arde`,
`kids`, `life`, `gold`) usan los mismos campos dentro de su propio maquetado: no
se les impuso un componente compartido a propósito, porque cada una tiene una
estética distinta.

Detalles que conviene no repisar:

- En `arde` el mismo dato se mostraba en tres lugares (dos badges y la tabla de
  horarios) y el link de Maps en otros tres. Ahora salen todos de un campo. La
  píldora chica del hero muestra sólo la hora: es angosta y el día ya se lee en
  Horarios.
- `.kids-badge` lleva `text-transform: uppercase` en CSS. Antes el texto estaba
  escrito en mayúscula a mano dentro del HTML, y quien carga el aviso escribe
  normal.
- Los botones de WhatsApp de `life` y `gold` apuntaban a `https://wa.me/` sin
  número. Mientras no haya un número cargado el botón no se muestra.

### Imágenes

- `src/lib/content/uploads.ts`. `rotate()` **primero**, si no las fotos de
  celular quedan acostadas. Resize a 1600px, WebP 80, se descartan el original
  y los metadatos (traen GPS). El nombre es el hash del contenido, así que la
  misma foto subida dos veces es un solo archivo y se puede cachear para
  siempre.
- Las sirve `src/pages/uploads/[...file].ts` desde `CDF_DATA_DIR`, con guarda
  contra path traversal. **No van en `public/`**: el build limpia `dist/` y se
  llevaría puestas todas las fotos cargadas.
- `src/lib/content/orphans.ts` borra las que dejan de estar en uso. Junta las
  referencias de las cuatro colecciones antes de borrar nada, porque al ser
  hashes una imagen puede estar compartida. Tiene ventana de una hora (una foto
  recién subida todavía no está referenciada) y se cancela si el contenido no
  se puede leer (si no, borraría todas las fotos del sitio). Busca en todos los
  strings, no en una lista de campos, para que un campo nuevo quede cubierto
  solo.

### Seguridad

- `AUTH_SECRET` firma las cookies de sesión (HMAC-SHA256 sobre el payload). El
  payload es base64 legible, **no está encriptado**: no meter nada sensible
  ahí. Si el secreto se filtra o queda sin definir, cualquiera se fabrica una
  cookie de admin y el chequeo de contraseña nunca corre. En producción tiene
  que ser aleatorio y distinto al de desarrollo.
- Los permisos se verifican **en cada endpoint**, no sólo en las pantallas. Se
  probó con POSTs directos como editor limitado: borrar un devocional, editar
  un anuncio, editar un ministerio ajeno y auto-promoverse a admin. Los cuatro
  rechazados. Al tocar el panel, mantener esa doble verificación.
- Cambiar una contraseña **no** invalida la sesión abierta (dura hasta 8 h).
  Para cortar el acceso al instante hay que sacarle el acceso desde el panel:
  el usuario se busca en la base en cada request y si no está, la sesión muere.
- No se puede borrar ni bajar a editor al último administrador.

## Archivos centrales

- `src/layouts/BaseLayout.astro`: layout global, carga de fuentes y sistema de animaciones.
- `src/components/Navbar.astro`: navegación responsive y cambio automático de contraste según `data-nav-surface-zone`.
- `src/components/Footer.astro`: pie global.
- `src/styles/global.css`: Tailwind y sistema visual compartido.
- `src/data/`: semilla y respaldo del contenido (misiones, evangelismo, ministerios, devocionales, series y anuncios). Las páginas ya no lo importan directo; leen por `src/lib/content/`.
- `src/lib/content/`: almacén en disco, colecciones y permisos por sección.
- `src/lib/admin-auth.ts`: usuarios, roles y sesión del panel.
- `src/pages/`: rutas Astro.
- `public/`: imágenes, videos, marcas y assets del sitio.
- `astro.config.mjs`: SSR standalone y Tailwind.

## Dirección visual aprobada

Palabras clave dadas por el usuario:

- Editorial web design.
- ARK minimalism.
- Soft brutalism.
- Premium agency.
- Motion-first.

Referencia visual conversada: `https://bymonolog.com/`.

Interpretación aplicada:

- Grilla fuerte y composición asimétrica.
- Tipografía grande como elemento principal.
- Fondos carbón/negro y marfil con dorado muy controlado.
- Líneas finas, números editoriales, marcos desplazados y radios mínimos.
- Textura de grano estática y sutil.
- Pocos halos, sombras discretas y nada de efectos decorativos gratuitos.
- Evitar estética de “cards de landing page”. Los bloques deben sentirse como capítulos.
- Evitar tilt 3D. El movimiento debe depender principalmente del scroll.
- Usar revelados por máscara, parallax lento, aparición progresiva de títulos y textos, y escenas de al menos una pantalla cuando el contenido lo permita.

Paleta editorial vigente:

- Negro principal: `#11110f`.
- Carbón secundario: `#181816`.
- Marfil: `#eee9df` / variantes cercanas.
- Dorado: `#c5a059`.

## Convenciones de movimiento

- Una página que usa el sistema editorial lleva `data-cinematic-page` en `main`.
- Las escenas con fondo oscuro deben declarar `data-nav-surface-zone="dark"` para mantener el contraste del navbar transparente.
- Los fondos de escena nunca deben ocultarse durante el reveal. Se animan contenidos internos, no la opacidad de toda la sección.
- `data-cinematic-heading`: reveal de título con máscara vertical vinculada al scroll.
- `data-cinematic-copy`: aparición progresiva de hijos directos.
- `data-cinematic="image"`: parallax lento de imagen o video dentro de su frame.
- `.mission-media-frame`: reveal editorial por clip-path controlado por ScrollTrigger.
- `data-cinematic-card` recibe reveal de scroll, pero no tilt salvo que además tenga `data-cinematic-tilt`.
- Respetar `prefers-reduced-motion`; `BaseLayout` ya desactiva animaciones si corresponde.

## Responsive y QA visual

- Verificar desktop alrededor de `1280×720`.
- Verificar mobile real en `390×844`.
- En mobile, los heroes editoriales deben ocupar al menos `100svh`.
- Los principios editoriales se apilan y cada bloque usa aproximadamente `68svh` para evitar un scroll acelerado.
- Comprobar que el navbar cambie correctamente entre escenas claras y oscuras.
- Revisar que no aparezcan franjas blancas entre escenas oscuras.
- Revisar que halos decorativos con `position: absolute` no entren en el flujo. Hubo un conflicto anterior que creó un vacío de 448px en Historia; los selectores excluyen ahora `.cinematic-orb`.
- Después de cambios visuales:
  1. Recargar la página local.
  2. Capturar hero y escenas intermedias en desktop.
  3. Repetir en `390×844`.
  4. Revisar errores de consola.
  5. Ejecutar `npm run build` con Node 24.
  6. Ejecutar `git diff --check` sobre los archivos modificados.

## Restricciones de contenido

- Mantener los textos existentes.
- Mantener las imágenes asignadas a cada sección.
- Se puede cambiar layout, jerarquía, tamaño, color grading, overlays, recortes responsivos, bordes y movimiento.
- No incorporar imágenes externas nuevas ni reemplazar assets sin autorización.
- No leer, mostrar ni versionar secretos. Existe configuración local de entorno; tratar `.env*` como sensible.

## Páginas ya migradas al sistema editorial

### Nosotros — `src/pages/nosotros.astro`

- Hero fotográfico, historia, manifiesto y cierre editorial.
- Textos e imágenes originales preservados.
- Escenas oscuras y claras con contraste automático del navbar.
- Mobile validado en `390×844`.

### Misiones — `src/pages/misiones/index.astro`

- Hero oscuro, principios numerados y destinos a pantalla completa.
- Alternancia editorial de texto y medios en desktop.
- Video de Mozambique mantiene carga diferida y reproducción según visibilidad/hover.
- Contenido proviene de `src/data/missions.ts`.
- Mobile validado en `390×844`.

### Evangelismo — `src/pages/evangelismo/index.astro`

- Hero oscuro, principios numerados y frentes editoriales a pantalla completa.
- Alternancia de composición en desktop y apilado vertical en mobile.
- Contenido proviene de `src/data/evangelism.ts`.
- Mantener imágenes actuales aunque su semántica pueda ser genérica; sólo reemplazarlas con autorización.

## Páginas todavía no migradas completamente

Los commits `41a5f32`, `066943f` y `b0f3093` (25 de julio de 2026) extendieron
el sistema editorial a inicio, anexos, institucionales, ministerios,
devocionales y contacto. **Esa migración no fue verificada visualmente por
quien escribe esta sección**, así que la lista de pendientes hay que
reconfirmarla antes de darla por cerrada.

Al migrar lo que falte, reutilizar el sistema existente y evitar duplicar
reglas con nombres específicos cuando convenga extraer primitivas editoriales
compartidas. `src/styles/global.css` ya tiene bloques casi repetidos por página
(`nosotros-cinematic`, `missions-cinematic`, `evangelism-cinematic`,
`home-cinematic`) que piden esa extracción.

## Pendiente

### Deploy del panel — hecho

El 26 de julio de 2026 el panel quedó funcionando en producción: variables
cargadas en el entorno de ejecución, primer login probado y andando, y las
variables viejas de Tina borradas de hPanel. Node ≥ 22.12 quedó configurado.

Si alguna vez hay que rehacerlo, lo que importaba era: `AUTH_SECRET` (aleatorio
y distinto al de desarrollo), `CDF_DATA_DIR=/home/u857415758/cdf-data`, las
`MYSQL_*` y las `ADMIN_*`, en el entorno de **ejecución** y no solo el de build.
Si el tablero apareciera vacío con "todavía no tenés ninguna sección asignada",
la promoción automática a admin no agarró y se arregla con
`UPDATE admin_users SET role='admin' WHERE username='mparisi';`

Queda pendiente **revocar el PAT de GitHub** en
`github.com/settings/tokens`. No hay endpoint de API para borrar un PAT propio:
es un click en la web. Se verificó que el token **nunca entró al historial de
git** — los únicos `.env*` versionados alguna vez son los dos `.example`
(commits `91c597d` y `4ad5203`) y no hay ningún `ghp_` ni `github_pat_` en
ningún commit. Es higiene, no urgencia.

### Contenido que quedó desprolijo y hay que resolver con el usuario

- **`life` y `gold` se contradicen con su ficha.** En `src/data/ministries.ts`
  Life figura como ministerio de jóvenes de 13 a 25 y Gold como ministerio de
  mujeres, pero las dos páginas hablan de matrimonios y parejas. La tarjeta del
  listado y la página dicen cosas distintas. Hay que preguntar cuál es la
  correcta; no inventarla.
- Dos ministerios tienen la foto de ficha apuntando a un `lh3.googleusercontent`
  externo (`carcelario` y `firmes-y-adelante`). Son URLs de terceros que pueden
  caerse solas. Conviene subir esas fotos desde el panel.
- `gold` tenía "Próximo encuentro: Octubre 24" escrito a mano. Se sacó al pasar
  a los campos editables: hoy no se muestra hasta que alguien cargue día y hora.

### Ideas que quedaron conversadas pero sin hacer

- Textos editoriales de las páginas editables desde el panel. Es el paso más
  invasivo: hay que sacar el copy de los `.astro` sin romper el sistema visual.
  El usuario lo puso como prioridad menor que devocionales y ministerios.
- Del panel de usuarios quedaron afuera a propósito, por prioridad: cambiar la
  contraseña **no** cierra las sesiones abiertas (se arreglaría con una columna
  `password_changed_at` y un `issuedAt` en el payload de la cookie); el email y
  el usuario no se pueden editar después de crear la cuenta; y los cambios de
  acceso no quedan registrados — las ediciones de contenido sí son atribuibles
  por `history/`, pero "quién le dio admin a quién" no.
- Restaurar una versión desde `history/`. Las copias con fecha ya se guardan en
  cada escritura; falta la pantalla que las liste y permita volver atrás.
- `astro check` reporta 7 hints de "declarado y nunca usado" sobre
  `denyRedirect` en las páginas de `/admin`. Son falsos: el language server no
  ve los usos que están después de un `return` temprano en el frontmatter. No
  perder tiempo "arreglándolos".

## Maqueta de rediseño — `/maqueta`

Propuesta de rediseño completa, en clave clara, que convive con el sitio sin
tocarlo. Commit `5e2ed7b`. Referencia visual pedida por el usuario:
`https://austinstone.org`.

Es descartable a propósito: ninguna ruta del sitio la referencia y todo su CSS
va prefijado con `.as`. Se borra sin dejar rastro si no convence.

### Qué contiene

26 páginas navegables entre sí:

- `/maqueta` — home.
- `/maqueta/[slug]` — los nueve ministerios.
- `/maqueta/anexos/[slug]` — las cinco sedes.
- `/maqueta/institucional/[slug]` — IETE y Discipulados.
- `/maqueta/nosotros`, `/maqueta/misiones`, `/maqueta/evangelismo`, `/maqueta/contacto`.
- `/maqueta/devocional` y `/maqueta/devocional/[slug]`.

### Archivos

- `src/layouts/MaquetaLayout.astro` — nav, footer y datos compartidos.
- `src/styles/maqueta.css` — el sistema de diseño entero.
- `src/scripts/maqueta-ui.js` — reveals, rotador, pestañas, nav y menú mobile.
- `src/data/maqueta-anexos.ts` — datos de sedes extraídos de `src/pages/anexos/*.astro`,
  donde hoy viven como props sueltas de `AnexoTemplate`.

### Tokens, medidos y no estimados

Todos salen de abrir las dos páginas en el navegador y comparar
`getComputedStyle`, no de mirarlas a ojo. A 1440px:

- Display: `7rem/7.6rem` w700 ls `-1px`. A 390px: `4rem/4.6rem`.
- H1 de sección: `3rem/3.6rem` w600 ls normal. A 390px: `2.4rem/3rem`.
- Eyebrow: `0.95rem/2rem` w500 ls `2px`, uppercase, **tinta plena, no gris**.
- Link de nav: `1rem/1.7rem` w600 ls `0.1px`, **caja normal, no versalita**.
- Meta de tarjeta: `1rem/1.4rem` w500 ls `1.2px` uppercase.
- Botón: radio `100px`, `16px 32px`, `.8rem` w600 ls `2px`. Small: `12px 24px`, `.7rem` ls `3px`.
- Sección: `padding: 120px` parejo; `80px` en tablet; `48px` en mobile.
- Nav: `fixed`, `z-index 2000`, alto `120px`, padding lateral `72px`.
- Marquee: `40s linear infinite`, `translateX(0 → -50%)`, piezas cuadradas, radio `12px`.
- Colores: `#282828` tinta, `#f4f4f4` fondo claro, `#737373` cuerpo, `#94979e29` hairline.
- Acento: se mantuvo el dorado `#c5a059` de la casa en lugar del celeste de la referencia.

Dos desvíos deliberados respecto de la referencia:

- `backdrop-filter: blur(12px)` en el nav en vez de `blur(5px)`. A pedido del
  usuario: sobre video en movimiento, 5px es imperceptible.
- Tipografía `Nunito Sans` en lugar de Proxima Nova, que es licenciada.

### Tipografía: por qué Nunito Sans

Medido con el navegador, a 16px w600, sobre la cadena `Ministerios Nosotros`:

| Fuente | Ancho | Δ | Altura-x | Mayúscula |
| --- | --- | --- | --- | --- |
| Proxima Nova (ref) | 146.66 | — | 8 | 11 |
| Nunito Sans | 149.75 | +2.1 % | 8 | 11 |
| Figtree | 150.83 | +2.9 % | 8 | 11 |
| Mulish | 152.66 | +4.1 % | 8 | 11 |
| Hind | 145.95 | −0.5 % | 8 | 10 |

Nunito Sans es la libre que más se acerca conservando ambas alturas. Hind gana
en ancho pero pierde la altura de mayúscula.

### Trampas encontradas, no volver a pisarlas

- **Especificidad de los resets.** Escribir `.as a`, `.as p`, `.as h1`, `.as button`
  da `0,1,1` y le gana a cualquier clase propia `0,1,0`. Rompió el color de los
  botones (tinta oscura sobre pastilla oscura), el peso de los títulos y el
  interlineado del cuerpo. Los resets van con `:where()`, que aporta cero.
- **Reveals que dejan la página invisible.** El contenido arranca en `opacity: 0`.
  Con `threshold: 0.12`, un bloque más alto que el viewport nunca lo cumple y
  queda oculto para siempre. Va `threshold: 0` más una red de seguridad a los 4 s.
- **Nav sobre fondos claros.** El punto de corte se calculaba con `.as-hero`. Las
  internas no lo tienen, así que la barra quedaba transparente con tinta blanca
  sobre blanco. Sin hero oscuro, la barra arranca sólida.
- **`scroll-margin-top` a mano.** El nav mide `121px` en desktop y `106px` en
  mobile. El JS publica el alto real en `--as-nav-h` y el CSS lo usa.
- **`ministry.image` no siempre es foto.** La mitad de los ministerios tiene
  logo; a sangre en el marquee se ve roto. Hay una lista aparte de fotografías.
- **`getStaticPaths` en SSR.** Es código muerto y ensucia el build. Las rutas
  dinámicas de la maqueta leen `Astro.params`.

### Verificación

Se usó Playwright con el Chromium ya descargado en
`~/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome` (la versión de
Playwright pide una más nueva; hay que pasar `executablePath`).

- `networkidle` no sirve en páginas con video en loop: nunca se cumple. Usar
  `domcontentloaded` más una espera explícita.
- Playwright dibuja los elementos `position: fixed` en su posición de scroll
  cuando se captura la página entera. El nav aparece en el medio de la captura;
  es un artefacto, no un bug.
- Chequear siempre: elementos en `opacity: 0`, palabras del reveal sin animar,
  `scrollWidth` contra el viewport, errores de consola y requests fallidos.

### Pendiente de la maqueta

- **Fotografía.** Se repiten seis fotos en 26 páginas. Es el techo real de la
  propuesta y es trabajo de la iglesia, no del código.
- Los formularios van con `action="#"`. Al promover hay que apuntarlos al
  endpoint real.
- El nav de la maqueta apunta a páginas de la maqueta. Para comparar contra
  producción, abrir las dos en pestañas.
- Si se aprueba, el color por ministerio pasa a ser un campo `color` en
  `src/data/ministries.ts` y lo consumen también el navbar y `MinistryTemplate`.

## Estado y precauciones del repositorio

- No usar `git reset --hard`, `git checkout --` ni limpiezas destructivas.
- No revertir archivos que no pertenezcan al pedido actual.
- `dist/` y `.astro/` ya no se versionan (commit `9c9ffea`). Al 25 de julio de
  2026 el worktree quedó limpio; si aparecen diferencias raras, no asumir que
  hay que borrarlas.
- Tratar `.env*` como sensible: no leerlo, mostrarlo ni versionarlo. El
  `.gitignore` traía `*.env`, que sólo matchea archivos **terminados** en
  `.env` y dejaba `.env.local` afuera. Ya está corregido.
- Advertencia de build conocida: Astro ignora `getStaticPaths()` en `src/pages/devocional/[slug].astro` porque la ruta es dinámica bajo salida server. No bloquea el build.
- Para verificar sin credenciales, el endpoint de login distingue los casos por
  el código de error del redirect: `db-auth` (usuario/password o whitelist),
  `db-connection` (no llega al host), `1` (conecta bien, credenciales
  inexistentes).

## Criterio de terminado

Un cambio visual no está terminado sólo porque compile. Debe:

- Respetar contenido y assets.
- Sentirse coherente con la dirección editorial aprobada.
- Tener ritmo de scroll deliberado.
- Funcionar en desktop y mobile.
- Mantener contraste y legibilidad.
- No producir errores de consola.
- Pasar build y `git diff --check`.


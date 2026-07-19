# Memoria del proyecto — Web Corazón de Fuego

Última actualización: 18 de julio de 2026.

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

- Astro 7 no funciona con el Node 18 del sistema.

## Stack

- Astro `^7.0.6`.
- Salida SSR/server con `@astrojs/node` en modo standalone.
- Tailwind CSS 3 mediante `@astrojs/tailwind`.
- TinaCMS mediante `@tinacms/astro` y archivos en `tina/`.
- GSAP + ScrollTrigger se cargan desde CDN en `src/layouts/BaseLayout.astro`.
- Tipografías: Inter para display y DM Sans para cuerpo.
- El build ejecuta `astro build` y luego copia `hostinger-entry.js` a `dist/index.js`.

## Archivos centrales

- `src/layouts/BaseLayout.astro`: layout global, carga de fuentes y sistema de animaciones.
- `src/components/Navbar.astro`: navegación responsive y cambio automático de contraste según `data-nav-surface-zone`.
- `src/components/Footer.astro`: pie global.
- `src/styles/global.css`: Tailwind y sistema visual compartido.
- `src/data/`: contenido estructurado de misiones, evangelismo, ministerios y devocionales.
- `src/pages/`: rutas Astro.
- `public/`: imágenes, videos, marcas y assets del sitio.
- `astro.config.mjs`: SSR standalone, Tina, Tailwind y alias del cliente Tina.

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

- Inicio.
- Anexos/sedes.
- Institucionales.
- Ministerios.
- Devocionales.
- Contacto y otras rutas auxiliares.

Al migrarlas, reutilizar el sistema existente y evitar duplicar reglas con nombres específicos cuando convenga extraer primitivas editoriales compartidas.

## Estado y precauciones del repositorio

- El worktree puede contener cambios previos y artefactos generados por Astro/Tina.
- No usar `git reset --hard`, `git checkout --` ni limpiezas destructivas.
- No revertir archivos que no pertenezcan al pedido actual.
- `dist/` y `.astro/` pueden cambiar al compilar; no asumir que sus diferencias deben eliminarse.
- Advertencia de build conocida: Astro ignora `getStaticPaths()` en `src/pages/devocional/[slug].astro` porque la ruta es dinámica bajo salida server. No bloquea el build.

## Criterio de terminado

Un cambio visual no está terminado sólo porque compile. Debe:

- Respetar contenido y assets.
- Sentirse coherente con la dirección editorial aprobada.
- Tener ritmo de scroll deliberado.
- Funcionar en desktop y mobile.
- Mantener contraste y legibilidad.
- No producir errores de consola.
- Pasar build y `git diff --check`.


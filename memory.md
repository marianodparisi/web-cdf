# Project Memory

## Proyecto

- Repo local: `/home/cdf/web-cdf`.
- Sitio Astro estatico para Iglesia Corazon de Fuego.
- Branches principales:
  - `main`: produccion, despliega a `corazondefuego.com`.
  - `dev`: desarrollo, despliega a `dev.corazondefuego.com`.
- El usuario suele trabajar y validar cambios primero en `dev`.

## Deploy

- Produccion usa `.github/workflows/deploy-hostinger-ftp.yml`.
- Dev usa `.github/workflows/deploy-hostinger-ftp-dev.yml`.
- Secrets produccion:
  - `FTP_SERVER`
  - `FTP_USERNAME`
  - `FTP_PASSWORD`
  - `FTP_SERVER_DIR`
- Secrets dev:
  - `DEV_FTP_SERVER`
  - `DEV_FTP_USERNAME`
  - `DEV_FTP_PASSWORD`
  - `DEV_FTP_SERVER_DIR`
- El deploy compila en GitHub Actions con `npm run build`, por eso no hace falta commitear `dist/`.

## Estructura relevante

- Layout base: `src/layouts/BaseLayout.astro`.
- Navbar: `src/components/Navbar.astro`.
- Footer: `src/components/Footer.astro`.
- Home: `src/pages/index.astro`.
- Datos de ministerios: `src/data/ministries.ts`.
- Datos de evangelismo: `src/data/evangelism.ts`.
- Datos de misiones: `src/data/missions.ts`.
- Devocionales: `src/data/devotionals.ts`.

## Convenciones actuales

- Tipografias cargadas en `BaseLayout`: DM Sans, Inter, Plus Jakarta Sans, Poppins.
- Tailwind config define:
  - `primary: #C5A059`
  - `primary-dark: #A8893D`
  - `charcoal: #3A3A3A`
  - `display: Inter`
  - `body: DM Sans`
- Navbar y footer deben coincidir en las secciones principales:
  - Navegacion
  - Ministerios
  - Nuestras Sedes
  - Educativos
- La seccion antes llamada `Institucional` ahora se llama `Educativos`, pero las rutas siguen bajo `/institucional/...`.
- La seccion antes llamada `Anexos` ahora se presenta como `Nuestras Sedes`, pero las rutas siguen bajo `/anexos/...`.

## Assets public

`public/` esta ordenado por seccion:

- `public/brand`: logos y favicon.
- `public/home`: video hero.
- `public/series`: imagenes de series.
- `public/ministries/arde`
- `public/ministries/gold`
- `public/ministries/kids`
- `public/ministries/life`
- `public/devocional`
- `public/missions`
- `public/sedes`
- `public/educativos`

No volver a asumir assets en la raiz de `public/`; revisar rutas nuevas antes de referenciar.

## Cambios funcionales recientes

- `dev` tiene workflow propio para Hostinger dev.
- Home de `dev` conserva el sitio completo.
- `main` tiene home de "Proximamente" para produccion.
- Se agregaron ministerios:
  - Ministerio Carcelario
  - Alabanza y Adoracion
  - Multimedia
  - Protocolo
- Carcelario salio de Evangelismo y ahora vive en Ministerios.
- Se agrego sede Ramos Mejia en `/anexos/ramos-mejia`.
- Series anteriores del home, en orden:
  - Sanados
  - Descanso
  - Pertenecer


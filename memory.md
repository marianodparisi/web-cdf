# Project Memory

## Proyecto

- Repo local: `/home/cdf/web-cdf`.
- Sitio Astro para Iglesia Corazon de Fuego, ahora en modo SSR Node.
- Branches principales:
  - `main`: produccion, despliega a `corazondefuego.com`.
  - `dev`: desarrollo, despliega a `dev.corazondefuego.com`.
- El usuario suele trabajar y validar cambios primero en `dev`.

## Deploy

- Ya no usa deploy por GitHub Actions/FTP.
- Hostinger corre la app Node directamente y hace autodeploy desde GitHub.
- Los workflows viejos de `.github/workflows/` fueron eliminados.
- `npm run build` ahora genera salida SSR para Node.

## Estructura relevante

- Layout base: `src/layouts/BaseLayout.astro`.
- Navbar: `src/components/Navbar.astro`.
- Footer: `src/components/Footer.astro`.
- Home: `src/pages/index.astro`.
- Middleware SSR: `src/middleware.ts`.
- Auth admin: `src/lib/admin-auth.ts`.
- Login admin: `src/pages/admin/login.astro`.
- API login admin: `src/pages/api/admin/login.ts`.
- API Tina GraphQL: `src/pages/api/tina/gql.ts`.
- Datos de ministerios: `src/data/ministries.ts`.
- Datos de evangelismo: `src/data/evangelism.ts`.
- Datos de misiones: `src/data/missions.ts`.
- Devocionales: `src/data/devotionals.ts`.
- Config Tina: `tina/config.ts`.
- Database Tina self-hosted: `tina/database.ts`.
- Demo Tina: `src/pages/tinacms-demo.astro`.

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

- Astro corre con `output: 'server'` y `@astrojs/node`.
- `npm run dev` usa `tinacms dev -c "astro dev"`.
- `npm run build` mantiene build SSR de Astro; `build:tina` queda separado.
- Tina ya esta integrado para desarrollo/local con una coleccion demo JSON en `content/site-content/home.json`.
- El admin propio usa MySQL para login/password y crea `admin_users` automaticamente si existe `ADMIN_USERNAME/ADMIN_PASSWORD` en env.
- Tina self-hosted usa:
  - GitHub como git provider
  - MongoDB como datalayer
  - la misma sesion/cookie del admin para proteger `/api/tina/gql`
- En local conviene usar `TINA_PUBLIC_IS_LOCAL=true` hasta cargar `GITHUB_PERSONAL_ACCESS_TOKEN`.
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

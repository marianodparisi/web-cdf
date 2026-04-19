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

## Diseño — Sección Series (index.astro)

Trabajo hecho en rama `dev`. Decisiones de diseño consolidadas:

- **Fondo sección**: `bg-[#f3f3f3]` con `shadow-[inset_0_6px_32px_rgba(0,0,0,0.07),inset_0_-6px_32px_rgba(0,0,0,0.04)]`
- **Borde cards**: `border-[12px] border-[#f5f5f5]` (no blanco puro, se integra al fondo)
- **Shadow cards**: `shadow-[0_20px_40px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)]`
- **Hover cards**: `transition-all duration-200 hover:-translate-y-[3px]`
- **Card principal ("Éxodo")**:
  - Imagen: top `68%`, `rounded-b-[1.75rem]`, gradient `from-black/[0.12] to-transparent`
  - Sección inferior: `bg-white`, `h-[32%]`, padding `pl-5..8`
  - Badge: `bg-[#2b2b2b]`, `px-[14px] py-[6px]`, `text-[11px]`, `tracking-[0.08em]`, `opacity-90`
  - Título de la serie (`currentSeries.title`) mostrado prominentemente: `text-2xl/3xl/4xl font-bold`
  - Descripción: `text-gray-500`
- **Heading sección**: `text-3xl font-medium text-[#6b7280]` (recede, no compite con la card)
- **Series anteriores**:
  - Layout alternado: card 0 imagen izq, card 1 imagen der, card 2 imagen izq
  - Ancho imagen variado: card 0 → 48%, card 1 → 52%, card 2 → 44%
  - Gradient leve en imagen: `from-black/15 to-transparent`
  - Label: `text-[11px] tracking-[0.12em] text-[#9ca3af]`
  - Gap: `gap-5`

## Diseño — Sección Anuncios (index.astro)

- **Fondo sección**: `bg-[#F8F5F0]` con mismo inset shadow que series
- **Cards mobile**: layout horizontal imagen izq + texto der (igual que series anteriores), `h-[130px]`
- **Cards desktop**: layout original con imagen completa + overlay gradient + texto
- Borde y shadow consistentes con sección series

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


# Project Learnings

## Flujo de trabajo

- Antes de cambiar algo, revisar `git status --short --branch`.
- Si se trabaja para publicar en dev, quedarse en branch `dev`.
- Si se trabaja produccion, cambiar a `main` y confirmar que el cambio realmente corresponde a produccion.
- Despues de cambios de UI o rutas, correr:
- Despues de cambios de SSR, auth o Tina, correr:

```bash
npm run build
```

- El build regenera `.astro/` y `dist/`. En general limpiar esos artefactos antes del commit:

```bash
git restore .astro dist
git clean -fd .astro dist
```

- No commitear `dist/` salvo que el usuario lo pida explicitamente.

## Deploy y ramas

- El proyecto ya no usa workflows de deploy por GitHub Actions/FTP.
- Hostinger hace autodeploy desde GitHub y corre Node/SSR.
- No reintroducir `dist/` ni workflows FTP salvo pedido explicito del usuario.

## SSR y Tina

- `astro.config.mjs` ya esta en `output: 'server'` con `@astrojs/node`.
- `@tinacms/astro` sobre Astro 7 entra con peers forzados; tratar cualquier upgrade con cuidado.
- Para local/dev de Tina usar `TINA_PUBLIC_IS_LOCAL=true`.
- El backend self-hosted de Tina esta cableado a `/api/tina/gql`.
- La autenticacion del admin actual es propia, con cookie firmada y MySQL, no Auth.js.
- El login crea la tabla `admin_users` automaticamente si las credenciales admin estan en env.
- `tina/__generated__/databaseClient.ts` depende de `tina/database.ts`; si se rompe, regenerar con Tina CLI.

## Assets

- Mantener `public/` organizado por subcarpetas.
- Evitar subir archivos `*:Zone.Identifier`.
- Antes de borrar assets, buscar referencias en `src/`.
- Si hay imagenes pesadas, comprimirlas con `sharp` si esta disponible en `node_modules`.
- Validar rutas de assets con una busqueda o script antes de commitear reorganizaciones.

## Navegacion

- Navbar y footer deben mantenerse sincronizados en nombres de secciones.
- `Educativos` muestra `IETE` y `Discipulados`.
- `Nuestras Sedes` muestra Ramos Mejia, Rojas, Villa Minetti, Palito y Santos Vega.
- Aunque el texto publico cambie, las rutas existentes siguen siendo:
  - `/institucional/iete`
  - `/institucional/discipulados`
  - `/anexos/...`

## Contenido

- El sitio usa bastante contenido hardcodeado en `.astro` y datos en `src/data/*.ts`.
- Tina todavia no edita el contenido real del sitio; solo hay una coleccion demo.
- Si se agregan ministerios, actualizar `src/data/ministries.ts` y crear ruta en `src/pages/ministerios/...` si el link debe resolver.
- Si se mueve contenido entre secciones, revisar tambien home, navbar, footer y paginas indice.

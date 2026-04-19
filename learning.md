# Project Learnings

## Flujo de trabajo

- Antes de cambiar algo, revisar `git status --short --branch`.
- Si se trabaja para publicar en dev, quedarse en branch `dev`.
- Si se trabaja produccion, cambiar a `main` y confirmar que el cambio realmente corresponde a produccion.
- Despues de cambios de UI o rutas, correr:

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

- Pushear a `dev` dispara deploy a `dev.corazondefuego.com`.
- Pushear a `main` dispara deploy a `corazondefuego.com`.
- Si se cambia un workflow de deploy, verificar que main y dev no compartan credenciales por accidente.

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
- Si se agregan ministerios, actualizar `src/data/ministries.ts` y crear ruta en `src/pages/ministerios/...` si el link debe resolver.
- Si se mueve contenido entre secciones, revisar tambien home, navbar, footer y paginas indice.


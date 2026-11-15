import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Dominio principal: www.corazondefuego.com. Cada servidor dice el suyo con
  // SITE_URL (dev usa dev.corazondefuego.com); el sitio lo lee en cada pedido
  // (src/lib/site.ts), así que esto es sólo el valor por defecto.
  site: process.env.SITE_URL || 'https://www.corazondefuego.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  devToolbar: {
    enabled: false
  },
  security: {
    // Apagado desde julio de 2026: detrás del proxy de Hostinger rompía el
    // login del panel. El control de origen lo hace el middleware con la lista
    // de dominios de la iglesia (src/lib/site.ts), y la cookie es SameSite=Lax.
    checkOrigin: false,
    allowedDomains: [
      { protocol: 'https', hostname: 'www.corazondefuego.com' },
      { protocol: 'https', hostname: 'corazondefuego.com' },
      { protocol: 'https', hostname: 'dev.corazondefuego.com' }
    ]
  },
  // Tailwind 4 va como plugin de Vite; las hojas que lo usan lo importan
  // (styles/tailwind.css y global.css).
  vite: {
    plugins: [tailwindcss()]
  }
});

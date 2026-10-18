import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dev.corazondefuego.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  devToolbar: {
    enabled: false
  },
  security: {
    checkOrigin: false,
    allowedDomains: [
      {
        protocol: 'https',
        hostname: 'dev.corazondefuego.com'
      }
    ]
  },
  // Tailwind 4 va como plugin de Vite; las hojas que lo usan lo importan
  // (styles/tailwind.css y global.css).
  vite: {
    plugins: [tailwindcss()]
  }
});

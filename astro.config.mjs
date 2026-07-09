import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

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
  integrations: [tailwind(), tina()],
  vite: {
    resolve: {
      alias: {
        'tinacms/dist/client': fileURLToPath(new URL('./src/lib/tina-client-stub.ts', import.meta.url))
      }
    },
    plugins: [tinaAdminDevRedirect()],
    ssr: {
      noExternal: ['@tinacms/astro', '@tinacms/bridge']
    }
  }
});

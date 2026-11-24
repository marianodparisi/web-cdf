/**
 * Dominio del sitio, por servidor.
 *
 * El mismo código publica en dos lugares: `main` → www.corazondefuego.com
 * (producción) y `dev` → dev.corazondefuego.com. Cada app de Hostinger dice el
 * suyo con la variable de entorno SITE_URL; así canonical, sitemap y la vista
 * previa al compartir apuntan al dominio correcto y dev no compite en Google.
 *
 * Se lee en cada pedido (SSR), no al compilar: no importa si Hostinger pasa o
 * no las variables al build.
 */
import { readEnv } from './env';

export const PRODUCTION_URL = 'https://www.corazondefuego.com';

/** Dominios desde donde se aceptan formularios del panel. */
export const KNOWN_HOSTS = ['www.corazondefuego.com', 'corazondefuego.com', 'dev.corazondefuego.com', 'localhost', '127.0.0.1'];

/** URL base del sitio sin barra final. Sin SITE_URL, la del pedido. */
export const siteUrl = (requestUrl: URL) => (readEnv('SITE_URL') || requestUrl.origin).replace(/\/+$/, '');

/** Fuera de producción (dev, local) no se indexa. */
export const isIndexable = (requestUrl: URL) => {
  const host = new URL(siteUrl(requestUrl)).hostname;
  return host === 'www.corazondefuego.com' || host === 'corazondefuego.com';
};

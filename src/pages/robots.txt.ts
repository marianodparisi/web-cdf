/**
 * robots.txt: en producción se indexa todo menos el panel y la API; en dev
 * (o local) no se indexa nada, para que no compita con www en Google.
 */
import type { APIRoute } from 'astro';
import { isIndexable, siteUrl } from '../lib/site';

export const GET: APIRoute = ({ url }) => {
  const body = isIndexable(url)
    ? `User-agent: *\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${siteUrl(url)}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

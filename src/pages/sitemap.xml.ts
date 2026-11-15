/**
 * Mapa del sitio para Google: páginas fijas + ministerios, sedes y
 * devocionales tal como están cargados ahora. Las URLs usan el dominio de
 * SITE_URL (src/lib/site.ts).
 */
import type { APIRoute } from 'astro';
import { getDevotionals, getMinistries } from '../lib/content/collections';
import { anexos } from '../data/anexos';
import { siteUrl } from '../lib/site';

const fixedPages = [
  '/',
  '/nosotros',
  '/ministerios',
  '/anexos',
  '/devocional',
  '/misiones',
  '/evangelismo',
  '/contact',
  '/institucional/iete',
  '/institucional/discipulados',
];

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ url }) => {
  const base = siteUrl(url);
  const [ministries, devotionals] = await Promise.all([getMinistries(), getDevotionals()]);

  const paths = [
    ...fixedPages,
    ...ministries.map((m) => `/ministerios/${m.slug}`),
    ...anexos.map((a) => `/anexos/${a.slug}`),
    ...devotionals.map((d) => `/devocional/${d.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(paths)].map((p) => `  <url><loc>${escapeXml(base + p)}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};

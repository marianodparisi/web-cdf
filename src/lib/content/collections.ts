import { announcements, type Announcement } from '../../data/announcements';
import { devotionalPosts, type DevotionalPost } from '../../data/devotionals';
import { ministries, type Ministry } from '../../data/ministries';
import { sermonSeries, type SermonSeries } from '../../data/series';
import { safeHref } from '../safe-url';
import { createCollection } from './store';

/**
 * Colecciones editables desde el panel.
 *
 * Los archivos de `src/data/` siguen siendo la semilla: la primera vez que
 * arranca el server se copian a disco, y si un JSON se corrompe el sitio vuelve
 * a mostrarlos en lugar de caerse. Por eso no hay que borrarlos.
 */
export const devotionalsCollection = createCollection<DevotionalPost>({
  name: 'devocionales',
  seed: devotionalPosts,
});

export const announcementsCollection = createCollection<Announcement>({
  name: 'anuncios',
  seed: announcements,
});

export const seriesCollection = createCollection<SermonSeries>({
  name: 'series',
  seed: sermonSeries,
});

export const ministriesCollection = createCollection<Ministry>({
  name: 'ministerios',
  seed: ministries,
});

export const getDevotionals = () => devotionalsCollection.read();
/*
 * El href se vuelve a validar al leer: cubre lo que se guardó antes de que la
 * API lo controlara. Uno inválido queda vacío (en el panel aparece para
 * corregir, en el sitio no lleva a ningún lado).
 */
export const getAnnouncements = async () =>
  (await announcementsCollection.read()).map((item) => ({ ...item, href: safeHref(item.href) ?? '' }));
export const getSeries = async () =>
  (await seriesCollection.read()).map((item) => ({ ...item, href: safeHref(item.href) ?? '' }));

/**
 * Textos y datos de cada ministerio que se cambian sólo por código (pedido del
 * usuario): el panel ya no los edita. El JSON del servidor guarda una copia de
 * cuando se sembró, así que se toman siempre de src/data/ministries.ts; si
 * no, una corrección en el código nunca llegaría al sitio. Del disco quedan la
 * foto y las novedades, que sí se cargan desde el panel.
 */
const CODE_OWNED_MINISTRY_FIELDS = [
  'name', 'area', 'image', 'excerpt', 'description', 'participation', 'schedule',
  'meetingDay', 'meetingHours', 'place', 'mapUrl', 'whatsapp', 'instagram',
] as const satisfies readonly (keyof Ministry)[];

const withCodeOwnedFields = (stored: Ministry): Ministry => {
  const fromCode = ministries.find((m) => m.slug === stored.slug);
  if (!fromCode) return stored;
  const merged: Ministry = { ...stored };
  for (const field of CODE_OWNED_MINISTRY_FIELDS) {
    // Un dato opcional vacío en el código no pisa uno que ya esté guardado
    // (por ejemplo un WhatsApp cargado antes de que el panel dejara de editarlo).
    const value = fromCode[field];
    if (value !== undefined && value !== '') (merged as Record<string, unknown>)[field] = value;
  }
  return merged;
};

export const getMinistries = async () => (await ministriesCollection.read()).map(withCodeOwnedFields);

export const getDevotionalBySlug = async (slug?: string) =>
  (await getDevotionals()).find((post) => post.slug === slug) ?? null;

export const getMinistryBySlug = async (slug?: string) =>
  (await getMinistries()).find((ministry) => ministry.slug === slug) ?? null;

/**
 * Genera el slug a partir del título. Se calcula una sola vez, al crear: el
 * slug es la URL pública y cambiarlo rompe los links que ya circularon.
 */
export const slugify = (title: string) =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export const buildUniqueSlug = (title: string, taken: string[]) => {
  const base = slugify(title) || 'sin-titulo';
  if (!taken.includes(base)) return base;

  let suffix = 2;
  while (taken.includes(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
};

/** El panel edita los párrafos como un solo textarea separado por líneas en blanco. */
export const paragraphsToText = (paragraphs: string[]) => paragraphs.join('\n\n');

export const textToParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim().replace(/\s*\n\s*/g, ' '))
    .filter(Boolean);

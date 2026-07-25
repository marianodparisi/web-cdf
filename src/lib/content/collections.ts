import { announcements, type Announcement } from '../../data/announcements';
import { devotionalPosts, type DevotionalPost } from '../../data/devotionals';
import { ministries, type Ministry } from '../../data/ministries';
import { sermonSeries, type SermonSeries } from '../../data/series';
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
export const getAnnouncements = () => announcementsCollection.read();
export const getSeries = () => seriesCollection.read();
export const getMinistries = () => ministriesCollection.read();

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

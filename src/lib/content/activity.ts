import fs from 'node:fs/promises';
import path from 'node:path';
import { getHistoryDir } from './store';

/**
 * "Últimos cambios" del inicio del panel.
 *
 * Cada guardado deja una copia en `history/<colección>/<fecha>--<usuario>.json`
 * (ver store.ts). Acá sólo se leen los nombres de esos archivos: quién guardó,
 * qué colección y cuándo. No se abre ningún JSON, así que es liviano aunque
 * el historial sea largo.
 */
export interface ActivityItem {
  author: string;
  /** "devocionales", "anuncios", "series", "ministerios". */
  collection: string;
  at: Date;
}

const LABELS: Record<string, string> = {
  devocionales: 'Devocionales',
  anuncios: 'Anuncios',
  series: 'Series',
  ministerios: 'Ministerios y novedades',
};
export const collectionLabel = (name: string) => LABELS[name] ?? name;

/** `2026-10-23T19-48-28-123Z--mparisi.json` → fecha y autor. */
const parse = (collection: string, file: string): ActivityItem | null => {
  const match = file.match(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z(?:--([\w-]+))?\.json$/);
  if (!match) return null;
  const [, day, h, m, s, ms, author] = match;
  const at = new Date(`${day}T${h}:${m}:${s}.${ms}Z`);
  // Sin autor: el sembrado inicial del contenido, no lo hizo una persona.
  if (!author || Number.isNaN(at.getTime())) return null;
  return { author, collection, at };
};

export async function recentActivity(limit = 6): Promise<ActivityItem[]> {
  const root = getHistoryDir();
  let collections: string[];
  try {
    collections = await fs.readdir(root);
  } catch {
    return [];
  }
  const all = await Promise.all(
    collections.map(async (collection) => {
      try {
        const files = (await fs.readdir(path.join(root, collection))).sort().reverse().slice(0, limit * 3);
        return files.map((file) => parse(collection, file)).filter((item): item is ActivityItem => item !== null);
      } catch {
        return [];
      }
    }),
  );
  const items = all.flat().sort((a, b) => b.at.getTime() - a.at.getTime());
  // Varios guardados seguidos de la misma persona en la misma sección cuentan
  // como un solo cambio (pasa al subir y bajar series, por ejemplo).
  const merged: ActivityItem[] = [];
  for (const item of items) {
    const last = merged[merged.length - 1];
    if (last && last.author === item.author && last.collection === item.collection && last.at.getTime() - item.at.getTime() < 10 * 60 * 1000) continue;
    merged.push(item);
    if (merged.length >= limit) break;
  }
  return merged;
}

/** "hace 5 min", "hace 2 h", "ayer", "hace 3 días", "12 oct". */
export const timeAgo = (date: Date, now = new Date()) => {
  const minutes = Math.round((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return 'recién';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', timeZone: 'America/Argentina/Buenos_Aires' }).format(date);
};

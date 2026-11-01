import { getMinistries } from './collections';
import { ministryColors } from '../../data/ministry-colors';

/**
 * Catálogo de permisos del panel.
 *
 * Una sección es la unidad más chica que se le puede asignar a alguien. Los
 * ministerios se abren uno por uno (`ministerio:kids`) para que el líder de
 * Kids entre y vea solo lo suyo.
 */
export interface Section {
  key: string;
  label: string;
  /** Agrupa las secciones en el panel. */
  group: 'Contenido' | 'Ministerios';
  /** Ícono de Material Symbols, para las secciones fijas. */
  icon?: string;
  /** Logo propio, para los ministerios (sólo si es un archivo del sitio). */
  image?: string;
  /** Color del ministerio: sin logo propio, el panel muestra un esfumado. */
  color?: string;
}

export const FIXED_SECTIONS: Section[] = [
  { key: 'devocionales', label: 'Devocionales y testimonios', group: 'Contenido', icon: 'menu_book' },
  { key: 'anuncios', label: 'Anuncios del inicio', group: 'Contenido', icon: 'campaign' },
  { key: 'series', label: 'Series de predicación', group: 'Contenido', icon: 'video_library' },
];

export const ministrySectionKey = (slug: string) => `ministerio:${slug}`;

export const getSectionCatalog = async (): Promise<Section[]> => {
  const ministries = await getMinistries();

  return [
    ...FIXED_SECTIONS,
    ...ministries.map((ministry) => ({
      key: ministrySectionKey(ministry.slug),
      label: ministry.name,
      group: 'Ministerios' as const,
      image: ministry.image?.startsWith('/') ? ministry.image : undefined,
      color: ministryColors[ministry.slug] ?? '#c5a059',
    })),
  ];
};

export interface SessionLike {
  role: 'admin' | 'editor';
  sections: string[];
}

/** Un admin llega a todo; un editor solo a lo que le asignaron. */
export const canEditSection = (session: SessionLike | null | undefined, sectionKey: string) => {
  if (!session) return false;
  if (session.role === 'admin') return true;
  return session.sections.includes(sectionKey);
};

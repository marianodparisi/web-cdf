/**
 * Última publicación de Instagram de Arde y Kids.
 *
 * Por ahora es CONTENIDO DE MUESTRA, para que la sección no quede vacía
 * mientras se conecta la API (cuentas profesionales + app de Meta, ver
 * PROJECT_MEMORY). Cuando esté conectada, `latestInstagram` va a devolver lo
 * que traiga la API (cacheado y con las fotos guardadas en el servidor) y
 * esto queda sólo como respaldo.
 *
 * Los @ son provisorios: confirmar los usuarios reales de cada cuenta.
 */
export interface IgAccount {
  username: string;
  avatar: string;
  url: string;
}

export interface IgPost {
  type: 'image' | 'video' | 'carousel';
  /** Fotos; en un video, la primera es la portada. */
  media: string[];
  video?: string;
  caption: string;
  date: string;
  permalink: string;
}

type Slug = 'arde' | 'kids';

const muestra: Record<Slug, { account: IgAccount; post: IgPost }> = {
  arde: {
    account: { username: 'arde.cdf', avatar: '/ministries/arde/arde.png', url: 'https://www.instagram.com/arde.cdf/' },
    post: {
      type: 'carousel',
      media: ['/ministries/arde/arde1.png', '/ministries/arde/ardehero.png', '/ministries/arde/campaarde.jpg'],
      caption: '¡Así vivimos el Campa Arde 2026! 🔥\nGracias a cada uno de los que hicieron posible estos días. Deslizá para ver más fotos 👉',
      date: '2026-10-05T18:00:00Z',
      permalink: 'https://www.instagram.com/arde.cdf/',
    },
  },
  kids: {
    account: { username: 'kids.cdf', avatar: '/ministries/kids/kids.png', url: 'https://www.instagram.com/kids.cdf/' },
    post: {
      type: 'carousel',
      media: ['/ministries/kids/campakids.jpg', '/sanadosvertical.jpg', '/gozovertical.jpg'],
      caption: '¡Campa Kids: Escuela de Superhéroes! 🦸‍♀️🦸\nMirá todo lo que vivimos este fin de semana 👉',
      date: '2026-10-06T18:00:00Z',
      permalink: 'https://www.instagram.com/kids.cdf/',
    },
  },
};

export async function latestInstagram(slug: Slug) {
  return muestra[slug];
}

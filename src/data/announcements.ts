export interface Announcement {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export const announcements: Announcement[] = [
  {
    href: '/ministerios/gold',
    eyebrow: 'Destacado',
    title: 'Encuentro GOLD',
    description: 'Un tiempo especial para compartir palabra, compañerismo y crecimiento.',
    image: '/ministries/gold/goldanuncio.jpg',
    alt: 'Anuncio GOLD',
  },
  {
    href: '/ministerios/arde',
    eyebrow: 'Campa ARDE',
    title: 'Campamento ARDE',
    description: 'Una experiencia para adolescentes con amigos, palabra y dias que no se olvidan facil.',
    image: '/ministries/arde/campaarde.jpg',
    alt: 'Campamento ARDE',
  },
  {
    href: '/ministerios/kids',
    eyebrow: 'Campa Kids',
    title: 'Campamento Kids',
    description: 'Una aventura para que los chicos aprendan, jueguen y vivan la fe con alegria.',
    image: '/ministries/kids/campakids.jpg',
    alt: 'Campa Kids',
  },
];

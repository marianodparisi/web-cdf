export interface SermonSeries {
  title: string;
  subtitle: string;
  label: string;
  image: string;
  mobileImage?: string;
  href: string;
  description: string;
}

export const seriesPlaylistUrl = 'https://www.youtube.com/@Coraz%C3%B3ndeFuego/playlists';

export const sermonSeries: SermonSeries[] = [
  {
    title: 'Éxodo',
    subtitle: 'El camino hacia la libertad',
    label: 'Serie actual',
    image: '/series/exododesktop.jpg',
    mobileImage: '/series/exodomobile.jpg',
    href: 'https://www.youtube.com/playlist?list=PLbq3XgHcmjEtwhYdGCqO8PqbFY7EMFI5p',
    description:
      'Un recorrido por el libro de Éxodo para ver la fidelidad de Dios, la libertad y el camino hacia su propósito.',
  },
  {
    title: 'Sanados',
    subtitle: 'Restauración para el corazón',
    label: 'Serie anterior',
    image: '/sanadosvertical.jpg',
    href: 'https://www.youtube.com/playlist?list=PLbq3XgHcmjEv4unRsnKoJVVnt9yLDdv4T',
    description: 'Una serie para recibir sanidad, libertad y restauración en Jesús.',
  },
  {
    title: 'Descanso',
    subtitle: 'Serie febrero 2026',
    label: 'Serie anterior',
    image: '/descansovertical.jpg',
    href: 'https://www.youtube.com/playlist?list=PLbq3XgHcmjEuy20aDEPjbTu6MUZhOCUqG',
    description: 'Una serie para volver al ritmo de Dios y aprender a descansar en su presencia.',
  },
  {
    title: 'Pertenecer',
    subtitle: 'Una casa, una familia, un propósito',
    label: 'Serie anterior',
    image: '/pertenecervertical.jpg',
    href: 'https://www.youtube.com/playlist?list=PLbq3XgHcmjEt1a2mr2d-g7-z6tzo7C-HP',
    description: 'Una serie sobre identidad, familia espiritual y el llamado a caminar juntos.',
  },
  {
    title: 'Enviame',
    subtitle: 'Disponibles para responder al llamado',
    label: 'Serie anterior',
    image: '/enviamevertical.jpg',
    href: seriesPlaylistUrl,
    description: 'Una serie sobre disponibilidad, obediencia y misión.',
  },
  {
    title: 'Gozo',
    subtitle: 'La alegría que nace en Dios',
    label: 'Serie anterior',
    image: '/gozovertical.jpg',
    href: seriesPlaylistUrl,
    description: 'Una serie para redescubrir el gozo verdadero en Cristo.',
  },
];

export interface DevotionalPost {
  slug: string;
  title: string;
  type: 'Devocional' | 'Testimonio';
  weekLabel: string;
  image: string;
  excerpt: string;
  content: string[];
  videoUrl?: string;
}

export const devotionalPosts: DevotionalPost[] = [
  {
    slug: 'permanecer-en-la-palabra',
    title: 'Permanecer en la Palabra en medio de la semana',
    type: 'Devocional',
    weekLabel: 'Semana 1 - Marzo 2026',
    image: '/descanso.jpeg',
    excerpt: 'Una palabra corta para sostener el corazon en dias de ritmo intenso.',
    content: [
      'Cuando la semana se acelera, Dios sigue hablando con claridad. Este devocional nos recuerda volver a la Palabra antes de reaccionar por cansancio o presion.',
      'Tomate unos minutos para leer, orar y anotar una verdad que puedas aplicar hoy. La constancia en lo pequeno fortalece la fe para decisiones grandes.',
    ],
    videoUrl: 'https://www.youtube.com/live/t2G5MA5EWQc?si=4qoAU6x8huFRb5L_',
  },
  {
    slug: 'testimonio-restauracion-familiar',
    title: 'Testimonio de restauracion familiar',
    type: 'Testimonio',
    weekLabel: 'Semana 4 - Febrero 2026',
    image: '/gold.png',
    excerpt: 'Un hogar que encontro direccion en Cristo a traves de la oracion perseverante.',
    content: [
      'Durante meses, una familia de la casa atraveso conversaciones quebradas y distancia emocional. En comunidad, comenzaron a caminar un proceso de perdon y restauracion.',
      'Hoy comparten como la obediencia diaria y la palabra oportuna de Dios trajeron paz en su casa. Este testimonio apunta a que siempre hay esperanza en Jesus.',
    ],
  },
  {
    slug: 'corazon-disponible-para-servir',
    title: 'Corazon disponible para servir',
    type: 'Devocional',
    weekLabel: 'Semana 3 - Febrero 2026',
    image: '/arde.png',
    excerpt: 'Servir no es solo una tarea, es una forma de amar al cuerpo de Cristo.',
    content: [
      'Dios forma caracter mientras servimos con fidelidad. Lo que hacemos en secreto, con amor y orden, construye una iglesia mas saludable para todos.',
      'Esta semana te animamos a preguntar: Senor, donde queres que sirva y como puedo hacerlo con excelencia? La respuesta suele empezar con un paso simple.',
    ],
  },
  {
    slug: 'fe-en-tiempos-de-espera',
    title: 'Fe en tiempos de espera',
    type: 'Devocional',
    weekLabel: 'Semana 2 - Febrero 2026',
    image: '/kids.png',
    excerpt: 'La espera tambien puede ser un lugar de crecimiento y confianza.',
    content: [
      'Esperar no significa estar detenido. En Dios, la espera es una temporada donde El ajusta motivaciones, afirma promesas y fortalece nuestra confianza.',
      'Si estas esperando una respuesta, no sueltes la oracion. Mantene una vida de adoracion y palabra; Dios sigue obrando aun cuando no lo ves completo.',
    ],
    videoUrl: 'https://www.youtube.com/live/4Vc9WsM4SlY?si=T83Ax_e5yMpvljs-',
  },
];

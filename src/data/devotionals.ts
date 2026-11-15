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
    slug: 'el-tiempo-del-padre',
    title: 'El tiempo del Padre',
    type: 'Devocional',
    weekLabel: 'Malaquías 1:6-7',
    image: '/devocional/devocionalejemplo.jpg',
    excerpt: 'Dios no busca lo que sobra de nuestra vida. Como Padre y Señor, merece honra, temor reverente y lo más valioso de nuestro tiempo.',
    content: [
      'El hijo honra al padre, y él siervo a su señor. Si, pues, soy yo padre, ¿dónde está mi honra? y si soy señor, ¿dónde está mi temor? dice Jehová de los ejércitos a vosotros, oh sacerdotes, que menospreciais mi nombre. Y decís: ¿En qué hemos menospreciado tu nombre? En que ofrecéis sobre mi altar pan inmundo. Y dijisteis: ¿En qué te hemos deshonrado? En que pensáis que la mesa de Jehová es despreciable.',
      'Qué simpleza hay en lo que Dios demanda de nosotros, tan simple como honrarlo como Padre, en temerle como Señor nuestro. Él, que nos dió la vida que nos da aliento todos los días, ¿no puede recibir honra y temor de nuestra parte?',
      'Los sacerdotes en ese tiempo estaban apagados espiritualmente, no veían el templo de Jehová como algo santo, todo lo contrario, lo utilizaban para comerciar, y solo daban a Jehová lo que sobraba, animales defectuosos, ciegos, cojos.',
      'Lo importante es entender que a Dios no se le puede honrar dándole nuestro tiempo de sobra, o nuestro dinero que nos sobra. Él merece ser honrado y glorificado porque es nuestro Padre.',
      'Nuestra verdadera actitud frente a nuestro Padre eterno debe ser la de darle y entregarle lo valioso de nuestra vida. Él se lo merece y está esperando eso de nosotros como sus hijos.',
      'No desperdicies más tiempo, no dejes pasar un segundo más. Comienza a leer su palabra, a hablarle, presentarle tus cargas, y a adorarle. Comenzá un tiempo de padre e hijo.',
    ],
  },
  {
    slug: 'testimonio-restauracion-familiar',
    title: 'Testimonio de restauración familiar',
    type: 'Testimonio',
    weekLabel: 'Semana 4 - Febrero 2026',
    image: '/ministries/gold/gold.png',
    excerpt: 'Un hogar que encontró dirección en Cristo a través de la oración perseverante.',
    content: [
      'Durante meses, una familia de la casa atravesó conversaciones quebradas y distancia emocional. En comunidad, comenzaron a caminar un proceso de perdón y restauración.',
      'Hoy comparten cómo la obediencia diaria y la palabra oportuna de Dios trajeron paz en su casa. Este testimonio apunta a que siempre hay esperanza en Jesús.',
    ],
  },
  {
    slug: 'corazon-disponible-para-servir',
    title: 'Corazón disponible para servir',
    type: 'Devocional',
    weekLabel: 'Semana 3 - Febrero 2026',
    image: '/ministries/arde/arde.png',
    excerpt: 'Servir no es sólo una tarea, es una forma de amar al cuerpo de Cristo.',
    content: [
      'Dios forma carácter mientras servimos con fidelidad. Lo que hacemos en secreto, con amor y orden, construye una iglesia más saludable para todos.',
      'Esta semana te animamos a preguntar: ¿Señor, dónde querés que sirva y cómo puedo hacerlo con excelencia? La respuesta suele empezar con un paso simple.',
    ],
  },
  {
    slug: 'fe-en-tiempos-de-espera',
    title: 'Fe en tiempos de espera',
    type: 'Devocional',
    weekLabel: 'Semana 2 - Febrero 2026',
    image: '/ministries/kids/kids.png',
    excerpt: 'La espera también puede ser un lugar de crecimiento y confianza.',
    content: [
      'Esperar no significa estar detenido. En Dios, la espera es una temporada donde Él ajusta motivaciones, afirma promesas y fortalece nuestra confianza.',
      'Si estás esperando una respuesta, no sueltes la oración. Mantené una vida de adoración y palabra; Dios sigue obrando aun cuando no lo ves completo.',
    ],
    videoUrl: 'https://www.youtube.com/live/4Vc9WsM4SlY?si=T83Ax_e5yMpvljs-',
  },
];

/**
 * Contenido de las páginas Educativos (IETE y Discipulados).
 *
 * Vivía dentro de `src/pages/institucional/[slug].astro`. Pasó acá cuando cada
 * programa tuvo página y diseño propios (`institucional/iete.astro`,
 * `institucional/discipulados.astro`). Los textos son los de las páginas
 * originales del sitio; no editar sin autorización.
 */
export const educativos = {
  iete: {
    name: 'IETE',
    kicker: 'Programa de certificación',
    // Vino tomado del propio logo (color dominante del PNG), para que botones,
    // títulos y acentos de la página coincidan con la marca IETE.
    color: '#8e253f',
    logo: '/educativos/ietelogo.png',
    lead: 'Si tu sueño es servir en la iglesia, este lugar también es para ti.',
    lead2:
      'Si sentís un llamado a ser pastor o misionero, si deseás plantar iglesias, o si simplemente querés crecer para mejorar el mundo que te rodea, este espacio fue diseñado para ayudarte a dar ese siguiente paso.',
    statement: 'Formación integral para líderes cristianos en el mundo actual.',
    image: '/sedes/nosotros2.JPG',
    // Provisoria. El hero de IETE muestra el logo, así que `image` no llegaba
    // a verse en ningún lado; acá al menos corta la columna de texto.
    // No ilustra el programa: es una foto de archivo de la sede en obra. Se
    // reemplaza en cuanto haya material propio de las clases.
    banda: '/sedes/nosotros2.JPG',
    quees: [
      'IETE es un programa de certificación diseñado para personas que están considerando integrarse al ministerio como pastores, misioneros o líderes dentro de su iglesia local.',
      'También es una certificación ideal para quienes ya están activos en el ministerio y desean fortalecer su formación bíblica y su liderazgo.',
      'De igual manera, el programa está abierto a personas que no necesariamente estarán en el ministerio, pero que desean crecer en su liderazgo, profundizar en su conocimiento bíblico y desarrollar herramientas para impactar positivamente su entorno.',
    ],
    ejes: [
      'Teología sistemática',
      'Liderazgo de iglesia para la actualidad',
      'Cultura del Reino',
      'Plantación de iglesias',
      'Misiones',
      'Salud integral del ministro',
    ],
    ejesTitulo: 'Áreas del programa',
    ejesCierre:
      'Nuestro enfoque busca formar líderes con carácter, convicción y empatía, capaces de proclamar la verdad con argumentos sólidos y tener conversaciones reales con el mundo actual.',
    visionTitulo: 'Formamos líderes para vivir la verdad con profundidad y cercanía.',
    visionCierre:
      'Creemos que el liderazgo cristiano no solo se trata de proclamar la verdad, sino también de vivirla y encarnarla en la vida cotidiana.',
    columnas: [
      {
        n: '01',
        label: 'Sensibilidad pastoral',
        title: 'Capaces de acompañar.',
        text: 'Escuchar, comprender y acompañar a las personas con sensibilidad pastoral.',
      },
      {
        n: '02',
        label: 'Pertenencia',
        title: 'Arraigados en la iglesia local.',
        text: 'Comprometidos con servir junto a su comunidad.',
      },
      {
        n: '03',
        label: 'Convicción',
        title: 'Con fundamentos sólidos.',
        text: 'Firmes en la verdad bíblica, con argumentos sólidos y una fe bien fundamentada.',
      },
      {
        n: '04',
        label: 'Diálogo',
        title: 'Preparados para el mundo actual.',
        text: 'Conversaciones reales con la cultura contemporánea sin perder la esencia del Evangelio.',
      },
    ],
    datos: [
      { icon: 'schedule', label: 'Duración', value: 'Un año y medio aprox.' },
      { icon: 'laptop', label: 'Modalidad', value: '100% en línea' },
      { icon: 'person', label: 'Edad sugerida', value: 'Desde los 18 años' },
    ],
    paraQuien: [
      'Personas que sienten un llamado al ministerio',
      'Personas activas en el ministerio',
      'Líderes de equipos dentro de su iglesia local',
      'Personas que desean plantar iglesias',
      'Personas que desean crecer en su liderazgo',
      'Líderes en distintos ámbitos que desean expandir su conocimiento bíblico',
    ],
    incluye: ['Clases en línea', 'Asesorías en tiempo real', 'Contenido formativo semanal'],
    presenciales: ['Retiro de sanidad', 'Viaje misionero', 'Conferencia presencial', 'Masterclass especial'],
    ctaTitle: 'Quiero conocer más sobre IETE',
    ctaText: 'Déjanos tus datos y te compartimos información sobre el programa, la modalidad y el proceso de inscripción.',
  },

  discipulados: {
    name: 'Discipulados',
    kicker: 'Formación inicial',
    color: '#487a7c',
    logo: null,
    lead: 'Un espacio para dar tus primeros pasos firmes en el Evangelio.',
    lead2: null,
    statement: 'Formación inicial, cercana y práctica.',
    image: '/ministries/life/life1.jpg',
    // Distinta de la del hero: repetir la misma foto a media página no rompe
    // nada, sólo confirma que ya la viste.
    banda: '/ministries/life/life3.jpg',
    quees: [
      'Es un estudio pensado para acompañar a quienes están comenzando en la fe. Buscamos que cada persona pueda entender las bases del Evangelio y afirmar su relación con Jesús.',
      'No es un espacio académico como IETE, sino una instancia de formación inicial, cercana y práctica para crecer paso a paso dentro de la vida cristiana.',
    ],
    ejes: [
      'La Biblia — cómo leerla, entenderla y tomarla como base para la vida diaria.',
      'El Evangelio — la obra de Jesús, la salvación y una nueva vida en Cristo.',
      'Vida cristiana — oración, obediencia, comunión y crecimiento personal.',
      'Iglesia y servicio — cómo integrarse a la comunidad y caminar con propósito.',
    ],
    ejesTitulo: '¿Qué se trabaja?',
    ejesCierre: null,
    visionTitulo: 'Qué buscamos en cada persona que empieza.',
    visionCierre: null,
    columnas: [
      {
        n: '01',
        label: 'Enfoque',
        title: 'Fundamentos de la fe',
        text: 'Estudiamos la Biblia desde una base clara y pastoral para que cada nuevo creyente entienda el mensaje del Evangelio y pueda afirmarse en su nueva vida en Cristo.',
      },
      {
        n: '02',
        label: 'Modalidad',
        title: 'Clases los sábados',
        text: 'Las clases se desarrollan los sábados, en un formato simple y accesible, para avanzar semana a semana en temas centrales de la vida cristiana.',
      },
      {
        n: '03',
        label: 'Acompañamiento',
        title: 'Profesores diferentes',
        text: 'Cada etapa cuenta con distintos profesores, aportando perspectivas complementarias y ayudando a que el proceso sea más dinámico y enriquecedor.',
      },
    ],
    datos: [
      { icon: 'event', label: 'Cuándo', value: 'Sábados' },
      { icon: 'groups', label: 'Formato', value: 'Clases presenciales' },
      { icon: 'person', label: 'Para quién', value: 'Quienes están comenzando' },
    ],
    paraQuien: [
      'Si recibiste a Jesús hace poco',
      'Si estás empezando a conocer la Biblia',
      'Si necesitás ordenar tus bases en la fe',
    ],
    incluye: [] as string[],
    presenciales: [] as string[],
    ctaTitle: 'Quiero sumarme a Discipulados',
    ctaText: 'Si querés comenzar, conocer los horarios o recibir más información sobre las clases de los sábados, dejanos tus datos y nos comunicamos con vos.',
  },
} as const;

export type Educativo = (typeof educativos)[keyof typeof educativos];

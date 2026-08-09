export interface Ministry {
  // --- Ficha: sólo la edita un administrador. Se ve en el navbar, en la home y
  // en el listado de /ministerios, así que no es del ministerio solo.
  slug: string;
  name: string;
  area: string;
  image: string;
  excerpt: string;

  // --- Lo que edita quien lidera el ministerio, dentro de su propia página.
  description: string;
  participation: string;
  schedule: string;

  /**
   * Datos que cambian seguido. Son todos opcionales a propósito: el contenido
   * que ya está guardado en disco no los tiene, y cada página esconde el bloque
   * entero cuando vienen vacíos en lugar de mostrar un hueco.
   */
  meetingDay?: string;
  meetingHours?: string;
  place?: string;
  mapUrl?: string;
  noticeTitle?: string;
  noticeText?: string;
  whatsapp?: string;
  instagram?: string;
  photo?: string;
}

export const ministries: Ministry[] = [
  {
    slug: 'life',
    name: 'Life',
    area: 'Matrimonios jóvenes',
    image: '/ministries/life/life.png',
    excerpt: 'Un espacio para matrimonios jóvenes que quieren crecer juntos en amor, fe y comunidad.',
    description:
      'LIFE es una comunidad vibrante diseñada específicamente para matrimonios jóvenes que buscan fortalecer su relación y crecer en su caminar espiritual. Creemos que el matrimonio es un viaje emocionante que se vive mejor en compañía.',
    participation:
      'Es ideal para parejas que están comenzando su viaje juntas: recién casados de 0 a 10 años, con o sin hijos pequeños, y cualquiera que desee un matrimonio con propósito. No importa en qué etapa estén, siempre hay espacio para crecer.',
    schedule: 'Las reuniones son el corazón de LIFE: un ambiente relajado donde la conexión es lo primero.',
    meetingDay: 'Cada viernes',
    meetingHours: '19:30',
    place: 'A veces en el salon, a veces en el hogar de una pareja anfitriona.',
    instagram: 'https://www.instagram.com/corazondefuegoiglesia/',
  },
  {
    slug: 'gold',
    name: 'Gold',
    area: 'Parejas',
    image: '/ministries/gold/gold.png',
    excerpt: 'Un legado de luz fundado en el pacto eterno.',
    description:
      'GOLD Team no es solo un grupo, es un santuario para el crecimiento conyugal, donde cada pareja es una joya siendo pulida por el Creador.',
    participation:
      'Para parejas en crecimiento, recién casados que quieren establecer cimientos sólidos desde el primer día, y matrimonios veteranos que vienen a mentorear a nuevas generaciones mientras siguen nutriendo su propio pacto.',
    schedule: 'Cenas de Pacto, Retiros de Vida y Talleres de Forja: encuentros de renovación, desconexión y herramientas prácticas.',
    instagram: 'https://www.instagram.com/corazondefuegoiglesia/',
  },
  {
    slug: 'kids',
    name: 'Kids',
    area: 'Niños',
    image: '/ministries/kids/kids.png',
    excerpt: 'Un espacio donde cada niño descubre que es un héroe en la gran historia de Dios.',
    description:
      'Kids es un espacio vibrante donde cada niño descubre que es un héroe en la gran historia de Dios. Se divide en salitas por edad —3 a 4, 5 a 7 y 8 a 10 años—, y cada grupo comparte actividades pensadas para su edad, con enseñanza, juego y acompañamiento.',
    participation:
      'Los chicos se integran durante las reuniones generales, cada uno en su salita. Cada grupo tiene líderes que dirigen la enseñanza y ayudantes que reciben, contienen y acompañan durante toda la reunión.',
    schedule: 'Bienvenida, alabanza, enseñanza bíblica, actividad por edades y cierre, en un entorno cuidado y dinámico.',
    noticeTitle: 'Nueva aventura disponible',
  },
  {
    slug: 'arde',
    name: 'Arde',
    area: 'Adolescentes',
    image: '/ministries/arde/arde.png',
    excerpt: 'Una comunidad donde los adolescentes descubren su identidad y viven su fe con pasión.',
    description:
      'Arde es la reunión de adolescentes de la casa. Somos una comunidad donde los adolescentes descubren su identidad, construyen amistades reales y viven su fe con pasión, entre amistad, mentoría, música y eventos.',
    participation:
      'Es para adolescentes de 11 a 18 años. No importa de dónde vengas ni en qué creas: acá siempre hay un lugar para vos.',
    schedule: 'Encuentros de adolescentes en Sede Gaona, con eventos y salidas especiales.',
    meetingDay: 'Sabados',
    meetingHours: '18:00 a 20:00 hs',
    place: 'Av. Pres. Peron 251\nB1706 Villa Sarmiento, Provincia de Buenos Aires',
    mapUrl: 'https://maps.app.goo.gl/nbkxbz89Rt92Aqx78',
    noticeTitle: 'Se viene el campamento de ARDE',
    noticeText: 'Si formás parte de ARDE, este campa es para vos. Un tiempo para desconectarte de lo de siempre, encontrar a Dios de una forma real y vivir algo fuerte con tu grupo.',
  },
  {
    slug: 'carcelario',
    name: 'Ministerio Carcelario',
    area: 'Restauracion',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHZ33zm0Bs_C_OrpCQi9xRm6PBscs-Wxps3Cv0_KQGUbVgy52G5MRZgfOhN4zgt44-ml47ou4i38rhzMxJ9EM1UWlT3BkNdxAC6Mstlc1c5U51Vd1L7SuLtCeZyZL4jjoHhT2OpAA-Ag0I_gEq3OKNwDfPFf7HJ0nOx9rfFnZ06j1HL1Os7abB6JPzmwRsTbpsaDAA1G7u-hbg2mkmStCVpQ4rps5UcsaOszL1yQrbw70xavRVpTiqSajlJ8W5EI7zQaufTPS5mYI',
    excerpt: 'Esperanza, palabra y acompanamiento en contextos de encierro.',
    description:
      'El Ministerio Carcelario visita unidades penitenciarias para compartir la Palabra, orar y acompanar procesos de restauracion espiritual.',
    participation:
      'Pueden sumarse personas con corazon pastoral, disposicion para servir y compromiso con el acompanamiento responsable.',
    schedule: 'Visitas programadas, preparacion previa y seguimiento pastoral durante el mes.',
  },
  {
    slug: 'firmes-y-adelante',
    name: 'Firmes y Adelante',
    area: 'Hombres y matrimonios',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeBRG3ZZOh247H-gEOZFvzjIHB4Lw5aCuXHgEA0N-6qAJ5PRGNQ7b852erovJwkMMLFTJQ1s4QZFGiRpsyop_fzpXLMobVSw5oYv2W6UU1OfPh8sIBusDjfyQjzpSwteKc65fb8OeFkcl30S3LCrMQBGmcNvd57kBzbwTfAaoHZwYxfi3bcZF0f57kUhfmKRCResG6crO7M0tP5LHSKEI_Aul3yIc3mjPEerL9YkX72F-szmtElrRwnaSZlmAjZ97l0-q0NHwm9Pg',
    excerpt: 'Un espacio para fortalecer hombres y matrimonios con base en la Palabra.',
    description:
      'Firmes y Adelante acompana procesos de crecimiento para hombres y matrimonios, promoviendo unidad, madurez espiritual y liderazgo saludable en el hogar.',
    participation:
      'Pueden sumarse varones y matrimonios de la casa. Hay espacios de mentoreo, consejeria y comunion para caminar cada etapa.',
    schedule: 'Reuniones periodicas, grupos de discipulado y jornadas especiales.',
  },
];

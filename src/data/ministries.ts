export interface Ministry {
  slug: string;
  name: string;
  area: string;
  image: string;
  excerpt: string;
  description: string;
  participation: string;
  schedule: string;
}

export const ministries: Ministry[] = [
  {
    slug: 'life',
    name: 'Life',
    area: 'Jovenes',
    image: '/life.png',
    excerpt: 'Un espacio para jovenes que quieren crecer en fe, identidad y proposito.',
    description:
      'Life es el ministerio de jovenes de nuestra casa. Nos reunimos para adorar, aprender la Palabra y construir amistades sanas que nos acerquen mas a Jesus.',
    participation:
      'Si tenes entre 13 y 25 anos, podes sumarte en cualquier encuentro. Tambien hay equipos de servicio, discipulado y acompanamiento pastoral.',
    schedule: 'Reuniones semanales y encuentros especiales durante el mes.',
  },
  {
    slug: 'gold',
    name: 'Gold',
    area: 'Mujeres',
    image: '/gold.png',
    excerpt: 'Mujeres que se fortalecen en la Palabra, oracion y comunion.',
    description:
      'Gold es un ministerio enfocado en afirmar la identidad de la mujer en Cristo. Promovemos sanidad interior, crecimiento espiritual y liderazgo en cada temporada de vida.',
    participation:
      'Todas las mujeres pueden participar. Contamos con reuniones generales, grupos pequenos y actividades especiales para acompanar cada proceso.',
    schedule: 'Encuentros periodicos, talleres y jornadas de oracion.',
  },
  {
    slug: 'kids',
    name: 'Kids',
    area: 'Ninos',
    image: '/kids.png',
    excerpt: 'Formacion biblica para ninos en un ambiente seguro y alegre.',
    description:
      'Kids acompana a los mas pequenos para que conozcan a Jesus desde temprana edad. Ensenamos con dinamicas, musica, juegos y lecciones adaptadas por edades.',
    participation:
      'Los ninos pueden integrarse durante las reuniones generales. Tambien recibimos voluntarios con corazon pastoral para servir en el equipo.',
    schedule: 'Actividades para ninos durante los servicios y eventos familiares.',
  },
  {
    slug: 'arde',
    name: 'Arde',
    area: 'Evangelismo',
    image: '/arde.png',
    excerpt: 'Un equipo activo para llevar el Evangelio a la ciudad.',
    description:
      'Arde impulsa la mision de salir, anunciar y servir. Nos movemos en acciones de evangelismo, ayuda comunitaria y alcance territorial con el mensaje de Cristo.',
    participation:
      'Cualquier persona con deseo de compartir su fe puede sumarse. Brindamos capacitacion practica y acompanamiento para cada salida.',
    schedule: 'Salidas regulares, acciones comunitarias y campanas especiales.',
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
    slug: 'alabanza-y-adoracion',
    name: 'Alabanza y Adoración',
    area: 'Adoración',
    image: '/nosotros1.JPG',
    excerpt: 'Un equipo que sirve guiando a la iglesia en alabanza y adoración.',
    description:
      'El Ministerio de Alabanza y Adoración prepara y acompana los tiempos congregacionales para exaltar a Jesus con excelencia, sensibilidad y unidad.',
    participation:
      'Pueden sumarse musicos, cantantes y servidores con compromiso espiritual, disposicion para ensayar y corazon de adoracion.',
    schedule: 'Ensayos, reuniones de preparacion y servicio durante los encuentros generales.',
  },
  {
    slug: 'multimedia',
    name: 'Multimedia',
    area: 'Comunicacion',
    image: '/serie.png',
    excerpt: 'Servicio tecnico y creativo para comunicar lo que Dios hace en la casa.',
    description:
      'Multimedia acompana cada reunion y proyecto desde sonido, pantallas, transmision, fotografia, video y comunicacion visual.',
    participation:
      'Pueden sumarse personas con experiencia tecnica o ganas de aprender en equipos de sonido, camaras, streaming, diseno y contenido.',
    schedule: 'Servicio en reuniones, eventos especiales y espacios de capacitacion por equipo.',
  },
  {
    slug: 'protocolo',
    name: 'Protocolo',
    area: 'Servicio',
    image: '/nosotros2.JPG',
    excerpt: 'Recepcion, orden y cuidado para que cada persona se sienta bienvenida.',
    description:
      'Protocolo sirve en la bienvenida, orientacion y organizacion de los encuentros, cuidando los detalles practicos de cada reunion.',
    participation:
      'Pueden sumarse personas con actitud de servicio, amabilidad, responsabilidad y deseo de recibir bien a cada familia.',
    schedule: 'Servicio durante reuniones generales, eventos especiales y coordinaciones previas.',
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

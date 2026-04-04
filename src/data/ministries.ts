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

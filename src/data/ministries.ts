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
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGvlfxoZ2T0HVvzaJK4f6loCzk_BzLERbiD7SFld9M1VhIEDpk0XOmNtwpc52ne1l43m_NLjZa7xQ2DeGu77uNcdw70hFpyi02TsvaRA4pwHsGD1bVRbSRoa8mpvK0QN6UFkt37htyl9ZsJ4pZ74yVv3QEQ0V0kpaUvQ1AvtrNN11axWFfEy3Eqfb2RIi3mAV_hdrcbhiv9sV22LcNnJp2YcGOl4VpRWvG7F6jtwOEdH8lDpAlhLk9lhHMlmZbPx8S5KcJWm4J9fY',
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
    slug: 'firmes',
    name: 'Firmes',
    area: 'Hombres',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeBRG3ZZOh247H-gEOZFvzjIHB4Lw5aCuXHgEA0N-6qAJ5PRGNQ7b852erovJwkMMLFTJQ1s4QZFGiRpsyop_fzpXLMobVSw5oYv2W6UU1OfPh8sIBusDjfyQjzpSwteKc65fb8OeFkcl30S3LCrMQBGmcNvd57kBzbwTfAaoHZwYxfi3bcZF0f57kUhfmKRCResG6crO7M0tP5LHSKEI_Aul3yIc3mjPEerL9YkX72F-szmtElrRwnaSZlmAjZ97l0-q0NHwm9Pg',
    excerpt: 'Hombres edificados para liderar con integridad en familia y sociedad.',
    description:
      'Firmes busca formar hombres maduros en Cristo, con caracter, convicciones y responsabilidad espiritual. Trabajamos relaciones sanas, paternidad y liderazgo piadoso.',
    participation:
      'Esta abierto para varones de todas las edades. Hay espacios de mentoreo, palabra y companerismo para crecer juntos.',
    schedule: 'Reuniones mensuales, grupos de discipulado y retiros.',
  },
  {
    slug: 'carcelario',
    name: 'Carcelario',
    area: 'Misiones',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHZ33zm0Bs_C_OrpCQi9xRm6PBscs-Wxps3Cv0_KQGUbVgy52G5MRZgfOhN4zgt44-ml47ou4i38rhzMxJ9EM1UWlT3BkNdxAC6Mstlc1c5U51Vd1L7SuLtCeZyZL4jjoHhT2OpAA-Ag0I_gEq3OKNwDfPFf7HJ0nOx9rfFnZ06j1HL1Os7abB6JPzmwRsTbpsaDAA1G7u-hbg2mkmStCVpQ4rps5UcsaOszL1yQrbw70xavRVpTiqSajlJ8W5EI7zQaufTPS5mYI',
    excerpt: 'Llevamos esperanza, restauracion y acompanamiento a contextos de encierro.',
    description:
      'El ministerio carcelario visita instituciones para compartir el Evangelio, orar y acompanar procesos de restauracion. Servimos con amor, respeto y compromiso continuo.',
    participation:
      'Se puede participar en visitas, intercesion y apoyo logistico. El equipo recibe lineamientos especificos para servir de manera ordenada y responsable.',
    schedule: 'Visitas programadas y actividades de seguimiento pastoral.',
  },
];

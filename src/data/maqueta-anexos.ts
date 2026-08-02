/**
 * Datos de las sedes para la MAQUETA.
 *
 * Extraídos de las páginas reales de `src/pages/anexos/*.astro`, donde hoy
 * viven como props sueltas de `AnexoTemplate`. Acá quedan como datos para que
 * la maqueta pueda recorrerlos con una sola ruta dinámica.
 *
 * Es un archivo de la maqueta: si el rediseño avanza, esto reemplaza a las
 * cinco páginas y pasa a ser la fuente única.
 */
export interface MaquetaAnexo {
  slug: string;
  name: string;
  subtitle: string;
  heroImage: string;
  storyImage: string;
  storyTitle: string;
  storyParagraphs: string[];
  yearsValue: string;
  yearsLabel: string;
  localValue: string;
  localLabel: string;
  locationTitle: string;
  addressLines: string[];
  meetingsLines: string[];
  ctaTitle: string;
  ctaText: string;
  color: string;
}

export const maquetaAnexos: MaquetaAnexo[] = [
  {
    slug: 'palito',
    name: 'Palito',
    subtitle: 'Un espacio donde la vida cotidiana y la esperanza se encuentran para caminar en comunidad.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB908V11_FIakv8e3l1tLYBeF1KgdFnipoOlkTF4ZFjgUq8rK_M9YlMQOrMeAfguPkfGt5MsHrqbCw1mtQmyugn_5HdLrPOgNM8l9YD7ddMmngIK49UOQP0x-6GjzrrMs7nS7rgHHAzc9mj-gb6f8hy110_5sEeHyRw_Tbj0CWVduSOHLWF3A6a_NM_q_ox89Yc96BN3cTKwByl1tyTZPPqK75l55gpKUMl6AnBripRHTH-KzTd_TOrgv60fIBv9nJEivbWkIOURzA',
    storyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfUq8CHRcb6ZNX-xKFKh6QvOXKkK7fACA_SPrcINKk5w5yDa460qCtqP76drLxLO5XwI5olAiSXY7_9gPsyvpVI-2IVer2mQhyWUnZg3Tb66GTtnGwZWWXx-_RKV92tT8KmMvjA4KY8cA2FCgU7hlpmWKyOJuW_iFPuOuZjNIKs1DVGT8lRiVQG3jm5AtzZevAatB62YC4Il1SN8wkNpRGzyH0WFkOkPhMAHR5haFSHy51B9z6OY1VJuS3rvXJ5uYMaJbfUuF5vz4',
    storyTitle: 'Una obra que avanza con cercanía y perseverancia.',
    storyParagraphs: ['Palito es una sede que sigue creciendo con pasos firmes, sosteniendo una vida comunitaria simple pero profundamente significativa. Aquí, cada encuentro fortalece vínculos y abre nuevas puertas para servir.', 'La sede se fue consolidando como un espacio de referencia para quienes buscan una iglesia cercana, una palabra oportuna y una comunidad que acompaña con constancia en cada temporada.'],
    yearsValue: '3+',
    yearsLabel: 'Años avanzando',
    localValue: '100%',
    localLabel: 'Presencia barrial',
    locationTitle: 'Una casa abierta para Palito.',
    addressLines: ['Pasaje Esperanza 87', 'Palito, Santa Fe'],
    meetingsLines: ['Sábados — 19:30 PM', 'Reuniones especiales durante el mes'],
    ctaTitle: 'Una sede que crece con su gente.',
    ctaText: 'Palito sigue afirmando su identidad con una comunidad servicial, hospitalaria y lista para recibir a quienes desean conectar con Dios y con otros.',
    color: '#b87a3c',
  },
  {
    slug: 'ramos-mejia',
    name: 'Ramos Mejía',
    subtitle: 'Nuestra sede principal, un lugar de encuentro, adoracion y formacion para toda la familia.',
    heroImage: '/sedes/nosotros1.JPG',
    storyImage: '/sedes/nosotros2.JPG',
    storyTitle: 'Una casa para adorar, crecer y servir juntos.',
    storyParagraphs: ['En Ramos Mejía nos reunimos como familia para buscar a Dios, recibir palabra, adorar y caminar procesos de formacion espiritual.', 'Desde esta sede se acompanan ministerios, equipos de servicio, espacios de discipulado y acciones que bendicen a la ciudad y a otras localidades.'],
    yearsValue: 'Casa',
    yearsLabel: 'Sede principal',
    localValue: 'CDF',
    localLabel: 'Familia de fe',
    locationTitle: 'Te esperamos en Ramos Mejía.',
    addressLines: ['Leandro N. Alem 467', 'Ramos Mejía, Buenos Aires'],
    meetingsLines: ['Domingos — reuniones generales', 'Actividades ministeriales durante la semana'],
    ctaTitle: 'Un lugar para encontrarte con Dios.',
    ctaText: 'La Sede Ramos Mejía es una casa abierta para cada persona y familia que quiere crecer en fe, comunidad y servicio.',
    color: '#c5a059',
  },
  {
    slug: 'rojas',
    name: 'Rojas',
    subtitle: 'Un lugar de encuentro y esperanza en el corazón de nuestra ciudad.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB908V11_FIakv8e3l1tLYBeF1KgdFnipoOlkTF4ZFjgUq8rK_M9YlMQOrMeAfguPkfGt5MsHrqbCw1mtQmyugn_5HdLrPOgNM8l9YD7ddMmngIK49UOQP0x-6GjzrrMs7nS7rgHHAzc9mj-gb6f8hy110_5sEeHyRw_Tbj0CWVduSOHLWF3A6a_NM_q_ox89Yc96BN3cTKwByl1tyTZPPqK75l55gpKUMl6AnBripRHTH-KzTd_TOrgv60fIBv9nJEivbWkIOURzA',
    storyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfUq8CHRcb6ZNX-xKFKh6QvOXKkK7fACA_SPrcINKk5w5yDa460qCtqP76drLxLO5XwI5olAiSXY7_9gPsyvpVI-2IVer2mQhyWUnZg3Tb66GTtnGwZWWXx-_RKV92tT8KmMvjA4KY8cA2FCgU7hlpmWKyOJuW_iFPuOuZjNIKs1DVGT8lRiVQG3jm5AtzZevAatB62YC4Il1SN8wkNpRGzyH0WFkOkPhMAHR5haFSHy51B9z6OY1VJuS3rvXJ5uYMaJbfUuF5vz4',
    storyTitle: 'Cinco años siendo luz para nuestra ciudad.',
    storyParagraphs: ['Lo que comenzó como un pequeño grupo de vecinos con el deseo de compartir fe y compañerismo, se ha transformado en una comunidad vibrante que late al ritmo de Rojas.', 'A lo largo de estos más de 5 años de crecimiento, hemos visto cómo las pequeñas semillas de bondad se convierten en raíces profundas. Hoy, la Sede Rojas no es solo un edificio, es un faro local que acompaña, sostiene y celebra la vida de cada familia que cruza nuestras puertas.'],
    yearsValue: '5+',
    yearsLabel: 'Años creciendo',
    localValue: '100%',
    localLabel: 'Corazón local',
    locationTitle: 'Te esperamos en el corazón de Rojas.',
    addressLines: ['Calle Principal 1234', 'Ciudad de Rojas, CP 2705'],
    meetingsLines: ['Domingos — 10:00 AM y 19:00 PM'],
    ctaTitle: 'Una mesa abierta para cada familia.',
    ctaText: 'La Sede Rojas sigue creciendo con una visión sencilla: crear un lugar cercano donde cada persona pueda encontrar fe, comunidad y esperanza.',
    color: '#775a19',
  },
  {
    slug: 'santos-vega',
    name: 'Santos Vega',
    subtitle: 'Un espacio de calma, fe y comunidad para seguir construyendo esperanza en la ciudad.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB908V11_FIakv8e3l1tLYBeF1KgdFnipoOlkTF4ZFjgUq8rK_M9YlMQOrMeAfguPkfGt5MsHrqbCw1mtQmyugn_5HdLrPOgNM8l9YD7ddMmngIK49UOQP0x-6GjzrrMs7nS7rgHHAzc9mj-gb6f8hy110_5sEeHyRw_Tbj0CWVduSOHLWF3A6a_NM_q_ox89Yc96BN3cTKwByl1tyTZPPqK75l55gpKUMl6AnBripRHTH-KzTd_TOrgv60fIBv9nJEivbWkIOURzA',
    storyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfUq8CHRcb6ZNX-xKFKh6QvOXKkK7fACA_SPrcINKk5w5yDa460qCtqP76drLxLO5XwI5olAiSXY7_9gPsyvpVI-2IVer2mQhyWUnZg3Tb66GTtnGwZWWXx-_RKV92tT8KmMvjA4KY8cA2FCgU7hlpmWKyOJuW_iFPuOuZjNIKs1DVGT8lRiVQG3jm5AtzZevAatB62YC4Il1SN8wkNpRGzyH0WFkOkPhMAHR5haFSHy51B9z6OY1VJuS3rvXJ5uYMaJbfUuF5vz4',
    storyTitle: 'Esperanza firme para servir y acompañar.',
    storyParagraphs: ['Santos Vega nació con el deseo de levantar una comunidad cercana, sensible y disponible para acompañar a cada persona en su caminar. Su crecimiento refleja constancia, servicio y una profunda vocación pastoral.', 'Cada reunión fortalece el sentido de pertenencia y abre nuevas oportunidades para compartir la fe en el barrio, creando una identidad serena pero firme que sigue impactando la vida de muchas familias.'],
    yearsValue: '2+',
    yearsLabel: 'Años sirviendo',
    localValue: '100%',
    localLabel: 'Comunidad presente',
    locationTitle: 'Un lugar de paz para Santos Vega.',
    addressLines: ['Ruta de la Fe 56', 'Santos Vega, Santa Fe'],
    meetingsLines: ['Domingos — 18:30 PM', 'Encuentros comunitarios durante la semana'],
    ctaTitle: 'Una comunidad que acompaña con calma y verdad.',
    ctaText: 'Santos Vega sigue afirmando una presencia cercana y confiable, siendo un espacio donde la fe se comparte con profundidad, ternura y visión.',
    color: '#7d9aa0',
  },
  {
    slug: 'villa-minetti',
    name: 'Villa Minetti',
    subtitle: 'Una comunidad cercana que abraza la fe, la amistad y el servicio en cada encuentro.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB908V11_FIakv8e3l1tLYBeF1KgdFnipoOlkTF4ZFjgUq8rK_M9YlMQOrMeAfguPkfGt5MsHrqbCw1mtQmyugn_5HdLrPOgNM8l9YD7ddMmngIK49UOQP0x-6GjzrrMs7nS7rgHHAzc9mj-gb6f8hy110_5sEeHyRw_Tbj0CWVduSOHLWF3A6a_NM_q_ox89Yc96BN3cTKwByl1tyTZPPqK75l55gpKUMl6AnBripRHTH-KzTd_TOrgv60fIBv9nJEivbWkIOURzA',
    storyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfUq8CHRcb6ZNX-xKFKh6QvOXKkK7fACA_SPrcINKk5w5yDa460qCtqP76drLxLO5XwI5olAiSXY7_9gPsyvpVI-2IVer2mQhyWUnZg3Tb66GTtnGwZWWXx-_RKV92tT8KmMvjA4KY8cA2FCgU7hlpmWKyOJuW_iFPuOuZjNIKs1DVGT8lRiVQG3jm5AtzZevAatB62YC4Il1SN8wkNpRGzyH0WFkOkPhMAHR5haFSHy51B9z6OY1VJuS3rvXJ5uYMaJbfUuF5vz4',
    storyTitle: 'Una comunidad que crece con constancia y ternura.',
    storyParagraphs: ['En Villa Minetti venimos construyendo un espacio donde la fe se vive de forma sencilla, cercana y real. Cada reunión abre la puerta a nuevas amistades, nuevas historias y nuevas oportunidades para acompañarnos.', 'Con el paso del tiempo, esta sede se convirtió en un punto de referencia para familias, jóvenes y vecinos que buscan una comunidad con raíces profundas, visión clara y una presencia amorosa en la ciudad.'],
    yearsValue: '4+',
    yearsLabel: 'Años sembrando',
    localValue: '100%',
    localLabel: 'Compromiso local',
    locationTitle: 'Un punto de encuentro para Villa Minetti.',
    addressLines: ['Av. del Encuentro 245', 'Villa Minetti, Santa Fe'],
    meetingsLines: ['Domingos — 10:30 AM', 'Miércoles — 20:00 PM'],
    ctaTitle: 'Fe sencilla, comunidad real.',
    ctaText: 'Villa Minetti sigue creciendo con una identidad cálida y servicial, ofreciendo un espacio donde todos pueden sentirse parte desde el primer día.',
    color: '#8f6b4f',
  },
];

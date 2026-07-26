import type { Ministry } from '../../data/ministries';

/**
 * Los datos prácticos de cada ministerio (día, lugar, contacto) los carga quien
 * lo lidera, no un programador. Así que hay que aceptar lo que una persona
 * escribiría de verdad — "11 5555-5555", "@arde.cdf", un link pegado del
 * navegador — y armar el href acá en vez de pedirle una URL bien formada.
 */

const clean = (value?: string) => value?.trim() || '';

/** Argentina: si el número no trae país, se le antepone 54. */
const AR_COUNTRY_CODE = '54';

/**
 * Un link pegado a mano suele venir sin `https://`, y así el navegador lo trata
 * como una ruta del propio sitio y el botón lleva a un 404.
 */
export const externalHref = (value?: string) => {
  const raw = clean(value);
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

export const whatsappHref = (value?: string) => {
  const raw = clean(value);
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;

  const digits = raw.replace(/\D/g, '');
  if (digits.length < 8) return '';

  return `https://wa.me/${digits.startsWith(AR_COUNTRY_CODE) ? digits : AR_COUNTRY_CODE + digits}`;
};

export const instagramHref = (value?: string) => {
  const raw = clean(value);
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;

  const user = raw.replace(/^@/, '').replace(/\/+$/, '');
  return user ? `https://www.instagram.com/${user}/` : '';
};

/** La dirección se escribe en varias líneas y se respetan tal cual. */
export const placeLines = (value?: string) =>
  clean(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

/** El aviso se muestra sólo si tiene título; el texto es opcional. */
export const hasNotice = (ministry: Pick<Ministry, 'noticeTitle'>) => Boolean(clean(ministry.noticeTitle));

/**
 * Un bloque de horario necesita al menos uno de los dos campos: hay ministerios
 * que se juntan un día fijo sin hora fija y al revés.
 */
export const hasSchedule = (ministry: Pick<Ministry, 'meetingDay' | 'meetingHours'>) =>
  Boolean(clean(ministry.meetingDay) || clean(ministry.meetingHours));

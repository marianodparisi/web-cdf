/**
 * Fecha de fin opcional de anuncios y novedades ("Mostrar hasta").
 *
 * Se guarda como `YYYY-MM-DD` (lo que manda un `<input type="date">`). El
 * aviso se ve hasta ese día inclusive, en hora de Argentina, y después deja de
 * mostrarse solo. No se borra: en el panel queda marcado como vencido y se
 * reactiva cambiando o vaciando la fecha.
 */
const TZ = 'America/Argentina/Buenos_Aires';
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Hoy en Argentina como `YYYY-MM-DD` (en-CA formatea justo así). */
export const todayAR = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);

/** Normaliza lo que llega del formulario: una fecha válida o nada. */
export const readEndDate = (value: unknown): string | undefined => {
  const text = String(value ?? '').trim();
  return DATE.test(text) ? text : undefined;
};

/** Sin fecha, siempre activo. Con fecha, activo hasta ese día inclusive. */
export const isActive = (endDate?: string, now = new Date()) => !endDate || !DATE.test(endDate) || todayAR(now) <= endDate;

/** "12 de octubre" para mostrar en el panel. */
export const formatEndDate = (endDate: string) =>
  new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${endDate}T12:00:00Z`));

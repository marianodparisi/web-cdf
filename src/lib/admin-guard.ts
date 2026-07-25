import type { AdminSession } from './admin-auth';

/**
 * El middleware ya bloqueó todo `/admin` y `/api/admin`, así que si llegamos
 * acá hay sesión. Esto solo la estrecha para TypeScript.
 */
export const getSession = (locals: App.Locals): AdminSession => {
  const session = locals.adminSession;
  if (!session) throw new Error('Ruta de admin sin sesión: revisar el middleware');
  return session;
};

export const canEdit = (session: AdminSession, sectionKey: string) =>
  session.role === 'admin' || session.sections.includes(sectionKey);

/** Para páginas: manda al panel con un mensaje en vez de tirar un 403 seco. */
export const denyRedirect = (message: string) => backTo('/admin', { error: message });

/** Vuelve a la pantalla de la que vino el formulario, con el cartel que corresponda. */
export const backTo = (path: string, feedback: { ok?: string; error?: string }) => {
  const params = new URLSearchParams();
  if (feedback.ok) params.set('ok', feedback.ok);
  if (feedback.error) params.set('error', feedback.error);

  const query = params.toString();
  return new Response(null, {
    status: 303,
    headers: { Location: query ? `${path}?${query}` : path },
  });
};

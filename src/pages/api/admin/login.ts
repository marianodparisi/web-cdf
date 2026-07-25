import type { APIRoute } from 'astro';
import {
  authenticateAdmin,
  createAdminSessionValue,
  getAdminSessionCookie,
} from '../../../lib/admin-auth';

const getLoginErrorCode = (error: unknown) => {
  const message = error instanceof Error ? error.message : '';
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  if (message.startsWith('Missing required env var:')) return 'env';
  if (code === 'ER_ACCESS_DENIED_ERROR' || message.includes('Access denied')) return 'db-auth';
  if (['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH'].includes(code)) {
    return 'db-connection';
  }

  return 'server';
};

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  try {
    const formData = await request.formData();
    const identifier = String(formData.get('identifier') || '').trim();
    const password = String(formData.get('password') || '');

    if (!identifier || !password) {
      return redirect('/admin/login?error=1');
    }

    const user = await authenticateAdmin(identifier, password);
    if (!user) {
      return redirect('/admin/login?error=1');
    }

    cookies.set(getAdminSessionCookie(), createAdminSessionValue(user.username), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      maxAge: 60 * 60 * 8,
    });

    // Antes apuntaba a /admin/index.html, que era la SPA estática de Tina.
    return redirect('/admin');
  } catch (error) {
    console.error('Admin login error:', error);
    return redirect(`/admin/login?error=${getLoginErrorCode(error)}`);
  }
};

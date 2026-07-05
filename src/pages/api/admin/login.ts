import type { APIRoute } from 'astro';
import {
  authenticateAdmin,
  createAdminSessionValue,
  getAdminSessionCookie,
} from '../../../lib/admin-auth';

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

    return redirect('/admin/index.html');
  } catch (error) {
    console.error('Admin login error:', error);
    return redirect('/admin/login?error=server');
  }
};

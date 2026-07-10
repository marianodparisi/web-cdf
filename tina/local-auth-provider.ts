export const defineConfig = <TConfig>(config: TConfig) => config;

const loginPath = '/admin/login';
const sessionPath = '/api/admin/session';

const hasAdminSession = async () => {
  if (typeof window === 'undefined') {
    return true;
  }

  const response = await fetch(sessionPath, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  }).catch(() => undefined);

  return response?.ok === true;
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.replace(loginPath);
  }
};

export class LocalAuthProvider {
  async authenticate() {
    if (!(await hasAdminSession())) {
      redirectToLogin();
    }

    return { access_token: 'LOCAL', id_token: 'LOCAL', refresh_token: 'LOCAL' };
  }

  async authorize() {
    return hasAdminSession();
  }

  async getUser() {
    return hasAdminSession();
  }

  async getToken() {
    return { id_token: '' };
  }

  async fetchWithToken(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(input, init);
  }

  async isAuthorized() {
    return hasAdminSession();
  }

  async isAuthenticated() {
    return hasAdminSession();
  }

  getLoginStrategy() {
    return 'Redirect' as const;
  }

  getLoginScreen() {
    return null;
  }

  getSessionProvider() {
    return ({ children }: { children?: unknown }) => children;
  }

  async logout() {
    if (typeof window !== 'undefined') {
      window.location.assign('/api/admin/logout');
    }
  }
}

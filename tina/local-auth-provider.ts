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

const ensureAdminSession = async () => {
  const hasSession = await hasAdminSession();

  if (!hasSession) {
    redirectToLogin();
  }

  return hasSession;
};

export class LocalAuthProvider {
  async authenticate() {
    if (!(await ensureAdminSession())) {
      return new Promise<never>(() => undefined);
    }

    return { access_token: 'LOCAL', id_token: 'LOCAL', refresh_token: 'LOCAL' };
  }

  async authorize() {
    return ensureAdminSession();
  }

  async getUser() {
    return ensureAdminSession();
  }

  async getToken() {
    return { id_token: '' };
  }

  async fetchWithToken(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(input, init);
  }

  async isAuthorized() {
    return ensureAdminSession();
  }

  async isAuthenticated() {
    return ensureAdminSession();
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

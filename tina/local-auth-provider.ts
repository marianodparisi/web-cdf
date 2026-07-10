export const defineConfig = <TConfig>(config: TConfig) => config;

export class LocalAuthProvider {
  async authenticate() {
    return { access_token: 'LOCAL', id_token: 'LOCAL', refresh_token: 'LOCAL' };
  }

  async authorize() {
    return true;
  }

  async getUser() {
    return true;
  }

  async getToken() {
    return { id_token: '' };
  }

  async fetchWithToken(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(input, init);
  }

  async isAuthorized() {
    return true;
  }

  async isAuthenticated() {
    return true;
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

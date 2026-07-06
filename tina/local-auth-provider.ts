export const defineConfig = <TConfig>(config: TConfig) => config;

export class LocalAuthProvider {
  async authenticate() {
    return { access_token: 'LOCAL', id_token: 'LOCAL', refresh_token: 'LOCAL' };
  }

  async getUser() {
    return true;
  }

  async getToken() {
    return { id_token: '' };
  }

  async logout() {}
}

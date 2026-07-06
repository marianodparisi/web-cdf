import graphQLSchema from './__generated__/_graphql.json';
import lookup from './__generated__/_lookup.json';
import schema from './__generated__/_schema.json';

type GitHubTreeItem = {
  path?: string;
  type?: string;
};

const generatedFiles: Record<string, unknown> = {
  'tina/__generated__/_graphql.json': graphQLSchema,
  'tina/__generated__/_lookup.json': lookup,
  'tina/__generated__/_schema.json': schema,
};

const normalizePath = (filepath: string) => filepath.replace(/^\/+/, '').replace(/\\/g, '/');

const assertSafePath = (filepath: string) => {
  const normalized = normalizePath(filepath);
  if (normalized.includes('..')) throw new Error(`Unsafe bridge path: ${filepath}`);
  return normalized;
};

export class TinaGithubBridge {
  rootPath = '';
  outputPath = '';

  private owner: string;
  private repo: string;
  private branch: string;
  private token: string;

  constructor({
    owner,
    repo,
    branch,
    token,
  }: {
    owner: string;
    repo: string;
    branch: string;
    token: string;
  }) {
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.token = token;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async glob(pattern: string, extension: string) {
    const prefix = assertSafePath(pattern).replace(/\/+$/, '');
    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${this.branch}?recursive=1`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub tree request failed: ${response.status} ${await response.text()}`);
    }

    const body = (await response.json()) as { tree?: GitHubTreeItem[] };
    return (body.tree || [])
      .filter((item) => item.type === 'blob')
      .map((item) => item.path || '')
      .filter((path) => path.startsWith(`${prefix}/`) && path.endsWith(`.${extension}`));
  }

  async get(filepath: string) {
    const normalized = assertSafePath(filepath);
    if (generatedFiles[normalized]) return JSON.stringify(generatedFiles[normalized]);

    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${normalized}?ref=${this.branch}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub content request failed: ${response.status} ${await response.text()}`);
    }

    const body = (await response.json()) as { content?: string; encoding?: string };
    if (body.encoding !== 'base64' || !body.content) {
      throw new Error(`GitHub content response for ${normalized} was not base64`);
    }

    return Buffer.from(body.content, 'base64').toString('utf-8');
  }

  async put() {}

  async delete() {}
}

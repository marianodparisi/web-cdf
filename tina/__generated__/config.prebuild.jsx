// tina/local-auth-provider.ts
var defineConfig = (config) => config;
var LocalAuthProvider = class {
  async authenticate() {
    return { access_token: "LOCAL", id_token: "LOCAL", refresh_token: "LOCAL" };
  }
  async authorize() {
    return true;
  }
  async getUser() {
    return true;
  }
  async getToken() {
    return { id_token: "" };
  }
  async fetchWithToken(input, init) {
    return fetch(input, init);
  }
  async isAuthorized() {
    return true;
  }
  async isAuthenticated() {
    return true;
  }
  getLoginStrategy() {
    return "Redirect";
  }
  getLoginScreen() {
    return null;
  }
  getSessionProvider() {
    return ({ children }) => children;
  }
  async logout() {
  }
};

// tina/config.ts
var branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "dev";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  contentApiUrlOverride: "/api/tina/gql",
  authProvider: new LocalAuthProvider(),
  build: {
    publicFolder: "public",
    outputFolder: "admin"
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: ""
    }
  },
  schema: {
    collections: [
      {
        name: "siteContent",
        label: "Site Content",
        path: "content/site-content",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "eyebrow",
            label: "Eyebrow"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          },
          {
            type: "string",
            name: "ctaLabel",
            label: "CTA Label"
          },
          {
            type: "string",
            name: "ctaHref",
            label: "CTA Link"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

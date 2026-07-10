// tina/local-auth-provider.ts
var defineConfig = (config) => config;
var loginPath = "/admin/login";
var sessionPath = "/api/admin/session";
var hasAdminSession = async () => {
  if (typeof window === "undefined") {
    return true;
  }
  const response = await fetch(sessionPath, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  }).catch(() => void 0);
  return response?.ok === true;
};
var redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.replace(loginPath);
  }
};
var LocalAuthProvider = class {
  async authenticate() {
    if (!await hasAdminSession()) {
      redirectToLogin();
    }
    return { access_token: "LOCAL", id_token: "LOCAL", refresh_token: "LOCAL" };
  }
  async authorize() {
    return hasAdminSession();
  }
  async getUser() {
    return hasAdminSession();
  }
  async getToken() {
    return { id_token: "" };
  }
  async fetchWithToken(input, init) {
    return fetch(input, init);
  }
  async isAuthorized() {
    return hasAdminSession();
  }
  async isAuthenticated() {
    return hasAdminSession();
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
    if (typeof window !== "undefined") {
      window.location.assign("/api/admin/logout");
    }
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
      },
      {
        name: "devNotes",
        label: "Dev Notes",
        path: "content/dev-notes",
        format: "md",
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

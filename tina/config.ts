import { LocalAuthProvider, defineConfig } from './local-auth-provider';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.HEAD ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'dev';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  contentApiUrlOverride: '/api/tina/gql',
  authProvider: new LocalAuthProvider(),
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: '',
    },
  },
  schema: {
    collections: [
      {
        name: 'siteContent',
        label: 'Site Content',
        path: 'content/site-content',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'eyebrow',
            label: 'Eyebrow',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
          {
            type: 'string',
            name: 'ctaLabel',
            label: 'CTA Label',
          },
          {
            type: 'string',
            name: 'ctaHref',
            label: 'CTA Link',
          },
        ],
      },
    ],
  },
});

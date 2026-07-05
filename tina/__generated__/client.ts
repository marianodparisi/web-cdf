import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: '/home/cdf/web-cdf/tina/__generated__/.cache/1783266392744', url: '/api/tina/gql', token: '', queries,  });
export default client;
  
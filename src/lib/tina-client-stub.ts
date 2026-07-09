type TinaRequest = {
  query: string;
  variables?: Record<string, unknown>;
  url?: string;
};

type TinaRequestOptions = {
  fetchOptions?: Omit<RequestInit, 'body' | 'method'>;
};

export type TinaClient = ReturnType<typeof createClient>;

export const createClient = ({ url }: { url: string; queries?: unknown; cacheDir?: string; token?: string }) => {
  const apiUrl = url;

  return {
    apiUrl,
    request: async (request: TinaRequest, options?: TinaRequestOptions) => {
      const response = await fetch(request.url || apiUrl, {
        ...options?.fetchOptions,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.fetchOptions?.headers || {}),
        },
        body: JSON.stringify({
          query: request.query,
          variables: request.variables || {},
        }),
      });

      return response.json();
    },
  };
};

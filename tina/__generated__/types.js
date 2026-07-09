export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SiteContentPartsFragmentDoc = gql`
    fragment SiteContentParts on SiteContent {
  __typename
  title
  eyebrow
  body
  ctaLabel
  ctaHref
}
    `;
export const DevNotesPartsFragmentDoc = gql`
    fragment DevNotesParts on DevNotes {
  __typename
  body
}
    `;
export const SiteContentDocument = gql`
    query siteContent($relativePath: String!) {
  siteContent(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SiteContentParts
  }
}
    ${SiteContentPartsFragmentDoc}`;
export const SiteContentConnectionDocument = gql`
    query siteContentConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SiteContentFilter) {
  siteContentConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SiteContentParts
      }
    }
  }
}
    ${SiteContentPartsFragmentDoc}`;
export const DevNotesDocument = gql`
    query devNotes($relativePath: String!) {
  devNotes(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...DevNotesParts
  }
}
    ${DevNotesPartsFragmentDoc}`;
export const DevNotesConnectionDocument = gql`
    query devNotesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: DevNotesFilter) {
  devNotesConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...DevNotesParts
      }
    }
  }
}
    ${DevNotesPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    siteContent(variables, options) {
      return requester(SiteContentDocument, variables, options);
    },
    siteContentConnection(variables, options) {
      return requester(SiteContentConnectionDocument, variables, options);
    },
    devNotes(variables, options) {
      return requester(DevNotesDocument, variables, options);
    },
    devNotesConnection(variables, options) {
      return requester(DevNotesConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "/api/tina/gql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};

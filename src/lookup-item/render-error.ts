export const renderError = (query: string, error: unknown): string =>
  `
  <h1>Ooops</h1>
  <p>Couldn't retrieve an info for query: ${query}</p>
  <h2>Error message</h2>
  <p>${String(error)}</p>
`;

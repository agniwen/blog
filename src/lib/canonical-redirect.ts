// Use one production origin so auth cookies and OAuth callbacks stay on the same host.
export function canonicalRedirect(requestUrl: string, authOrigin: string): string | null {
  if (authOrigin !== 'https://akumanoko.com') return null;
  const url = new URL(requestUrl);
  if (!['www.akumanoko.com', 'blog.wenhouman.workers.dev'].includes(url.hostname)) return null;
  url.protocol = 'https:';
  url.host = 'akumanoko.com';
  return url.href;
}

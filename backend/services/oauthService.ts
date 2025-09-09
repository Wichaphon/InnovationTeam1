function getFrontendBase(): string {
  return process.env.FRONTEND_URL || process.env.FRONTEND || 'http://localhost:5173';
}

function buildOAuthSuccessRedirect(token: string, refreshToken: string, role?: string | null): string {
  const base = getFrontendBase();
  const url = new URL('/oauth/callback', base);
  url.searchParams.set('token', token);
  url.searchParams.set('refreshToken', refreshToken);
  if (role) url.searchParams.set('role', role);
  return url.toString();
}

function buildOAuthErrorRedirect(code: string): string {
  const base = getFrontendBase();
  const url = new URL('/oauth/callback', base);
  url.searchParams.set('error', code);
  return url.toString();
}

export { buildOAuthSuccessRedirect, buildOAuthErrorRedirect };



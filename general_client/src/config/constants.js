// API + socket origin.
//
// Production builds run on the same origin as the Express server, so the
// safest default is to use whatever origin served the SPA. CRA's dev
// server runs on :3000 and talks to Express on :5001 — that's the only
// case where we need an explicit override.

const isCraDevServer =
  typeof window !== 'undefined' &&
  window.location &&
  window.location.port === '3000';

const sameOrigin =
  typeof window !== 'undefined' && window.location
    ? `${window.location.protocol}//${window.location.hostname}:5001`
    : 'http://localhost:5001';

// Used as `${ApiOrigin}/nox/api/...` in the action creators and as the socket
// connection target. Keep `PublicURL` for backwards compatibility — it omits
// the port to match the legacy concat `PublicURL + ':5001'` pattern.
export const ApiOrigin = isCraDevServer ? 'http://localhost:5001' : sameOrigin;
export const PublicURL = ApiOrigin.replace(/:\d+$/, '');

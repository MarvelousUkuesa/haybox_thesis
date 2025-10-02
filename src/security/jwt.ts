/**
 * Lightweight JWT header/payload checks to support security unit tests.
 * This does NOT verify signatures; it enforces algorithm allow-lists and registered claims.
 */
export type AllowedAlgs = Array<'RS256'|'RS384'|'RS512'|'ES256'|'ES384'|'ES512'>;

export interface JwtHeader { alg?: string; [k: string]: any }
export interface JwtPayload { iss?: string; aud?: string|string[]; exp?: number; [k: string]: any }

export function decodeSegment(seg: string): any {
  const str = Buffer.from(seg.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  try { return JSON.parse(str); } catch { return {}; }
}

export function decode(token: string): { header: JwtHeader; payload: JwtPayload } {
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT format');
  return { header: decodeSegment(parts[0]), payload: decodeSegment(parts[1]) };
}

export function assertAlgAllowed(header: JwtHeader, allowed: AllowedAlgs): void {
  if (!header.alg) throw new Error('Missing alg');
  if (header.alg === 'none') throw new Error('Disallow alg=none');
  if (!allowed.includes(header.alg as any)) {
    throw new Error(`Algorithm not allowed: ${header.alg}`);
  }
}

export function assertRegisteredClaims(payload: JwtPayload, opts: { iss?: string; aud?: string|string[]; now?: number; leewaySec?: number } = {}): void {
  const now = (opts.now ?? Math.floor(Date.now() / 1000)) + (opts.leewaySec ?? 0);
  if (opts.iss && payload.iss !== opts.iss) throw new Error('Issuer mismatch');
  if (opts.aud) {
    const expAud = Array.isArray(opts.aud) ? opts.aud : [opts.aud];
    const gotAud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const ok = gotAud.some(a => expAud.includes(a as string));
    if (!ok) throw new Error('Audience mismatch');
  }
  if (typeof payload.exp !== 'number' || payload.exp <= now) throw new Error('Token expired or missing exp');
}

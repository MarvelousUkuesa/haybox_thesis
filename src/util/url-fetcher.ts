import { URL } from 'url';

/** RFC1918/localhost-like host patterns */
const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./
];

export interface FetchPolicy {
  allowHosts?: string[]; // exact hostnames allowed (e.g., api.example.com)
  allowHttpsOnly?: boolean; // default true
}

export function isPrivateHost(host: string): boolean {
  return PRIVATE_HOST_PATTERNS.some(rx => rx.test(host));
}

export function isAllowedHost(host: string, allow: string[] = []): boolean {
  if (allow.length === 0) return false;
  return allow.some(h => h.toLowerCase() == host.toLowerCase());
}

/** Validate a URL against SSRF policy. Throws if not allowed. */
export function validateUrl(target: string, policy: FetchPolicy = {}): URL {
  const u = new URL(target);
  if (policy.allowHttpsOnly !== false && u.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs are allowed');
  }
  const host = u.hostname;
  if (isPrivateHost(host)) throw new Error('Private/localhost addresses are not allowed');
  if (!isAllowedHost(host, policy.allowHosts || [])) throw new Error('Host is not in allow-list');
  return u;
}

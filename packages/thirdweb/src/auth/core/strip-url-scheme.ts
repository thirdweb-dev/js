/**
 * Strips the URL scheme (e.g. "https://") and any trailing path/slash from a domain string.
 * Per EIP-4361, the domain field should be an RFC 3986 authority (host without scheme).
 * @internal
 */
export function stripUrlScheme(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

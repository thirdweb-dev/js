/**
 * Build a WalletConnect display URI from a wc:// uri + a wallet specific link
 *
 * @param uri The wc:// uri
 * @param links The wallet specific links
 * @returns The WalletConnect display URI
 */
export function formatWalletConnectDisplayUri(
  uri: string,
  links: { universal: string; native: string },
) {
  const encodedUri: string = encodeURIComponent(uri);
  return links.universal
    ? `${links.universal}/wc?uri=${encodedUri}`
    : links.native
    ? `${links.native}${
        links.native.endsWith(":") ? "//" : "/"
      }wc?uri=${encodedUri}`
    : `${uri}`;
}

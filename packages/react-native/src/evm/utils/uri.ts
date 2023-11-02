import { Chain, getValidChainRPCs } from "@thirdweb-dev/chains";
import { WCMeta } from "../wallets/types/wc";

/**
 * Build a WalletConnect display URI from a wc:// uri + a wallet specific link
 *
 * @param uri The wc:// uri
 * @param links The wallet specific links
 * @returns The WalletConnect display URI
 */
export function formatWalletConnectDisplayUri(
  uri: string,
  links: WCMeta["links"],
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

export function getValidPublicRPCUrl(chain: Chain) {
  return getValidChainRPCs(chain).map((rpc) => {
    try {
      const url = new URL(rpc);
      // remove client id from url
      if (url.hostname.endsWith(".thirdweb.com")) {
        url.pathname = "";
        url.search = "";
      }
      return url.toString();
    } catch (e) {
      return rpc;
    }
  });
}

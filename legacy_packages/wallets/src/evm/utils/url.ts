import { getValidChainRPCs, type Chain } from "@thirdweb-dev/chains";

export function isTwUrl(url: string): boolean {
  const host = new URL(url).hostname;
  return (
    host.endsWith(".thirdweb.com") ||
    host.endsWith(".thirdweb-dev.com") ||
    host === "localhost" ||
    host === "0.0.0.0"
  );
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

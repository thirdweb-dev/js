import { GatewayUrls } from "../types";

/**
 * @internal
 */
export const DEFAULT_GATEWAY_URLS: GatewayUrls = {
  // Note: Gateway URLs should have trailing slashes (we clean this on user input)
  "ipfs://": [
    "https://ipfs-2.thirdwebcdn.com/ipfs/",
    "https://ipfs-3.thirdwebcdn.com/ipfs/",
    "https://ipfs-4.thirdwebcdn.com/ipfs/",
    "https://ipfs-5.thirdwebcdn.com/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://ipfs.io/ipfs/",
    // TODO this one can become the default again once it's stable (no more VT issues)
    "https://ipfs.thirdwebcdn.com/ipfs/",
  ],
};

/**
 * @internal
 */
export const TW_IPFS_SERVER_URL = "https://upload.nftlabs.co";

/**
 * @internal
 */
export const PINATA_IPFS_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

/**
 * @internal
 */
export function parseGatewayUrls(
  gatewayUrls?: GatewayUrls | string[],
): GatewayUrls {
  if (Array.isArray(gatewayUrls)) {
    return {
      "ipfs://": gatewayUrls,
    };
  }

  return gatewayUrls || {};
}

/**
 * @internal
 */
export function prepareGatewayUrls(gatewayUrls?: GatewayUrls): GatewayUrls {
  const allGatewayUrls = {
    ...gatewayUrls,
    ...DEFAULT_GATEWAY_URLS,
  };

  for (const key of Object.keys(DEFAULT_GATEWAY_URLS)) {
    if (gatewayUrls && gatewayUrls[key]) {
      // Make sure that all user gateway URLs have trailing slashes
      const cleanedGatewayUrls = gatewayUrls[key].map(
        (url) => url.replace(/\/$/, "") + "/",
      );
      allGatewayUrls[key] = [
        ...cleanedGatewayUrls,
        ...DEFAULT_GATEWAY_URLS[key],
      ];
    }
  }

  return allGatewayUrls;
}

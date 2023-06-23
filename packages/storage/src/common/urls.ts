import { GatewayUrls } from "../types";
import {CID} from "multiformats/cid";
import {normalizeCID} from "./cid";

/**
 * @internal
 */
export const DEFAULT_GATEWAY_URLS: GatewayUrls = {
  // Note: Gateway URLs should have trailing slashes (we clean this on user input)
  "ipfs://": [
    "https://*.ipfs-staging.thirdwebcdn.com/ipfs/",
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
export function getUrlForCid(gatewayUrl: string, cid: string): string {
  if (gatewayUrl.includes('ipfs-staging.thirdwebcdn.com')) {
    const prefix = 'https://';
    const suffix = '.ipfs-staging.thirdwebcdn.com/';
    const parts = cid.split('/');
    const hash = parts[0]
    const normalizedHash = normalizeCID(hash)
    const filePath = parts.slice(1).join('/');
    return `${prefix}${normalizedHash}${suffix}${filePath}`;
  }
  return gatewayUrl.replace("{cid}", cid);
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
      let cleanedGatewayUrls = gatewayUrls[key].map(
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

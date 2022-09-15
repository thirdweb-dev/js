import { GatewayUrls } from "../types";

/**
 * @internal
 */
export const DEFAULT_GATEWAY_URLS: GatewayUrls = {
  "ipfs://": [
    "https://gateway.ipfscdn.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://ipfs.io/ipfs/",
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

export function prepareGatewayUrls(gatewayUrls?: GatewayUrls): GatewayUrls {
  const allGatewayUrls = {
    ...gatewayUrls,
    ...DEFAULT_GATEWAY_URLS,
  };

  for (const key of Object.keys(DEFAULT_GATEWAY_URLS)) {
    if (gatewayUrls && gatewayUrls[key]) {
      allGatewayUrls[key] = [...gatewayUrls[key], ...DEFAULT_GATEWAY_URLS[key]];
    }
  }

  return allGatewayUrls;
}

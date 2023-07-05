import { GatewayUrls } from "../types";
import CIDTool from "cid-tool";

/**
 * @internal
 */
export const DEFAULT_GATEWAY_URLS: GatewayUrls = {
  // Note: Gateway URLs should have trailing slashes (we clean this on user input)
  "ipfs://": [
    "https://{cid}.ipfs.thirdwebstorage.com/{path}",
    "https://{cid}.ipfs.thirdwebipfs.com/{path}",
    "https://{cid}.ipfs.thirdwebgateway.com/{path}",
    "https://{cid}.ipfs-public.thirdwebcdn.com/{path}",
    "https://cloudflare-ipfs.com/ipfs/{cid}/{path}",
    "https://ipfs.io/ipfs/{cid}/{path}",
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
export function getGatewayUrlForCid(gatewayUrl: string, cid: string): string {
  const parts = cid.split("/");
  const hash = convertCidToV1(parts[0]);
  const filePath = parts.slice(1).join("/");

  let url = gatewayUrl;

  // If the URL contains {cid} or {path} tokens, replace them with the CID and path
  // Both tokens must be present for the URL to be valid
  if (gatewayUrl.includes("{cid}") && gatewayUrl.includes("{path}")) {
    url = url.replace("{cid}", hash).replace("{path}", filePath);
  }
  // If the URL contains only the {cid} token, replace it with the CID
  else if (gatewayUrl.includes("{cid}")) {
    url = url.replace("{cid}", hash);
  }
  // If those tokens don't exist, use the canonical gateway URL format
  else {
    url += `${hash}/${filePath}`;
  }

  return url;
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
      const cleanedGatewayUrls = gatewayUrls[key].map((url) =>
        // don't add trailing slash if the URL contains {path} token
        url.includes("{path}") ? url : url.replace(/\/$/, "") + "/",
      );

      allGatewayUrls[key] = [
        ...cleanedGatewayUrls,
        ...DEFAULT_GATEWAY_URLS[key],
      ];
    }
  }

  return allGatewayUrls;
}

/**
 * @internal
 */
export function convertCidToV1(cid: string) {
  let normalized: string;
  try {
    const hash = cid.split("/")[0];
    normalized = CIDTool.base32(hash);
  } catch (e) {
    throw new Error(`The CID ${cid} is not valid.`);
  }
  return normalized;
}

import { GatewayUrls } from "../types";
import CIDTool from "cid-tool";

/**
 * @internal
 */
export const DEFAULT_GATEWAY_URLS: GatewayUrls = {
  // Note: Gateway URLs should have trailing slashes (we clean this on user input)
  "ipfs://": [
    // FIXME switch to prod before merging
    "https://{clientId}.thirdwebstorage-staging.com/ipfs/{cid}/{path}",
    "https://{clientId}.ipfscdn.io/ipfs/{cid}/{path}",
    "https://cloudflare-ipfs.com/ipfs/{cid}/{path}",
    "https://dweb.link/ipfs/{cid}/{path}",
    "https://ipfs.io/ipfs/{cid}/{path}",
    "https://w3s.link/ipfs/{cid}/{path}",
    "https://nftstorage.link/ipfs/{cid}/{path}",
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
export function prepareGatewayUrls(
  gatewayUrls: GatewayUrls,
  clientId?: string,
  secretKey?: string,
): GatewayUrls {
  const allGatewayUrls = {
    ...DEFAULT_GATEWAY_URLS,
    ...gatewayUrls,
  };

  for (const key of Object.keys(allGatewayUrls)) {
    const cleanedGatewayUrls = allGatewayUrls[key]
      .map((url) => {
        // inject clientId when present
        if (clientId && url.includes("{clientId}")) {
          return url.replace("{clientId}", clientId);
        } else if (secretKey && url.includes("{clientId}")) {
          // should only be used on Node.js in a backend/script context
          const crypto = require("crypto");
          const hashedSecretKey = crypto
            .createHash("sha256")
            .update(secretKey)
            .digest("hex");
          const derivedClientId = hashedSecretKey.slice(0, 32);
          return url.replace("{clientId}", derivedClientId);
        } else if (url.includes("{clientId}")) {
          // if no client id passed, filter out the url
          return undefined;
        } else {
          return url;
        }
      })
      .filter((url) => url !== undefined) as string[];

    allGatewayUrls[key] = cleanedGatewayUrls;
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

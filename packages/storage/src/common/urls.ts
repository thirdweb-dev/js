import CIDTool from "cid-tool";
import { getProcessEnv } from "./process";
import { GatewayUrls } from "../types/download";

const TW_HOSTNAME_SUFFIX = ".ipfscdn.io";
const TW_STAGINGHOSTNAME_SUFFIX = ".thirdwebstorage-staging.com";
const TW_GATEWAY_URLS = [
  `https://{clientId}${TW_HOSTNAME_SUFFIX}/ipfs/{cid}/{path}`,
];

/**
 * @internal
 * @param url
 * @returns
 */
export function isTwGatewayUrl(url: string): boolean {
  const hostname = new URL(url).hostname;
  const isProd = hostname.endsWith(TW_HOSTNAME_SUFFIX);
  if (isProd) {
    return true;
  }
  // fall back to also handle staging urls
  return hostname.endsWith(TW_STAGINGHOSTNAME_SUFFIX);
}

const PUBLIC_GATEWAY_URLS = [
  "https://{cid}.ipfs.cf-ipfs.com/{path}",
  "https://{cid}.ipfs.dweb.link/{path}",
  "https://ipfs.io/ipfs/{cid}/{path}",
  "https://cloudflare-ipfs.com/ipfs/{cid}/{path}",
  "https://{cid}.ipfs.w3s.link/{path}",
  "https://w3s.link/ipfs/{cid}/{path}",
  "https://nftstorage.link/ipfs/{cid}/{path}",
  "https://gateway.pinata.cloud/ipfs/{cid}/{path}",
];

/**
 * @internal
 */
export const DEFAULT_GATEWAY_URLS: GatewayUrls = {
  // Note: Gateway URLs should have trailing slashes (we clean this on user input)
  "ipfs://": [...TW_GATEWAY_URLS, ...PUBLIC_GATEWAY_URLS],
};

/**
 * @internal
 */
export const TW_UPLOAD_SERVER_URL = getProcessEnv(
  "CUSTOM_UPLOAD_SERVER_URL",
  "https://storage.thirdweb.com",
);

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
export function getGatewayUrlForCid(
  gatewayUrl: string,
  cid: string,
  clientId?: string,
): string {
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
  // if the URL contains the {clientId} token, replace it with the client ID
  if (gatewayUrl.includes("{clientId}")) {
    if (!clientId) {
      throw new Error(
        "Cannot use {clientId} in gateway URL without providing a client ID",
      );
    }
    url = url.replace("{clientId}", clientId);
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
          if (typeof window !== "undefined") {
            throw new Error("Cannot use secretKey in browser context");
          }
          // this is on purpose because we're using the crypto module only in node
          // eslint-disable-next-line @typescript-eslint/no-var-requires
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

import mime from "mime/lite.js";
import {
  parseGatewayUrls,
  prepareGatewayUrls,
  replaceSchemeWithGatewayUrl,
} from "@thirdweb-dev/storage";

// TODO legacy remove this when possible
export interface IPFSResolverOptions {
  gatewayUrl: string;
}

export function resolveIpfsUri(uri?: string, options?: IPFSResolverOptions) {
  if (!uri) {
    return undefined;
  }
  const gatewayUrls = prepareGatewayUrls(
    parseGatewayUrls(options?.gatewayUrl ? [options?.gatewayUrl] : undefined),
  );
  return replaceSchemeWithGatewayUrl(uri, gatewayUrls);
}

export async function resolveMimeType(url?: string) {
  if (!url) {
    return undefined;
  }
  const mimeType = mime.getType(url);
  if (mimeType) {
    return mimeType;
  }

  const res = await fetch(url, {
    method: "HEAD",
  });
  if (res.ok && res.headers.has("content-type")) {
    return res.headers.get("content-type") || undefined;
  }
  // we failed to resolve the mime type, return null
  return undefined;
}

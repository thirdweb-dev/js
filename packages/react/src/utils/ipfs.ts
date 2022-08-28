import { DEFAULT_IPFS_RESOLVER_OPTIONS } from "../constants/ipfs";
import mime from "mime/lite.js";

export function resolveIpfsUri(
  uri?: string,
  options = DEFAULT_IPFS_RESOLVER_OPTIONS,
) {
  if (!uri) {
    return undefined;
  }
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", options.gatewayUrl);
  }
  return uri;
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
    return res.headers.get("content-type") ?? undefined;
  }
  // we failed to resolve the mime type, return null
  return undefined;
}

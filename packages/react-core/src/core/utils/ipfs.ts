import mime from "mime/lite.js";

// TODO legacy remove this when possible
export interface IPFSResolverOptions {
  gatewayUrl: string;
}

/**
 * @internal
 */
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

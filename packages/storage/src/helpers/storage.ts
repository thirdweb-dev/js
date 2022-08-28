import { Json } from "../types";
import { File } from "@web-std/file";

/**
 * Given a map of file hashes to ipfs uris, this function will hash
 * all properties recursively and replace them with the ipfs uris
 * from the map passed in. If a hash is missing from the map, the function
 * will throw an error.
 *
 * @internal
 *
 * @param object - The object to recursively process
 * @param cids - The array of file hashes to ipfs uris in the recurse order
 * @returns - The processed metadata with properties pointing at ipfs in place of `File | Buffer`
 */
export function replaceFilePropertiesWithHashes(
  object: Record<string, any>,
  cids: string[]
) {
  const keys = Object.keys(object);
  for (const key in keys) {
    const val = object[keys[key]];
    const isFile = val instanceof File || val instanceof Buffer;
    if (typeof val === "object" && !isFile) {
      replaceFilePropertiesWithHashes(val, cids);
      continue;
    }

    if (!isFile) {
      continue;
    }

    object[keys[key]] = `ipfs://${cids.splice(0, 1)[0]}`;
  }
  return object;
}

/**
 * Replaces all ipfs:// hashes (or any other scheme) with gateway url
 * @internal
 * @param object
 * @param scheme
 * @param gatewayUrl
 */
export function replaceHashWithGatewayUrl(
  object: Record<string, any>,
  scheme: string,
  gatewayUrl: string
): Record<string, any> {
  if (object === null || !object) {
    return {};
  }
  const keys = Object.keys(object);
  for (const key in keys) {
    const val = object[keys[key]];
    object[keys[key]] = resolveGatewayUrl(val, scheme, gatewayUrl);
    if (Array.isArray(val)) {
      object[keys[key]] = val.map((el) => {
        if (typeof el === "object") {
          return replaceHashWithGatewayUrl(el, scheme, gatewayUrl);
        } else {
          return resolveGatewayUrl(el, scheme, gatewayUrl);
        }
      });
    }
    if (typeof val === "object") {
      replaceHashWithGatewayUrl(val, scheme, gatewayUrl);
    }
  }
  return object;
}

/**
 * Replaces all gateway urls back to ipfs:// hashes
 * @internal
 * @param object
 * @param scheme
 * @param gatewayUrl
 */
export function replaceGatewayUrlWithHash(
  object: Record<string, any>,
  scheme: string,
  gatewayUrl: string
): Record<string, any> {
  if (object === null || !object) {
    return {};
  }
  const keys = Object.keys(object);
  for (const key in keys) {
    const val = object[keys[key]];
    object[keys[key]] = toIPFSHash(val, scheme, gatewayUrl);
    if (Array.isArray(val)) {
      object[keys[key]] = val.map((el) => {
        const isFile = el instanceof File || el instanceof Buffer;
        if (typeof el === "object" && !isFile) {
          return replaceGatewayUrlWithHash(el, scheme, gatewayUrl);
        } else {
          return toIPFSHash(el, scheme, gatewayUrl);
        }
      });
    }
    const isFile = val instanceof File || val instanceof Buffer;
    if (typeof val === "object" && !isFile) {
      replaceGatewayUrlWithHash(val, scheme, gatewayUrl);
    }
  }
  return object;
}

/**
 * Resolves the full URL of a file for a given gateway.
 *
 * For example, if the hash of a file is `ipfs://bafkreib3u2u6ir2fsl5nkuwixfsb3l4xehri3psjv5yga4inuzsjunk2sy`, then the URL will be:
 * "https://cloudflare-ipfs.com/ipfs/bafkreibnwjhx5s3r2rggdoy3hw7lr7wmgy4bas35oky3ed6eijklk2oyvq"
 * if the gateway is `cloudflare-ipfs.com`.
 * @internal
 * @param object
 * @param scheme
 * @param gatewayUrl
 */
export function resolveGatewayUrl<T extends Json>(
  object: T,
  scheme: string,
  gatewayUrl: string
): T {
  if (typeof object === "string") {
    return object && object.toLowerCase().includes(scheme)
      ? (object.replace(scheme, gatewayUrl) as T)
      : object;
  } else {
    return object;
  }
}

/**
 * @internal
 * @param object
 * @param scheme
 * @param gatewayUrl
 */
export function toIPFSHash<T extends Json>(
  object: T,
  scheme: string,
  gatewayUrl: string
): T {
  if (typeof object === "string") {
    return object && object.toLowerCase().includes(gatewayUrl)
      ? (object.replace(gatewayUrl, scheme) as T)
      : object;
  } else {
    return object;
  }
}

import { resolveScheme, type ResolveSchemeOptions } from "../utils/ipfs.js";

export type DownloadOptions = ResolveSchemeOptions;

/**
 * Downloads a file from the specified URI.
 * @param options - The download options.
 * @returns A Promise that resolves to the downloaded file.
 * @throws An error if the URI scheme is invalid.
 * @example
 * ```ts
 * import { download } from "thirdweb/storage";
 * const file = await download({
 *  client,
 *  uri: "ipfs://Qm...",
 * });
 * ```
 */
export async function download(options: DownloadOptions) {
  const url = resolveScheme(options);
  const headers: HeadersInit = {};
  if (options.client.secretKey) {
    headers["x-secret-key"] = options.client.secretKey;
  }
  return await fetch(url, headers);
}

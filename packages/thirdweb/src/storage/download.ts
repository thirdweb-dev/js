import { getRequestTimeoutConfig } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { resolveScheme, type ResolveSchemeOptions } from "../utils/ipfs.js";

export type DownloadOptions = ResolveSchemeOptions & {
  requestTimeoutMs?: number;
};

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
  const requestTimeoutMs = getRequestTimeoutConfig(
    options.client,
    "storage",
    options.requestTimeoutMs,
  );

  const res = await getClientFetch(options.client)(resolveScheme(options), {
    requestTimeoutMs,
  });
  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.statusText}`);
  }
  return res;
}

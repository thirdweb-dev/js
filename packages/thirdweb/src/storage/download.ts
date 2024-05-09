import { getClientFetch } from "../utils/fetch.js";
import { type ResolveSchemeOptions, resolveScheme } from "../utils/ipfs.js";
import type { Prettify } from "../utils/type-utils.js";

export type DownloadOptions = Prettify<
  ResolveSchemeOptions & {
    requestTimeoutMs?: number;
  }
>;

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
 * @storage
 */
export async function download(options: DownloadOptions) {
  let url: string;
  if (options.uri.startsWith("ar://")) {
    const { resolveArweaveScheme } = await import("../utils/arweave.js");
    url = resolveArweaveScheme(options);
  } else {
    url = resolveScheme(options);
  }
  const res = await getClientFetch(options.client)(url, {
    keepalive: options.client.config?.storage?.fetch?.keepalive,
    headers: options.client.config?.storage?.fetch?.headers,
    requestTimeoutMs: options.client.config?.storage?.fetch?.requestTimeoutMs,
  });
  if (!res.ok) {
    res.body?.cancel();
    throw new Error(`Failed to download file: ${res.statusText}`);
  }
  return res;
}

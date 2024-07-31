import { getClientFetch } from "../utils/fetch.js";
import { type ResolveSchemeOptions, resolveScheme } from "../utils/ipfs.js";
import type { Prettify } from "../utils/type-utils.js";

export type DownloadOptions = Prettify<
  ResolveSchemeOptions & {
    requestTimeoutMs?: number;
  }
>;

/**
 * @description Downloads a file from the specified IPFS, Arweave, or HTTP URI.
 *
 * `download` will parse the provided URI based on its scheme (ipfs://, ar://, https://) and convert it to a URL to fetch the file from thirdweb's storage service.
 *
 * @param options - The download options.
 * @param options.client - The Thirdweb client. See [createThirdwebClient](https://portal.thirdweb.com/references/typescript/v5/createThirdwebClient).
 * @param options.uri - The URI of the file to download. Can be IPFS, Arweave, or HTTP.
 * @param [options.requestTimeoutMs] - The maximum time in milliseconds to wait for the request to complete. Defaults to 60 seconds (60,000 milliseconds).
 *
 * @returns Asynchronously returns the network response from fetching the file.
 * @throws An error if the URI scheme is invalid or if the request fails.
 *
 * @example
 * Download a file from IPFS:
 * ```ts
 * import { download } from "thirdweb/storage";
 * import { createThirdwebClient } from "@thirdweb-dev/sdk";
 *
 * const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });
 *
 * const file = await download({
 *  client,
 *  uri: "ipfs://Qm...",
 * });
 * ```
 *
 * Download a file from Arweave:
 * ```ts
 * import { download } from "thirdweb/storage";
 * import { createThirdwebClient } from "@thirdweb-dev/sdk";
 *
 * const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });
 *
 * const file = await download({
 *  client,
 *  uri: "ar://{arweave-transaction-id}",
 * });
 * ```
 *
 * Download a file from HTTP:
 * ```ts
 * import { download } from "thirdweb/storage";
 * import { createThirdwebClient } from "@thirdweb-dev/sdk";
 *
 * const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });
 *
 * const file = await download({
 *  client,
 *  uri: "https://example.com/file.txt",
 * });
 * ```
 *
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
    requestTimeoutMs:
      options.client.config?.storage?.fetch?.requestTimeoutMs ?? 60000,
  });

  if (!res.ok) {
    res.body?.cancel();
    throw new Error(`Failed to download file: ${res.statusText}`);
  }
  return res;
}

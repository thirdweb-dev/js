import type { ThirdwebClient } from "../client/client.js";

export type ResolveSchemeOptions = {
  client: ThirdwebClient;
  uri: string;
};

/**
 * Resolves the scheme of a given URI and returns the corresponding URL.
 * If the URI starts with "ipfs://", it constructs a URL using the IPFS client ID and the IPFS gateway.
 * If the URI starts with "http", it returns the URI as is.
 * Otherwise, it throws an error indicating an invalid URI scheme.
 * @param options - The options object containing the URI and the IPFS client.
 * @returns The resolved URL.
 * @throws Error if the URI scheme is invalid.
 * @example
 * ```ts
 * import { resolveScheme } from "thirdweb/storage";
 * const url = resolveScheme({
 *  client,
 *  uri: "ipfs://Qm...",
 * });
 * ```
 */
export function resolveScheme(options: ResolveSchemeOptions) {
  let url: string;
  if (options.uri.startsWith("ipfs://")) {
    url = `https://${
      options.client.clientId
    }.ipfscdn.io/ipfs/${options.uri.slice(7)}`;
  } else if (options.uri.startsWith("http")) {
    url = options.uri;
  } else {
    throw new Error(`Invalid URI scheme, expected "ipfs://" or "http(s)://"`);
  }
  return url;
}

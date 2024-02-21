import type { ThirdwebClient } from "../client/client.js";

export type ResolveSchemeOptions = {
  client: ThirdwebClient;
  uri: string;
};

const DEFAULT_GATEWAY = "https://{clientId}.ipfscdn.io/ipfs/{cid}";

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
    const gateway = options.client.config?.storage?.gateway ?? DEFAULT_GATEWAY;
    const clientId = options.client.clientId;
    const cid = options.uri.slice(7);
    url =
      // purpusefully using SPLIT here and and not replace for CID to avoid cases where users don't know the schema
      // also only splitting on `/ipfs` to avoid cases where people pass non `/` terminated gateway urls
      gateway.replace("{clientId}", clientId).split("/ipfs")[0] +
      "/ipfs/" +
      cid;
  } else if (options.uri.startsWith("http")) {
    url = options.uri;
  } else {
    throw new Error(`Invalid URI scheme, expected "ipfs://" or "http(s)://"`);
  }
  return url;
}

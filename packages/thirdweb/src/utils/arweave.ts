const DEFAULT_GATEWAY = "https://arweave.net/{fileId}";

export type ResolveArweaveSchemeOptions = {
  uri: string;
  gatewayUrl?: string;
};

/**
 * Resolves the scheme of a given Arweave URI and returns the corresponding URL.
 * @param options - The options object containing the Arweave URI
 * @returns The resolved URL
 * @throws Error if the URI scheme is invalid.
 * @example
 * ```ts
 * import { resolveArweaveScheme } from "thirdweb/storage";
 * const url = resolveArweaveScheme({ uri: "ar://<fileId>" });
 * ```
 * @storage
 */
export function resolveArweaveScheme(options: ResolveArweaveSchemeOptions) {
  if (options.uri.startsWith("ar://")) {
    const fileId = options.uri.replace("ar://", "");
    if (options.gatewayUrl) {
      const separator = options.gatewayUrl.endsWith("/") ? "" : "/";
      return `${options.gatewayUrl}${separator}${fileId}`;
    }
    return DEFAULT_GATEWAY.replace("{fileId}", fileId);
  }
  if (options.uri.startsWith("http")) {
    return options.uri;
  }
  throw new Error(`Invalid URI scheme, expected "ar://" or "http(s)://"`);
}

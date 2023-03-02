import { DEFAULT_IPFS_RESOLVER_OPTIONS } from "../constants/ipfs";

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

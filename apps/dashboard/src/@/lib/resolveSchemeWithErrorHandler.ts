import type { ThirdwebClient } from "thirdweb";
import { resolveScheme } from "thirdweb/storage";

export function resolveSchemeWithErrorHandler(options: {
  uri: string | undefined;
  client: ThirdwebClient;
}) {
  if (!options.uri) {
    return undefined;
  }
  try {
    // eslint-disable-next-line no-restricted-syntax
    return resolveScheme({
      uri: options.uri,
      client: options.client,
    });
  } catch (err) {
    console.error("error resolving ipfs url", options.uri, err);
    return undefined;
  }
}

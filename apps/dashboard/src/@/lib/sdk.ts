import type { ThirdwebClient } from "thirdweb";
import { resolveScheme } from "thirdweb/storage";

export function replaceIpfsUrl(uri: string, client: ThirdwebClient) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    return resolveScheme({
      client,
      uri,
    });
  } catch (err) {
    console.error("error resolving ipfs url", uri, err);
    return uri;
  }
}

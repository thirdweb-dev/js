import { resolveScheme } from "thirdweb/storage";
import { thirdwebClient } from "../@/constants/client";

export function replaceIpfsUrl(uri: string) {
  try {
    return resolveScheme({
      uri,
      client: thirdwebClient,
    });
  } catch (err) {
    console.error("error resolving ipfs url", uri, err);
    return uri;
  }
}

import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveScheme } from "thirdweb/storage";

export function replaceIpfsUrl(uri: string) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    return resolveScheme({
      uri,
      client: getThirdwebClient(),
    });
  } catch (err) {
    console.error("error resolving ipfs url", uri, err);
    return uri;
  }
}

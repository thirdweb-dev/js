import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveScheme } from "thirdweb/storage";

export function replaceIpfsUrl(uri: string) {
  try {
    return resolveScheme({
      uri,
      client: getThirdwebClient(),
    });
  } catch (err) {
    console.error("error resolving ipfs url", uri, err);
    return uri;
  }
}

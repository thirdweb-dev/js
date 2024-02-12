import { isBase64JSON, parseBase64String } from "../base64/base64.js";
import type { ThirdwebClient } from "../../client/client.js";

type FetchContractMetadata = {
  client: ThirdwebClient;
  uri: string;
};

/**
 * Fetches the metadata for a token.
 *
 * @param options - The options for fetching the token metadata.
 * @returns The token metadata.
 * @internal
 */
export async function fetchContractMetadata(options: FetchContractMetadata) {
  const { client, uri } = options;

  // handle case where the URI is a base64 encoded JSON
  if (isBase64JSON(uri)) {
    try {
      return JSON.parse(parseBase64String(uri));
    } catch (e) {
      console.error(
        "Failed to decode base64 encoded contract metadata",
        { uri },
        e,
      );
      return undefined;
    }
  }

  // in all other cases we will need the `download` function from storage

  const { download } = await import("../../storage/download.js");
  return await (await download({ client, uri })).json();
}

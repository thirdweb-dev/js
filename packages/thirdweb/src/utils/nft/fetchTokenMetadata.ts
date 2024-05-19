import type { ThirdwebClient } from "../../client/client.js";
import { isBase64JSON, parseBase64String } from "../base64/base64.js";
import { numberToHex } from "../encoding/hex.js";
import type { NFTMetadata } from "./parseNft.js";

/**
 * @internal
 */
export type FetchTokenMetadataOptions = {
  client: ThirdwebClient;
  tokenId: bigint;
  tokenUri: string;
};

/**
 * Fetches the metadata for a token.
 *
 * @param options - The options for fetching the token metadata.
 * @returns The token metadata.
 * @internal
 */
export async function fetchTokenMetadata(
  options: FetchTokenMetadataOptions,
): Promise<NFTMetadata> {
  const { client, tokenId, tokenUri } = options;
  // handle case where the URI is a base64 encoded JSON (onchain nft)
  if (isBase64JSON(tokenUri)) {
    try {
      return JSON.parse(parseBase64String(tokenUri));
    } catch (e) {
      console.error(
        "Failed to fetch base64 encoded NFT",
        { tokenId, tokenUri },
        e,
      );
      throw e;
    }
  }

  // in all other cases we will need the `download` function from storage
  const { download } = await import("../../storage/download.js");

  // handle non-dynamic uris (most common case -> skip the other checks)
  try {
    if (!tokenUri.includes("{id}")) {
      return await (await download({ client, uri: tokenUri })).json();
    }
  } catch (e) {
    console.error("Failed to fetch non-dynamic NFT", { tokenId, tokenUri }, e);
    throw e;
  }

  // DYNAMIC NFT FORMATS (2 options, sadly has to be waterfall)
  try {
    try {
      // try first dynamic id format
      return await (
        await download({
          client,
          uri: tokenUri.replace(
            "{id}",
            numberToHex(tokenId, { size: 32 }).slice(2),
          ),
        })
      ).json();
    } catch (err) {
      // otherwise attempt the second format
      return await (
        await download({
          client,
          uri: tokenUri.replace("{id}", tokenId.toString()),
        })
      ).json();
    }
  } catch (e) {
    console.error("Failed to fetch dynamic NFT", { tokenId, tokenUri }, e);
    throw e;
  }
}

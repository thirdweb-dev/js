import { toHex } from "viem";
import type { ThirdwebClient } from "../../client/client.js";
import { isBase64String, parseBase64String } from "./base64.js";

const FALLBACK_METADATA = {
  name: "Failed to load NFT metadata",
};

type FetchTokenMetadataOptions = {
  client: ThirdwebClient;
  tokenId: bigint;
  tokenUri: string;
};

export async function fetchTokenMetadata({
  client,
  tokenId,
  tokenUri,
}: FetchTokenMetadataOptions) {
  // handle case where the URI is a base64 encoded JSON (onchain nft)
  if (isBase64String(tokenUri)) {
    try {
      return JSON.parse(parseBase64String(tokenUri));
    } catch (e) {
      console.error(
        "Failed to fetch base64 encoded NFT",
        { tokenId, tokenUri },
        e,
      );
      return FALLBACK_METADATA;
    }
  }

  // in all other cases we will need the `download` function from storage
  const { download } = await import("../../storage/download.js");

  // handle non-dynamic uris (most common case -> skip the other checks)
  try {
    if (!tokenUri.includes("{id}")) {
      return await (await download(client, { uri: tokenUri })).json();
    }
  } catch (e) {
    console.error("Failed to fetch non-dynamic NFT", { tokenId, tokenUri }, e);
    return FALLBACK_METADATA;
  }

  // DYNAMIC NFT FORMATS (2 options, sadly has to be waterfall)
  try {
    try {
      // try first dynamic id format
      return await (
        await download(client, {
          uri: tokenUri.replace("{id}", toHex(tokenId, { size: 32 }).slice(2)),
        })
      ).json();
    } catch (err) {
      // otherwise attempt the second format
      return await (
        await download(client, {
          uri: tokenUri.replace("{id}", tokenId.toString()),
        })
      ).json();
    }
  } catch (e) {
    console.error("Failed to fetch dynamic NFT", { tokenId, tokenUri }, e);
    return FALLBACK_METADATA;
  }
}

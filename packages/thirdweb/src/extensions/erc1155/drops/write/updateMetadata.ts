import { getBaseURICount } from "../../../erc721/__generated__/IBatchMintMetadata/read/getBaseURICount.js";
import {
  type UpdateBatchBaseURIParams,
  updateBatchBaseURI,
} from "../../__generated__/DropERC1155/write/updateBatchBaseURI.js";

import type { ThirdwebClient } from "../../../../client/client.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { NFT, NFTInput } from "../../../../utils/nft/parseNft.js";

export type UpdateMetadataParams = {
  targetTokenId: bigint;
  newMetadata: NFTInput;
  client: ThirdwebClient;
};

/**
 * @internal
 */
export async function getUpdateMetadataParams(
  options: BaseTransactionOptions<UpdateMetadataParams>,
): Promise<UpdateBatchBaseURIParams> {
  const { contract, targetTokenId, newMetadata, client } = options;
  const batchCount = await getBaseURICount(options);
  if (batchCount === 0n) {
    throw new Error(
      "No base URI set. Please set a base URI before updating metadata",
    );
  }

  // Look for the batchId & determine the start + end tokenId of the batch
  const [{ getBatchIdAtIndex }, { getNFT }] = await Promise.all([
    import("../../__generated__/BatchMintMetadata/read/getBatchIdAtIndex.js"),
    import("../../read/getNFT.js"),
  ]);

  let startTokenId = 0n;
  let endTokenId = 0n;
  let batchIndex = 0n;
  for (let i = 0n; i < batchCount; i += 1n) {
    batchIndex = i;
    endTokenId = await getBatchIdAtIndex({ contract, index: batchIndex });
    if (endTokenId > targetTokenId) {
      break;
    }
    startTokenId = endTokenId;
  }

  const range = Array.from(
    { length: Number(endTokenId - startTokenId) },
    (_, k) => BigInt(k) + startTokenId,
  );

  const currentMetadatas = await Promise.all(
    range.map((id) => getNFT({ contract, tokenId: id })),
  );

  // Abort if any of the items failed to load
  if (currentMetadatas.some((item) => item === undefined || !item.tokenURI)) {
    throw new Error(
      `Failed to load all ${range.length} items from batchIndex: ${batchIndex}`,
    );
  }

  const newMetadatas: NFTInput[] = [];
  for (let i = 0; i < currentMetadatas.length; i++) {
    const { id, metadata } = currentMetadatas[i] as NFT;
    if (targetTokenId === id) {
      newMetadatas.push(newMetadata);
    } else {
      newMetadatas.push(metadata);
    }
  }

  const { uploadOrExtractURIs } = await import("../../../../utils/ipfs.js");
  const batchOfUris = await uploadOrExtractURIs(
    newMetadatas,
    client,
    Number(startTokenId),
  );

  if (!batchOfUris || !batchOfUris.length || !batchOfUris[0]) {
    throw new Error("Failed to upload batch of new metadatas");
  }

  const baseUri = batchOfUris[0].substring(0, batchOfUris[0].lastIndexOf("/"));

  // IMPORTANT: The new ipfs URI must have the trailing slash at the end
  // this is required by the Drop contract
  const uri = `${baseUri}/`;

  return { index: batchIndex, uri };
}

/**
 * Update the metadata of the single token in an Edition Drop (DropERC1155) collection
 * For Edition contracts, use `setTokenURI`
 * @param options
 * @returns the prepared transaction
 * @extension ERC1155
 * @example
 * ```ts
 * import { updateMetadata } from "thirdweb/extensions/erc1155";
 *
 * const transaction = updateMetadata({
 *  contract,
 *  targetTokenId: 0n,
 *  newMetadata: {
 *    name: "this is the new nft name",
 *    description: "...",
 *    image: "new image uri"
 *    // ...
 *  }
 * });
 * ```
 */
export function updateMetadata(
  options: BaseTransactionOptions<UpdateMetadataParams>,
) {
  const { contract } = options;
  return updateBatchBaseURI({
    contract,
    asyncParams: async () => getUpdateMetadataParams(options),
  });
}

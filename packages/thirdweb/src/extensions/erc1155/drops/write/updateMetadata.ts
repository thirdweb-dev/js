import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { NFT, NFTInput } from "../../../../utils/nft/parseNft.js";
import * as BaseURICount from "../../../erc721/__generated__/IBatchMintMetadata/read/getBaseURICount.js";
import * as BatchAtIndex from "../../__generated__/BatchMintMetadata/read/getBatchIdAtIndex.js";
import * as BatchBaseURI from "../../__generated__/DropERC1155/write/updateBatchBaseURI.js";
import * as GetNFT from "../../read/getNFT.js";

/**
 * @extension ERC1155
 */
export type UpdateMetadataParams = {
  targetTokenId: bigint;
  newMetadata: NFTInput;
};

/**
 * @internal
 */
async function getUpdateMetadataParams(
  options: BaseTransactionOptions<UpdateMetadataParams>,
): Promise<BatchBaseURI.UpdateBatchBaseURIParams> {
  const { contract, targetTokenId, newMetadata } = options;
  const batchCount = await BaseURICount.getBaseURICount(options);
  if (batchCount === 0n) {
    throw new Error(
      "No base URI set. Please set a base URI before updating metadata",
    );
  }

  // Look for the batchId & determine the start + end tokenId of the batch
  let startTokenId = 0n;
  let endTokenId = 0n;
  let batchIndex = 0n;
  for (let i = 0n; i < batchCount; i += 1n) {
    batchIndex = i;
    endTokenId = await BatchAtIndex.getBatchIdAtIndex({
      contract,
      index: batchIndex,
    });
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
    range.map((id) => GetNFT.getNFT({ contract, tokenId: id })),
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
    contract.client,
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = updateMetadata({
 *  contract,
 *  targetTokenId: 0n,
 *  client: thirdwebClient,
 *  newMetadata: {
 *    name: "this is the new nft name",
 *    description: "...",
 *    image: "new image uri"
 *    // ...
 *  },
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function updateMetadata(
  options: BaseTransactionOptions<UpdateMetadataParams>,
) {
  const { contract } = options;
  return BatchBaseURI.updateBatchBaseURI({
    asyncParams: async () => getUpdateMetadataParams(options),
    contract,
  });
}

/**
 * Checks if the `updateMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `updateMetadata` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isUpdateMetadataSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isUpdateMetadataSupported(["0x..."]);
 * ```
 */
export function isUpdateMetadataSupported(availableSelectors: string[]) {
  return (
    BaseURICount.isGetBaseURICountSupported(availableSelectors) &&
    BatchBaseURI.isUpdateBatchBaseURISupported(availableSelectors) &&
    BatchAtIndex.isGetBatchIdAtIndexSupported(availableSelectors) &&
    GetNFT.isGetNFTSupported(availableSelectors)
  );
}

import { decodeAbiParameters } from "viem/utils";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { fetchTokenMetadata } from "../../../../utils/nft/fetchTokenMetadata.js";
import type { NFTMetadata } from "../../../../utils/nft/parseNft.js";
import { getBaseURICount } from "../../__generated__/IBatchMintMetadata/read/getBaseURICount.js";
import { getBatchIdAtIndex } from "../../__generated__/IBatchMintMetadata/read/getBatchIdAtIndex.js";
import { encryptedData } from "../../__generated__/IDelayedReveal/read/encryptedData.js";
import { baseURIIndices } from "../../__generated__/IDrop/read/baseURIIndices.js";
import { tokenURI } from "../../__generated__/IERC721A/read/tokenURI.js";

export interface BatchToReveal {
  batchId: bigint;
  batchUri: string;
  placeholderMetadata: NFTMetadata;
}

/**
 * Retrieves the batches available to reveal in an NFT contract.
 *
 * @param options {BaseTransactionOptions} - The transaction options.
 * @param options.contract {@link ThirdwebContract} - The NFT contract instance.
 * @returns A promise resolving to an array of unrevealed batches.
 *
 * @note Use the `batchId` and corresponding password for each batch to reveal it with `reveal`. {@see reveal}
 * @extension ERC721
 * @example
 * ```ts
 * import { getBatchesToReveal } from "thirdweb/extensions/erc721";
 *
 * const batches = await getBatchesToReveal({ contract: contract });
 *
 * const { transactionHash } = await sendTransaction({ transaction, account });
 * ```
 */
export async function getBatchesToReveal(
  options: BaseTransactionOptions,
): Promise<BatchToReveal[]> {
  const count = await getBaseURICount({
    contract: options.contract,
  });
  if (count === 0n) {
    return [];
  }

  const countRangeArray = Array.from(Array(Number(count)).keys());
  const uriIndices = await Promise.all(
    countRangeArray.map(async (batchId) => {
      try {
        return await getBatchIdAtIndex({
          contract: options.contract,
          index: BigInt(batchId),
        });
      } catch {
        try {
          return await baseURIIndices({
            contract: options.contract,
            index: BigInt(batchId),
          });
        } catch {
          throw new Error(
            "Contract does not have `getBatchIdAtIndex` or `baseURIIndices`, which are required for `getBatchesToReveal`",
          );
        }
      }
    }),
  );

  // first batch always start from 0. don't need to fetch the last batch so pop it from the range array
  const uriIndicesWithZeroStart = uriIndices.slice(0, uriIndices.length - 1);

  const tokenMetadatas = await Promise.all(
    Array.from([0, ...uriIndicesWithZeroStart]).map(async (i) => {
      const uri = await tokenURI({
        contract: options.contract,
        tokenId: BigInt(i),
      });
      return await fetchTokenMetadata({
        tokenId: BigInt(i),
        tokenUri: uri,
        client: options.contract.client,
      });
    }),
  );

  const encryptedUriData = await Promise.all(
    Array.from([...uriIndices]).map((i) =>
      encryptedData({
        contract: options.contract,
        index: BigInt(i),
      }),
    ),
  );

  const encryptedBaseUris = encryptedUriData.map((data) => {
    const hexDataLength = (data.length - 2) / 2;
    if (hexDataLength > 0) {
      return decodeAbiParameters(
        [
          { name: "baseUri", type: "bytes" },
          { name: "provenanceHash", type: "bytes32" },
        ],
        data,
      )[0];
    } else {
      return data;
    }
  });

  return tokenMetadatas
    .map((metadata, i) => ({
      batchId: BigInt(i),
      batchUri: encryptedBaseUris[i] as Hex,
      placeholderMetadata: metadata,
    }))
    .filter((_, index) => (encryptedBaseUris[index]?.length || 0) > 0);
}

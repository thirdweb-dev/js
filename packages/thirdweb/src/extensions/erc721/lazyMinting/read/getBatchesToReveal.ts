import { decodeAbiParameters } from "viem/utils";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { fetchTokenMetadata } from "../../../../utils/nft/fetchTokenMetadata.js";
import type { NFTMetadata } from "../../../../utils/nft/parseNft.js";
import * as GetBaseURICount from "../../__generated__/IBatchMintMetadata/read/getBaseURICount.js";
import * as GetBatchIdAtIndex from "../../__generated__/IBatchMintMetadata/read/getBatchIdAtIndex.js";
import * as EncryptedData from "../../__generated__/IDelayedReveal/read/encryptedData.js";
import * as BaseURIIndicies from "../../__generated__/IDrop/read/baseURIIndices.js";
import * as TokenURI from "../../__generated__/IERC721A/read/tokenURI.js";

/**
 * @extension ERC721
 */
export interface BatchToReveal {
  batchId: bigint;
  batchUri: string;
  placeholderMetadata: NFTMetadata | undefined;
}

/**
 * Retrieves the batches available to reveal in an NFT contract.
 *
 * @param options {BaseTransactionOptions} - The transaction options.
 * @param options.contract {@link ThirdwebContract} - The NFT contract instance.
 * @returns A promise resolving to an array of unrevealed batches.
 *
 *  Use the `batchId` and corresponding password for each batch to reveal it with `reveal`. {@see reveal}
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
  const count = await GetBaseURICount.getBaseURICount({
    contract: options.contract,
  });
  if (count === 0n) {
    return [];
  }

  const countRangeArray = Array.from(Array(Number(count)).keys());
  const uriIndices = await Promise.all(
    countRangeArray.map(async (batchId) => {
      const promiseAll = await Promise.allSettled([
        GetBatchIdAtIndex.getBatchIdAtIndex({
          contract: options.contract,
          index: BigInt(batchId),
        }),
        BaseURIIndicies.baseURIIndices({
          contract: options.contract,
          index: BigInt(batchId),
        }),
      ]);
      const result = promiseAll.find((result) => result.status === "fulfilled");
      if (!result) {
        throw new Error(
          "Contract does not have `getBatchIdAtIndex` or `baseURIIndices`, which are required for `getBatchesToReveal`",
        );
      }
      return result.value;
    }),
  );

  // first batch always start from 0. don't need to fetch the last batch so pop it from the range array
  const uriIndicesWithZeroStart = uriIndices.slice(0, uriIndices.length - 1);

  const tokenMetadatas = await Promise.all(
    Array.from([0, ...uriIndicesWithZeroStart]).map(async (i) => {
      const uri = await TokenURI.tokenURI({
        contract: options.contract,
        tokenId: BigInt(i),
      });
      return await fetchTokenMetadata({
        client: options.contract.client,
        tokenId: BigInt(i),
        tokenUri: uri,
      }).catch(() => undefined);
    }),
  );

  const encryptedUriData = await Promise.all(
    Array.from([...uriIndices]).map((i) =>
      EncryptedData.encryptedData({
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
    }

    return data;
  });

  return tokenMetadatas
    .map((metadata, i) => ({
      batchId: BigInt(i),
      batchUri: encryptedBaseUris[i] as Hex,
      placeholderMetadata: metadata,
    }))
    .filter((_, index) => (encryptedBaseUris[index]?.length || 0) > 0);
}

/**
 * Checks if the `getBatchesToReveal` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getBatchesToReveal` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetBatchesToRevealSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isGetBatchesToRevealSupported(["0x..."]);
 * ```
 */
export function isGetBatchesToRevealSupported(availableSelectors: string[]) {
  return [
    GetBaseURICount.isGetBaseURICountSupported(availableSelectors),
    GetBatchIdAtIndex.isGetBatchIdAtIndexSupported(availableSelectors),
    EncryptedData.isEncryptedDataSupported(availableSelectors),
    BaseURIIndicies.isBaseURIIndicesSupported(availableSelectors),
    TokenURI.isTokenURISupported(availableSelectors),
  ].every(Boolean);
}

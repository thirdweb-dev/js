import { multicall } from "../../../extensions/common/__generated__/IMulticall/write/multicall.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../transaction/types.js";
import { uri } from "../__generated__/IERC1155/read/uri.js";
import { encodeMintTo } from "../__generated__/IMintableERC1155/write/mintTo.js";
import type { MintAdditionalSupplyToParams } from "./mintAdditionalSupplyTo.js";

/**
 * @extension ERC1155
 */
export type MintAdditionalSupplyToBatchParams = WithOverrides<{
  nfts: MintAdditionalSupplyToParams[];
}>;

/**
 * This extension batches multiple `mintAdditionalSupplyToBatch` extensions into one single multicall.
 * This method is only available on the `TokenERC1155` contract.
 * Keep in mind that there is a limit of how many NFTs you can mint per transaction.
 * This limit varies depends on the network that you are transacting on.
 *
 * You are recommended to experiment with the number to figure out the best number for your chain of choice.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintAdditionalSupplyToBatch } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintAdditionalSupplyToBatch({
 *   contract,
 *   nfts: [
 *     { tokenId: 0n, supply: 99n, to: account.address },
 *     { tokenId: 1n, supply: 98n, to: account.address },
 *     { tokenId: 2n, supply: 97n, to: account.address },
 *   ],
 * });
 * ```
 */
export function mintAdditionalSupplyToBatch(
  options: BaseTransactionOptions<MintAdditionalSupplyToBatchParams>,
) {
  return multicall({
    asyncParams: async () => {
      const nfts = optimizeMintBatchContent(options.nfts);
      const data = await Promise.all(
        nfts.map(async (nft) => {
          const tokenUri = await uri({
            contract: options.contract,
            tokenId: nft.tokenId,
          });
          return encodeMintTo({
            amount: nft.supply,
            to: nft.to,
            tokenId: nft.tokenId,
            uri: tokenUri,
          });
        }),
      );
      return { data };
    },
    contract: options.contract,
    overrides: options.overrides,
  });
}

/**
 * Optimization
 *
 * We can batch the records that share the same "to" & "tokenId" into 1 transaction
 *
 * For example, this struct:
 * [
 *   { tokenId: 0n, supply: 99n, to: account.address },
 *   { tokenId: 1n, supply: 49n, to: account.address },
 *   { tokenId: 1n, supply: 51n, to: account.address },
 * ]
 *
 * ...can be packed into:
 * [
 *   { tokenId: 0n, supply: 99n, to: account.address },
 *   { tokenId: 1n, supply: 100n, to: account.address },
 * ]
 * @internal
 */
export function optimizeMintBatchContent(
  nfts: MintAdditionalSupplyToParams[],
): MintAdditionalSupplyToParams[] {
  const results: MintAdditionalSupplyToParams[] = [];
  for (const item of nfts) {
    const matchingIndex = results.findIndex(
      (o) =>
        o.tokenId === item.tokenId &&
        o.to.toLowerCase() === item.to.toLowerCase(),
    );
    if (matchingIndex !== -1) {
      results[matchingIndex] = {
        supply: item.supply + (results[matchingIndex]?.supply || 0n),
        to: item.to,
        tokenId: item.tokenId,
      };
    } else {
      results.push(item);
    }
  }
  return results;
}

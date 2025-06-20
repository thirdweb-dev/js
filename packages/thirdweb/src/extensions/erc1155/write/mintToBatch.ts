import { maxUint256 } from "ox/Solidity";
import { multicall } from "../../../extensions/common/__generated__/IMulticall/write/multicall.js";
import { upload } from "../../../storage/upload.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../transaction/types.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { encodeMintTo } from "../__generated__/IMintableERC1155/write/mintTo.js";

/**
 * @extension ERC1155
 */
export type MintToBatchParams = WithOverrides<{
  /**
   * The wallet that the NFTs will be minted to
   */
  to: string;
  /**
   * An array of NFT metadata & supply to mint
   * @example
   * ```ts
   * const nfts = [
   *   {
   *     metadata: { name: "token 0" },
   *     supply: 1n,
   *   },
   *   {
   *     metadata: { name: "token 1" },
   *     supply: 10n,
   *   },
   * ]
   * ```
   */
  nfts: Array<{
    supply: bigint;
    metadata: NFTInput | string;
  }>;
}>;

/**
 * This extension batches multiple `mintTo` extensions into one single multicall.
 * This method is only available on the `TokenERC1155` contract.
 * Keep in mind that there is a limit of how many NFTs you can mint per transaction.
 * This limit varies depends on the network that you are transacting on.
 *
 * You are recommended to experiment with the number to figure out the best number for your chain of choice.
 * @param options - the transaction options
 * @returns A promise that resolves to the transaction result.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintBatchTo } from "thirdweb/extension/erc1155";
 *
 * const transaction = mintToBatch({
 *   contract: editionContract,
 *   to: "0x...",
 *   nfts: [
 *     {
 *       metadata: {
 *         name: "Token #0",
 *         image: "...",
 *         attributes: [],
 *       },
 *       supply: 100n,
 *     },
 *     {
 *       metadata: {
 *         name: "Token #1",
 *         image: "...",
 *         attributes: [],
 *       },
 *       supply: 111n,
 *     },
 *   ],
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function mintToBatch(
  options: BaseTransactionOptions<MintToBatchParams>,
) {
  return multicall({
    asyncParams: async () => {
      const data = await Promise.all(
        options.nfts.map(async (nft) => {
          const uri =
            typeof nft.metadata === "string"
              ? nft.metadata
              : await upload({
                  client: options.contract.client,
                  files: [nft.metadata],
                });
          return encodeMintTo({
            amount: nft.supply,
            to: options.to,
            // maxUint256 is used to indicate that this is a NEW token!
            tokenId: maxUint256,
            uri,
          });
        }),
      );
      return { data };
    },
    contract: options.contract,
    overrides: options.overrides,
  });
}

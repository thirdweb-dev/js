import { maxUint256 } from "ox/Solidity";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";

export type EditionMintParams = {
  to: string;
  amount: bigint;
  nft: NFTInput | string;
  tokenId?: bigint;
};

/**
 * Mints ERC1155 tokens to a specified address via a MintableERC1155 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC1155 } from "thirdweb/modules";
 *
 * const transaction = MintableERC1155.mintWithRole({
 *   contract,
 *   to: "0x...", // Address to mint tokens to
 *   amount: 2, // Amount of tokens to mint
 *   nft: {
 *     name: "My NFT",
 *     description: "This is my NFT",
 *     image: "ipfs://...",
 *   },
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC1155
 */
export function mintWithRole(
  options: BaseTransactionOptions<EditionMintParams>,
) {
  return generatedMint({
    asyncParams: async () => {
      let baseURI = "";
      if (options.nft) {
        const batchOfUris = await uploadOrExtractURIs(
          [options.nft],
          options.contract.client,
        );
        baseURI = getBaseUriFromBatch(batchOfUris);
      }

      const tokenId = options.tokenId ?? maxUint256;
      return {
        amount: options.amount,
        baseURI: baseURI,
        data: "0x",
        to: getAddress(options.to),
        tokenId,
      };
    },
    contract: options.contract,
  });
}

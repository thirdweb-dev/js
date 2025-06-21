import { maxUint256 } from "ox/Solidity";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../transaction/types.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mintTo as generatedMintTo } from "../__generated__/IMintableERC1155/write/mintTo.js";

export { isMintToSupported } from "../__generated__/IMintableERC1155/write/mintTo.js";

/**
 * @extension ERC1155
 */
export type MintToParams = WithOverrides<{
  to: string;
  nft: NFTInput | string;
  supply: bigint;
}>;

/**
 * Mints a "supply" number of new ERC1155 tokens to the specified "to" address.
 * This method is only available on the `TokenERC1155` contract.
 * If the `nft` parameter is a string, it will be used as the token URI.
 * If the `nft` parameter is a file, it will be uploaded to the storage server and the resulting URI will be used as the token URI.
 * @param options - The transaction options.
 * @returns A promise that resolves to the transaction result.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc1155";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = mintTo({
 *  contract,
 *  to: "0x...",
 *  supply: 10n,
 *  nft: {
 *    name: "My NFT",
 *    description: "This is my NFT",
 *    image: "https://example.com/image.png",
 *  },
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return generatedMintTo({
    asyncParams: async () => {
      let tokenUri: string;

      if (typeof options.nft === "string") {
        // if the input is already a string then we just use that
        tokenUri = options.nft;
      } else {
        // otherwise we need to upload the file to the storage server

        // load the upload code if we need it
        const { upload } = await import("../../../storage/upload.js");
        tokenUri = await upload({
          client: options.contract.client,
          files: [options.nft],
        });
      }
      return {
        amount: options.supply,
        overrides: options.overrides,
        to: options.to,
        // maxUint256 is used to indicate that this is a NEW token!
        tokenId: maxUint256,
        uri: tokenUri,
      };
    },
    contract: options.contract,
  });
}

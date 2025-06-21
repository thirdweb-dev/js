import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../transaction/types.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mintTo as generatedMintTo } from "../__generated__/IMintableERC721/write/mintTo.js";

export { isMintToSupported } from "../__generated__/IMintableERC721/write/mintTo.js";

/**
 * @extension ERC721
 */
export type MintToParams = WithOverrides<{
  to: string;
  nft: NFTInput | string;
}>;

/**
 * Mints a new ERC721 token and assigns it to the specified address.
 * This method is only available on the `TokenERC721` contract.
 *
 * If the `nft` parameter is a string, it will be used as the token URI.
 * If the `nft` parameter is a file, it will be uploaded to the storage server and the resulting URI will be used as the token URI.
 * @param options - The transaction options.
 * @returns A promise that resolves to the transaction result.
 * @extension ERC721
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc721";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = mintTo({
 *  contract,
 *  to: "0x...",
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
        overrides: options.overrides,
        to: options.to,
        uri: tokenUri,
      } as const;
    },
    contract: options.contract,
  });
}

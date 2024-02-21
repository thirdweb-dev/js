import type { FileOrBufferOrString } from "../../../storage/upload/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Prettify } from "../../../utils/type-utils.js";

type NFTInput = Prettify<
  {
    name?: string;
    description?: string;
    image?: FileOrBufferOrString;
    animation_url?: FileOrBufferOrString;
    external_url?: FileOrBufferOrString;
    background_color?: string;
    // TODO check if we truly need both of these?
    properties?: Record<string, unknown> | Array<Record<string, unknown>>;
  } & Record<string, unknown>
>;

export type MintToParams = {
  to: string;
  nft: NFTInput | string;
};

/**
 * Mints a new ERC721 token and assigns it to the specified address.
 * If the `nft` parameter is a string, it will be used as the token URI.
 * If the `nft` parameter is a file, it will be uploaded to the storage server and the resulting URI will be used as the token URI.
 * @param options - The transaction options.
 * @returns A promise that resolves to the transaction result.
 * @extension ERC721
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc721";
 * const tx = await mintTo({
 *  contract,
 *  to: "0x...",
 *  nft: {
 *    name: "My NFT",
 *    description: "This is my NFT",
 *    image: "https://example.com/image.png",
 *  },
 * });
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: "function mintTo(address _to, string memory _tokenURI)",
    params: async () => {
      let tokenUri: string;

      if (typeof options.nft === "string") {
        // if the input is already a string then we just use that
        tokenUri = options.nft;
      } else {
        // otherwise we need to upload the file to the storage server

        // load the upload code if we need it
        const { upload } = await import("../../../storage/upload.js");
        tokenUri = (
          await upload({
            client: options.contract.client,
            files: [options.nft],
          })
        )[0] as string;
      }
      return [options.to, tokenUri] as const;
    },
  });
}

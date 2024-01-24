import { transaction } from "../../../transaction/index.js";
import type { FileOrBufferOrString } from "../../../storage/upload/types.js";
import {
  extractTXOpts,
  type ThirdwebClientLike,
  type TxOpts,
} from "../../../transaction/transaction.js";

export type NFTInput = {
  name?: string;
  description?: string;
  image?: FileOrBufferOrString;
  animation_url?: FileOrBufferOrString;
  external_url?: FileOrBufferOrString;
  background_color?: string;
  // TODO check if we truly need both of these?
  properties?: Record<string, unknown> | Array<Record<string, unknown>>;
} & Record<string, unknown>;

export type MintToParams = {
  to: string;
  nft: NFTInput | string;
};

/**
 * Mints a new ERC721 token and assigns it to the specified address.
 * If the `params.nft` is a string, it uses the provided URI for the token.
 * If the `params.nft` is a file, it uploads the file to the storage server and uses the generated URI for the token.
 * @param contract - The ThirdwebContract instance.
 * @param params - The parameters for minting the token.
 * @returns The transaction object.
 */
export function mintTo<client extends ThirdwebClientLike>(
  options: TxOpts<client, MintToParams>,
) {
  const [opts, params] = extractTXOpts(options);
  return transaction({
    ...opts,

    method: "function mintTo(address _to, string memory _tokenURI)",
    params: async () => {
      let tokenUri: string;

      if (typeof params.nft === "string") {
        // if the input is already a string then we just use that
        tokenUri = params.nft;
      } else {
        // otherwise we need to upload the file to the storage server

        // load the upload code if we need it
        const { upload } = await import("../../../storage/upload.js");
        tokenUri = (
          await upload(opts.client, {
            files: [params.nft],
          })
        )[0] as string;
      }
      return [params.to, tokenUri] as const;
    },
  });
}

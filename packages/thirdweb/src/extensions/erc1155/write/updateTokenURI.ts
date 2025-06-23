import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import {
  type SetTokenURIParams,
  setTokenURI,
} from "../../erc1155/__generated__/INFTMetadata/write/setTokenURI.js";

export { isSetTokenURISupported as isUpdateTokenURISupported } from "../../erc1155/__generated__/INFTMetadata/write/setTokenURI.js";
/**
 * @extension ERC1155
 */
export type UpdateTokenURIParams = {
  tokenId: bigint;
  newMetadata: NFTInput;
};

/**
 * This function is an abstracted layer of the [`setTokenURI` extension](https://portal.thirdweb.com/references/typescript/v5/erc1155/setTokenURI),
 * which means it uses `setTokenURI` under the hood.
 * While the `setTokenURI` method only takes in a uri string, this extension takes in a user-friendly [`NFTInput`](https://portal.thirdweb.com/references/typescript/v5/NFTInput),
 * upload that content to IPFS and pass the IPFS URI (of said `NFTInput`) to the underlying `setTokenURI` method.
 * This method is only available on the `TokenERC1155` contract.
 *
 * This extension does not validate the NFTInput so make sure you are passing the proper content that you want to update.
 *
 * @extension ERC1155
 * @returns the prepared transaction from `setTokenURI`
 * @example
 * ```ts
 * import { updateTokenURI } from "thirdweb/extensions/erc1155";
 *
 * const transaction = updateTokenURI({
 *   tokenId: 0n,
 *   nft: {
 *     name: "new name",
 *     description: "new description",
 *     image: "https://image-host.com/new-image.png",
 *   },
 * });
 * ```
 */
export function updateTokenURI(
  options: BaseTransactionOptions<UpdateTokenURIParams>,
) {
  const { contract } = options;
  return setTokenURI({
    asyncParams: async () => getUpdateTokenParams(options),
    contract,
  });
}

async function getUpdateTokenParams(
  options: BaseTransactionOptions<UpdateTokenURIParams>,
): Promise<SetTokenURIParams> {
  const { tokenId, newMetadata } = options;
  const batch: Promise<string>[] = [
    // image URI resolution
    (async () => {
      if (!newMetadata.image) {
        return "";
      }
      if (typeof newMetadata.image === "string") {
        return newMetadata.image;
      }
      return await upload({
        client: options.contract.client,
        files: [newMetadata.image],
      });
    })(),
    // animation URI resolution
    (async () => {
      if (!newMetadata.animation_url) {
        return "";
      }
      if (typeof newMetadata.animation_url === "string") {
        return newMetadata.animation_url;
      }
      return await upload({
        client: options.contract.client,
        files: [newMetadata.animation_url],
      });
    })(),
  ];

  const [imageURI, animationURI] = await Promise.all(batch);
  if (newMetadata.image && imageURI) {
    newMetadata.image = imageURI;
  }
  if (newMetadata.animation_url && animationURI) {
    newMetadata.animation_url = animationURI;
  }

  const uri = await upload({
    client: options.contract.client,
    files: [newMetadata],
  });
  return { tokenId, uri };
}

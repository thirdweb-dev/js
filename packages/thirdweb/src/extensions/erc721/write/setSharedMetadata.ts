import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { setSharedMetadata as generatedSharedMetadata } from "../__generated__/ISharedMetadata/write/setSharedMetadata.js";

export type SetSharedMetadataParams = {
  nft: NFTInput;
};

/**
 * Sets the shared metadata for a OpenEdition contract.
 * @param options - The options for the transaction.
 * @returns The prepared transaction.
 * @extension ERC721
 */
export function setSharedMetadata(
  options: BaseTransactionOptions<SetSharedMetadataParams>,
) {
  return generatedSharedMetadata({
    contract: options.contract,
    asyncParams: async () => {
      if (!options.nft.name) {
        throw new Error("NFT name is required");
      }

      const batch: Promise<string>[] = [
        // image URI resolution
        (async () => {
          if (!options.nft.image) {
            return "";
          }
          if (typeof options.nft.image === "string") {
            return options.nft.image;
          }
          const { upload } = await import("../../../storage/upload.js");
          return await upload({
            client: options.contract.client,
            files: [options.nft.image],
          });
        })(),
        // animation URI resolution
        (async () => {
          if (!options.nft.animation_url) {
            return "";
          }
          if (typeof options.nft.animation_url === "string") {
            return options.nft.animation_url;
          }
          const { upload } = await import("../../../storage/upload.js");
          return await upload({
            client: options.contract.client,
            files: [options.nft.animation_url],
          });
        })(),
      ];

      const [imageURI, animationURI] = await Promise.all(batch);

      return {
        metadata: {
          name: options.nft.name,
          description: sanitizeJSONString(options.nft.description) ?? "",
          imageURI: imageURI ?? "",
          animationURI: animationURI ?? "",
        },
      };
    },
  });
}

function sanitizeJSONString(val: string | undefined | null) {
  if (!val) {
    return val;
  }
  const sanitized = JSON.stringify(val);
  return sanitized.slice(1, sanitized.length - 1);
}

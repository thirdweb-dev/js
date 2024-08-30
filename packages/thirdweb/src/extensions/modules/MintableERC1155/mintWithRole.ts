import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";

export type EditionMintParams = {
  to: string;
  amount: bigint;
  nft: NFTInput | string;
  tokenId: bigint; // TODO (modular) this should be optional
};

export function mintWithRole(
  options: BaseTransactionOptions<EditionMintParams>,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let metadataURI: string;
      if (typeof options.nft === "string") {
        // if the input is already a string then we just use that
        metadataURI = options.nft;
      } else {
        // otherwise we need to upload the file to the storage server
        // load the upload code if we need it
        const { upload } = await import("../../../storage/upload.js");
        metadataURI = await upload({
          client: options.contract.client,
          files: [options.nft],
        });
      }

      const tokenId = options.tokenId;
      return {
        to: getAddress(options.to),
        tokenId,
        amount: options.amount,
        baseURI: metadataURI,
        data: "0x",
      };
    },
  });
}
